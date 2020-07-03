import routes from '@/src/routes/MoreCharts';
var express = require('express');
var router = express.Router();

function useRoutes(routes, padString='') {
	const length = routes.length;
	for (let i = 0; i < length; i++) {
		const item = routes[i];
		const path = padString + item.path;
		router[item.type](path,item.handler);
	}
}

useRoutes(routes,'/api');
// console.log(router);

module.exports = router;
