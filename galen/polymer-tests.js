/* global PolymerPage readFile takeScreenshot */
/* eslint no-invalid-this: 0 */
'use strict';

load('polymer-page.js');

function retry(cb, driver, report, numRetries) {
	for (var i = 0; i < numRetries; ++i) {
		try {
			cb();
			break;
		} catch (e) {
			try {
				report.error(e.toString() + (e.stack || e.message || e.name)).withAttachment('Screenshot', takeScreenshot(driver));
			} catch (err) {
				report.error(e.toString() + (e.stack || e.message || e.name));
			}
		}
	}
}

function polymerTests(browsers, runTests) {
	function loggerWrapper(report, driver, cb) {
		try {
			cb(report);
		} catch (e) {
			report.error(e.toString() + (e.stack || e.message || e.name)).withAttachment('Screenshot', takeScreenshot(driver));
		}
	}

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
					if (System.getProperty('d2l.galen.utils.d2lShadow')) {
						driver.executeScript(readFile(System.getProperty('d2l.galen.utils.d2lShadow') + ''));
						opts.report.info('::d2l-shadow loaded');
					}
					if (opts.exportPath) {
						dumpPage(opts);
					} else {
						checkLayout(opts);
					}
				}

				// Navigate, size browser, then checkLayout/dumpPage or call callback
				function innerTest(name, opts, cb) {
					logged(name, function(report) {
						loggerWrapper(report, driver, function(report) {
							driver.get(opts.endpoint);
							report.info('GET ' + opts.endpoint);
							var size = opts.size || factory.settings.size;
							size && resize(driver, size);
							size && report.info('Resize: ' + size);
							polymerPage.waitForIt();

							var runTest = 'function' === typeof opts.runTest ? opts.runTest : defaultCb;
							cb = cb || runTest;
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
							retry(cb.bind(this, cloneOpts, runTest.bind(null, cloneOpts)), opts.driver, report, 3);
						});
					});
				}
				innerTest.shadow = (hasShadow && !dumpsDir) ? innerTest : function() {};
				innerTest.demo = dumpsDir ? innerTest : function() {};

				loggerWrapper(this.report, driver, function(report) {
					polymerPage = new PolymerPage(driver);
					runTests.call(this, innerTest, {
						driver: driver,
						polymerPage: polymerPage,
						factory: factory,
						report: report
					});
				});
				var passed = this.report.fetchStatistic().getErrors() === 0;
				factory.reportStatus(driver, passed);
				driver.quit();
			});
		});
	});
}

this.polymerTests = polymerTests;
