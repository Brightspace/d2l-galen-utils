/* global importClass, com, org, ChromeDriver, SeleniumBrowserFactory */
/* eslint no-invalid-this: 0 */
'use strict';

importClass(org.openqa.selenium.chrome.ChromeDriver);
importClass(com.galenframework.browser.SeleniumBrowserFactory);

function ChromeBrowserFactory(settings) {
	this.settings = settings;
	settings.groups = settings.groups || [];
	settings.groups.push('factory:sauce');
	settings.groups.push('browser:chrome');
	settings.groups.push(('platform:' + settings.platform.toLowerCase()).toString());
}

ChromeBrowserFactory.prototype.create = function create(url) {
	var settings = this.settings;

	var capabilities = SeleniumBrowserFactory.getBrowserCapabilities('chrome');
	Object.keys(settings.desiredCapabilities).forEach(function(key) {
		var capability = settings.desiredCapabilities[key];
		if (capability) {
			capabilities.setCapability(key, capability);
		}
	});

	var driver = new ChromeDriver(capabilities);
	url && driver.get(url);
	settings.size && resize(driver, settings.size);

	capabilities = driver.getCapabilities();
	console.log(capabilities);

	return driver;
};

ChromeBrowserFactory.prototype.reportStatus = function reportStatus() {};

this.ChromeBrowserFactory = ChromeBrowserFactory;
