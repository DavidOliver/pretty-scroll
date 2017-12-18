/**
 * Modules in this bundle
 * @license
 *
 * pretty-scroll:
 *   license: appleple
 *   author: appleple
 *   homepage: http://developer.a-blogcms.jp
 *   version: 1.0.1
 *
 * es6-object-assign:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: Rubén Norte <rubennorte@gmail.com>
 *   homepage: https://github.com/rubennorte/es6-object-assign
 *   version: 1.1.0
 *
 * This header is generated by licensify (https://github.com/twada/licensify)
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PrettyScroll = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Code refactored from Mozilla Developer Network:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */

'use strict';

function assign(target, firstSource) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }

  var to = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource === undefined || nextSource === null) {
      continue;
    }

    var keysArray = Object.keys(Object(nextSource));
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
      if (desc !== undefined && desc.enumerable) {
        to[nextKey] = nextSource[nextKey];
      }
    }
  }
  return to;
}

function polyfill() {
  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: assign
    });
  }
}

module.exports = {
  assign: assign,
  polyfill: polyfill
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../lib/util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assign = require('es6-object-assign').assign;

var defaults = {
  container: 'body',
  condition: function condition() {
    return true;
  },
  offsetTop: 0,
  breakpoint: 767
};

var PrettyScroll = function () {
  function PrettyScroll(ele, option) {
    var _this = this;

    _classCallCheck(this, PrettyScroll);

    this.opt = assign({}, defaults, option);
    this.scrollAmount = -this.opt.offsetTop;
    this.scrollOld = 0;
    this.containerElement = document.querySelector(this.opt.container);
    this.targetElement = document.querySelector(ele);
    this.targetWidth = this.targetElement.style.width;
    this.targetBoxSizing = this.targetElement.style.boxSizing;
    (0, _util.before)(this.targetElement, '<div class="js-pretty-scroll-before"></div>');
    this.beforeElement = this.targetElement.previousElementSibling;
    this.targetElement.parentElement.style.position = 'relative';
    window.addEventListener('scroll', function () {
      _this.onScroll();
    });
    window.addEventListener('resize', function () {
      _this.onScroll();
    });
  }

  _createClass(PrettyScroll, [{
    key: 'applyStyle',
    value: function applyStyle(style) {
      var target = this.targetElement;
      for (var key in style) {
        target.style[key] = style[key];
      }
    }
  }, {
    key: 'onScroll',
    value: function onScroll() {
      var scroll = (0, _util.getScrollTop)();
      var beforeElement = this.beforeElement,
          containerElement = this.containerElement,
          targetElement = this.targetElement,
          targetWidth = this.targetWidth,
          targetBoxSizing = this.targetBoxSizing;
      var _opt = this.opt,
          offsetTop = _opt.offsetTop,
          condition = _opt.condition,
          breakpoint = _opt.breakpoint;

      var windowHeight = window.innerHeight;
      var windowWidth = window.innerWidth;
      var thisHeight = (0, _util.outerHeight)(targetElement);
      var beforeBottom = (0, _util.getOffset)(beforeElement).top;
      var containerHeight = (0, _util.outerHeight)(containerElement);
      var containerOffset = (0, _util.getOffset)(containerElement).top;
      var containerBottom = containerHeight + containerOffset;
      var limitHeight = windowHeight > thisHeight ? thisHeight : windowHeight;
      var offsetHeight = thisHeight - windowHeight;
      var beforeOffsetTop = beforeElement.offsetTop;
      var beforeOffsetLeft = beforeElement.offsetLeft;
      var style = {
        position: 'static',
        width: targetWidth,
        boxSizing: targetBoxSizing
      };

      if (!condition()) {
        this.applyStyle(style);
        return;
      }

      if (breakpoint >= windowWidth) {
        this.applyStyle(style);
        return;
      }

      // when side column is larger than container
      if (beforeOffsetTop + thisHeight >= (0, _util.selfHeight)(containerElement)) {
        this.applyStyle(style);
        return;
      }

      if (scroll < beforeBottom - offsetTop) {
        this.applyStyle(style);
        this.scrollOld = scroll;
        return;
      }

      style.width = beforeElement.offsetWidth + 'px';
      style.boxSizing = 'border-box';
      if (scroll + limitHeight <= containerBottom) {
        this.scrollAmount += scroll - this.scrollOld;
        this.scrollOld = scroll;
        if (this.scrollAmount > offsetHeight) {
          this.scrollAmount = offsetHeight;
        } else if (this.scrollAmount < -offsetTop) {
          this.scrollAmount = -offsetTop;
        }
        if (this.scrollAmount === offsetHeight || this.scrollAmount === -offsetTop) {
          style.position = 'fixed';
          if (this.scrollAmount === -offsetTop || thisHeight < windowHeight) {
            style.top = offsetTop + 'px';
          } else {
            style.top = windowHeight - thisHeight + 'px';
          }
          style.left = (0, _util.getOffset)(beforeElement).left + 'px';
        } else {
          style.position = 'absolute';
          if (scroll - this.scrollAmount < beforeBottom) {
            style.top = beforeOffsetTop + 'px';
          } else {
            style.top = scroll - this.scrollAmount - beforeBottom + 'px';
          }
          style.left = beforeOffsetLeft + 'px';
        }
      } else {
        style.position = 'absolute';
        style.top = containerHeight - thisHeight + 'px';
        style.left = beforeOffsetLeft + 'px';
      }
      this.applyStyle(style);
    }
  }]);

  return PrettyScroll;
}();

exports.default = PrettyScroll;
module.exports = exports['default'];

},{"../lib/util":4,"es6-object-assign":1}],3:[function(require,module,exports){
'use strict';

module.exports = require('./core/');

},{"./core/":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var append = exports.append = function append(element, string) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(string, 'text/html');
  element.appendChild(doc.querySelector('body').childNodes[0]);
};

var prepend = exports.prepend = function prepend(element, string) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(string, 'text/html');
  element.insertBefore(doc.querySelector('body').childNodes[0], element.firstChild);
};

var getUniqId = exports.getUniqId = function getUniqId() {
  return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
};

var remove = exports.remove = function remove(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

var addClass = exports.addClass = function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ' ' + className;
  }
};

var triggerEvent = exports.triggerEvent = function triggerEvent(el, eventName, options) {
  var event = void 0;
  if (window.CustomEvent) {
    event = new CustomEvent(eventName, { cancelable: true });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, false, false, options);
  }
  el.dispatchEvent(event);
};

var getScrollTop = exports.getScrollTop = function getScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};

var getScrollLeft = exports.getScrollLeft = function getScrollLeft() {
  return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
};

var getOffset = exports.getOffset = function getOffset(el) {
  var rect = el.getBoundingClientRect();
  return {
    top: rect.top + getScrollTop(),
    left: rect.left + getScrollLeft()
  };
};

var before = exports.before = function before(el, html) {
  el.insertAdjacentHTML('beforebegin', html);
};

var outerHeight = exports.outerHeight = function outerHeight(el) {
  var height = el.offsetHeight;
  var style = getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
};

var selfHeight = exports.selfHeight = function selfHeight(el) {
  var height = el.offsetHeight;
  var style = getComputedStyle(el);

  height -= parseInt(style.paddingTop) + parseInt(style.paddingBottom);
  return height;
};

},{}]},{},[3])(3)
});