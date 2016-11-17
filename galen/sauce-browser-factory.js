/* global createGridDriver, System, load */
/* eslint no-invalid-this: 0 */

/* Factory for galen tests to use
 * Usage
 * sauceBrowserFactory({
 *   browser: 'Chrome',
 *   platform: 'WIN10',
 *   size: '1400x900'
 * })
 * System Properties
 * d2l.galen.utils.env.TRAVIS_JOB_NUMBER
 * d2l.galen.utils.env.TRAVIS_REPO_SLUG
 * d2l.galen.utils.env.TRAVIS_BUILD_NUMBER
 * d2l.galen.utils.env.SAUCE_USERNAME
 * d2l.galen.utils.env.SAUCE_ACCESS_KEY
 */
'use strict';

function sauceReportStatus(driver, status) {
	driver.executeScript('sauce:job-result=' + (status ? 'passed' : 'failed'));
}

function sauceBrowserFactory(settings, url) {
	settings = settings || {};
	settings.desiredCapabilities = settings.desiredCapabilities || {};
	settings.desiredCapabilities.tunnelIdentifier = System.getProperty('d2l.galen.utils.env.TRAVIS_JOB_NUMBER');
	settings.desiredCapabilities.name = System.getProperty('d2l.galen.utils.env.TRAVIS_REPO_SLUG');
	settings.desiredCapabilities.build = System.getProperty('d2l.galen.utils.env.TRAVIS_BUILD_NUMBER');
	settings.desiredCapabilities.tags = 'galen';

	var USERNAME = encodeURIComponent(System.getProperty('d2l.galen.utils.env.SAUCE_USERNAME'));
	var ACCESS_KEY = encodeURIComponent(System.getProperty('d2l.galen.utils.env.SAUCE_ACCESS_KEY'));
	var driver = createGridDriver('http://' + USERNAME + ':' + ACCESS_KEY + '@ondemand.saucelabs.com:80/wd/hub', settings);
	url && driver.get(url);
	return {
		driver: driver,
		reportStatus: sauceReportStatus
	};
}

this.sauceBrowserFactory = sauceBrowserFactory;
