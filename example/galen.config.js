/* eslint no-invalid-this: 0 */
'use strict';

var browsers = {
	phantomjs: new LocalBrowserFactory({
		browser: 'phantomjs',
		size: '768x768'
	}),
	chrome: new LocalBrowserFactory({
		browser: 'chrome',
		size: '768x768'
	}),
	chromeWindows: new SauceBrowserFactory({
		browser: 'Chrome',
		platform: 'WIN10',
		size: '1400x900'
	})
};
var endpoint = 'http://localhost:8080/components/test/demo/index.html';

polymerTests(browsers, function(test) {
	test('LTR', {
		endpoint: endpoint,
		spec: 'example/specs/test.polyfill.gspec'
	}, function(opts, cb) {
		// do stuff with opts.driver, opts.report to put the page in a state before checking layout or dumping page
		cb();
	});

	test('RTL', {
		endpoint: endpoint + '?dir=rtl',
		spec: 'example/specs/test.polyfill.rtl.gspec'
	});

	// These tests will only be run on browsers that have shadow dom
	test.shadow('Shadow LTR', {
		endpoint: endpoint + '?dom=shadow',
		spec: 'example/specs/test.shadow.gspec'
	});

	test.shadow('Shadow RTL', {
		endpoint: endpoint + '?dom=shadow&dir=rtl',
		spec: 'example/specs/test.shadow.rtl.gspec'
	});
});
