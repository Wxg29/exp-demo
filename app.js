var createError = require('http-errors');  //http错误模块
var express = require('express');    //express模块
var path = require('path');        //node自带的路径模块
var cookieParser = require('cookie-parser');  //处理cookie
var logger = require('morgan');    // 记录服务器日志
var session = require("express-session");
var cors = require("cors")  //引入cors 跨域问题
//连接数据库
var connect = require("./connect/conn")

//ws模块
require("./connect/webSocketSever")

//路由模块
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var detailsRouter = require('./routes/details');
var vueRouter = require("./routes/vue")

var app = express();   //app 包含了express所有的api
//引入的token
var {
  checkToken
} = require("./connect")

// view engine setup
app.set('views', path.join(__dirname, 'views')); //把views的文件路径设置为绝对路径 / 
app.set('view engine', 'ejs');  //ejs设置模板引擎
//设置html模板引擎自愿

app.use(logger('dev'));  //打印日志
app.use(express.json());  //获取表单post提交 或者 ajax post传递的参数
app.use(express.urlencoded({ extended: false })); //req.body 获取post请求的参数
app.use(cookieParser());  //设置服务器的 cookie
//设置加载静态文件 (express.static服务器的静态资源)  然后把public设置为绝对路径  /
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());  //解决 cors 跨域问题  重置协议  服务器没有任何安全协议  

//session 中间件--- 必须写在路由前面
app.use(session({
  name: "AppTest",
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 10 }, //存的时长
  secret: "test",
  resave: false,
  saveUninitialized: true
}))


//设置路由中间件   app.use("路由别名",路由模块)
// 正确路由地址 == 路由别名 + 路由路径
app.use('/', indexRouter);  //路由正确执行不会进入下一步
app.use('/users', usersRouter); //区别各个模块之间的名字冲突
app.use('/details', detailsRouter)//  新增的电影详情页路由别名

app.use(checkToken);

app.use('/vue', vueRouter)  //vue路由别名

// catch 404 and forward to error handler
//next表示进入下一个中间件
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');  //res.render 渲染页面
  //esj文件本身是js 相当于处理html文件的js(模板引擎)
});

module.exports = app;


//app.js是处理express的核心配置文件
