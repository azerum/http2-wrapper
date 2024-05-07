'use strict';
const basicAuthHeaderForProxyUrl = require("./basic-auth-header-for-proxy-url")

module.exports = self => {
	const authorization = basicAuthHeaderForProxyUrl(self.proxyOptions.url);

	if (authorization === undefined) {
		return {};
	}

	return {
		'proxy-authorization': authorization,
		authorization
	};
};
