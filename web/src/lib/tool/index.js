export default {
	isType: function (type, target) {
		const Tag = `[object ${type}]`;
		return Object.prototype.toString.call(target) === Tag
	}
}
