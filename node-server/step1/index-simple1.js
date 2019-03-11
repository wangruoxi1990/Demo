var http = require('http')
var fs = require('fs')
http.createServer(function(req, res){
   
    switch(req.url){
        case '/getWeather':
            res.setHeader('Content-Type','text/json; charset=utf-8')
            res.write(JSON.stringify({city: "南京",weather: 16}))
            res.end()
            break;
        case '/user':
            res.end(fs.readFileSync(__dirname + '/sample/user.html'))
            break;
        default:
            res.end(fs.readFileSync(__dirname +'/sample' + req.url))
    }
}).listen(8080)