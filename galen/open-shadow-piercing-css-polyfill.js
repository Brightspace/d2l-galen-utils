/* global Polymer Element window */
'use strict';

(function() {
	if (window.D2LShadowQuerySelector) {
		return;
	}
	var oldQuerySelectorAll = Element.prototype.querySelectorAll;
	var oldQuerySelector = Element.prototype.querySelector;

	var psuedoSelector = '::d2l-shadow ';

	Element.prototype.querySelectorAll = function querySelectorAll(selector) {
		if (selector.indexOf(psuedoSelector) === 0) {
			var newSelector = selector.slice(psuedoSelector.length);
			if (this.shadowRoot) {
				return this.shadowRoot.querySelectorAll(newSelector);
			} else if (Polymer && Polymer.dom && this.root) {
				return Polymer.dom(this.root).querySelectorAll(newSelector);
			} else {
				return this.querySelectorAll(newSelector);
			}
		}
		return oldQuerySelectorAll.apply(this, arguments);
	};

	Element.prototype.querySelector = function querySelector(selector) {
		if (selector.indexOf(psuedoSelector) === 0) {
			var newSelector = selector.slice(psuedoSelector.length);
			if (this.shadowRoot) {
				return this.shadowRoot.querySelector(newSelector);
			} else if (Polymer && Polymer.dom && this.root) {
				return Polymer.dom(this.root).querySelector(newSelector);
			} else {
				return this.querySelector(newSelector);
			}
		}
		return oldQuerySelector.apply(this, arguments);
	};

	window.D2LShadowQuerySelector = true;
}());
