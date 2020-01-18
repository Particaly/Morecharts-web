var express = require('express');
var router = express.Router();
import { login, createUser, changepassword } from '@/database';

/* GET users listing. */
router.get('/', function () {
	res.sendFile('./public/morecharts/index.html')
});

router.post('/api/login',login);

router.post('/api/isLogin', function(req, res, next) {
	res.send()
});

router.post('/api/changepassword',changepassword);
router.post('/api/register', createUser);

module.exports = router;
