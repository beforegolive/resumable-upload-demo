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
			console.warn('=== event fileBegin :')
		})
		form.on('file', (filename, file) => {
			console.warn('=== event filename :', filename)
			console.warn('=== event file :', file)
		})

		form.on('field', (fieldName, fieldValue) => {
			console.warn('=== event field:')
			console.warn('=== fieldName:', fieldName)
			console.warn('=== fieldValue:', fieldValue)
		})

		form.onPart = part => {
			part.on('data', buffer => {
				console.warn('=== onPart part:', part)
				console.warn('=== onPart data:', buffer)
				const tempFilePath = `${tempFileDir}${part.filename}`

				fs.appendFile(tempFilePath, buffer, err => {
					if (err) throw err
				})
			})
		}

		form.on('error', err => {
			console.warn('*** error:', err)
		})

		form.on('aborted', e => {
			console.warn('*** aborted e:', e)
		})

		form.on('end', () => {
			console.warn('*** event end :')
		})

		form.on('progress', (bytesReceived, bytesExpected) => {
			console.warn('%%% event progress')
			console.warn('%% bytesReceived:', bytesReceived)
			console.warn('%% bytesExpected:', bytesExpected)
		})

		form.on('data', ({ name, key, value, buffer, start, end }) => {})

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
