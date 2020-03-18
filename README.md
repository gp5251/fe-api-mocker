## fe-api-mocker
* 一个小工具，主要为方便前端开发过程中mock后台数据
* 可mock返回的状态码(status)，头部(headers)，响应数据(response)
* 内置mockjs，让mock数据更加灵活高效
* 支持以函数方式返回response

### 安装fe-api-mocker
```bash
$ npm i fe-api-mocker -D
```

### 接口参数
* **status** 服务器返回状态码, 默认：200
* **delay** 请求延时，默认：100ms
* **headers** 返回头header
* **data** 	返回数据, 可以为json，或者函数，函数接收req请求对象，可以获取query，body，或者params

### 基本使用

1. 定义mock接口

	默认为 GET 请求，
	
	如果是 POST 或者其他请求，请以[method api]方式配置, 如:`post /api`
```javascript
module.exports = {
	// 请求的方法和api地址。
	// 默认为 GET 请求。
  "api/1": {
		status: 200,
		// 自定义header
    headers: {
      'X-Foo': 'bar'
		},
		// 请求延时，默认100ms
		delay: 1000,
		// 返回数据
    data: {
      msg: 'response data'
    }
	},

	// 以函数定义返回数据
  "api/2": {
    data (req){
      return {
				role: req.query.username === 'paul' ? 'admin' : 'not admin'
			}
    }
	},

	// 内置mockjs
  "api/3": {
		data: {
			// 定义长度为5～10的list数组
			'list|5-10': [{
				// 属性 id 是一个自增数，起始值为 1，每次增 1
				'id|+1': 1
			}]
		}
	},
	
	// 发送POST请求
  "post api/1": {
    data: {
      msg: 'response data'
    }
	},

	// 以函数定义返回数据
  "post api/2": {
    data (req){
      return {
				role: req.body.username === 'paul' ? 'admin' : 'not admin',
				name: req.body.username
			}
    }
	},
}

```

2. 服务器配置

使用 express 服务器

```javascript
const path = require('path');
const mock = require('fe-api-mocker');
const express = require('express');
const app = express();

// 如果跨域请增加
app.all("*", function (_, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	next();
});

// 假设接口文件是 ./mockData.js
mock(app, path.resolve(__dirname, './mockData.js'));

app.listen(3000);
```

其他基于express的server，如vue-cli, webpack-dev-sever, 需要配置
```javascript
module.exports = {
	// 如果跨域，需要配置proxy
	proxy: {
		// 请求到 /api/xxx 现在会被代理到请求 http://localhost:3000/api/xxx
		'/api': 'http://localhost:3000'
	},
	devServer: {
		before(app) {
			// 假设接口文件是 ./mockData.js
			mock(app, path.resolve(__dirname, './mockData.js'));
		}
	}
}
```

3. 前端请求

```javascript
	fetch('http://localhost:3000/api/2?username=paul')
		.then(d => d.json())
		.then(d => {
			console.log(d)
		})
```
