var xhr = new XHRHttpRequest()
xhr.open('GET', '/getWeather', true)

//如果根据用户请求的参数（?city=beijing），返回不同的数据：xhr.open('GET','/getWeather?city=beiing', true)
//此时在index-simple1.js中便mock不到数据。（见b1.js、index-simple2.js）

xhr.send()
xhr.onload = function(){
    console.log(JSON.parse(xhr.responseText))
}