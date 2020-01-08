var { User, Project } = require('./dbindex');


function getProjectList(req,res,next) {
	if(!res.tempRes||!res.tempRes.loginInfo||res.tempRes.loginInfo.status!==1){
		res.send();
	}else{
		Project.find({
			'auther': req.decode_token.pid
		},function (err, projects) {
			if(err) return console.log(err);
			if(projects.length){
				console.log();
			}else{
				res.tempRes.ownerProjects = [];
			}
		})
	}
}


module.exports = { getProjectList };
