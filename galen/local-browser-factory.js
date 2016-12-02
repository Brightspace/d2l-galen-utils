/* global createDriver */
/* eslint no-invalid-this: 0 */
'use strict';

function LocalBrowserFactory(settings) {
	this.settings = settings;
	settings.groups = settings.groups || [];
	settings.groups.push('factory:local');
	settings.groups.push(('browser:' + settings.browser.toLowerCase()).toString());
}

LocalBrowserFactory.prototype.create = function create(url) {
	var settings = this.settings;
	var args = [settings.size, settings.browser];
	return createDriver.apply(this, [url].concat(args));
};

LocalBrowserFactory.prototype.reportStatus = function reportStatus() {};

this.LocalBrowserFactory = LocalBrowserFactory;
