var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')

// var server = http.createServer(function(req,res){
//     setTimeout(function(){
        
//         res.setHeader('Content-Type','text/html; charset=utf-8')
//         res.writeHead(200, 'ok')
//         res.write('<html><head><meta charset="gbk" /></head>')
//         res.write('<body>')
//         res.write('<h1>你好</h1>')
//         res.write('</body></html>')

//         res.end()

//     },2000);
// })

function staticRoot(staticPath, req, res){
    console.log('这是staticPath：'+ staticPath)
    console.log('这是req.url：'+ req.url)
    console.log('这是__dirname:' + __dirname)
    console.log('这是__filename:' + __filename)
    console.log('这是path.dirname(__filename):' + path.dirname(__filename))
    var pathObj = url.parse(req.url, true) //返回Url对象
    //console.log('这是pathObj.pathname：'+ pathObj.pathname)

    if(pathObj.pathname === '/'){
        pathObj.pathname += 'index.html'
    }

    var filePath = path.join(staticPath, pathObj.pathname)

    fs.readFile(filePath, 'binary', function(err, fileContent){
        if(err){
            console.log('404')
            res.writeHead(404, 'not found')
            res.end('<h1>404 Not Found</h1>')
             /*res.end('<h1>404 Not Found</h1>')相当于：
               res.write('<h1>404 Not Found</h1>')
               res.end()
             */
        }else{
            console.log('ok')
            res.writeHead(200, 'ok')
            res.write(fileContent, 'binary')
            res.end()
        }
    })
}

//console.log(path.join(__dirname, 'sample'))
var server = http.createServer(function(req,res){
    staticRoot(path.join(__dirname, 'sample'),req,res)
})



console.log('open http://localhost:8080')
server.listen(8080)
