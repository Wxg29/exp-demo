
//新建的路由  --- 电影详情模块

var express = require("express");
var router = express.Router();

var {
    Mv,
    Comment,
    Uid
} = require("../connect/model")

//导入判断登录模块
var {
    checkSession,
    dateFormat
} = require("../connect")

//测试  --- ok的，成功了
router.get("/", (req, res) => {
    res.send("新建的路由连接成功")
})

//电影详情render
router.get("/mvdetails", (req, res) => {
    //通过地址栏传过来的mid在找到数据库找到对应的数据，然后传给ejs页面渲染
    var {
        mid
    } = req.query;

    checkSession(req, res, () => {
        Mv.findOne({
            id: mid,
        }).then(result => {
            res.render("details.ejs", { result })
        })
    })
})

//评论提交 --- 插入数据库
router.post("/content", (req, res) => {
    var body = req.body;
    console.log(body);

    var {
        mid
    } = req.query;
    console.log(mid);

    checkSession(req, res, () => {
        // 1. 查询电影详情 
        // 2. 获取自增长的id  
        // 3. 插入  
        Mv.findOne({
            id: mid   //找到id的这条信息
        }).then(movie => {   //通过id找到的电影数据 
            // console.log(movie);
            Uid.updateMany({
                name: "comments",
            }, {
                $inc: {
                    id: 1,
                }
            }).then(data => {
                Uid.findOne({
                    name: "comments"
                }).then(obj => {
                    // 插入操作
                    body.time = dateFormat();
                    body.id = obj.id;
                    body.username = req.session.username;
                    body.mid = movie.id;
                    body.mtitle = movie.title;

                    Comment.insertMany(body)
                        .then(result => {
                            //  显示评论列表 
                            //存一个mid进去session   --- 评论的电影的id
                            req.session.mid = mid

                            //重定向，提交评论跳到渲染的评论页面
                            res.redirect("/details/mvcomment")
                        })
                })
            })
        })
    })
})


//评论列表
router.get("/mvcomment", (req, res) => {
    checkSession(req, res, () => {
        //做分页限制
        //当前页码 pageNow
        //总条数 total
        //每页要显示的数据 pageSize
        //总的页数  pageTotal

        var query = req.query;
        var pageNow = query.pageNow * 1 || 1;  //默认为一 或者为传过来的值
        var total = 0;
        var pageSize = query.pageSize * 1 || 10;
        var pageTotal = 0;

        Comment.find()
            .then(result => {
                if (result.length > 0) {

                    //代码有执行顺序   --- 先有总条数  ---  总页数  ---  当前页码 

                    //总条数
                    total = result.length
                    //总页数  = 总条数 / 每页的条数
                    pageTotal = Math.ceil(total / pageSize);  // 向上取整数 
                    //当前页码小于1就等于1
                    pageNow = pageNow <= 1 ? 1 : pageNow
                    //当前页码大于总的页数就等于最大页数
                    pageNow = pageNow >= pageTotal ? pageTotal : pageNow
                }

                Comment.find()
                    .sort({ _id: -1 })  //降序排序  id大的是后插进去的 
                    .skip((pageNow - 1) * pageSize) //过滤的条数 --- pageNow为1 就是不过滤  为2就过滤十条
                    .limit(pageSize)  //只显示的条数
                    .then(data => {
                        res.render("mvcomment", {
                            result: data,
                            username: req.session.username,
                            total,
                            pageSize,
                            pageTotal,
                            pageNow
                        })
                    })
            })






        // 查询所有的电影评论 
        //     Comment.find({}, {}).sort({ _id: -1 })
        //         .then(result => {
        //             res.render("mvcomment", {
        //                 result,
        //                 username: req.session.username
        //             });
        //         })
    })
})


//删除评论
router.get("/delete", (req, res) => {
    var {
        deleteid
    } = req.query;
    console.log(deleteid);

    checkSession(req, res, () => {
        // 查询id对应的数据进行删除
        Comment.deleteMany({
            _id: deleteid
        }).then(result => {
            res.json({
                code: 200,
                type: 1,
                result,
                msg: "评论删除成功"
            })
        })
    })
})


//修改评论
router.post("/update", (req, res) => {
    var body = req.body

    console.log(body);

    //修改操作
    checkSession(req, res, () => {
        Comment.updateMany({
            id: body.id
        }, {
            $set: {
                title: body.title,
                content: body.content
            }
        }).then(result => {
            res.json({
                code: 200,
                type: 1,
                result,
                msg: "评论修改成功"
            })
        })
    })
})


//点击评论的电影名字，跳转到本部电影的所有评论
router.get("/aboutcomment", (req, res) => {
    checkSession(req, res, () => {
        var { mtitle } = req.query  //获取到前端地址栏传来的值
        console.log(mtitle);

        Comment.find({ mtitle: mtitle })
            .sort({ id: -1 })
            .then(result => {
                res.render("aboutcomment", { result, username: req.session.username })
            })


    })
})


module.exports = router