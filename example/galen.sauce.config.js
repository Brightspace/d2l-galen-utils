/* eslint no-invalid-this: 0 */
'use strict';

load('galen.common.config.js');

this.browsers = {
	chromeWindows: new SauceBrowserFactory({
		browser: 'Chrome',
		platform: 'WIN10',
		size: '1400x900'
	})
};
