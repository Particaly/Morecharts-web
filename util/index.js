function getBody(req) {
	if(JSON.stringify(req.body) === "{}"){
		return req.query;
	}else{
		return req.body;
	}
}

function isType(type, target){
	const Tag = `[object ${type}]`;
	return Object.prototype.toString.call(target) === Tag
}

function checkEmail(str){
	var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	return re.test(str);
}

function checkMobile(str) {
	var re = /^1\d{10}$/;
	return re.test(str);
}

module.exports = { getBody, isType, checkEmail, checkMobile };
