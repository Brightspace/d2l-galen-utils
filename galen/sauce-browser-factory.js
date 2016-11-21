/* global createGridDriver, System, load */
/* eslint no-invalid-this: 0 */

/* Factory for galen tests to use
 * Usage
 * new SauceBrowserFactory({
 *   browser: 'Chrome',
 *   platform: 'WIN10',
 *   size: '1400x900'
 * }).create(url)
 * System Properties
 * d2l.galen.utils.env.TRAVIS_JOB_NUMBER
 * d2l.galen.utils.env.TRAVIS_REPO_SLUG
 * d2l.galen.utils.env.TRAVIS_BUILD_NUMBER
 * d2l.galen.utils.env.SAUCE_USERNAME
 * d2l.galen.utils.env.SAUCE_ACCESS_KEY
 */
'use strict';

function SauceBrowserFactory(settings) {
	settings = settings || {};
	settings.desiredCapabilities = settings.desiredCapabilities || {};
	settings.desiredCapabilities.tunnelIdentifier = System.getProperty('d2l.galen.utils.env.TRAVIS_JOB_NUMBER');
	settings.desiredCapabilities.name = System.getProperty('d2l.galen.utils.env.TRAVIS_REPO_SLUG');
	settings.desiredCapabilities.build = System.getProperty('d2l.galen.utils.env.TRAVIS_BUILD_NUMBER');
	settings.desiredCapabilities.tags = 'galen';

	this.username = encodeURIComponent(System.getProperty('d2l.galen.utils.env.SAUCE_USERNAME'));
	this.accessKey = encodeURIComponent(System.getProperty('d2l.galen.utils.env.SAUCE_ACCESS_KEY'));
	this.settings = settings;
}

SauceBrowserFactory.prototype.create = function create(url) {
	var driver = createGridDriver('http://' + this.username + ':' + this.accessKey + '@ondemand.saucelabs.com:80/wd/hub', this.settings);
	url && driver.get(url);
	return driver;
};

SauceBrowserFactory.prototype.reportStatus = function reportStatus(driver, status) {
	driver.executeScript('sauce:job-result=' + (status ? 'passed' : 'failed'));
};

this.SauceBrowserFactory = SauceBrowserFactory;
