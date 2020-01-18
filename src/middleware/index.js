import fs from 'fs';
let files = fs.readdirSync(__dirname);

const modules = {};

files.forEach(key => {
	if (key === 'index.js') return;
	modules[key.replace(/(\.\/|\.js)/g, '')] = require('./'+key).default
});

module.exports =  {
	...modules
};
