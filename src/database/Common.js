import {AccessToken,User,Project,Chart} from '@/database/Mongoose.js';
import {istype} from "../util";

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

module.exports = {
	findUserInfo, findAccessToken, findProjectInfo, findChartInfo
};
