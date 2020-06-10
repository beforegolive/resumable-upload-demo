import formidable from 'formidable'
import fs from 'fs'

const koaMiddleware = opt => {
	const tempFileDir = `${opt.uploadDir}/tmp/`
	if (!fs.existsSync(tempFileDir, { recursive: true })) {
		fs.mkdirSync(tempFileDir)
	}

	return async function(ctx, next) {
		const form = formidable.IncomingForm()
		for (const key in opt) {
			form[key] = opt[key]
		}

		form.onPart = part => {
			const tempFilePath = `${tempFileDir}${part.filename}`
			const writer = fs.createWriteStream(tempFilePath, { flags: 'a' })
			form.on('aborted', e => {
				writer.end()
				console.warn(`=== ${part.name} 上传被中断，已上传的部分保存为临时文件，等待续传`)
			})

			form.on('end', () => {
				writer.end()
				console.warn(`=== ${part.name} 上传完成`)
			})

			part.on('data', buffer => {
				writer.write(buffer)
			})
		}

		form.on('progress', (bytesReceived, bytesExpected) => {
			console.warn(`%% bytesReceived: ${bytesReceived}, bytesExpected:${bytesExpected}`)
		})

		await new Promise((resolve, reject) => {
			form.parse(ctx.req, (err, fields, files) => {
				console.warn(ctx.req)
				if (err) {
					reject(err)
				} else {
					ctx.request.body = fields
					ctx.request.files = files
					resolve()
				}
			})
		})

		await next()
	}
}

export default koaMiddleware
