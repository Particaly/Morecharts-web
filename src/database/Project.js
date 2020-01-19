import { Project } from './Mongoose';
import { getBody, istype } from '../util';
import { findUserInfo, findProjectInfo } from './common';

async function getProjectList(req,res,next) {
	if(res.predata?.loginInfo.status!==1){
		res.send();
	}else{
		let info = await findUserInfo(req.accesstoken.pid);
		let projects = await findProjectInfo(info.userInfo.name);
		if(projects){
			let data = [];
			if(istype('Object',projects)){
				projects = [projects];
			}
			for(let item of projects){
				data.push({
					...item._doc
				})
			}
			res.send(data)
		}else{
			res.send([])
		}
	}
}

async function createNewProject(req, res, next){
	if(res.predata?.loginInfo.status!==1){
		res.send();
	}else{
		let project = await findProjectInfo({
			'$and':[{
				'auther': req.accesstoken.pid,
				'projectName': getBody(req).name
			}]
		});
		if(!project){
			let newproject = new Project({
				auther: req.accesstoken.pid,
				projectName: getBody(req).name,
				projectDescribe: getBody(req).describe
			});
			newproject.save();
			res.send({
				status: 1,
				msg: '创建成功'
			})
		}else{
			res.send({
				status: 2,
				msg: '已有同名项目'
			})
		}
	}
}

module.exports = {
	getProjectList, createNewProject
};
