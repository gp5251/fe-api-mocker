// const fs = require('fs')
const path = require('path')
const Mock = require('mockjs')
const bodyParser = require('body-parser')
const { readData } = require('./utils')

function fn(app, filePath, {
	baseUrl = '',
	useBodyparser = true
} = {}) {
	if (useBodyparser) {
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
	}

	let keys = []

	const run = function () {
		const data = readData(filePath);
		Object.keys(data).forEach(tokenStr => {
			const tokens = tokenStr.split(' ')
			const [method = 'get', url] = tokens.length > 1 ? tokens : [undefined, tokens[0]];
			if (keys.indexOf(tokenStr) < 0) {
				// new route. todo
				keys.push(tokenStr);
				addRoute(method, url);
			}
		})
	}

	const addRoute = function (method, url) {
		app[method](path.join(baseUrl, '/', url), (req, res) => {
			const configData = getData(method, url);
			if (!configData) res.send(null)
			else {
				const { config } = configData;
				const { status = 200, delay = 100, data = '', headers = {} } = config;

				res.statusCode = status;
				Object.entries(headers).forEach(([k, v]) => {
					res.setHeader(k, v)
				});

				setTimeout(() => {
					let reData = data;

					if (typeof data == 'function') {
						reData = data(req);
					}

					res.send(Mock.mock(reData))
				}, delay)
			}
		})
	}

	const getData = function (reqMethod, reqUrl) {
		let re = null;
		const data = readData(filePath);

		Object.entries(data).some(([tokenStr, config]) => {
			const tokens = tokenStr.split(' ')
			const [method = 'get', url] = tokens.length > 1 ? tokens : [undefined, tokens[0]];

			if (reqMethod == method.toLocaleLowerCase() && reqUrl == url) {
				re = { config }
				return true
			}
		});

		return re
	}

	run();
	// fs.watchFile(require.resolve(filePath), { interval: 5000 }, function () {
	//     initData()
	// });
}

module.exports = fn
