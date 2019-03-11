//根据用户请求的参数，返回不同的数据
var http = require('http')
var fs = require('fs')

var url = require('url') 


http.createServer(function(req,res){
    var pathObj = url.parse(req.url, true)
    console.log(pathObj)  //注释2：打印出请求（index.html/a.css/b.js/b1.js/getWeather?city=beijing）后返回的Url对象。
    /*
    switch (req.url) {
        case '/getWeather':
            res.end(JSON.stringify({a:1,b:2}))
            break;
        case '/user':
            res.end(fs.readFileSync(__dirname + '/sample/user.html'))
            break;
        default:
            res.end(fs.readFileSync(__dirname + '/sample' + req.url))
    }
    */
    switch (pathObj.pathname) {  //注释2：需要匹配的是pathname，而非req.url。
        case '/getWeather':
            var ret
            if(pathObj.query.city == 'beijing'){
                ret = {city: 'beijing', weather: '晴天'}
            }else{
                ret = {city: pathObj.query.city, weather: '不知道'}
            }
            res.end(JSON.stringify(ret))
            break;
        case '/user':
            res.end(fs.readFileSync(__dirname + '/sample/user.html'))
            break;
        default:
            res.end(fs.readFileSync(__dirname + '/sample' + pathObj.pathname))
    }    
}).listen(8080)

/* 注释1
运行node index-simple2.js，在请求getWeather?city=beijing时服务器挂掉，因为在switch中没有相应的匹配，进入到default逻辑，
读__dirname+'/sample'+req.url文件（即localhose:8080/sample/getWeather?city=beijing），该文件又不存在，所以报错，报错之后又没有做其他处理，所以崩溃。
*/

/* 注释2
请求getWeather?city=beijing返回的Url对象：
Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?city=beijing',
  query: { city: 'beijing' },
  pathname: '/getWeather',
  path: '/getWeather?city=beijing',
  href: '/getWeather?city=beijing' 
}
  此时getWeather?city=beijing请求，需要匹配的是pathname，而非req.url。（对于getWeather请求，需要得到对应的query）
*/

/* 注释3
运行node index-simple2.js，控制台输出{city: "beijing", weather: "晴天"}
如果将b1.js中将?city=beijing改成?city=nanjing，运行node index-simple2.js，控制台输出{city: "nanjing", weather: "不知道"}
*/