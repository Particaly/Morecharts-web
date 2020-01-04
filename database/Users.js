var mongoose = require('mongoose');
var utility = require('utility');
var Schema = mongoose.Schema;
var CounterModel = require('./Counter');
var { getTokenFromDatabase } = require('./Token');
var { checkMobile, checkEmail } = require('../util');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
	if(err){
		console.log('Connection Error:' + err)
	}else{
		console.log('Connection success!')
	}
});

var userSchema = new Schema({
	userId: {
		type: Number,
		default: 0
	},
	userInfo: {
		name: String,
		email: String,
		phone: String
	},
	userPass: String,
});

userSchema.pre('save',async function() {
	// Don't increment if this is NOT a newly created document
	if(!this.isNew) return;
	this.userId = await CounterModel.increment('userId');
});

var User = mongoose.model('User', userSchema);



User.find({
	'userInfo.name': 'admin'
}, function (err, user) {
	if(err) return console.log(err);
	if(!user.length){
		var admin = new User({
			userId: 1,
			userInfo: {
				name: 'admin',
				email: '',
				phone: ''
			},
			userPass: utility.md5('admin')
		});
		admin.save(function (err, param) {
			if(err) return console.log(err);
		});
	}
});

function filterCheckOption(data) {
	let name = data.pid,
		checktype = '';
	if(checkEmail(name)){
		checktype = {
			'userInfo.email':name
		}
	}else if(checkMobile(name)){
		checktype = {
			'userInfo.phone':name
		}
	}else{
		checktype = {
			'userInfo.name':name
		}
	}
	return checktype
}

// 登录
function checkUser(data, callback){
	let checktype = filterCheckOption(data);
	User.find(checktype,function (err, res) {
		if(err) return err;
		let postdata = {};
		if(res.length){
			res = res[0];
			if(res.userPass === utility.md5(data.psw)){
				postdata.msg = '登录成功';
				postdata.status = 1;
				callback(postdata);
			}else{
				postdata.msg = '密码错误';
				postdata.status = 2;
				callback(postdata);
			}
		}else{
			postdata.msg = '该用户尚未注册';
			postdata.status = 3;
			callback(postdata)
		}
	});
}
// 新增用户
function createUser(data, callback){
	User.find({
		$or: [
			{'userInfo.name':data.pid},
			{'userInfo.email':data.pem}
		],
	}, function (err, user) {
		if(err) return console.log(err);
		let postdata = {};
		if(!user.length){
			var newuser = new User({
				userName: data.pid,
				userEmail: data.pem,
				userPass: utility.md5(data.psw)
			});
			newuser.save(function (err, param) {
				if(err) return console.log(err);
				postdata.msg = '注册成功';
				postdata.status = 1;
				callback(postdata)
			});
		}else{
			postdata.msg = '当前用户名或邮箱已被使用';
			postdata.status = 2;
			callback(postdata)
		}
	})
}
// 判断token

/*
* @status
* status:	1 // 已登录, 2 // 未登录, 3 // 密码近期被修改, 4 // 找不到用户
* */
function checkToken(req, res, next){
	if(!req.decode_token){
		next();
		return
	}
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

	if(req.decode_token.toString() === '{}'){
		makeTempRes(req, 'loginInfo',{
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

function isType(type, target){
	const Tag = `[object ${type}]`;
	return Object.prototype.toString.call(target) === Tag
}
module.exports = { User, checkUser, createUser, checkToken };
