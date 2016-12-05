/* global PolymerPage */
/* eslint no-invalid-this: 0 */
'use strict';

load('polymer-page.js');

function polymerTests(browsers, runTests) {
	var dumpsDir = System.getProperty('d2l.galen.utils.dumps');
	Object.keys(browsers).forEach(function(browserName) {
		var factory = browsers[browserName];
		// FIXME: Workaround for Rhino Javascript not being able to convert a concatenated string to a Java.Lang.String
		grouped(factory.settings.groups, function() {
			test(browserName, function() {
				var driver = factory.create();

				// TODO: Check for attachShadow when Polymer uses it
				var result = driver.executeScript('return Boolean(Element.prototype.createShadowRoot)');
				var hasShadow = result.booleanValue();
				var polymerPage;

				function defaultCb(opts) {
					if (opts.exportPath) {
						dumpPage(opts);
					} else {
						checkLayout(opts);
					}
				}

				// Navigate, size browser, then checkLayout/dumpPage or call callback
				function innerTest(name, opts, cb) {
					logged(name, function(report) {
						driver.get(opts.endpoint);
						report.info('GET ' + opts.endpoint);
						var size = opts.size || factory.settings.size;
						size && resize(driver, size);
						size && report.info('Resize: ' + size);
						polymerPage.waitForIt();

						cb = cb || defaultCb;
						var cloneOpts = {
							name: name,
							driver: driver,
							report: report,
							exportPath: dumpsDir && dumpsDir + '/' + name
						};
						Object.keys(opts).forEach(function(key) {
							cloneOpts[key] = opts[key];
						});
						cloneOpts.tags = [].concat(cloneOpts.tags || [], factory.settings.tags || []);
						cb(cloneOpts, defaultCb.bind(null, cloneOpts));
					});
				}
				innerTest.shadow = (hasShadow && !dumpsDir) ? innerTest : function() {};
				innerTest.demo = dumpsDir ? innerTest : function() {};

				try {
					polymerPage = new PolymerPage(driver);
					runTests.call(this, innerTest, {
						driver: driver,
						polymerPage: polymerPage,
						factory: factory
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
	});
}

this.polymerTests = polymerTests;
