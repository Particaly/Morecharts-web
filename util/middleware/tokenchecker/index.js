var { Token,User } = require('../../../database/dbindex');
var jwt = require('jsonwebtoken');

// 判断token
/*
* @status
* status:	1 // 已登录, 2 // 未登录, 3 // 密码近期被修改, 4 // 找不到用户
* */
function checkToken(req, res, next){
    res.send = new Proxy(res.send, {
        apply :function (target, thisArg, argArray) {
            if(!thisArg.sended){
                thisArg.sended = true;
                argArray[0] = {
                    data: argArray[0],
                    ...thisArg.tempRes
                };
                return Reflect.apply(target, thisArg, argArray)
            }
            return Reflect.apply(target, thisArg, argArray)
        }
    });
    let token = req.get('Authorization');
    if(token){
        try {
            req.decode_token = jwt.decode(token, req.app.get('jwtTokenSecret'));
            req.decode_token.token = token;
        }catch (e) {
            req.decode_token = {};
        }
    }else{
        makeTempRes(res, 'loginInfo',{
            status: 2,
            msg: '未登录'
        });
        next();
        return
    }

    if(req.decode_token.toString() === '{}'){
        makeTempRes(res, 'loginInfo',{
            status: 2,
            msg: '未登录'
        });
        next();
    }
    getTokenFromDatabase(req.decode_token.token, function (tokenlist) {
        if(tokenlist.length){
            User.find({
                'userInfo.name': req.decode_token.pid
            }, function (err, userlist) {
                if(err) return console.log(err);
                if(userlist.length){
                    if(userlist[0].userPass === req.decode_token.psw){
                        makeTempRes(res, 'loginInfo', {
                            status: 1,
                            msg: '已登录',
                            username: userlist[0].userInfo.name
                        });
                        next();
                    }else{
                        makeTempRes(res, 'loginInfo', {
                            status: 3,
                            msg: '用户密码已过期'
                        });
                        next();
                    }
                }else{
                    makeTempRes(res, 'loginInfo', {
                        status: 3,
                        msg: '无效token'
                    });
                    next();
                }
            })
        }else{
            makeTempRes(res, 'loginInfo', {
                status: 3,
                msg: '无效token'
            });
            next();
        }
    });
}
function makeTempRes(req, targetName, target){
    if(req.tempRes){
        req.tempRes[targetName] = target;
    }else{
        req.tempRes = {};
        req.tempRes[targetName] = target;
    }
}
// 检查token
function getTokenFromDatabase(token, callback){
    Token.find({
        token
    }, function (err, res) {
        if(err) return console.log(err);
        callback(res)
    })
}

module.exports = { checkToken };
