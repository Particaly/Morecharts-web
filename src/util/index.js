import fs from 'fs';

function istype(type, target) {
	const Tag = `[object ${type}]`;
	return Object.prototype.toString.call(target) === Tag
}

function getBody(req) {
	if(JSON.stringify(req.body) === "{}"){
		return req.query;
	}else{
		return req.body;
	}
}

function delFile(path, reservePath) {
	if (fs.existsSync(path)) {
		if (fs.statSync(path).isDirectory()) {
			let files = fs.readdirSync(path);
			files.forEach((file, index) => {
				let currentPath = path + "/" + file;
				if (fs.statSync(currentPath).isDirectory()) {
					delFile(currentPath, reservePath);
				} else {
					fs.unlinkSync(currentPath);
				}
			});
			if (path !== reservePath) {
				fs.rmdirSync(path);
			}
		} else {
			fs.unlinkSync(path);
		}
	}
}

// 生成随机id
function randomId(num){
	var returnStr = "",
		charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for(var i=0; i<num; i++){
		if(i===0){returnStr+='P';continue}
		var index = Math.round(Math.random() * (charStr.length-1));
		returnStr += charStr.substring(index,index+1);
	}
	return returnStr;
}

export { istype, getBody, delFile, randomId }
