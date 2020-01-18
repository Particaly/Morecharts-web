import { findAccessToken, findUserInfo } from '@/database/Common';
import jwt from 'jsonwebtoken';

function register(req,token){
	try {
		req.accesstoken = jwt.decode(token, req.app.get('jwtTokenSecret'));
		req.accesstoken.token = token;
	}catch (e) {
		req.accesstoken = {};
	}
}

export default async function(req, res, next) {
	let token = req.get('Authorization');
	if(token){
		register(req,token);
	}else{
		res.presend('loginInfo',{
			status: 2,
			msg: '未登录'
		});
		next();
		return false;
	}
	if(req.accesstoken.toString() === '{}'){
		res.presend('loginInfo',{
			status: 2,
			msg: '未登录'
		});
		next();
	}
	let tokeninfo = await findAccessToken(token);
	if(tokeninfo){
		let user = await findUserInfo(req.accesstoken.pid);
		if(user){
			if(user.userPass === req.accesstoken.psw){
				res.presend('loginInfo', {
					status: 1,
					msg: '已登录',
					username: user.userInfo.name
				});
				
				next();
			}else{
				res.presend('loginInfo', {
					status: 3,
					msg: '用户密码已过期'
				});
				next();
			}
		}else{
			res.presend('loginInfo', {
				status: 3,
				msg: '无效token'
			});
			next();
		}
	}else{
		res.presend('loginInfo', {
			status: 3,
			msg: '无效token'
		});
		next();
	}
}
