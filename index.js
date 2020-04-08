import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-bodyparser'
import formidable from 'koa2-formidable'

const app = new Koa()
const router = new Router()

app.use(koaBody())
app.use(formidable({ uploadDir:'./upload/'}))

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

router.get('/error', async ctx=>{
  ctx.throw(500, 'custome error', { name: 'jacky'})
})

router.post('/post-test', async ctx=>{
  console.log(ctx.query);
  console.log(ctx.params);
  console.log(ctx.request.body);
  console.log(ctx.request.files);
  ctx.body=`post test success! ${JSON.stringify(ctx.request.body)}`
})

app.use(router.routes())


app.listen(3000)
console.log('started, please visit http://localhost:3000.');
