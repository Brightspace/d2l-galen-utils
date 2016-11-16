/* eslint no-invalid-this: 0 */
'use strict';

load('galen.common.config.js');

this.browsers = {
	phantomjs: {
		browserName: 'phantomjs',
		browserFactory: localBrowserFactory.bind(this, ['768x768', 'phantomjs'])
	},
	chrome: {
		browserName: 'chrome',
		browserFactory: localBrowserFactory.bind(this, ['768x768', 'chrome'])
	}
};
