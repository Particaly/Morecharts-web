var { User } = require('./dbindex');

function getUserInfo(id) {
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

module.exports = {
	getUserInfo
};
