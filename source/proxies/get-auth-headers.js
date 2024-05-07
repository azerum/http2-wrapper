'use strict';
const getBasicAuthHeader = require("./get-basic-auth-header")

module.exports = self => {
	const authorization = getBasicAuthHeader(self.proxyOptions.url);

	if (authorization === undefined) {
		return {};
	}

	return {
		'proxy-authorization': authorization,
		authorization
	};
};
