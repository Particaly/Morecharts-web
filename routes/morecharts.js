var express = require('express');
var router = express.Router();
let { checkUser, generateToken, createUser, changepassword } = require('../database');
let { getBody } = require('../util');

/* GET users listing. */
router.get('/', function () {
	res.sendFile('./public/morecharts/index.html')
});

router.post('/api/login',function (req, res, next) {
	checkUser(getBody(req),function (msg) {
		if(msg.status === 1){
			generateToken(getBody(req),function(token) {
				msg.token = token;
				res.send(msg)
			});
		}else{
			res.send(msg)
		}
	});
});

router.post('/api/changepassword',function (req, res, next) {
	changepassword(req, res, next)
});

router.post('/api/register', function(req, res, next) {
	createUser(getBody(req),function (msg) {
		if(msg.status === 1){
			generateToken(getBody(req),function(token) {
				msg.token = token;
				res.send(msg)
			});
		}else{
			res.send(msg)
		}
	})
});

router.post('/api/isLogin', function (req, res, next) {
	res.send()
});

module.exports = router;
