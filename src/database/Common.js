import {AccessToken,User,Project,Chart} from '@/database/Mongoose.js'

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

module.exports = {
	findUserInfo, findAccessToken
};
