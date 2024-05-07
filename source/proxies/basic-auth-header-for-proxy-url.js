'use strict'

module.exports = (url) => {
	const {username, password} = url

	if (username || password) {		
		const u = decodeURIComponent(username);
		const p = decodeURIComponent(password);

		const data = `${u}:${p}`;
		return `Basic ${Buffer.from(data).toString('base64')}`;
	}

	return undefined;
};
