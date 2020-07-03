module.exports = {
	"presets": [
		[
			"@babel/env",
			{
				"targets": {
					"node": "4"
				}
			}
		]
	],
	"plugins": [
		[
			"module-resolver",
			{
				"root": ["./"],
				"alias": {
					"@": "./"
				},
				"extensions": [
					".js", ".jsx", ".es", ".es6", ".mjs", "index.js"
				],
				"stripExtensions": [".js", ".jsx", ".es", ".es6", ".mjs"]
			}
		],
		["@babel/plugin-transform-runtime"],
		[
			"@babel/plugin-proposal-optional-chaining"
		]
	]
}
