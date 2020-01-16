var { Project } = require('./dbindex');
var { getBody } = require('../util');
var { getUserInfo } = require('./common');


async function getProjectList(req,res,next) {
	if(!res.tempRes||!res.tempRes.loginInfo||res.tempRes.loginInfo.status!==1){
		res.send();
	}else{
		let info = await getUserInfo(req.decode_token.pid);
		let name = info.userInfo.name;
		Project.find({
			'auther': name
		},function (err, projects) {
			if(err) return console.log(err);
			if(projects.length){
				let data = [];
				for(let item of projects){
					data.push({
						...item._doc
					})
				}
				res.send(data)
			}else{
				res.send([])
			}
		})
	}
}

function createNewProject(req, res, next){
	if(!res.tempRes||!res.tempRes.loginInfo||res.tempRes.loginInfo.status!==1){
		res.send();
	}else{
		let query = Project.find({
			'$and':[{
				'auther': req.decode_token.pid,
				'projectName': getBody(req).name
			}]
		});
		query.exec(function (err,list) {
			if(err) return console.log(err);
			if(!list.length){
				let newproject = new Project({
					auther: req.decode_token.pid,
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
		})
	}
}


module.exports = { getProjectList, createNewProject };
