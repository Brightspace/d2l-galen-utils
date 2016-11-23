/* eslint no-invalid-this: 0 */
'use strict';

var endpoint = 'http://localhost:8080/components/test/demo/index.html';

this.specs = {
	ltr: {
		// This spec will be run on all browsers
		name: 'LTR',
		endpoint: endpoint,
		spec: 'example/specs/test.polyfill.gspec'
	},
	rtl: {
		// This spec will be run on all browsers
		name: 'RTL',
		endpoint: endpoint + '?dir=rtl',
		spec: 'example/specs/test.polyfill.rtl.gspec'
	},
	shadowLtr: {
		// This spec will only be run on browsers that have shadow dom
		shadow: true,
		name: 'Shadow LTR',
		endpoint: endpoint + '?dom=shadow',
		spec: 'example/specs/test.shadow.gspec'
	},
	shadowRtl: {
		// This spec will only be run on browsers that have shadow dom
		shadow: true,
		name: 'Shadow RTL',
		endpoint: endpoint + '?dom=shadow&dir=rtl',
		spec: 'example/specs/test.shadow.rtl.gspec'
	}
};
