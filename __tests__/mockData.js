module.exports = {
	// get
  "api/1": {
    status: 200,
    headers: {
      'X-Foo': 'bar'
    },
    delay: 1000,
    data: {
      msg: 'response data'
    }
	},

	// data为函数
  "api/2": {
    status: 200,
    headers: {
      'X-Foo2': 'bar2'
    },
    delay: 200,
    data (req){
      return {
				role: req.query.username === 'paul' ? 'admin' : 'not admin',
				name: req.query.username
			}
    }
	},

	// mockjs
  "api/3": {
		data: {
			'list|5-10': [{
				// 属性 id 是一个自增数，起始值为 1，每次增 1
				'id|+1': 1
			}]
		}
	},
	
	// post
  "post api/1": {
    status: 200,
    headers: {
      'X-Foo': 'bar'
    },
    delay: 1000,
    data: {
      msg: 'response data'
    }
	},

	// data为函数
  "post api/2": {
    status: 200,
    headers: {
      'X-Foo2': 'bar2'
    },
    delay: 200,
    data (req){
      return {
				role: req.body.username === 'paul' ? 'admin' : 'not admin',
				name: req.body.username
			}
    }
	},
}
