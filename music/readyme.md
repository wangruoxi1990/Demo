1. 创建music.json
2. 创建index.js服务器
```
var http = require('http')
var fs = require('fs')
var url = require('url')
var path = require('path')

var server = http.createServer(function(req, res){
    staticRoot(path.join(__dirname,'sample'),req,res)
})

function staticRoot(staticPath,req,res){
    var pathObj = url.parse(req.url, true) //返回Url对象

    if(pathObj.pathname === '/'){  //默认输入index.html
        pathObj.pathname += 'index.html'
    }

    var filePath = path.join(staticPath, pathObj.pathname)
    fs.readFile(filePath, 'binary', function(err, fileContent){
        if(err){
            console.log('404')
            res.writeHead(404, 'not found')
            res.end('<h1>404 NOT FOUND</h1>')
        }else{
            console.log('ok')
            res.writeHead(200, 'ok')
            res.end(fileContent, 'binary')
        }
    })
}

console.log('open http://localhost:8080')
server.listen(8080)
```
3. 使用ajax获取数据
```
var xht = new XMLHttpRequest()
xhr.open('GET', '/music.json', true)
xhr.onload = function(){
    if((xhr.status >= 200 && xhr.status < 300)|| xhr.status === 304){
        window.musicList = JSON.parse(xhr.responseText)  //使用JSON解析字符串
    }else{
        console.log('error')
    }
}
xhr.onerror(){
    console.log('服务器异常')
}
xhr.send();
console.log(window.musicList)
//undefined 因为在send()之后就立即执行console.log(..)，此时musicList还没有定义所以undefined，在一段时间之后数据到来时已经结束执行。
```
所以这种写法是没有效果的，如果要使用musicList，则所有代码都放在if里，此时又太过臃肿，所以正确的做法是`封装函数`
```
function getMusicList(callback){
    var xht = new XMLHttpRequest()
    xhr.open('GET', '/music.json', true)
    xhr.onload = function(){
        if((xhr.status >= 200 && xhr.status < 300)|| xhr.status === 304){
            callback(JSON.parse(xhr.responseText)) 
            //数据到来后如果是正确的就执行callback参数，将参数当做函数调用，再将得到的JSON数据作为参数传入callback函数
        }else{
            console.log('获取数据失败')
        }
    }
    xhr.onerror(){
        console.log('网络异常')
    }
    xhr.send(); 
}

getMusicList(function(list){
    console.log(list)
})

//0:{src:"http://cloud.hunger-valley.com/music/玫瑰.mp3", title: "玫瑰", auther: "贰佰", img:".."}
//1:{src:...}
//当数据到来后，就会执行function(list)函数，该函数相当于callback(..)，此时参数list就是JSON.parse(xhr.responseText)
```
4. 获取到list列表后，就可以得到具体某项数据
```
getMusicList(function(list){
    console.log(list)
    var song = list[0]
    var audioObject = new Audio(song.src)  //创建一个audio，获取到第0首音乐的src
    audioObject.play() //播放音乐
})
```
5. 如何定位播放第一首、第二首..音乐？可以创建一个变量表示list的下标，0表示第一首，1表示第二首...默认为0
```
var currentIndex = 0
getMusicList(function(list){
    loadMusic(list[currentIndex])  //此时只要修改currenIndex值就会播放指定音乐
})
function loadMusic(musicObj){    //参数musicObj就是list[currentIndex]对象
    console.log('begin play', musicObj)
}
```
6. 创建一个audio，设置成自动播放
```
var currentIndex = 0
var audio = new Audio()  //此时没有src
audio.autoplay = true    //设为自动播放

getMusicList(function(list){
    loadMusic(list[currentIndex])
})
function loadMusic(musicObj){
    console.log('begin play', musicObj)
    audio.src = musicObj.src  //将musicObj的src赋给audio，便自动播放第currentIndex首音乐
}
```
7. 操作dom，修改title、auther
```
function loadMusic(musicObj){
    console.log('begin play',musicObj)
    audio.src = musicObj.src
    $('.musicbox .title').innerText = musicObj.title
    $('.musicbox .auther').innerText = musicObj.auther
}
```
8. 当音乐播放时进度条和时间都会改变，所以需要监听timeupdate事件，因为该事件是由实时播放时间currentTime触发的
```
audio.ontimeupdate = function(){
    console.log(this.currentTime)
    $('.musicbox .progress-now').style.width = (this.currentTime / this.duration) * 100 + '%'
    var min = Math.floor(this.currentTime / 60)        //取整
    var sec = Math.floor(this.currentTime % 60) + ''  //将秒数转换成字符串
    sec = sec.length === 2? sec: '0' + sec //判断字符串秒数长度是否为2，是则当前秒数，不是则在前面加‘0’
}
```
9. 因为timeupdate每秒触发4-66次，导致时间变化不匀速，使用setInterval
```
audio.ontimeupdate = function(){
    console.log(this.currentTime)
    $('.musicbox .progress-now').style.width = (this.currentTime / this.duration) * 100 + '%'
}

var clock
audio.onplay = function(){
    clock = setInterval(function(){
        var min = Math.floor(audio.currentTime / 60)
        var sec = Math.floor(audio.currentTime % 60) + ''
        sec = sec.length === 2? sec: '0' + sec
    },1000)
}
audio.onpause = function(){
    clearInterval(clock)
}
```
10. 音乐播放时，点击暂停按钮，音乐暂停，图标换成‘播放’按钮
```
$('.musicbox .play').onclick = function(){
    audio.pause()
    this.querySelector('.fa').classList.remove('fa-pause')
    this.querySelector('.fa').classList.add('fa-play')
}
```
点击暂停按钮，音乐暂停，图标更换成‘播放’，但再次点击‘播放’按钮时，音乐不再播放，因为只监听了一次，监听完成后暂停，再点击时还是暂停；
所以要判断音乐当前所处状态：播放或停止状态，点击时如果状态为暂停，就改成播放；播放状态就改成暂停。
```
$('.musicbox .play').onclick = function(){
    if(audio.paused){   //如果为true，则为暂停状态
        audio.play()    //点击时播放音乐
        this.querySelector('.fa').classList.remove('fa-play')
        this.querySelector('.fa').classList.add('fa-pause')
    }else{
        audio.pause()
        this.querySelector('.fa').classList.remove('fa-pause')
        this.querySelector('.fa').classList.add('fa-play')
    }
}
```
11. 点击下一首按钮时，播放下一首音乐，如果是最后一首，点击下一首会循环播放第一首
实现下一首方法：`currentIndex = (++currentIndex) % musicList.length`，所以要创建一个全局变量musicList。
解析：
假设共4首音乐，下标currentIndex分别为0、1、2、3，musicList表示音乐列表，musicList.length列表的长度表示当前音乐的数量，为4。
播放currentIndex = 0即第一首，点击下一曲时，先自增（++currentIndex），得到1，再（%musicList.length)，1%4，余1，即播放current
index=1也就是第二首，类推。
```
var musicList = []
getMusicList(function(list){
    musicList = list      //在注释6里添加此行代码，表示当数据到来后，将值赋给全局变量
    loadMusic(list[currentIndex])  //loadMusic修改src、title、auther
})
```
```
$('.musicbox .forward').onlick = function(){
    currentIndex = (++currentIndex) % musicList.length
    loadMusic(musicList[currentIndex])
}
```
此时，如果在‘暂停’状态下(图标为‘播放’)点击下一首，音乐会自动播放，但图标仍为‘播放’，没有切换成‘暂停’。
所以，在点击下一首时判断，‘暂停’状态下一首仍暂停，‘播放’状态下一首仍然播放。
```
$('.musicbox .forward').onclick = function(){
    currentIndex = (++currentIndex) % musicList.length
    $('.musicbox .progress-now').style.width = 0  //将进度条清零
    if(audio.paused){       //true为暂停状态
        loadMusic(musicList[currentIndex])
        audio.pause()       //点击下一首仍暂停
    }else{
        loadMusic(musicList[currentIndex])
        //audio.play()      因为设置了自动播放，所以可以不加此行代码
    }
}
```
12. 点击上一首按钮，要实现可循环播放
实现上一首方法：`currentIndex = (musicList.length + --currentIndex) % musicList.length`
解析：
假设共4首音乐，播放currentIndex = 0即第一首，点击上一曲时，先自减(--currentIndex)，得到-1，再musicList.length+(-1)，4+(-1)为3，再(%musicList.length)，3%4，余3，即播放currentIndex=3也就是第四首音乐，实现循环。
```
$('.musicbox .back').onclick = function(){
    currentIndex = (musicList.length + --currentIndex) % musicList.length
    $('.musicbox .progress-now').style.width = 0
    if(audio.paused){
        loadMusic(musicList[currentIndex])
        audio.pause()
    }else{
        loadMusic(musicList[currentIndex])
    }
}
```
