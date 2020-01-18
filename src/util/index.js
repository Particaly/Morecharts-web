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

export { istype, getBody }
