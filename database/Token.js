var mongoose = require('mongoose');
var utility = require('utility');
var jwt = require('jsonwebtoken');
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

function generateToken(msg,callback) {
	let content = {
		pid: msg.pid,
		psw: utility.md5(msg.psw)
	};
	let secretkey = 'shoudongjiami@123456789';
	
	let token = new Token({
		token: jwt.sign(content, secretkey)
	});
	token.save(function (err, param) {
		if(err) return console.log(err);
	});
	callback(token.token)
}


module.exports = { generateToken };
