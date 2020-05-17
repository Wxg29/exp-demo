

//聊天室的服务器端

const ws = require("ws")  //导入安装的模块
const webSocketServer = ws.Server;
const port = 3333;


//1.创建服务器  绑定ip + 端口     监听端口
const wss = new webSocketServer({ port })  //启动服务器端口  监听3333

console.log(` webSocket is running at ws://0.0.0.0:3900 `);

let count = 0;
let info = "用户/";
let clientUserMap = {};

//2.监听客户端连接   socket 客户端传过来的型参
wss.on("connection", (socket) => {
    console.log(` 客户端的 socket 上线了 `);

    //给每个用户分配一个账号 --- 计数来区分
    count++;
    //socket是一个对象
    socket.name = info + count;
    clientUserMap[socket.name] = socket   //放置在对象里面


    //3.监听 客户端发来的消息
    socket.on("message", (msg) => {
        // console.log(msg);

        // 4. 把来自客户端的消息 转发给其他的在线客户端
        boradCast(socket, msg)
    })

    // 5. 监听 客户端的关闭  
    socket.on("close", () => {
        boradCast(socket, "886,我下线了");
        // 对象删除  delete obj[key]
        delete clientUserMap[socket.name];
    })


})


//将消息广播出去
function boradCast(socket, msg) {
    for (var i in clientUserMap) {
        var hour = new Date().getHours();
        var min = new Date().getMinutes();
        // 谁 说 : msg    
        clientUserMap[i].send(`${socket.name} : (${hour}:${min}) ${msg} `);   // 发送消息
    }
}
