import Koa from 'koa'
import Router from 'koa-router'
import fs from 'fs'
import cors from '@koa/cors'
import formidableMiddleware from './formidable-middleware'

const app = new Koa()
const router = new Router()
const uploadDir = './upload'

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir)
}

app.use(cors())

app.use(
	formidableMiddleware({
		uploadDir,
		hash: true
	})
)

app.on('error', err => {
	console.log('server error:', err)
})

router.get('/', ctx => {
	ctx.body = `hello world`
})

router.post('/upload-file-test', async ctx => {
	console.warn('=== /post-test log :')
	ctx.body = `post success`
})

router.get('/get-tmp-file-size', async ctx => {
	const { name } = ctx.query
	const filePath = `./upload/tmp/${name}`
	try {
		const instance = fs.statSync(filePath)
		ctx.body = { size: instance.size }
	} catch (err) {
		ctx.body = { size: 0 }
	}
})

app.use(router.routes())

const host = '0.0.0.0'
const port = 8081
app.listen(port, host)
console.log(`started, please upload file to http://${host}:${port}.`)
