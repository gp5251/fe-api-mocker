// const fs = require('fs-extra')
const path = require('path')
const Mock = require('mockjs')
const bodyParser = require('body-parser')
const { readData } = require('./utils')

function fn(app, filePath, {
	baseUrl = '',
	useBodyparser = true 
} = {}) {
	const data = readData(filePath);

	if (useBodyparser) {
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({extended: true}));
	}

	Object.entries(data).forEach(([tokenStr, config]) => {
		const tokens = tokenStr.split(' ')
		const [method = 'get', url] = tokens.length > 1 ? tokens : [undefined, tokens[0]];
		const { status = 200, delay = 100, data = '', headers = {} } = config;

		app[method.toLowerCase()](path.join(baseUrl, '/', url), (req, res) => {
			res.statusCode = status;
			Object.entries(headers).forEach(([k, v]) => {
				res.setHeader(k, v)
			});

			setTimeout(() => {
				let reData = data;
				if (typeof data == 'function') {
					reData = data(req);
				}

				res.json(Mock.mock(reData))
			}, delay)
		})
	});
}

module.exports = fn
