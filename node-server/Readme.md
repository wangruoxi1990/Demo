### http.ServerRequset请求信息
HTTP请求分为两部分`请求头`和`请求体`，如果请求内容少直接在请求头协议完成之后立即读取，请求体相对较长，需要一定的时间传输，因此提供了三个事件用于控制请求体传输：
data：当请求体数据到来时，该事件被触发，有一个参数chunk，表示接受到的数据。
end：当请求体数据传输完成时，该事件被触发，此后将不会再有数据到来。
close：用户当前请求结束时，该事件被触发，不同于end，如果用户强制终止了传输，也会触发close。
`ServerRequset`的属性：
|名称|含义|
|:---:|:---:|
|complete|客户端请求是否已经发送完成|
|httpVersion|HTTP协议版本，通常是1.0或1.1|
|method|HTTP请求方法，如GET、POST|
|url|原始的请求路径|
|headers|HTTP请求头|
|trailers|HTTP请求尾(不常见)|
|connection|当前HTTP连接套接字，为net.Socket的实例|
|socket|connection属性的别名|
|client|client属性的别名|

### 获取GET请求内容
由于GET请求直接被嵌入在路径中，URL是完整的请求路径，包括了?后面的部分，因此可以手动解析后面的内容作为GET请求的参数。
node.js中url模块中的parse函数提供了这个功能。
参考：[Node.js GET/POST请求](http://www.runoob.com/nodejs/node-js-get-post.html)
```
var http = require('http');
var url = require('url');
var util = require('util');
 
http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    //利用url模块去解析客户端发送过来的Url对象
    res.end(util.inspect(url.parse(req.url, true)));
}).listen(8080);
```
注：`util.inspect`
util.inspect(object,[showHidden],[depth],[colors])是一个将任意对象转换为字符串的方法，通常用于调试和错误输出。它至少接受一个参数object，即要转换的对象。
showHidden：是一个可选参数，如果值为true，将会输出更多隐藏信息。
depth：表示最大递归的层数，如果对象很复杂，可以指定层数以控制输出信息的多少。如果不指定depth，默认会递归2层，指定为null表示将不限递归层数完整遍历对象。 
color：如果值为true，输出格式将会以ANSI颜色编码，通常用于在终端显示更漂亮的效果。
特别要指出的是，util.inspect并不会简单地直接把对象转换为字符串，即使该对象定义了toString方法也不会调用。
参考：[Node.js常用工具](http://www.runoob.com/nodejs/nodejs-util.html)
```
var util = require('util'); 
function Person() { 
    this.name = 'byvoid'; 
    this.toString = function() { 
    return this.name; 
    }; 
} 
var obj = new Person(); 
console.log(util.inspect(obj)); 
console.log(util.inspect(obj, true));
```
输出结果：
```
Person { name: 'byvoid', toString: [Function] }
Person {
  name: 'byvoid',
  toString: 
   { [Function]
     [length]: 0,
     [name]: '',
     [arguments]: null,
     [caller]: null,
     [prototype]: { [constructor]: [Circular] } } }
```

### 获取POST请求内容
POST 请求的内容全部的都在请求体中，http.ServerRequest 并没有一个属性内容为请求体，原因是等待请求体传输可能是一件耗时的工作。
比如上传文件，而很多时候可能并不需要理会请求体的内容，恶意的POST请求会大大消耗服务器的资源，所以node.js默认是不会解析请求体的，当需要时要手动来做。
基本语法结构：
```
var http = require('http');
var querystring = require('querystring');
http.createServer(function(req, res){
    // 定义了一个post变量，用于暂存请求体的信息
    var post = '';     
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    req.on('data', function(chunk){    
        post += chunk;
    });
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function(){    
        post = querystring.parse(post);
        res.end(util.inspect(post));
    });
}).listen(8080);
```
举例：表单通过 POST 提交并输出数据
```
var http = require('http');
var querystring = require('querystring');
 
var postHTML = 
  '<html><head><meta charset="utf-8"><title>菜鸟教程 Node.js 实例</title></head>' +
  '<body>' +
  '<form method="post">' +
  '网站名： <input name="name"><br>' +
  '网站 URL： <input name="url"><br>' +
  '<input type="submit">' +
  '</form>' +
  '</body></html>';
 
http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    // 解析参数
    body = querystring.parse(body);
    // 设置响应头部信息及编码
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
 
    if(body.name && body.url) { // 输出提交的数据
        res.write("网站名：" + body.name);
        res.write("<br>");
        res.write("网站 URL：" + body.url);
    } else {  // 输出表单
        res.write(postHTML);
    }
    res.end();
  });
}).listen(3000);
```
访问‘localhost：3000’，在input表单中分别输入‘饥人谷’‘jirengu.com’，点提交，输出：
```
网站名：饥人谷
网站 URL：jirengu.com
```

### __dirname和__filename
`__dirname`等同于`path.dirname(__filename)`
__dirname返回当前模块文件解析过后所在的文件夹（目录）的绝对路径；
__filename返回当前模块文件被解析过后的绝对路径。
![](https://upload-images.jianshu.io/upload_images/11389777-e8fc7e4d78c186ec.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
举例，在index.js中：
```
console.log('这是staticPath：'+ staticPath)
console.log('这是req.url：'+ req.url)
console.log('这是__dirname:' + __dirname)
console.log('这是__filename:' + __filename)
console.log('这是path.dirname(__filename):' + path.dirname(__filename))
//输出
这是staticPath：/Users/WRX/projects/Demo/node-server/sample
这是req.url：/getWeather?city=beijing
这是__dirname:/Users/WRX/projects/Demo/node-server
这是__filename:/Users/WRX/projects/Demo/node-server/index.js
这是path.dirname(__filename):/Users/WRX/projects/Demo/node-server

 ```

### fs.readFileSync方法
`fs.readFileSync(filename, [encoding])`
由于该方法属于fs模块，使用前需要引入fs模块（var fs = require('fs')）
接受参数：
filename：文件路径
options：option对象，包含encoding，编码格式，该项是可选的。
举例：
```
var fs = require('fs')
var contentText = fs.readFileSync('123.txt','utf-8')
console.log(contentText);
```
在index-simple.js中，文件路径filename为：__dirname + '/sample' + req.url，拼装成完整的路径。

### try与catch的使用
```
try{
    //代码区
}catch(Exception e){
    //异常处理
}
```
代码区如果有错误，就会返回所写异常的处理。（如果没有try，出现异常会导致程序崩溃，而try则可以保证程序的正常运行。）
try catch是捕捉try部分的异常，当没有try时，如果出现异常程序报错，加上try catch，出现异常程序正常运行，只是把错误信息存储到Exception里，所以catch是用来提取异常信息的，可以在catch部分加`System.out.println(e.ToString());`，如果出现异常可以把异常打印出来。
> println和print基本没什么差别，就是最后会换行.
print将它的参数显示在命令窗口，并将输出光标定位在所显示的最后一个字符之后;
println 将它的参数显示在命令窗口，并在结尾加上换行符，将输出光标定位在下一行的开始。

### url.parse(req.url,true)
将一个url字符串转换成对象并返回，使用前需要引入url（var url = require('url')）
`url.parse(urlStr, [parseQueryString], [slashesDenoteHost])`，默认情况url.parse(url)等价于url.parse(url, false, false)
接受参数：
urlStr：url字符串；
parseQueryString：控制解析的 Url {……} 中的query字段的值是否为JSON格式，即{……}，还是普通字符串格式，即‘……’，默认false为字符串格式；
slashesDenoteHost：默认为false，//foo/bar形式的字符串将被解释成{pathname: ‘//foo/bar’}；如果为true，//foo/bar形式的字符串将被解释成{host: ‘foo',pathname: ‘/bar'}。
举例：
```
var url = require('url');
var a = url.parse('http://localhost:8080/one?a=index&t=article');
console.log(a);
Url { 
    protocol : 'http' ,
    auth : null ,
    host : 'localhost:8080' ,
    port : '8080' ,
    hostname : 'localhost' ,
    hash : null ,
    search : '?a=index&t=article',
    query : 'a=index&t=article',
    pathname : '/one',
    path : '/one?a=index&t=article',
    href : 'http://localhost:8080/one?a=index&t=article'
}
```