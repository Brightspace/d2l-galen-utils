/* eslint no-invalid-this: 0 */
'use strict';

load('galen.common.config.js');

this.browsers = {
	chromeWindows: {
		browserName: 'chrome-windows',
		browserFactory: sauceBrowserFactory.bind(this, {
			browser: 'Chrome',
			platform: 'WIN10',
			size: '1400x900'
		})
	}
};
