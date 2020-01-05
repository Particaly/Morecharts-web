var { Token } = require('./dbindex');
var utility = require('utility');
var jwt = require('jsonwebtoken');




// 生成token
function generateToken(msg,callback) {
	let content = {
		pid: msg.pid,
		psw: utility.md5(msg.psw)
	};
	let app = require('../app.js');
	let secretkey = app.get('jwtTokenSecret');

	let token = new Token({
		token: jwt.sign(content, secretkey)
	});
	token.save(function (err, param) {
		if(err) return console.log(err);
	});
	callback(token.token)
}


function handlerTokenCheck(res, req, next){

}

module.exports = { generateToken };
