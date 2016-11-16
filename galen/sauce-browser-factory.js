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
 * USERNAME          sauce username
 * ACCESS_KEY        sauce access key
 * TUNNEL_IDENTIFIER sauce connect tunnel_identifier
 * NAME              sauce test name
 * BUILD             sauce build number
 */
'use strict';

function sauceReportStatus(driver, status) {
	driver.executeScript('sauce:job-result=' + (status ? 'passed' : 'failed'));
}

function sauceBrowserFactory(settings, url) {
	settings = settings || {};
	settings.desiredCapabilities = settings.desiredCapabilities || {};
	settings.desiredCapabilities.tunnelIdentifier = System.getProperty('TUNNEL_IDENTIFIER');
	settings.desiredCapabilities.name = System.getProperty('NAME');
	settings.desiredCapabilities.build = System.getProperty('BUILD');
	settings.desiredCapabilities.tags = 'galen';

	var USERNAME = System.getProperty('USERNAME');
	var ACCESS_KEY = System.getProperty('ACCESS_KEY');
	var driver = createGridDriver('http://' + USERNAME + ':' + ACCESS_KEY + '@ondemand.saucelabs.com:80/wd/hub', settings);
	url && driver.get(url);
	return {
		driver: driver,
		reportStatus: sauceReportStatus
	};
}

this.sauceBrowserFactory = sauceBrowserFactory;
