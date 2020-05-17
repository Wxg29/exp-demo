

const mongoose = require("mongoose");

const Schema = mongoose.Schema;  //构造函数 Schema


//user 表结构
const user_Schema = new Schema({
    username: String,
    password: String,
    repassword: String,
    email: String,
    mobile: String,
    avatar: String,
    time: Date
}); //没有定义数据类型的nickname不能进行操作


exports.User = mongoose.model("user", user_Schema)



//mv 表结构
const mv_schema = new Schema({
    "rating": Object,
    "genres": Array,
    "title": String,
    "casts": Array,
    "collect_count": Number,
    "original_title": String,
    "subtype": String,
    "directors": Array,
    "year": String,
    "images": Object,
    "alt": String,
    "id": String
});

exports.Mv = mongoose.model("mv", mv_schema);




const comment_schema = new Schema({
    id: Number,  // 评论序号
    title: String, // 评论标题
    content: String, // 评论内容
    username: String, // 评论人
    time: String, // 评论时间 
    mid: String, // 评论的电影id 
    mtitle: String, // 评论的电影标题  
});
exports.Comment = mongoose.model("comment", comment_schema);  // comments


// 控制id 自增长 
const uid_schema = new Schema({
    id: Number,
    name: String  // 表名 
});
exports.Uid = mongoose.model("uid", uid_schema)  // uids 