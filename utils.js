module.exports = {
	readData(url){
		let re = {};
		try{
			re = require(url);
		}catch(e) {
			console.error(e);
		}
		return re;
	}
}