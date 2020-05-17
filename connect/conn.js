

const mongoose = require("mongoose");

const hostname = "0.0.0.0";
const port = 27017;
const dbname = "oncetest";  //数据库名字

const user = "?"   //以后数据库加密要用到
const password = "?"



const conn_db = `mongodb://${hostname}:${port}/${dbname}`;//如果错了可能就在链接


//开始连接数据库
mongoose.connect(conn_db, {
    //不加会出现两个警告 ，但是不影响
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log("mongodb数据库连接失败");
        throw err;
    } else {
        console.log("mongodb数据库连接成功");
    }
});
//连接数据库成功了


//监听数据库的连接状态
const connection = mongoose.connection;
//连接成功
connection.on("connected", () => {
    console.log("mongoose 链接成功")
});

// 连接异常
connection.on("error", (err) => {
    console.log("Mongoose connection error " + err);
})

// 连接断开
connection.on("disconnected", () => {
    console.log("Mongoose connection 断开 ")
})