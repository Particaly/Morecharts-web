let {
	login, createUser, changepassword, getUserInfo, getProjectList,
	createNewProject, getChartsInfo, updateChart, getChartInfo, updateImg
} = require('../database');
import express from 'express';
var router = express.Router();


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

router.post('/api/getUserInfo', getUserInfo);

router.post('/api/getProjectList', getProjectList);

router.post('/api/createNewProject', createNewProject);

router.post('/api/getChartsInfo', getChartsInfo);

router.post('/api/getChartInfo', getChartInfo);

router.post('/api/updateChart', updateChart);

router.post('/api/updateImg', updateImg);

module.exports = router;
