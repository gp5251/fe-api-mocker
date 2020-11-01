module.exports = {
	readData(url) {
		let re = {};
		try {
			re = require(url);
			delete require.cache[require.resolve(url)];
		} catch (e) {
			console.error(e);
		}
		return re;
	}
}
