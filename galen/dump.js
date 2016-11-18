/* global browsers, PolymerPage, specs */
'use strict';

load('polymer-page.js');

Object.keys(browsers).forEach(function(browserName) {
	var factory = browsers[browserName];

	test('Open simple.html in ${browserName}', function() {
		var dumpsDir = System.getProperty('d2l.galen.utils.dumps');
		var driver = factory.create();

		try {
			var polymerPage = new PolymerPage(driver);
			polymerPage.waitTimeout = 60000;

			Object.keys(specs).forEach(function(key) {
				var spec = specs[key];
				if (spec.shadow) {
					return;
				}
				driver.get(spec.endpoint);
				polymerPage.waitForIt();
				dumpPage({
					driver: driver,
					name: spec.name,
					spec: spec.file,
					exportPath: dumpsDir + '/' + key
				});
			});
		} finally {
			driver.quit();
		}
	});
});
