let { Chart, Project } = require('./dbindex');
let { getBody } = require('../util');
let { getUserInfo } = require('./common');
let fs = require('fs');
var utility = require('utility');
var path  = require('path');
let imgurl = './public';

function delFile(path, reservePath) {
	if (fs.existsSync(path)) {
		if (fs.statSync(path).isDirectory()) {
			let files = fs.readdirSync(path);
			files.forEach((file, index) => {
				let currentPath = path + "/" + file;
				if (fs.statSync(currentPath).isDirectory()) {
					delFile(currentPath, reservePath);
				} else {
					fs.unlinkSync(currentPath);
				}
			});
			if (path !== reservePath) {
				fs.rmdirSync(path);
			}
		} else {
			fs.unlinkSync(path);
		}
	}
}

async function getChartsInfo(req, res, next) {
	if(!res.tempRes||!res.tempRes.loginInfo||res.tempRes.loginInfo.status!==1){
		res.send();
	}else{
		let info = await getUserInfo(req.decode_token.pid);
		let name = info.userInfo.name;
		let query = Project.findOne({
			'$and':[{
				'auther': name,
				'projectName': getBody(req).name
			}]
		});
		query.exec(function (err, result) {
			if(err) return console.log(err);
			if(result){
				if(result.chartList.length){
					Chart.find({
						'_id':{
							'$in': result.chartList
						}
					},function (err, chartinfo) {
						if(err) return console.log(err);
						res.send(chartinfo)
					})
				}else{
					res.send([])
				}
			}else{
				res.send({
					status: 404,
					msg: '找不到该项目'
				})
			}
		})
	}
}

async function updateChart(req, res, next) {
	if(!res.tempRes||!res.tempRes.loginInfo||res.tempRes.loginInfo.status!==1){
		res.send();
	}else{
		let info = await getUserInfo(req.decode_token.pid);
		let name = info.userInfo.name;
		let data = getBody(req);
		if(!data.id){
			let newChart = new Chart({
				chartInfo:{
					name: data.name,
					code: data.code,
					tag: data.tag,
					project: data.project
				}
			});
			newChart.save();
			Project.findOne({
				'$and':[{
					'auther': name,
					'projectName': data.project
				}]
			},function (err, result) {
				if(err) return console.log(err);
				if(result){
					result.chartList.push(newChart._id.toString());
					result.save();
					res.send({
						id: newChart._id.toString(),
						status: 1,
						msg: '保存成功'
					});
				}else{
					res.send({
						status: 500,
						msg: '找不到项目'
					});
				}
			});
		}else{
			Chart.findOne({
				'_id': data.id
			},function (err, result) {
				if(err) return console.log(err);
				if(result){
					result.chartInfo.name = data.name;
					result.chartInfo.code = data.code;
					result.chartInfo.tag = data.tag;
					result.chartInfo.project = data.project;
					result.save();
					res.send({
						id: data.id,
						status: 1,
						msg: '保存成功'
					})
				}
			})
		}
	}
}

function getChartInfo(req, res, next){
	if(!res.tempRes||!res.tempRes.loginInfo||res.tempRes.loginInfo.status!==1){
		res.send();
	}else{
		let query = Chart.findOne({
			'_id': getBody(req).id
		});
		query.exec(function (err, data) {
			if(err) return console.log(err);
			if(data){
				res.send({
					...data.chartInfo,
					id: data._id.toString(),
					createdAt: data.createdAt,
					updatedAt: data.updatedAt
				})
			}else{
				res.send({
					status: 404,
					msg: '找不到图表'
				})
			}
		})
	}
}

function updateImg(req, res, next){
	if(!res.tempRes||!res.tempRes.loginInfo||res.tempRes.loginInfo.status!==1){
		res.send();
	}else{
		let data = getBody(req);
		if(data.id&&data.img){
			Chart.findOne({
				'_id': getBody(req).id
			},function (err, result) {
				if(err) return console.log(err);
				if(result.chartInfo.img){
					delFile(path.join(imgurl,result.chartInfo.img))
				}
				let imgData = data.img.replace(/^data:image\/\w+;base64,/, '');
				let dataBuffer = new Buffer.from(imgData, 'base64');
				//写入文件
				let imgrootpath = '/morecharts/img/'+utility.md5(imgData)+'.png';
				let imgpath = path.join(imgurl,imgrootpath);
				fs.writeFile(imgpath, dataBuffer, function(err){
					if(err){
						res.send(err);
					}else{
						result.chartInfo.img = imgrootpath;
						result.save();
						res.send({
							status:1,
							msg: '保存成功'
						});
					}
				});
			});
		}
	}
}


module.exports = { getChartsInfo, getChartInfo, updateChart, updateImg };
