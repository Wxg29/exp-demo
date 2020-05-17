//先在app.js里面引入vue.js文件  --- 引入模块 然后再use设置路由别名

//新建vue项目的路由 --- 写接口
var express = require("express");
var router = express.Router();

var {
    Mv,
    User
} = require("../connect/model")

var {
    aesEncrypt,
    keys
} = require("../connect")

//导入上传头像的插件
var multer = require("multer")

router.get("/", (req, res) => {
    res.json({
        msg: "这是一个vue的测试接口",
        // code: 200
    })
})

//查询电影数据的接口
router.get("/movie", (req, res) => {
    var {
        limit
    } = req.query
    limit = limit * 1 || 0
    console.log(limit);

    Mv.find({}, { _id: 0 })
        .limit(limit)
        .sort({ _id: -1 })
        .then(result => {
            res.json({
                msg: "电影数据查询成功",
                code: 200,
                result
            })
        })
})


//注册接口  ---  注册逻辑  
router.post("/register", (req, res) => {
    var body = req.body;  // 前端发送过来的数据
    console.log(body);
    User.findOne({
        mobile: body.mobile,
    }).then(data => {
        if (data) {
            // 表明用户名已经存在  请重新注册 
            res.json({
                code: 200,
                msg: "注册失败,手机号码已经存在",
                data,
                type: 0  // 前端会通过 type  判断是否注册成功
            })
        } else {
            // 立即注册 
            body.time = new Date();
            User.insertMany(body).then(result => {
                res.json({
                    code: 200,
                    msg: "注册成功",
                    result,
                    type: 1  // 前端会通过 type  判断是否注册成功
                })
            })
        }
    })
})

//  登录接口 
router.post("/login", (req, res) => {
    const body = req.body;
    console.log(body);
    User.findOne({
        mobile: body.mobile
    }).then(data => {
        if (data.password == body.password) {
            var token = aesEncrypt(data.mobile + data.username + data.password, keys);
            req.session.mobile = data.mobile;
            req.session.username = data.username;
            req.session.token = token
            res.json({
                msg: "登录成功",
                code: 200,
                type: 1,
                data,
                token   //  token 一定要发送客户端 
            })
        } else {
            res.json({
                msg: "手机号或密码错误",
                code: 200,
                type: 0,
                data
            })
        }
    })
});


//获取个人信息
router.get("/getuserinfo", (req, res) => {
    console.log(req.session);

    User.findOne({
        mobile: req.session.mobile
    }).then(result => {
        res.json({
            msg: "获取用户信息成功",
            code: 200,
            type: 1,
            result
        })
    })
})


//上传头像部分
//1.选择硬盘存储
var storage = multer.diskStorage({
    destination: function (req, file, cb) {  // 上传的目录 
        cb(null, './public/upload');
    },
    filename: function (req, file, cb) {   // 上传的文件名 --- 加上时间戳避免重名
        cb(null, Date.now() + "nz1903" + file.originalname);
    }
})

var upload = multer({ storage: storage }).any();  // any表示接受任何格式文件


//2.上传头像
router.post("/uploadimg", upload, (req, res) => {
    console.log("文件上传成功");
    console.log(req.files);  //里面有个path是图片路径  非常重要 传给前端
    if (req.files) {
        var path = req.files[0].path  //files 是一个数组   里面只有一个对象
        //把头像存进对应用户的数据库
        User.updateOne({
            mobile: req.session.mobile
        }, {
            $set: {
                avatar: path
            }
        }).then(result => {
            res.json({
                code: 200,
                mag: "头像上传成功",
                type: 1,
                path: path,
                result,
                mobile: req.session.mobile
            })
        })

    } else {
        res.json({
            code: 200,
            mag: "头像上传失败",
            type: 0,
        })
    }
})

//获取头像
router.post("/getavatar", (req, res) => {
    User.findOne({
        mobile: req.session.mobile
    }).then(result => {
        if (result.avatar) {
            res.json({
                msg: "获取头像成功",
                code: 200,
                result,
                type: 1
            })
        } else {
            res.json({
                msg: "获取头像失败",
                code: 200,
                result,
                type: 0
            })
        }
    })
})


//暴露模块
module.exports = router;