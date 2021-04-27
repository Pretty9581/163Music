var audio = new Audio()
// audio.controls = true  //这样控件才能显示出来
//显示或隐藏input框
var flag = null; //判断是否播放
function showInput(body, input, info) {
    body.onmouseenter = function () {
        //鼠标移入时显示input
        input.style.display = "block"
        info.style.display = "block"
        // document.querySelector(".info").innerHTML = '';
    }
    body.onmouseleave = function () {
        //鼠标移出时隐藏input
        input.style.display = "none"
        info.style.display = "none"

    }
}
function getSearchLists(audio, value) {
    if (value) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", `https://musicapi.leanapp.cn/search/suggest?keywords=${value}`)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                //数据请求成功
                var lists = JSON.parse(xhr.responseText);
                // console.log(lists)
                var songs = getDetail(lists);
                render(songs);
                playmusic(audio, songs);
            }
        }
        xhr.send();
    }
    // }else{
    //     alert("请输入歌曲或歌手信息")
    // }
}
function getDetail(lists) {
    // console.log(lists)
    var songs = lists.result.songs;
    var albums = lists.result.albums;
    var id = [], title = [], album = [];
    songs.forEach(item => {
        id.push(item.id)
        title.push(item.name)
    });
    albums.forEach(item => {
        album.push(item.artist.picUrl)
    })
    if (albums.length < id.length) {
        for (let i = albums.length - 1; i < id.length; i++) {
            album.push("http://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg")
        }
    }
    return {
        id, title, album
    }
    // console.log(id,title,album)
}
function playmusic(audio, songs) {
    // console.log(songs)
    var lists = document.querySelectorAll("li");
    for (let i = 0; i < lists.length; i++) {
        lists[i].onclick = function () {
            var id = songs.id;
            var xhr = new XMLHttpRequest();
            xhr.open("get", `https://api.imjad.cn/cloudmusic/?type=song&id=${id[i]}`)
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    //数据请求成功
                    var lists = eval(JSON.parse(xhr.responseText));
                    var url = lists.data[0].url;
                    audio.pause();
                    audio.src = url;
                    // console.log(url)
                    flag = true;
                    audio.play();

                }
            }
            xhr.send();
            document.getElementsByClassName("player")[0].appendChild(audio);
        }
    }

}

function render(songs) {
    // console.log(songs.album)
    document.querySelector(".info").innerHTML = '';
    var len = songs.id.length;
    var str = '';
    for (let i = 0; i < len; i++) {
        str += `<li>
            <img src="${songs.album[i]}" width="40" height="40"/>
            <span>${songs.title[i]}<span>
        </li>`
    }
    document.querySelector(".info").innerHTML = str;
}
window.onload = function () {
    var info = document.querySelector(".info");
    var input = document.getElementsByTagName("input")[0];
    var body = document.querySelector("body");
    showInput(body, input, info);
}

//用户按下空格暂停或启动音乐
document.body.addEventListener("keydown", function (e) {
    var e = e || window.event;
    if (e.keyCode === 32) {
        if (flag) {
            audio.pause();
        } else {
            audio.play();
        }
        flag = !flag;
    }
})