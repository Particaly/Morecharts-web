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

function createNewChart(req, res, next) {

}

module.exports = { getChartsInfo, createNewChart };
