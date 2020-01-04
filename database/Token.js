var mongoose = require('mongoose');
var utility = require('utility');
var jwt = require('jsonwebtoken');
var { getBody } = require('../util');
var Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
	if(err){
		console.log('Connection Error:' + err)
	}else{
		console.log('Connection success!')
	}
});

var tokenSchema = new Schema({
	token: String,
	expireAt: {
		type: Date,
		default: Date.now,
		index: { expires: '1d' }
	}
});
// tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 })

var Token = mongoose.model('Token', tokenSchema);

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
// 检查token
function getTokenFromDatabase(token, callback){
	Token.find({
		token
	}, function (err, res) {
		if(err) return console.log(err);
		callback(res)
	})
}

function handlerTokenCheck(res, req, next){

}

module.exports = { generateToken, getTokenFromDatabase };
