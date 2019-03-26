var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')

var server = http.createServer(function(req, res){
    staticRoot(path.join(__dirname, 'sample'),req, res)
    console.log('__dirname:' + __dirname)
})

function staticRoot(staticPath, req, res){
    console.log('staticPath:'+ staticPath)
    var pathObj = url.parse(req.url, true)

    if(pathObj.pathname === '/'){
        pathObj.pathname += 'index.html'
    }

    var filePath = path.join(staticPath, pathObj.pathname)
    console.log('filePath:' + filePath)

    fs.readFile(filePath, 'binary', function(err, fileContent){
        if(err){
            console.log('404')
            res.writeHead(404, 'not found')
            res.end('<h1>NOT FOUND</h1>')
        }else{
            console.log('ok')
            res.writeHead(200, 'ok')
            res.end(fileContent, 'binary')
        }
    })
}

console.log('open http://localhoat:8080')
server.listen(8080)