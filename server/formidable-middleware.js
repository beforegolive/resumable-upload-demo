import formidable from 'formidable'

const koaMiddleware = opt=>{
  return async function(ctx,next){
    const form = formidable.IncomingForm()
    for(const key in opt){
      form[key]=opt[key]
    }

    form.on('fileBegin',(filename, file)=>{
      const randomStr = Math.random().toString(16).substr(2)
      file.path=`${form.uploadDir}${randomStr}-${file.name}`
      console.warn('=== event fileBegin :', )
    })
    form.on('file',(filename, file)=>{
      console.warn('=== event filename :', filename)
      console.warn('=== event file :', file)
    })

    form.on('field', (fieldName, fieldValue) => {
      console.warn('=== event field:')
      console.warn('=== fieldName:' ,fieldName)
      console.warn('=== fieldValue:', fieldValue)
    })

    form.on('error', (err) => { 
      console.warn('*** error:', err)
    });

    form.on('aborted', () => { 
      console.warn('*** aborted') 
    });

    form.on('end', ()=>{
      console.warn('*** event end :')
    })

    form.on('progress', (bytesReceived, bytesExpected) => {
      console.warn('%%% event progress');
      console.warn('%% bytesReceived:', bytesReceived)
      console.warn('%% bytesExpected:', bytesExpected)
     });

    form.on('data',({name,key,value,buffer,start,end})=>{
      console.warn('=== name :', name)
      console.warn('=== key :', key)
      console.warn('=== value :', value)
      console.warn('=== buffer :', buffer)
      console.warn('=== start :', start)
      console.warn('=== end :', end)
      console.warn('=== more :', more)
    })

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