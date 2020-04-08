import formidable from 'formidable'

const koaMiddleware = opt=>{
  return async function(ctx,next){
    const form = formidable.IncomingForm()
    for(const key in opt){
      form[key]=opt[key]
    }

    await new Promise((resolve, reject)=>{
      form.parse(ctx.req, (err, fields, files)=>{
        if(err){
          reject(err)
        } else{
          ctx.request.body=fields
          ctx.request.files= files
          resolve()
        }
      })
    })

    await next()
  }
}

export default koaMiddleware