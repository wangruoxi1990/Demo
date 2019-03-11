1. 添加node内置模块，通过require加载：
```
var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')
```
整个底层服务器是由node提供的`http`模块实现的。

2. http.server是一个基于事件的HTTP服务器，所有的请求都被封装到独立的事件当中，创建server：
```
http.createServer(function(req, res){
    res.setHeader('Content-Type','text/html; charset=utf-8')
    res.writeHead(200, 'ok')
    res.write('hello world')
    res.end()
})
```
两个参数request和response，分别是http.ServerRequest和http.ServerResponse表示请求和响应的信息。

3. http.ServerResponse返回客户端信息
决定了用户最终能到的结果，它是由http.Server的request事件发送的，作为第二个参数传递，一般为response或res。
主要的三个函数： 
* response.writeHead(statusCode,[headers])：向请求的客户端发送响应头。statusCode是HTTP的状态码，如200为成功，404未找到等。headers是一个类似关联数组的对象，表示响应头的每个属性。 
* response.write(data,[encoding])：向请求客户端发送相应内容，data是buffer或字符串，encoding为编码。
* response.end([data],[encoding])：结束响应，告知用户所有发送已经完成，当所有要返回的内容发送完毕，该函数必须被调用一次，`如果不调用，客户端永远处于等待状态`。