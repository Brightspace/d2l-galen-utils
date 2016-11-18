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
d2l-galen test <path_to_config> -- --htmlreport report
d2l-galen dump <path_to_config> -d dumps

# To make work with SauceLabs
d2l-galen test <path_to_config> -i SAUCE_USERNAME SAUCE_ACCESS_KEY TRAVIS_REPO_SLUG TRAVIS_BUILD_NUMBER -- --htmlreport report
```

#### Example Configs

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

### sauceBrowserFactory

`SauceBrowserFactory` is a factory used to instantiate a sauce browser for tests.

The result is an object with `create` and `reportStatus` methods.

To use the factory, `load(node_modules/d2l-galen-utils/galen/sauce-browser-factory.js)`
or use the `d2l-galen` command, which includes it.

### check

[check](galen/check.js) is a script that is meant to be loaded after `browsers` and `specs` have been defined.
It will run through all the browsers and test the specs and report the results to SauceLabs. specs with `demo: true`
will be skipped.

### dump

[dump](galen/dump.js) is a script that is meant to be loaded after `browsers` and `specs` have been defined.
It will run through all the browsers and dump all the pages

## Coding styles

See the [Best Practices & Style Guide](https://github.com/Brightspace/valence-ui-docs/wiki/Best-Practices-&-Style-Guide) for information on naming conventions, plus information about the [EditorConfig](http://editorconfig.org) rules used in this repo.

[ci-url]: https://travis-ci.org/Brightspace/d2l-galen-utils
[ci-image]: https://img.shields.io/travis-ci/Brightspace/d2l-galen-utils.svg
[Galen]: http://galenframework.com/
[GalenConfig]: http://galenframework.com/docs/getting-started-configuration/
[GalenSpec]: http://galenframework.com/docs/reference-galen-spec-language-guide/
