import koa from 'koa'
import router from 'koa-router'
import multer from 'koa-multer'

const app = new koa()
const upload = multer({ dest: 'upload/'})

app.use(async (ctx, next) => {
	await next()
	const rt = ctx.response.get('X-Response-Time')
	console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

app.use(async (ctx, next) => {
	const start = Date.now()
	await next()
	const ms = Date.now() - start
	ctx.set('X-Response-Time', `${ms}ms`)
})

app.on('error', err=>{
  console.log('server error:', err)
})

router.get('/', ctx=>{
  ctx.body = 'Hello World'
})

router.post('/profile', upload.single('avatar'))

router.get('/error', async ctx=>{
  ctx.throw(500, 'custome error', { name: jacky})
})

app.use(router.routes())


app.listen(3000)
console.log('started, please visit http://localhost:3000.');
