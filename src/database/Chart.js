import { Chart, Project } from './Mongoose';
import { getBody, delFile } from '../util';
import { findUserInfo, findProjectInfo, findChartInfo } from './common';
import fs from 'fs';
import utility from 'utility';
import path from 'path';
let baseurl = './public';

async function getChartsInfo(req, res, next) {
	if(res.predata?.loginInfo.status!==1){
		res.send();
	}else{
		let info = await findUserInfo(req.accesstoken.pid);
		let name = info.userInfo.name;
		let project = await findProjectInfo({
			'$and':[{
				'auther': name,
				'projectName': getBody(req).name
			}]
		});
		if(project){
			if(project.chartList.length){
				res.send(await findChartInfo({
					'_id':{
						'$in': project.chartList
					}
				},'array'))
			}else{
				res.send([])
			}
		}else{
			res.send({
				status: 404,
				msg: '找不到该项目'
			})
		}
	}
}

async function updateChart(req, res, next) {
	if(res.predata?.loginInfo.status!==1){
		res.send();
	}else{
		let info = await findUserInfo(req.accesstoken.pid);
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
			let project = await findProjectInfo({
				'$and':[{
					'auther': name,
					'projectName': data.project
				}]
			});
			if(project){
				project.chartList.push(newChart._id.toString());
				project.save();
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
		}else{
			let chart = await findChartInfo({
				'_id': data.id
			});
			if(chart){
				chart.chartInfo.name = data.name;
				chart.chartInfo.code = data.code;
				chart.chartInfo.tag = data.tag;
				chart.chartInfo.project = data.project;
				chart.save();
				res.send({
					id: data.id,
					status: 1,
					msg: '保存成功'
				})
			}
		}
	}
}

async function getChartInfo(req, res, next){
	if(res.predata?.loginInfo.status!==1){
		res.send();
	}else{
		let data = await findChartInfo({
			'_id': getBody(req).id
		});
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
	}
}

async function updateImg(req, res, next){
	if(res.predata?.loginInfo.status!==1){
		res.send();
	}else{
		let data = getBody(req);
		if(data.id&&data.img){
			let chart = await findChartInfo({
				'_id': getBody(req).id
			});
			if(chart.chartInfo.img){
				delFile(path.join(baseurl, chart.chartInfo.img))
			}
			let imgData = data.img.replace(/^data:image\/\w+;base64,/, '');
			let dataBuffer = new Buffer.from(imgData, 'base64');
			//写入文件
			let imgrootpath = '/morecharts/img/'+utility.md5(imgData)+'.png';
			let imgpath = path.join(baseurl,imgrootpath);
			fs.writeFile(imgpath, dataBuffer, function(err){
				if(err){
					res.send(err);
				}else{
					chart.chartInfo.img = imgrootpath;
					chart.save();
					res.send({
						status:1,
						msg: '保存成功'
					});
				}
			});
		}
	}
}

module.exports = {
	getChartsInfo, updateChart, getChartInfo, updateImg
};
