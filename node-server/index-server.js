var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')

var routes = {
    '/a': function(req, res){
        res.end(JSON.stringify(req.query))
    },
    '/b': function(req, res){
        res.end('match /b')    
    },
    '/a/c': function(req, res){
        res.end('match /a/c')
    },
    '/search': function(req, res){
        res.end('username=' + req.body.username + ',password=' + req.body.password)
    }
}

var server = http.createServer(function(req, res){
    routePath(req, res)
})

function routePath(req, res){
    var pathObj = url.parse(req.url, true)
    var handleFn = routes[pathObj.pathname]
    
    if(handleFn){
        req.query = pathObj.query  //参考 https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/

        //post json解析
        var body = ''
        req.on('data', function(chunk){
            body += chunk
            console.log(body)
        }).on('end', function(){
            req.body = parseBody(body)
            handleFn(req, res)
        })
    }else{
        staticRoot(path.resolve(__dirname, 'sample'), req, res)
    }
}

function parseBody(body){
    console.log(body)
    var obj = {}
    body.split('&').forEach(function(str){
        obj[str.split('=')[0]] = str.split('=')[1]
    })
    return obj
}

function staticRoot(staticPath, req, res){
    var pathObj = url.parse(req.url, true)

    if(pathObj.pathname === '/'){
        pathObj.pathname += 'index.html'
    }

    var filePath = path.join(staticPath, pathObj.pathname)
    fs.readFile(filePath, 'binary', function(err, fileContent){
        if(err){
            console.log('404')
            res.writeHead(404, 'Not Found')
            res.end('<h1>404 Not Found</h1>')
        }else{
            console.log('ok')
            res.writeHead(200, 'OK')
            res.write(fileContent, 'binary')
            res.end()
        }
    })
}

server.listen(8080)
console.log('visit http://localhost:8080')