# 断点续传的demo

### 运行方法

启动服务器端：

`npm run server`


启动web端：

`npm start`


### 断点续传知识点汇总

1. 【前端】FileReader，将文件读取为字节，能做切片上传
2. 【前端】FormData，将要上传的文件格式
3. 【前端】MD5，获取文件的唯一性标识
4. 【后端】使用Nodejs的WriteStream，将接受的字节写入自定义文件。
5. 【后端】监听fileBegin和onPart事件，自定义接受字节方式并拼接在一个自定义文件中（使用第三方库formidable）
6. 【后端】监听end和aborted事件，确保传输终止时，数据被正确保存到对应文件中
7. 【后端】添加API用于查询未传完文件的大小，方便前端进行分片处理

### 可能的扩展【大文件处理步骤】

1. 将1个大文件切分成多个小文件片段，分别进行断点续传（切片序号可以通过表单字段一并传递）
2. 在合适的时机将小文件合并，（可采取办法是，前端在全部上传完毕后调用API，传递信号给后端，完成合并）