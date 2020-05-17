var express = require('express');
var router = express.Router();


var {
  User,
  Mv
} = require("../connect/model")

//导入的函数封装
var {
  checkSession   //判断是否登陆
} = require("../connect")

/* GET home page. */
// router 路由模块 实现动态路由数据交互(页面 json 字符串)

//res.render   ---  将会根据views中的模板文件进行渲染
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function (req, res, next) {
  res.render("home", {
    username: req.session.username,  //从存进的session取出username
  });
})

//res.send  --- 响应字符串内容register
router.get('/register', function (req, res, next) {
  res.render("register");
})

router.get('/login', function (req, res, next) {
  var username = req.query.username || "";
  res.render("login", { username: username });
})

router.get("/logout", (req, res) => {
  // 销毁 req.session 
  req.session.destroy(() => {
    res.redirect("/home");
  })
})

//重置个人信息
router.get("/my", function (req, res, next) {
  if (req.session.username) {
    User.findOne({
      username: req.session.username
    }).then(result => {
      console.log(result);
      res.render('my', { result });  // 对象 key-value 相同 直接合并简写 
    })
  } else {
    res.send(`<script>alert("你的登录已经失效,请重新登录!");location.href='/login'</script>`)
  }

})

//重置用户名
router.get("/resetuser", function (req, res, next) {
  if (req.session.username) {
    res.render("resetuser");
  } else {
    res.send(`<script>alert("你的登录已经失效,请重新登录!");location.href='/login'</script>`)
  }
  // res.render("resetuser");
})



//渲染电影列表
router.get("/mvlist", function (req, res) {
  //取到地址栏传过来的关键字
  var query = req.query;
  console.log(query);  //能取到query

  var searchObj = {};  //搜索条件
  var sortObj = {};  //排序条件
  if (query.keyword) {
    var keyword = query.keyword;
    searchObj = {
      $or: [
        { title: new RegExp(keyword) },
        { year: new RegExp(keyword) },
        { genres: new RegExp(keyword) },
        // { 'rating.average': new RegExp(keyword * 1) },
      ]
    }

  } else {  //如果没传关键字 点击的是排序按钮
    sortObj = query
  }

  checkSession(req, res, () => {   //如果登陆了
    Mv.find(searchObj, { _id: 0 })  //searchObj本身就是数组
      .sort(sortObj)  //排序
      .then(result => {
        // console.log(result);
        res.render("mvlist", { result })
      })
  })
})



//聊天室
router.get("/chatroom", (req, res) => {
  checkSession(req, res, () => {
    res.render("webSocket")
  })
})







//res.json
router.get("/demo", function (req, res) {
  // req.query 获取 query 对象数据  
  res.json({
    msg: "返回的是josn格式的数据",
    query: req.query,   //查询参数
    header: req.headers // 获取请求头 
  })
})

//res.send
router.all("/all", function (req, res) {
  res.send("这是一个get 和 post 都可以调用的请求")
})




module.exports = router;
