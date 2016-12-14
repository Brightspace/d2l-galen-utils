# D2L Galen Utils
[![Build status][ci-image]][ci-url]

Contains helpful scripts/commands for running [Galen][Galen] tests for Polymer components.
Galen is not meant to test functionality. For example, these tests will fail if the
border-radius changes. The tests use a combination of screenshots and layout assertions.
The results of the tests can be dumped into an htmlreport.

See the [galen config documentation][GalenConfig] and [gspec documentation][GalenSpec]

## Usage

### d2l-galen

`d2l-galen` is a CLI that puts everything together. The input is a Javascript file
that defines `browsers` and `specs`. (See the example configs.).

For every defined browser, `d2l-galen`

1. Starts the browser
2. For every spec: (reuses the browser connection)
   1. Navigate to the defined endpoint
   2. Wait for the page to become resolved (when the `unresolved` attribute disappears)
   3. Check the layout for the specified `gspec`
3. If there are any errors, report them to SauceLabs if the browser was created with `sauceBrowserFactory`
4. Stop the browser

```
d2l-galen test <path_to_config> # run all tests
d2l-galen test <path_to_config> -g factory:local # only run tests on local browsers
d2l-galen test <path_to_config> -g factory:sauce # only run Sauce Labs tests
d2l-galen dump <path_to_config> -d dumps -g factory:local

# To make work with SauceLabs
d2l-galen test <path_to_config> -i SAUCE_USERNAME SAUCE_ACCESS_KEY TRAVIS_REPO_SLUG TRAVIS_BUILD_NUMBER -- --htmlreport report
```

#### Configs

The config is a Javascript file that defines `specs` and `browsers`. For example

```javascript
// This can be placed in another file using `load`
var browsers = {
	// See settings argument for http://galenframework.com/docs/reference-galen-javascript-api/#createGridDriver
	chromeWindows: new SauceBrowserFactory({
		browser: 'Chrome',
		platform: 'WIN10',
		size: '800x600',
        tags: ['chrome'] // tags gets appended to the test's tags property
	}),
    // desiredCapabilities are sent to the ChromeDriver constructor
    chromeNexus5: new ChromeBrowserFactory({
		tags: ['chrome', 'mobile', 'nexus5'],
		desiredCapabilities: {
			chromeOptions: {
				mobileEmulation: {
					deviceName: 'Google Nexus 5'
				}
			}
		}
	}),
	// Only 2 settings: browser and size
	phantomjs: new LocalBrowserFactory({
		browser: 'phantomjs',
		size: '800x600',
        tags: ['phantomjs']
	})
};
polymerTests(browsers, function(test, ctx) {
	ctx.driver.get('http://foo.bar');

	test('stuff', {
		endpoint: 'http://google.ca',
		spec: 'awesome.gspec',
		// optional
		size: '320x600',
		// http://galenframework.com/docs/reference-galen-javascript-api/#checkLayout
		tags: ['mobile'],
		vars: {},
		objects: {}
	}, function(opts, cb) { // optional callback
		// do stuff with opts.driver, opts.report to put the page in a state before checking layout or dumping page
		cb();
	});

	// Will only run this spec on browsers that support shadow DOM v0
	test.shadow('stuff-shadow', {
		endpoint: 'http://google.ca',
		spec: 'awesome.gspec',
		// optional
		size: '320x600',
		// http://galenframework.com/docs/reference-galen-javascript-api/#checkLayout
		tags: ['mobile'],
		vars: {},
		objects: {}
	}, function(opts, cb) { // optional callback
		// do stuff with opts.driver, opts.report to put the page in a state before checking layout or dumping page
		cb();
	});
});
```

##### Example Configs

[Example config for local browsers](example/galen.local.config.js)

[Example config for saucy browsers](example/galen.sauce.config.js)

[Example Spec definitions](example/galen.common.config.js)

#### Using an Alternate Galen Version

```
d2l-galen -c "/usr/local/bin/galen" test <path_to_config> -- --htmlreport report
d2l-galen -c "java com.galenframework.GalenMain" test <path_to_config> -- --htmlreport report
```

#### Using galen directly

```
galen test node_modules/d2l-galen-utils/galen/entrypoint.test.js -Dd2l.galen.utils.config=<absolute_path_to_config> -Dd2l.galen.utils.test=check.js
```

## Verbose Usage

### LocalBrowserFactory

`LocalBrowserFactory` is a factory used to instantiate a local browser for tests.

The result is an object with `create` and `reportStatus` methods.

To use the factory, `load(node_modules/d2l-galen-utils/galen/local-browser-factory.js)`
or use the `d2l-galen` command, which includes it.

### ChromeBrowserFactory

`ChromeBrowserFactory` is a factory used to instantiate a chrome browser for tests.
The `desiredCapabilities` property is sent to the `ChromeDriver` constructor.

The result is an object with `create` and `reportStatus` methods.

To use the factory, `load(node_modules/d2l-galen-utils/galen/chrome-browser-factory.js)`
or use the `d2l-galen` command, which includes it.

### SauceBrowserFactory

`SauceBrowserFactory` is a factory used to instantiate a sauce browser for tests.

The result is an object with `create` and `reportStatus` methods.

To use the factory, `load(node_modules/d2l-galen-utils/galen/sauce-browser-factory.js)`
or use the `d2l-galen` command, which includes it.

### polymerTests

`polymerTests` is a method that is called with an object of browsers and a callback.

The callback is called for every browser initialized. The callback is called with a method
`test` and an object `opts`. `test` takes a name, an object, and a callback.

See [Example config](#configs) for examples

## Coding styles

See the [Best Practices & Style Guide](https://github.com/Brightspace/valence-ui-docs/wiki/Best-Practices-&-Style-Guide) for information on naming conventions, plus information about the [EditorConfig](http://editorconfig.org) rules used in this repo.

[ci-url]: https://travis-ci.org/Brightspace/d2l-galen-utils
[ci-image]: https://img.shields.io/travis-ci/Brightspace/d2l-galen-utils.svg
[Galen]: http://galenframework.com/
[GalenConfig]: http://galenframework.com/docs/getting-started-configuration/
[GalenSpec]: http://galenframework.com/docs/reference-galen-spec-language-guide/
