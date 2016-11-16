/* global browsers, PolymerPage, specs */
/* eslint no-invalid-this: 0 */
'use strict';

load('polymer-page.js');
forAll(browsers, function() {
	test('${browserName}', function(browser) {
		var browserObj = browser.browserFactory();
		var driver = browserObj.driver;
		try {
			var polymerPage = new PolymerPage(driver);

			Object.keys(specs).forEach(function(key) {
				var spec = specs[key];
				if ((!browserObj.hasShadow && spec.shadow) || spec.demo) {
					return;
				}
				driver.get(spec.endpoint);
				polymerPage.waitForIt();
				checkLayout(driver, spec.file);
			});

			var passed = this.report.fetchStatistic().getErrors() === 0;
			browserObj.reportStatus(driver, passed);
		} catch (e) {
			browserObj.reportStatus(driver, false);
			throw e;
		} finally {
			driver.quit();
		}
	});
});