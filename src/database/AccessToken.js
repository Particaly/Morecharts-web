import { AccessToken } from './Mongoose';
import jwt from 'jsonwebtoken';
import utility from 'utility';
import {getBody} from "@/util";

// 生成token
function generateToken(req,res,next) {
	let msg = getBody(req);
	let content = {
		pid: msg.pid,
		psw: utility.md5(msg.psw)
	};
	let app = require('../app.js');
	let secretkey = app.get('jwtTokenSecret');
	
	let token = new AccessToken({
		token: jwt.sign(content, secretkey)
	});
	token.save(function (err, param) {
		if(err) return console.log(err);
	});
	res.presend({
		token:token.token
	});
	next()
}



module.exports = { generateToken };
