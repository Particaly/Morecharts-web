import {AccessToken,User,Project,Chart} from '@/database/Mongoose.js';
import {istype} from "../util";
import fs from 'fs';
import path from 'path';

function findAccessToken(token) {
	return new Promise((resolve,reject)=>{
		AccessToken.findOne({
			token
		}).exec(function (err,res) {
			if(err) reject(err);
			resolve(res);
		});
	});
}

function findUserInfo(id) {
	return new Promise((resolve,reject)=>{
		User.findOne({
			$or: [
				{'userInfo.name': id},
				{'userInfo.email': id}
			]
		}).exec(function (err,res) {
			if(err) reject(err);
			resolve(res);
		});
	});
}

function findProjectInfo(params) {
	let findOption = {};
	if(istype('String',params)){
		findOption.auther = params
	}else if(istype('Object',params)){
		findOption = params
	}else{
		return null;
	}
	return new Promise((resolve,reject)=>{
		Project.find(findOption).exec(function (err,res) {
			if(err) reject(err);
			if(res.length === 1){
				resolve(res[0])
			}else if(res.length === 0){
				resolve(null);
			}else{
				resolve(res)
			}
		});
	});
}

function findChartInfo(params, type) {
	let findOption = {};
	if(istype('String',params)){
		findOption.auther = params
	}else if(istype('Object',params)){
		findOption = params
	}else{
		return null;
	}
	return new Promise((resolve,reject)=>{
		Chart.find(findOption).exec(function (err,res) {
			if(err) reject(err);
			if(type&&type.toLowerCase() ==='array'){
				resolve(res)
			}else{
				if(res.length === 1){
					resolve(res[0])
				}else if(res.length === 0){
					resolve(null);
				}else{
					resolve(res)
				}
			}
			
		});
	});
}

function generateJSFile(data,perpath) {
	let filePath = path.resolve(__dirname,'../../',perpath);
	let chartData = [];
	for(let i in data){
		chartData.push(`"${data[i].chartInfo.name}":"${data[i].chartInfo.code}"`)
	}
	let filedata = `
		if(window.namespace === undefined){
			window.namespace = {
				morechartsData:_morechartsData()
			}
		}else{
			window.namespace.morechartsData = _morechartsData()
		}
		function _morechartsData(){
			return {
				${chartData.toString()}
			};
		}
	`;
	fs.writeFileSync(filePath, filedata);
	return filePath
}

module.exports = {
	findUserInfo, findAccessToken, findProjectInfo, findChartInfo, generateJSFile
};
