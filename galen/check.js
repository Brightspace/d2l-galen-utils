/* global browsers, PolymerPage, specs */
/* eslint no-invalid-this: 0 */
'use strict';

load('polymer-page.js');

Object.keys(browsers).forEach(function(browserName) {
	var factory = browsers[browserName];

	test(browserName, function() {
		var driver = factory.create();

		// TODO: Check for attachShadow when Polymer uses it
		var result = driver.executeScript('return Boolean(Element.prototype.createShadowRoot)');
		var hasShadow = result.booleanValue();
		try {
			var polymerPage = new PolymerPage(driver);

			Object.keys(specs).forEach(function(key) {
				var spec = specs[key];
				if ((!hasShadow && spec.shadow) || spec.demo) {
					return;
				}
				var specOpts = spec.opts || {};
				logged(spec.name, function(report) {
					driver.get(spec.endpoint);
					report.info('GET ' + spec.endpoint);
					var size = spec.size || factory.settings.size;
					size && GalenUtils.resizeDriver(driver, size);
					size && report.info('Resize: ' + size);
					polymerPage.waitForIt();
					checkLayout({
						driver: driver,
						spec: spec.file,
						tags: specOpts.tags,
						vars: specOpts.vars,
						objects: specOpts.vars
					});
				});
			});

			var passed = this.report.fetchStatistic().getErrors() === 0;
			factory.reportStatus(driver, passed);
		} catch (e) {
			factory.reportStatus(driver, false);
			throw e;
		} finally {
			driver.quit();
		}
	});
});
