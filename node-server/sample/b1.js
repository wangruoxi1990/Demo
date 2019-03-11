//根据用户请求的参数，返回不同的数据。
var xhr = new XMLHttpRequest()
xhr.open('GET', '/getWeather?city=beijing', true)
xhr.send()
xhr.onload = function(){
    console.log(JSON.parse(xhr.responseText))
}