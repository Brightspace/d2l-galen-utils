/* eslint no-invalid-this: 0 */
'use strict';

this.browsers = {
	phantomjs: new LocalBrowserFactory({
		browser: 'phantomjs',
		size: '768x768'
	}),
	chrome: new LocalBrowserFactory({
		browser: 'chrome',
		size: '768x768'
	})
};

load('galen.common.config.js');
