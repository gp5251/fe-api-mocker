const axios = require('axios')

axios.get('http://localhost:30801/api/1')
.then(d => {
	return d.data
})
.then(console.log)