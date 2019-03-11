var http = require('http')
var fs = require('fs')

// var server = http.createServer(function(req, res){
//     console.log('输出：' + __dirname + '/sample' + req.url) //__dirname为:Users/RWX/projects/Demo/node-server
//     var fileContent = fs.readFileSync(__dirname + '/sample' + req.url, 'binary') //(__dirname + '/sample' + req.url)拼装成完整的路径
//     res.write(fileContent, 'binary')
//     res.end()
// })
/*
此时服务器非常的不健壮，如果输入错误的req.url（比如localhost:8080//index11.html），服务器就挂掉.
使用try catch方法。
*/

var server = http.createServer(function(req, res){
    console.log('输出：' + __dirname + '/sample' + req.url)
    try{
        var fileContent = fs.readFileSync(__dirname + '/sample' + req.url,'binary')
        res.write(fileContent, 'binary')
    }catch(e){
        res.writeHead(404, 'not found')
        console.log(404 + 'Not Found')
    }
    res.end()
})

server.listen(8080)
console.log('visit http://localhost:8080')

//  visit http://localhost:8080
//  /Users/WRX/projects/Demo/node-server/sample/index.html
//  /Users/WRX/projects/Demo/node-server/sample/a.css