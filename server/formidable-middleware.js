import formidable from 'formidable'
import fs from 'fs'

const koaMiddleware = opt => {
	const tempFileDir = `./upload/tmp/`
	if (!fs.existsSync(tempFileDir, { recursive: true })) {
		fs.mkdirSync(tempFileDir)
	}

	return async function(ctx, next) {
		const form = formidable.IncomingForm()
		for (const key in opt) {
			form[key] = opt[key]
		}

		form.on('fileBegin', (filename, file) => {
			const randomStr = Math.random()
				.toString(16)
				.substr(2)
			file.path = `${form.uploadDir}${randomStr}-${file.name}`
		})

		form.onPart = part => {
			const tempFilePath = `${tempFileDir}${part.filename}`
			const writer = fs.createWriteStream(tempFilePath, { flags: 'a' })
			form.on('aborted', e => {
				writer.end()
			})

			form.on('end', () => {
				writer.end()
			})

			part.on('data', buffer => {
				writer.write(buffer)
			})
		}

		form.on('progress', (bytesReceived, bytesExpected) => {
			console.warn('%% bytesReceived:', bytesReceived)
			console.warn('%% bytesExpected:', bytesExpected)
		})

		await new Promise((resolve, reject) => {
			form.parse(ctx.req, (err, fields, files) => {
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
