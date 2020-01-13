let { Chart, Project } = require('./dbindex');
let { getBody } = require('../util');


function getChartsInfo(req, res, next) {
	if(!res.tempRes||!res.tempRes.loginInfo||res.tempRes.loginInfo.status!==1){
		res.send();
	}else{
		let query = Project.findOne({
			'$and':[{
				'auther': req.decode_token.pid,
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

function updateChart(req, res, next) {
	if(!res.tempRes||!res.tempRes.loginInfo||res.tempRes.loginInfo.status!==1){
		res.send();
	}else{
		let data = getBody(req);
		if(!data.id){
			let newChart = new Chart({
				chartInfo:{
					name: data.name,
					code: data.code,
					tag: data.tag
				}
			});
			newChart.save();
			res.send({
				id: newChart._id.toString(),
				status: 1,
				msg: '保存成功'
			});
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



module.exports = { getChartsInfo, getChartInfo, updateChart };
