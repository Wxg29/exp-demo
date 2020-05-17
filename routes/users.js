var express = require('express');
var router = express.Router();

/* GET users listing. */

//导入连库模块
var {
  User
} = require("../connect/model")

//req.send
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//注册页面
router.post("/register", function (req, res, next) {
  var body = req.body;  //req.body 响应post请求发送的数据
  console.log(body);
  //注册时传入的数据要和数据库对比是否存在
  User.findOne({
    username: body.username,
  }).then((result => {
    if (result) {
      res.send(`<script>alert("用户名已经存在!");location.href='/register'</script>`)
    } else {
      body.time = new Date();
      User.insertMany(body)
        .then(data => {
          console.log(data);
          res.send(`<script>alert("注册成功，点击跳转登陆!");location.href='/login?uesrname=${body.username}'</script>`)
        })
        .catch(err => {
          res.send(`<script>alert("注册失败,数据库的错误");location.href='/register'</script>`)
        })
    }
  }))
})

//登陆页面
router.post("/login", function (req, res, next) {
  var body = req.body;
  console.log(body);
  User.findOne({
    username: body.username,
    password: body.password
  }).then(result => {
    if (result) {
      // 跳转首页
      // 把用户名存储到 req.session 
      req.session.username = result.username;
      res.redirect("/home");
      // res.send(`<script>alert()</script>`)
    } else {
      res.send(`<script>alert('用户名或者密码错误,请重新登录');location.href='/login'</script>`)
    }
  })
})


//修改个人信息
router.post("/changeinfo", (req, res) => {
  var body = req.body;
  console.log(body);
  if (req.session.username) {
    User.updateMany({
      username: req.session.username
    }, {
      $set: body
    }).then(result => {
      res.json({
        mas: "个人信息修改成功",
        result,
        code: 200
      })
    })
  } else {
    res.send(`<script>alert('用户名或者密码错误,请重新登录');location.href='/login'</script>`)
  }
})


router.post("/changeuser", (req, res) => {
  var {  //解构赋值
    oldusername,
    newusername
  } = req.body;

  console.log(oldusername, newusername);

  if (req.session.username) {
    User.findOne({
      username: req.session.username
    }).then(data => {
      if (data.username === oldusername) {
        User.updateMany({
          username: req.session.username
        }, {
          $set: {
            username: newusername
          }
        }).then(result => {
          res.json({
            msg: "用户名修改成功",
            code: 200,
            type: 1
          })
        })
      } else {
        res.json({
          msg: "用户名修改失败，原始用户名不对",
          code: 200,
          type: 0
        })
      }
    })

  } else {
    res.send(`<script>alert('请重新登录');location.href='/login'</script>`)
  }
})







router.get("/list", function (req, res, next) {
  res.send('我是list的页面');
})




module.exports = router;
