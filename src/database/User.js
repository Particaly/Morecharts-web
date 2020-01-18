import { User } from "@/database/Mongoose";
import { generateToken } from './AccessToken';
import { findUserInfo } from './Common';
import { getBody } from "@/util";
import utility from 'utility';

User.find({
	'userType': 'admin'
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
			userType: 'admin',
			userPass: utility.md5('admin')
		});
		admin.save(function (err, param) {
			if(err) return console.log(err);
		});
	}
});

// 登录
async function login(req, res, next){
	let data = getBody(req);
	let user = await findUserInfo(data.pid);
	if(user){
		if(user.userPass === utility.md5(data.psw)){
			generateToken(req,res,next);
			res.presend({
				msg: '登录成功',
				status: 1
			});
		}else{
			res.presend({
				msg: '密码错误',
				status: 2
			});
		}
	}else{
		res.presend({
			msg: '该用户尚未注册',
			status: 3
		});
	}
	res.send()
}

// 新增用户
function createUser(req, res, next){
	let data = getBody(req);
	User.find({
		$or: [
			{'userInfo.name':data.pid},
			{'userInfo.email':data.pem}
		],
	}, function (err, user) {
		if(err) return console.log(err);
		if(!user.length){
			var newuser = new User({
				userInfo: {
					name: data.pid,
					email: data.pem,
					phone: ''
				},
				userEmail: data.pem,
				userPass: utility.md5(data.psw)
			});
			newuser.save(function (err, param) {
				if(err) return console.log(err);
				generateToken(req,res,next);
				res.presend({
					msg: '注册成功',
					status: 1
				})
			});
		}else{
			res.presend({
				msg: '当前用户名或邮箱已被使用',
				status: 2
			});
		}
		res.send();
	})
}
// 修改密码
/*
* @decode_token: {
* 		pid,psw,token
* }
* status： 1 修改成功，2 旧密码不正确，3 用户数据错误
* */
function changepassword(req, res, next){
	if(res.predata?.loginInfo.status!==1){
		res.send();
	}else{
		User.find({
			'userInfo.name': req.accesstoken.pid
		},function (err, user) {
			if(err) return console.log(err)
			if(user.length){
				if(user[0].userPass === utility.md5(getBody(req).oldpsw)){
					user[0].userPass = utility.md5(getBody(req).newpsw);
					user[0].save(function (err, user0, numAffected) {
						if (err) return console.log(err);
						res.send({
							status: 1,
							msg: '修改成功'
						})
					});
				}else{
					res.send({
						status: 2,
						msg: '旧密码不正确'
					})
				}
			}else{
				res.send({
					status: 3,
					msg: '用户数据错误'
				})
			}
		})
	}
}

module.exports = {
	login,createUser,changepassword
};
