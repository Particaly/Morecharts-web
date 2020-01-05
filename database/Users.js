var { User } = require('./dbindex');
var utility = require('utility');

var { getTokenFromDatabase } = require('./Token');
var { checkMobile, checkEmail } = require('../util');

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



module.exports = { User, checkUser, createUser };
