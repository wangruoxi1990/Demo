var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')

var server = http.createServer(function(req,res){
    try{
        var fileContent = fs.readFileSync(__dirname + req.url, 'binary')
        res.write(fileContent, 'binary')
    }catch(e){
        res.writeHead(404, 'not found')
        console.log(404 + 'Not found')
    }
    res.end()
})

server.listen(8080)
console.log('visit http://localhost:8080')