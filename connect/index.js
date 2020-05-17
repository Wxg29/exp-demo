

//判断是否已经登陆
exports.checkSession = function (req, res, callback) {
    if (req.session.username) {
        callback()
    } else {
        res.send(`<script>alert("你的登录已经失效,请重新登录!");location.href='/login'</script>`)
    }
}


// 日期格式化
exports.dateFormat = function () {
    var value = new Date();
    var year = value.getFullYear();
    var month = value.getMonth() + 1;
    var day = value.getDate();
    var hour = value.getHours();
    var min = value.getMinutes();
    var sec = value.getSeconds();
    console.log(`${year}-${month}-${day} ${hour}:${min}:${sec}`)
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}



//token 的加密解密

const crypto = require("crypto");   // Node 自带API 

// MD5 只能加密不能解密 
// 加密函数  data 需要加密的字段 
function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;  // 密文  
}

// 解密 
function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;  // 明文 
}

const keys = "NZ1903daydayup";   //   zklabc ==>  NZ1903daydayupzklabc

exports.aesEncrypt = aesEncrypt;   // 加密
exports.aesDecrypt = aesDecrypt;   // 解密
exports.keys = keys;        // 密钥 



// token 拦截的中间件  判断是否登录  
exports.checkToken = function (req, res, next) {
    console.log("checkToken---nz1903")
    const client_token = req.headers.token;  // 客户端  token  axios 请求头带过去的 
    const server_token = req.session.token;  // 服务器  token 
    console.log("客户端 token = " + client_token);
    console.log("服务器 token = " + server_token);
    if (req.path !== "/vue/login" && req.path !== "/vue/register") {
        if (client_token) {
            if (server_token) {
                if (client_token === server_token) {
                    // 合法的登录用户 
                    next();
                } else {
                    res.json({
                        code: "3000",   // 3000 表示未登录 
                        type: 0,
                        msg: "token有错,请重新登录"
                    })
                }
            } else {
                res.json({
                    code: "3000",
                    type: 0,
                    msg: "token失效,登录超时,请重新登录"
                })
            }
        } else {
            res.json({
                code: "3000",
                type: 0,
                msg: "token不存在,未登录,请重新登录"
            })
        }
    } else {
        // 登录和注册 不会有token 判断 
        next();
    }

}



