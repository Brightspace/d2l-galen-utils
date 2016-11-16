/* eslint no-invalid-this: 0 */
'use strict';

var endpoint = 'http://localhost:8080/components/test/demo/index.html';

this.specs = {
	ltr: {
		name: 'LTR',
		endpoint: endpoint,
		file: 'example/specs/test.polyfill.gspec'
	},
	rtl: {
		name: 'RTL',
		endpoint: endpoint + '?dir=rtl',
		file: 'example/specs/test.polyfill.rtl.gspec'
	},
	shadowLtr: {
		name: 'Shadow LTR',
		endpoint: endpoint + '?dom=shadow',
		file: 'example/specs/test.shadow.gspec',
		shadow: true
	},
	shadowRtl: {
		name: 'Shadow RTL',
		endpoint: endpoint + '?dom=shadow&dir=rtl',
		file: 'example/specs/test.shadow.rtl.gspec',
		shadow: true
	}
};
