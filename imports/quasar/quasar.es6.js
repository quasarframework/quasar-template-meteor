/*!
 * Quasar Framework v0.13.6
 * (c) 2017 Razvan Stoenescu
 * Released under the MIT License.
 */
import moment from 'moment';
import FastClick from 'fastclick';

/* eslint-disable no-useless-escape */

function getUserAgent () {
  return (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
}

function getMatch (userAgent, platformMatch) {
  var match = /(edge)\/([\w.]+)/.exec(userAgent) ||
    /(opr)[\/]([\w.]+)/.exec(userAgent) ||
    /(vivaldi)[\/]([\w.]+)/.exec(userAgent) ||
    /(chrome)[\/]([\w.]+)/.exec(userAgent) ||
    /(iemobile)[\/]([\w.]+)/.exec(userAgent) ||
    /(version)(applewebkit)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
    /(webkit)[\/]([\w.]+).*(version)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
    /(webkit)[\/]([\w.]+)/.exec(userAgent) ||
    /(opera)(?:.*version|)[\/]([\w.]+)/.exec(userAgent) ||
    /(msie) ([\w.]+)/.exec(userAgent) ||
    (userAgent.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec(userAgent)) ||
    (userAgent.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(userAgent)) ||
    [];

  return {
    browser: match[5] || match[3] || match[1] || '',
    version: match[2] || match[4] || '0',
    versionNumber: match[4] || match[2] || '0',
    platform: platformMatch[0] || ''
  }
}

function getPlatformMatch (userAgent) {
  return /(ipad)/.exec(userAgent) ||
    /(ipod)/.exec(userAgent) ||
    /(windows phone)/.exec(userAgent) ||
    /(iphone)/.exec(userAgent) ||
    /(kindle)/.exec(userAgent) ||
    /(silk)/.exec(userAgent) ||
    /(android)/.exec(userAgent) ||
    /(win)/.exec(userAgent) ||
    /(mac)/.exec(userAgent) ||
    /(linux)/.exec(userAgent) ||
    /(cros)/.exec(userAgent) ||
    /(playbook)/.exec(userAgent) ||
    /(bb)/.exec(userAgent) ||
    /(blackberry)/.exec(userAgent) ||
    []
}

function getPlatform () {
  let
    userAgent = getUserAgent(),
    platformMatch = getPlatformMatch(userAgent),
    matched = getMatch(userAgent, platformMatch),
    browser = {};

  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
    browser.versionNumber = parseInt(matched.versionNumber, 10);
  }

  if (matched.platform) {
    browser[matched.platform] = true;
  }

  // These are all considered mobile platforms, meaning they run a mobile browser
  if (browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
    browser.ipod || browser.kindle || browser.playbook || browser.silk || browser['windows phone']) {
    browser.mobile = true;
  }

  // Set iOS if on iPod, iPad or iPhone
  if (browser.ipod || browser.ipad || browser.iphone) {
    browser.ios = true;
  }

  if (browser['windows phone']) {
    browser.winphone = true;
    delete browser['windows phone'];
  }

  // These are all considered desktop platforms, meaning they run a desktop browser
  if (browser.cros || browser.mac || browser.linux || browser.win) {
    browser.desktop = true;
  }

  // Chrome, Opera 15+, Vivaldi and Safari are webkit based browsers
  if (browser.chrome || browser.opr || browser.safari || browser.vivaldi) {
    browser.webkit = true;
  }

  // IE11 has a new token so we will assign it msie to avoid breaking changes
  if (browser.rv || browser.iemobile) {
    matched.browser = 'ie';
    browser.ie = true;
  }

  // Edge is officially known as Microsoft Edge, so rewrite the key to match
  if (browser.edge) {
    matched.browser = 'edge';
    browser.edge = true;
  }

  // Blackberry browsers are marked as Safari on BlackBerry
  if ((browser.safari && browser.blackberry) || browser.bb) {
    matched.browser = 'blackberry';
    browser.blackberry = true;
  }

  // Playbook browsers are marked as Safari on Playbook
  if (browser.safari && browser.playbook) {
    matched.browser = 'playbook';
    browser.playbook = true;
  }

  // Opera 15+ are identified as opr
  if (browser.opr) {
    matched.browser = 'opera';
    browser.opera = true;
  }

  // Stock Android browsers are marked as Safari on Android.
  if (browser.safari && browser.android) {
    matched.browser = 'android';
    browser.android = true;
  }

  // Kindle browsers are marked as Safari on Kindle
  if (browser.safari && browser.kindle) {
    matched.browser = 'kindle';
    browser.kindle = true;
  }

  // Kindle Silk browsers are marked as Safari on Kindle
  if (browser.safari && browser.silk) {
    matched.browser = 'silk';
    browser.silk = true;
  }

  if (browser.vivaldi) {
    matched.browser = 'vivaldi';
    browser.vivaldi = true;
  }

  // Assign the name and platform variable
  browser.name = matched.browser;
  browser.platform = matched.platform;

  if (window && window.process && window.process.versions && window.process.versions.electron) {
    browser.electron = true;
  }
  else if (window._cordovaNative || document.location.href.indexOf('http') !== 0) {
    browser.cordova = true;
  }

  return browser
}

const Platform = {
  is: getPlatform(),
  has: {
    touch: (() => !!('ontouchstart' in document.documentElement) || window.navigator.msMaxTouchPoints > 0)()
  },
  within: {
    iframe: window.self !== window.top
  }
};

Platform.has.popstate = !Platform.within.iframe && !Platform.is.electron;

let bus;

function install$1 (_Vue) {
  bus = new _Vue();
}

var Events = {
  $on (...args) { bus && bus.$on(...args); },
  $once (...args) { bus && bus.$once(...args); },
  $emit (...args) { bus && bus.$emit(...args); },
  $off (...args) { bus && bus.$off(...args); }
};

function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

var uid = function () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
};

let ids = {};

function animate ({id, finalPos, pos, threshold, factor, done, apply}) {
  ids[id] = requestAnimationFrame(() => {
    let diff = (finalPos - pos);
    if (Math.abs(diff) < threshold) {
      delete ids[id];
      apply(finalPos);
      done && done(finalPos);
      return
    }
    let newPos = pos + (finalPos - pos) / factor;
    apply(newPos);
    animate({id, finalPos, pos: newPos, threshold, done, factor, apply});
  });
}

function start ({name, finalPos, pos, threshold = 1, factor = 5, done, apply}) {
  let id = name;
  if (id) {
    start.stop(id);
  }
  else {
    id = uid();
  }
  animate({id, finalPos, pos, threshold, factor, done, apply});
  return id
}

start.stop = id => {
  let timer = ids[id];
  if (timer) {
    cancelAnimationFrame(timer);
    delete ids[id];
  }
};

var clone = function (data) {
  return JSON.parse(JSON.stringify(data))
};

/*
 * Credits go to sindresorhus
 */

function rgbToHex (red, green, blue) {
  if (typeof red === 'string') {
    const res = red.match(/\b\d{1,3}\b/g).map(Number);
    red = res[0];
    green = res[1];
    blue = res[2];
  }

  if (
    typeof red !== 'number' ||
    typeof green !== 'number' ||
    typeof blue !== 'number' ||
    red > 255 ||
    green > 255 ||
    blue > 255
  ) {
    throw new TypeError('Expected three numbers below 256')
  }

  return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1)
}

function hexToRgb (hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string')
  }

  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  let num = parseInt(hex, 16);

  return [num >> 16, num >> 8 & 255, num & 255]
}


var colors = Object.freeze({
	rgbToHex: rgbToHex,
	hexToRgb: hexToRgb
});

let now = Date.now;

var debounce = function (fn, wait = 250, immediate) {
  let
    timeout, params, context, timestamp, result,
    later = () => {
      let last = now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      }
      else {
        timeout = null;
        if (!immediate) {
          result = fn.apply(context, params);
          if (!timeout) {
            context = params = null;
          }
        }
      }
    };

  return function (...args) {
    var callNow = immediate && !timeout;

    context = this;
    timestamp = now();
    params = args;

    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) {
      result = fn.apply(context, args);
      context = params = null;
    }

    return result
  }
};

function offset (el) {
  if (el === window) {
    return {top: 0, left: 0}
  }
  let {top, left} = el.getBoundingClientRect();

  return {top, left}
}

function style (el, property) {
  return window.getComputedStyle(el).getPropertyValue(property)
}

function height (el) {
  if (el === window) {
    return viewport().height
  }
  return parseFloat(window.getComputedStyle(el).getPropertyValue('height'), 10)
}

function width (el) {
  if (el === window) {
    return viewport().width
  }
  return parseFloat(window.getComputedStyle(el).getPropertyValue('width'), 10)
}

function css (element, css) {
  let style = element.style;

  Object.keys(css).forEach(prop => {
    style[prop] = css[prop];
  });
}

function viewport () {
  let
    e = window,
    a = 'inner';

  if (!('innerWidth' in window)) {
    a = 'client';
    e = document.documentElement || document.body;
  }

  return {
    width: e[a + 'Width'],
    height: e[a + 'Height']
  }
}

function ready (fn) {
  if (typeof fn !== 'function') {
    return
  }

  if (document.readyState === 'complete') {
    return fn()
  }

  document.addEventListener('DOMContentLoaded', fn, false);
}

function getScrollTarget (el) {
  return el.closest('.layout-view,.scroll') || window
}

function getScrollPosition (scrollTarget) {
  if (scrollTarget === window) {
    return window.pageYOffset || window.scrollY || document.body.scrollTop || 0
  }
  return scrollTarget.scrollTop
}

function animScrollTo (el, to, duration) {
  if (duration <= 0) {
    return
  }

  const pos = getScrollPosition(el);

  requestAnimationFrame(() => {
    setScroll(el, pos + (to - pos) / duration * 16);
    if (el.scrollTop !== to) {
      animScrollTo(el, to, duration - 16);
    }
  });
}

function setScroll (scrollTarget, offset) {
  if (scrollTarget === window) {
    document.documentElement.scrollTop = offset;
    document.body.scrollTop = offset;
    return
  }
  scrollTarget.scrollTop = offset;
}

function setScrollPosition (scrollTarget, offset, duration) {
  if (duration) {
    animScrollTo(scrollTarget, offset, duration);
    return
  }
  setScroll(scrollTarget, offset);
}

const prefix = ['-webkit-', '-moz-', '-ms-', '-o-'];
function cssTransform (val) {
  let o = {transform: val};
  prefix.forEach(p => {
    o[p + 'transform'] = val;
  });
  return o
}


var dom = Object.freeze({
	offset: offset,
	style: style,
	height: height,
	width: width,
	css: css,
	viewport: viewport,
	ready: ready,
	getScrollTarget: getScrollTarget,
	getScrollPosition: getScrollPosition,
	setScrollPosition: setScrollPosition,
	cssTransform: cssTransform
});

function getEvent (e) {
  return !e ? window.event : e
}

function rightClick (e) {
  e = getEvent(e);

  if (e.which) {
    return e.which == 3 // eslint-disable-line
  }
  if (e.button) {
    return e.button == 2 // eslint-disable-line
  }

  return false
}

function position (e) {
  let posx, posy;
  e = getEvent(e);

  if (e.touches && e.touches[0]) {
    e = e.touches[0];
  }
  else if (e.changedTouches && e.changedTouches[0]) {
    e = e.changedTouches[0];
  }

  if (e.clientX || e.clientY) {
    posx = e.clientX;
    posy = e.clientY;
  }
  else if (e.pageX || e.pageY) {
    posx = e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft;
    posy = e.pageY - document.body.scrollTop - document.documentElement.scrollTop;
  }

  return {
    top: posy,
    left: posx
  }
}

function targetElement (e) {
  let target;
  e = getEvent(e);

  if (e.target) {
    target = e.target;
  }
  else if (e.srcElement) {
    target = e.srcElement;
  }

  // defeat Safari bug
  if (target.nodeType === 3) {
    target = target.parentNode;
  }

  return target
}

function getMouseWheelDirection (e) {
  e = getEvent(e);
  return Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))
}


var event = Object.freeze({
	rightClick: rightClick,
	position: position,
	targetElement: targetElement,
	getMouseWheelDirection: getMouseWheelDirection
});

let toString = Object.prototype.toString;
let hasOwn = Object.prototype.hasOwnProperty;
let class2type = {};

'Boolean Number String Function Array Date RegExp Object'.split(' ').forEach(name => {
  class2type['[object ' + name + ']'] = name.toLowerCase();
});

function type (obj) {
  return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object'
}

function isPlainObject (obj) {
  if (!obj || type(obj) !== 'object') {
    return false
  }

  if (obj.constructor &&
    !hasOwn.call(obj, 'constructor') &&
    !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
    return false
  }

  let key;
  for (key in obj) {}

  return key === undefined || hasOwn.call(obj, key)
}

function extend () {
  let
    options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }

  if (typeof target !== 'object' && type(target) !== 'function') {
    target = {};
  }

  if (length === i) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target === copy) {
          continue
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = type(copy) === 'array'))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && type(src) === 'array' ? src : [];
          }
          else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        }
        else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target
}

var filter = function (terms, {field, list}) {
  const token = terms.toLowerCase();
  return list.filter(item => ('' + item[field]).toLowerCase().startsWith(token))
};

const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];

function humanStorageSize (bytes) {
  let u = 0;

  while (Math.abs(bytes) >= 1024 && u < units.length - 1) {
    bytes /= 1024;
    ++u;
  }

  return `${bytes.toFixed(1)} ${units[u]}`
}

function between (val, min, max) {
  if (max <= min) {
    return min
  }
  return Math.min(max, Math.max(min, val))
}

function normalizeToInterval (val, min, max) {
  if (max <= min) {
    return min
  }

  const size = (max - min + 1);

  let index = val % size;
  if (index < min) {
    index = size + index;
  }

  return index
}


var format = Object.freeze({
	humanStorageSize: humanStorageSize,
	between: between,
	normalizeToInterval: normalizeToInterval
});

var ModalGenerator = function (VueComponent) {
  return {
    create (props) {
      const node = document.createElement('div');
      document.body.appendChild(node);

      let vm = new Vue({
        el: node,
        data () {
          return {props}
        },
        render: h => h(VueComponent, {props})
      });

      return {
        close (fn) {
          vm.quasarClose(fn);
        }
      }
    }
  }
};

var Dialog$1 = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-modal',{ref:"dialog",staticClass:"minimized",attrs:{"no-backdrop-dismiss":_vm.noBackdropDismiss,"no-esc-dismiss":_vm.noEscDismiss},on:{"close":function($event){_vm.__dismiss();}}},[_c('div',{staticClass:"modal-header",domProps:{"innerHTML":_vm._s(_vm.title || '')}}),(_vm.message)?_c('div',{staticClass:"modal-body modal-scroll",domProps:{"innerHTML":_vm._s(_vm.message)}}):_vm._e(),(_vm.form)?_c('div',{staticClass:"modal-body modal-scroll"},[_vm._l((_vm.form),function(el){return [(el.type === 'heading')?_c('h6',{domProps:{"innerHTML":_vm._s(el.label)}}):_vm._e(),(el.type === 'textbox')?_c('div',{staticClass:"floating-label",staticStyle:{"margin-bottom":"10px"}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(el.model),expression:"el.model"}],staticClass:"full-width",attrs:{"type":"text","placeholder":el.placeholder,"required":"","tabindex":"0"},domProps:{"value":(el.model)},on:{"input":function($event){if($event.target.composing){ return; }el.model=$event.target.value;}}}),_c('label',{domProps:{"innerHTML":_vm._s(el.label)}})]):_vm._e(),(el.type === 'password')?_c('div',{staticClass:"floating-label",staticStyle:{"margin-bottom":"10px"}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(el.model),expression:"el.model"}],staticClass:"full-width",attrs:{"type":"password","placeholder":el.placeholder,"required":"","tabindex":"0"},domProps:{"value":(el.model)},on:{"input":function($event){if($event.target.composing){ return; }el.model=$event.target.value;}}}),_c('label',{domProps:{"innerHTML":_vm._s(el.label)}})]):_vm._e(),(el.type === 'textarea')?_c('div',{staticClass:"floating-label",staticStyle:{"margin-bottom":"10px"}},[_c('textarea',{directives:[{name:"model",rawName:"v-model",value:(el.model),expression:"el.model"}],staticClass:"full-width",attrs:{"type":"text","placeholder":el.placeholder,"required":"","tabindex":"0"},domProps:{"value":(el.model)},on:{"input":function($event){if($event.target.composing){ return; }el.model=$event.target.value;}}}),_c('label',{domProps:{"innerHTML":_vm._s(el.label)}})]):_vm._e(),(el.type === 'numeric')?_c('div',{staticStyle:{"margin-bottom":"10px"}},[_c('label',{domProps:{"innerHTML":_vm._s(el.label)}}),_c('q-numeric',{attrs:{"min":el.min,"max":el.max,"step":el.step,"tabindex":"0"},model:{value:(el.model),callback:function ($$v) {el.model=$$v;}}})],1):_vm._e(),(el.type === 'chips')?_c('div',{staticStyle:{"margin-bottom":"10px"}},[_c('label',{domProps:{"innerHTML":_vm._s(el.label)}}),_c('q-chips',{model:{value:(el.model),callback:function ($$v) {el.model=$$v;}}})],1):_vm._e(),_vm._l((el.items),function(radio){return (el.type === 'radio')?_c('label',{staticClass:"item"},[_c('div',{staticClass:"item-primary"},[_c('q-radio',{attrs:{"val":radio.value,"disable":radio.disabled},model:{value:(el.model),callback:function ($$v) {el.model=$$v;}}})],1),_c('div',{staticClass:"item-content",domProps:{"innerHTML":_vm._s(radio.label)}})]):_vm._e()}),_vm._l((el.items),function(checkbox){return (el.type === 'checkbox')?_c('label',{staticClass:"item"},[_c('div',{staticClass:"item-primary"},[_c('q-checkbox',{attrs:{"disable":checkbox.disabled},model:{value:(checkbox.model),callback:function ($$v) {checkbox.model=$$v;}}})],1),_c('div',{staticClass:"item-content",domProps:{"innerHTML":_vm._s(checkbox.label)}})]):_vm._e()}),_vm._l((el.items),function(toggle){return (el.type === 'toggle')?_c('label',{staticClass:"item"},[_c('div',{staticClass:"item-content has-secondary",domProps:{"innerHTML":_vm._s(toggle.label)}}),_c('div',{staticClass:"item-secondary"},[_c('q-toggle',{attrs:{"disable":toggle.disabled},model:{value:(toggle.model),callback:function ($$v) {toggle.model=$$v;}}})],1)]):_vm._e()}),(el.type === 'rating')?_c('div',{staticStyle:{"margin-bottom":"10px"}},[_c('label',{domProps:{"innerHTML":_vm._s(el.label)}}),_c('q-rating',{style:({fontSize: el.size || '2rem'}),attrs:{"max":el.max,"icon":el.icon},model:{value:(el.model),callback:function ($$v) {el.model=$$v;}}})],1):_vm._e()]})],2):_vm._e(),(_vm.progress)?_c('div',{staticClass:"modal-body"},[_c('q-progress',{staticClass:"primary stripe animate",class:{indeterminate: _vm.progress.indeterminate},attrs:{"percentage":_vm.progress.model}}),(!_vm.progress.indeterminate)?_c('span',[_vm._v(_vm._s(_vm.progress.model)+" %")]):_vm._e()],1):_vm._e(),(_vm.buttons)?_c('div',{staticClass:"modal-buttons",class:{row: !_vm.stackButtons, column: _vm.stackButtons}},_vm._l((_vm.buttons),function(button){return _c('button',{class:button.classes || 'primary clear',style:(button.style),attrs:{"tabindex":"0"},domProps:{"innerHTML":_vm._s(typeof button === 'string' ? button : button.label)},on:{"click":function($event){_vm.trigger(button.handler, button.preventClose);}}})})):_vm._e(),(!_vm.buttons && !_vm.nobuttons)?_c('div',{staticClass:"modal-buttons row"},[_c('button',{staticClass:"primary clear",attrs:{"tabindex":"0"},on:{"click":function($event){_vm.close();}}},[_vm._v("OK")])]):_vm._e()])},staticRenderFns: [],
  props: {
    title: String,
    message: String,
    form: Object,
    stackButtons: Boolean,
    buttons: Array,
    nobuttons: Boolean,
    progress: Object,
    onDismiss: Function,
    noBackdropDismiss: Boolean,
    noEscDismiss: Boolean
  },
  computed: {
    opened () {
      if (this.$refs.dialog) {
        return this.$refs.dialog.active
      }
    }
  },
  methods: {
    trigger (handler, preventClose) {
      const handlerFn = typeof handler === 'function';
      if (!handlerFn) {
        this.close();
        return
      }

      if (preventClose) {
        handler(this.getFormData(), this.close);
      }
      else {
        this.close(() => { handler(this.getFormData()); });
      }
    },
    getFormData () {
      if (!this.form) {
        return
      }

      let data = {};

      Object.keys(this.form).forEach(name => {
        let el = this.form[name];
        if (['checkbox', 'toggle'].includes(el.type)) {
          data[name] = el.items.filter(item => item.model).map(item => item.value);
        }
        else if (el.type !== 'heading') {
          data[name] = el.model;
        }
      });

      return data
    },
    close (fn) {
      if (!this.opened) {
        return
      }
      this.$refs.dialog.close(() => {
        if (typeof fn === 'function') {
          fn();
        }
      });
    },
    __dismiss () {
      this.$root.$destroy();
      if (typeof this.onDismiss === 'function') {
        this.onDismiss();
      }
    }
  },
  mounted () {
    this.$refs.dialog.open(() => {
      if (!this.$q.platform.is.desktop) {
        return
      }

      const node = this.$refs.dialog.$el.getElementsByTagName(this.form ? 'INPUT' : 'BUTTON');
      if (!node.length) {
        return
      }

      if (this.form) {
        node[0].focus();
      }
      else {
        node[node.length - 1].focus();
      }
    });
    this.$root.quasarClose = this.close;
  }
};

var Dialog = ModalGenerator(Dialog$1);

/* istanbul ignore next */
var openURL = (url) => {
  if (Platform.is.cordova) {
    navigator.app.loadUrl(url, {
      openExternal: true
    });

    return
  }

  let win = window.open(url, '_blank');

  if (win) {
    win.focus();
  }
  else {
    Dialog.create({
      title: 'Cannot Open Window',
      message: 'Please allow popups first, then please try again.'
    }).show();
  }
};

function getAnchorPosition (el, offset) {
  let
    {top, left, right, bottom} = el.getBoundingClientRect(),
    a = {
      top,
      left,
      width: el.offsetWidth,
      height: el.offsetHeight
    };

  if (offset) {
    a.top += offset[1];
    a.left += offset[0];
    if (bottom) {
      bottom += offset[1];
    }
    if (right) {
      right += offset[0];
    }
  }

  a.right = right || a.left + a.width;
  a.bottom = bottom || a.top + a.height;
  a.middle = a.left + ((a.right - a.left) / 2);
  a.center = a.top + ((a.bottom - a.top) / 2);

  return a
}

function getTargetPosition (el) {
  return {
    top: 0,
    center: el.offsetHeight / 2,
    bottom: el.offsetHeight,
    left: 0,
    middle: el.offsetWidth / 2,
    right: el.offsetWidth
  }
}

function getOverlapMode (anchor, target, median) {
  if ([anchor, target].indexOf(median) >= 0) return 'auto'
  if (anchor === target) return 'inclusive'
  return 'exclusive'
}

function getPositions (anchor, target) {
  const
    a = extend({}, anchor),
    t = extend({}, target);

  const positions = {
    x: ['left', 'right'].filter(p => p !== t.horizontal),
    y: ['top', 'bottom'].filter(p => p !== t.vertical)
  };

  const overlap = {
    x: getOverlapMode(a.horizontal, t.horizontal, 'middle'),
    y: getOverlapMode(a.vertical, t.vertical, 'center')
  };

  positions.x.splice(overlap.x === 'auto' ? 0 : 1, 0, 'middle');
  positions.y.splice(overlap.y === 'auto' ? 0 : 1, 0, 'center');

  if (overlap.y !== 'auto') {
    a.vertical = a.vertical === 'top' ? 'bottom' : 'top';
    if (overlap.y === 'inclusive') {
      t.vertical = t.vertical;
    }
  }

  if (overlap.x !== 'auto') {
    a.horizontal = a.horizontal === 'left' ? 'right' : 'left';
    if (overlap.y === 'inclusive') {
      t.horizontal = t.horizontal;
    }
  }

  return {
    positions: positions,
    anchorPos: a
  }
}

function applyAutoPositionIfNeeded (anchor, target, selfOrigin, anchorOrigin, targetPosition) {
  const {positions, anchorPos} = getPositions(anchorOrigin, selfOrigin);

  if (targetPosition.top < 0 || targetPosition.top + target.bottom > window.innerHeight) {
    let newTop = anchor[anchorPos.vertical] - target[positions.y[0]];
    if (newTop + target.bottom <= window.innerHeight) {
      targetPosition.top = Math.max(0, newTop);
    }
    else {
      newTop = anchor[anchorPos.vertical] - target[positions.y[1]];
      if (newTop + target.bottom <= window.innerHeight) {
        targetPosition.top = Math.max(0, newTop);
      }
    }
  }
  if (targetPosition.left < 0 || targetPosition.left + target.right > window.innerWidth) {
    let newLeft = anchor[anchorPos.horizontal] - target[positions.x[0]];
    if (newLeft + target.right <= window.innerWidth) {
      targetPosition.left = Math.max(0, newLeft);
    }
    else {
      newLeft = anchor[anchorPos.horizontal] - target[positions.x[1]];
      if (newLeft + target.right <= window.innerWidth) {
        targetPosition.left = Math.max(0, newLeft);
      }
    }
  }
  return targetPosition
}

function parseHorizTransformOrigin (pos) {
  return pos === 'middle' ? 'center' : pos
}

function getTransformProperties ({selfOrigin}) {
  let
    vert = selfOrigin.vertical,
    horiz = parseHorizTransformOrigin(selfOrigin.horizontal);

  return {
    'transform-origin': vert + ' ' + horiz + ' 0px'
  }
}

function setPosition ({el, anchorEl, anchorOrigin, selfOrigin, maxHeight, event, anchorClick, touchPosition, offset}) {
  let anchor;
  el.style.maxHeight = this.maxHeight || '65vh';

  if (event && (!anchorClick || touchPosition)) {
    const {top, left} = position(event);
    anchor = {top, left, width: 1, height: 1, right: left + 1, center: top, middle: left, bottom: top + 1};
  }
  else {
    anchor = getAnchorPosition(anchorEl, offset);
  }

  let target = getTargetPosition(el);
  let targetPosition = {
    top: anchor[anchorOrigin.vertical] - target[selfOrigin.vertical],
    left: anchor[anchorOrigin.horizontal] - target[selfOrigin.horizontal]
  };

  targetPosition = applyAutoPositionIfNeeded(anchor, target, selfOrigin, anchorOrigin, targetPosition);

  el.style.top = Math.max(0, targetPosition.top) + 'px';
  el.style.left = Math.max(0, targetPosition.left) + 'px';
}

function positionValidator (pos) {
  let parts = pos.split(' ');
  if (parts.length !== 2) {
    return false
  }
  if (!['top', 'center', 'bottom'].includes(parts[0])) {
    console.error('Anchor/Self position must start with one of top/center/bottom');
    return false
  }
  if (!['left', 'middle', 'right'].includes(parts[1])) {
    console.error('Anchor/Self position must end with one of left/middle/right');
    return false
  }
  return true
}

function offsetValidator (val) {
  if (!val) { return true }
  if (val.length !== 2) { return false }
  if (typeof val[0] !== 'number' || typeof val[1] !== 'number') {
    return false
  }
  return true
}

function parsePosition (pos) {
  let parts = pos.split(' ');
  return {vertical: parts[0], horizontal: parts[1]}
}


var popup = Object.freeze({
	getAnchorPosition: getAnchorPosition,
	getTargetPosition: getTargetPosition,
	getOverlapMode: getOverlapMode,
	getPositions: getPositions,
	applyAutoPositionIfNeeded: applyAutoPositionIfNeeded,
	parseHorizTransformOrigin: parseHorizTransformOrigin,
	getTransformProperties: getTransformProperties,
	setPosition: setPosition,
	positionValidator: positionValidator,
	offsetValidator: offsetValidator,
	parsePosition: parsePosition
});

let size;

function width$1 () {
  if (size) {
    return size
  }

  const
    inner = document.createElement('p'),
    outer = document.createElement('div');

  css(inner, {
    width: '100%',
    height: '200px'
  });
  css(outer, {
    position: 'absolute',
    top: '0px',
    left: '0px',
    visibility: 'hidden',
    width: '200px',
    height: '150px',
    overflow: 'hidden'
  });

  outer.appendChild(inner);

  document.body.appendChild(outer);

  let w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;

  if (w1 === w2) {
    w2 = outer.clientWidth;
  }

  document.body.removeChild(outer);
  size = w1 - w2;

  return size
}


var scrollbar = Object.freeze({
	width: width$1
});

let data = {};

function add (name, el, ctx) {
  let id = uid();
  el.dataset['__' + name] = id;
  if (!data[name]) {
    data[name] = {};
  }
  data[name][id] = ctx;
}

function get (name, el) {
  let id = el.dataset['__' + name];
  if (!id) {
    return
  }
  if (!data[name]) {
    return
  }
  let ctx = data[name][id];
  if (!ctx) {
    return
  }
  return ctx
}

function remove (name, el) {
  let id = el.dataset['__' + name];
  if (!id) {
    return
  }
  if (data[name] && data[name][id]) {
    delete data[name][id];
  }
}


var store = Object.freeze({
	add: add,
	get: get,
	remove: remove
});

var throttle = function (fn, limit = 250) {
  let wait = false;

  return function (...args) {
    if (wait) {
      return
    }

    wait = true;
    fn.apply(this, args);
    setTimeout(() => {
      wait = false;
    }, limit);
  }
};

var Utils = {
  animate: start,
  clone,
  colors,
  debounce,
  dom,
  event,
  extend,
  filter,
  format,
  noop () {},
  openURL,
  popup,
  scrollbar,
  store,
  throttle,
  uid
};

let transitionDuration = 300;
let displayDuration = 2500; // in ms

function parseOptions (opts, defaults) {
  if (!opts) {
    throw new Error('Missing toast options.')
  }

  let options = Utils.extend(
    true,
    {},
    defaults,
    typeof opts === 'string' ? {html: opts} : opts
  );

  if (!options.html) {
    throw new Error('Missing toast content/HTML.')
  }

  return options
}

var Toast = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-toast-container",class:{active: _vm.active}},[(_vm.stack[0])?_c('div',{staticClass:"q-toast row no-wrap items-center non-selectable",class:_vm.classes,style:({color: _vm.stack[0].color, background: _vm.stack[0].bgColor})},[(_vm.stack[0].icon)?_c('i',[_vm._v(_vm._s(_vm.stack[0].icon))]):_vm._e(),_vm._v(" "),(_vm.stack[0].image)?_c('img',{attrs:{"src":_vm.stack[0].image}}):_vm._e(),_c('div',{staticClass:"q-toast-message auto",domProps:{"innerHTML":_vm._s(_vm.stack[0].html)}}),(_vm.stack[0].button && _vm.stack[0].button.label)?_c('a',{style:({color: _vm.stack[0].button.color}),on:{"click":function($event){_vm.dismiss(_vm.stack[0].button.handler);}}},[_vm._v(_vm._s(_vm.stack[0].button.label)+" ")]):_vm._e(),_c('a',{style:({color: _vm.stack[0].button.color}),on:{"click":function($event){_vm.dismiss();}}},[_c('i',[_vm._v("close")])])]):_vm._e()])},staticRenderFns: [],
  data () {
    return {
      active: false,
      inTransition: false,
      stack: [],
      timer: null,
      defaults: {
        color: 'white',
        bgColor: '#323232',
        button: {
          color: 'yellow'
        }
      }
    }
  },
  computed: {
    classes () {
      if (!this.stack.length || !this.stack[0].classes) {
        return {}
      }

      return this.stack[0].classes.split(' ')
    }
  },
  methods: {
    create (options) {
      this.stack.push(parseOptions(options, this.defaults));

      if (this.active || this.inTransition) {
        return
      }

      this.active = true;
      this.inTransition = true;

      this.__show();
    },
    __show () {
      Events.$emit('app:toast', this.stack[0].html);

      this.timer = setTimeout(() => {
        if (this.stack.length > 0) {
          this.dismiss();
        }
        else {
          this.inTransition = false;
        }
      }, transitionDuration + (this.stack[0].timeout || displayDuration));
    },
    dismiss (done) {
      this.active = false;
      clearTimeout(this.timer);
      this.timer = null;

      setTimeout(() => {
        if (typeof this.stack[0].onDismiss === 'function') {
          this.stack[0].onDismiss();
        }

        this.stack.shift();
        done && done();

        if (this.stack.length > 0) {
          this.active = true;
          this.__show();
          return
        }

        this.inTransition = false;
      }, transitionDuration + 50);
    },
    setDefaults (opts) {
      Utils.extend(true, this.defaults, opts);
    }
  }
};

let toast;
let defaults;
let toastStack = [];
let types = [
    {
      name: 'positive',
      defaults: {icon: 'check', classes: 'bg-positive'}
    },
    {
      name: 'negative',
      defaults: {icon: 'error', classes: 'bg-negative'}
    },
    {
      name: 'info',
      defaults: {icon: 'info', classes: 'bg-info'}
    },
    {
      name: 'warning',
      defaults: {icon: 'warning', classes: 'bg-warning'}
    }
  ];

function create (opts, defaults) {
  if (!opts) {
    throw new Error('Missing toast options.')
  }

  if (defaults) {
    opts = Utils.extend(
      true,
      typeof opts === 'string' ? {html: opts} : opts,
      defaults
    );
  }

  if (!toast) {
    toastStack.push(opts);
    return
  }

  toast.create(opts);
}

types.forEach(type => {
  create[type.name] = opts => create(opts, type.defaults);
});

function install$2 (_Vue) {
  Utils.dom.ready(() => {
    let node = document.createElement('div');
    document.body.appendChild(node);
    toast = new _Vue(Toast).$mount(node);
    if (defaults) {
      toast.setDefaults(defaults);
    }
    if (toastStack.length) {
      toastStack.forEach(opts => {
        toast.create(opts);
      });
    }
  });
}

var toast$1 = {
  create,
  setDefaults (opts) {
    if (toast) {
      toast.setDefaults(opts);
    }
    else {
      defaults = opts;
    }
  },
  install: install$2
};

function set (theme) {
  const currentTheme = current;
  current = theme;

  Utils.dom.ready(() => {
    if (currentTheme) {
      document.body.classList.remove(current);
    }
    document.body.classList.add(theme);
  });
}

var current;

if (typeof __THEME !== 'undefined') {
  set(__THEME);
}


var theme = Object.freeze({
	set: set,
	get current () { return current; }
});

var version = "0.13.6";

function getHeight (el, style$$1) {
  let initial = {
    visibility: el.style.visibility,
    maxHeight: el.style.maxHeight
  };

  css(el, {
    visibility: 'hidden',
    maxHeight: ''
  });
  const height$$1 = style$$1.height;
  css(el, initial);

  return parseFloat(height$$1, 10)
}

function parsePadding (padding) {
  return padding.split(' ').map(t => {
    let unit = t.match(/[a-zA-Z]+/) || '';
    if (unit) {
      unit = unit[0];
    }
    return [parseFloat(t, 10), unit]
  })
}

function toggleSlide (el, showing, done) {
  let store = get('slidetoggle', el) || {};
  function anim () {
    store.uid = start({
      finalPos: showing ? 100 : 0,
      pos: store.pos !== null ? store.pos : showing ? 0 : 100,
      factor: 10,
      threshold: 0.5,
      apply (pos) {
        store.pos = pos;
        css(el, {
          maxHeight: `${store.height * pos / 100}px`,
          padding: store.padding ? store.padding.map(t => (t[0] * pos / 100) + t[1]).join(' ') : ''
        });
      },
      done () {
        store.uid = null;
        store.pos = null;
        done();
        css(el, store.css);
      }
    });
    add('slidetoggle', el, store);
  }

  if (store.uid) {
    start.stop(store.uid);
    return anim()
  }

  store.css = {
    overflowY: el.style.overflowY,
    maxHeight: el.style.maxHeight,
    padding: el.style.padding
  };
  let style$$1 = window.getComputedStyle(el);
  if (style$$1.padding && style$$1.padding !== '0px') {
    store.padding = parsePadding(style$$1.padding);
  }
  store.height = getHeight(el, style$$1);
  store.pos = null;
  el.style.overflowY = 'hidden';
  anim();
}

var slide = {
  enter (el, done) {
    toggleSlide(el, true, done);
  },
  leave (el, done) {
    toggleSlide(el, false, done);
  }
};

let transitions = {slide};

var Transition = {
  functional: true,
  props: {
    name: {
      type: String,
      default: 'slide',
      validator (value) {
        if (!transitions[value]) {
          console.error('Quasar Transition unknown: ' + value);
          return false
        }
        return true
      }
    },
    appear: Boolean
  },
  render (h, context) {
    const config = transitions[context.props.name];
    if (!config) {
      throw new Error(`Quasar Transition ${context.props.name} is unknown.`)
    }
    var data = {
      props: {
        name: 'q-transition',
        mode: 'out-in',
        css: false,
        appear: context.props.appear
      },
      on: config
    };
    return h('transition', data, context.children)
  }
};

function updateBinding (el, { value, modifiers }, ctx) {
  if (!value) {
    ctx.update();
    return
  }

  if (typeof value === 'number') {
    ctx.offset = value;
    ctx.update();
    return
  }

  if (value && Object(value) !== value) {
    console.error('v-back-to-top requires an object {offset, duration} as parameter', el);
    return
  }

  if (value.offset) {
    if (typeof value.offset !== 'number') {
      console.error('v-back-to-top requires a number as offset', el);
      return
    }
    ctx.offset = value.offset;
  }
  if (value.duration) {
    if (typeof value.duration !== 'number') {
      console.error('v-back-to-top requires a number as duration', el);
      return
    }
    ctx.duration = value.duration;
  }

  ctx.update();
}

var dBackToTop = {
  bind (el) {
    let ctx = {
      offset: 200,
      duration: 300,
      update: Utils.debounce(() => {
        const trigger = Utils.dom.getScrollPosition(ctx.scrollTarget) > ctx.offset;
        if (ctx.visible !== trigger) {
          ctx.visible = trigger;
          el.classList[trigger ? 'remove' : 'add']('hidden');
        }
      }, 25),
      goToTop () {
        Utils.dom.setScrollPosition(ctx.scrollTarget, 0, ctx.animate ? ctx.duration : 0);
      }
    };
    el.classList.add('hidden');
    Utils.store.add('backtotop', el, ctx);
  },
  inserted (el, binding) {
    let ctx = Utils.store.get('backtotop', el);
    ctx.scrollTarget = Utils.dom.getScrollTarget(el);
    ctx.animate = binding.modifiers.animate;
    updateBinding(el, binding, ctx);
    ctx.scrollTarget.addEventListener('scroll', ctx.update);
    window.addEventListener('resize', ctx.update);
    el.addEventListener('click', ctx.goToTop);
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding(el, binding, Utils.store.get('backtotop', el));
    }
  },
  unbind (el) {
    let ctx = Utils.store.get('backtotop', el);
    ctx.scrollTarget.removeEventListener('scroll', ctx.update);
    window.removeEventListener('resize', ctx.update);
    el.removeEventListener('click', ctx.goToTop);
    Utils.store.remove('backtotop', el);
  }
};

var dGoBack = {
  bind (el, { value, modifiers }, vnode) {
    let ctx = { value, position: window.history.length - 1, single: modifiers.single };

    if (Platform.is.cordova) {
      ctx.goBack = () => {
        vnode.context.$router.go(ctx.single ? -1 : ctx.position - window.history.length);
      };
    }
    else {
      ctx.goBack = () => {
        vnode.context.$router.replace(ctx.value);
      };
    }

    Utils.store.add('goback', el, ctx);
    el.addEventListener('click', ctx.goBack);
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      let ctx = Utils.store.get('goback', el);
      ctx.value = binding.value;
    }
  },
  unbind (el) {
    el.removeEventListener('click', Utils.store.get('goback', el).goBack);
    Utils.store.remove('goback', el);
  }
};

function equal (a, b) {
  if (a.length !== b.length) {
    return false
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

var dLink = {
  bind (el, binding, vnode) {
    let ctx = {
      route: binding.value,
      delay: binding.modifiers.delay,
      active: false,
      go () {
        const fn = () => {
          vnode.context.$router[ctx.route.replace ? 'replace' : 'push'](ctx.route);
        };
        if (ctx.delay) {
          setTimeout(fn, 100);
          return
        }
        fn();
      },
      updateClass () {
        let matched;
        const
          route = vnode.context.$route,
          router = vnode.context.$router,
          prop = ctx.route.name ? 'name' : 'path';

        if (ctx.route.exact) {
          matched = route[prop] === (typeof ctx.route === 'string' ? ctx.route : ctx.route[prop]);
        }
        else {
          matched = equal(
            router.resolve(ctx.route, route).resolved.matched.map(r => r[prop]),
            route.matched.map(r => r[prop])
          );
        }

        if (ctx.active !== matched) {
          el.classList[matched ? 'add' : 'remove']('router-link-active');
          ctx.active = matched;
        }
      }
    };

    ctx.destroyWatcher = vnode.context.$watch('$route', ctx.updateClass);
    ctx.updateClass();
    Utils.store.add('link', el, ctx);
    el.addEventListener('click', ctx.go);
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      let ctx = Utils.store.get('link', el);
      ctx.route = binding.value;
      ctx.updateClass();
    }
  },
  unbind (el) {
    let ctx = Utils.store.get('link', el);
    ctx.destroyWatcher();
    el.removeEventListener('click', ctx.go);
    Utils.store.remove('link', el);
  }
};

function updateBinding$1 (el, binding, ctx) {
  if (typeof binding.value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    console.error('v-scroll-fire requires a function as parameter', el);
    return
  }

  ctx.handler = binding.value;
  if (typeof binding.oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll);
    ctx.scroll();
  }
}

var dScrollFire = {
  bind (el, binding) {
    let ctx = {
      scroll: Utils.debounce(() => {
        let containerBottom, elementBottom, fire;

        if (ctx.scrollTarget === window) {
          elementBottom = el.getBoundingClientRect().bottom;
          fire = elementBottom < Utils.dom.viewport().height;
        }
        else {
          containerBottom = Utils.dom.offset(ctx.scrollTarget).top + Utils.dom.height(ctx.scrollTarget);
          elementBottom = Utils.dom.offset(el).top + Utils.dom.height(el);
          fire = elementBottom < containerBottom;
        }

        if (fire) {
          ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
          ctx.handler(el);
        }
      }, 25)
    };

    Utils.store.add('scrollfire', el, ctx);
  },
  inserted (el, binding) {
    let ctx = Utils.store.get('scrollfire', el);
    ctx.scrollTarget = Utils.dom.getScrollTarget(el);
    updateBinding$1(el, binding, ctx);
  },
  update (el, binding) {
    if (binding.value !== binding.oldValue) {
      updateBinding$1(el, binding, Utils.store.get('scrollfire', el));
    }
  },
  unbind (el) {
    let ctx = Utils.store.get('scrollfire', el);
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    Utils.store.remove('scrollfire', el);
  }
};

function updateBinding$2 (el, binding, ctx) {
  if (typeof binding.value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    console.error('v-scroll requires a function as parameter', el);
    return
  }

  ctx.handler = binding.value;
  if (typeof binding.oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll);
  }
}

var dScroll = {
  bind (el, binding) {
    let ctx = {
      scroll () {
        ctx.handler(Utils.dom.getScrollPosition(ctx.scrollTarget));
      }
    };
    Utils.store.add('scroll', el, ctx);
  },
  inserted (el, binding) {
    let ctx = Utils.store.get('scroll', el);
    ctx.scrollTarget = Utils.dom.getScrollTarget(el);
    updateBinding$2(el, binding, ctx);
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding$2(el, binding, Utils.store.get('scroll', el));
    }
  },
  unbind (el) {
    let ctx = Utils.store.get('scroll', el);
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    Utils.store.remove('scroll', el);
  }
};

let defaultDuration = 800;

function updateBinding$3 (el, binding, ctx) {
  ctx.duration = parseInt(binding.arg, 10) || defaultDuration;
  if (binding.oldValue !== binding.value) {
    ctx.handler = binding.value;
  }
}

var dTouchHold = {
  bind (el, binding) {
    let ctx = {
      start (evt) {
        ctx.timer = setTimeout(() => {
          document.removeEventListener('mousemove', ctx.mouseAbort);
          document.removeEventListener('mouseup', ctx.mouseAbort);
          ctx.handler();
        }, ctx.duration);
      },
      mouseStart (evt) {
        document.addEventListener('mousemove', ctx.mouseAbort);
        document.addEventListener('mouseup', ctx.mouseAbort);
        ctx.start(evt);
      },
      abort (evt) {
        clearTimeout(ctx.timer);
        ctx.timer = null;
      },
      mouseAbort (evt) {
        document.removeEventListener('mousemove', ctx.mouseAbort);
        document.removeEventListener('mouseup', ctx.mouseAbort);
        ctx.abort(evt);
      }
    };

    Utils.store.add('touchhold', el, ctx);
    updateBinding$3(el, binding, ctx);
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('touchmove', ctx.abort);
    el.addEventListener('touchend', ctx.abort);
    el.addEventListener('mousedown', ctx.mouseStart);
  },
  update (el, binding) {
    updateBinding$3(el, binding, Utils.store.get('touchhold', el));
  },
  unbind (el, binding) {
    let ctx = Utils.store.get('touchhold', el);
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('touchmove', ctx.abort);
    el.removeEventListener('touchend', ctx.abort);
    el.removeEventListener('mousedown', ctx.mouseStart);
    document.removeEventListener('mousemove', ctx.mouseAbort);
    document.removeEventListener('mouseup', ctx.mouseAbort);
    Utils.store.remove('touchhold', el);
  }
};

function getDirection (mod) {
  if (Object.keys(mod).length === 0) {
    return {
      horizontal: true,
      vertical: true
    }
  }

  let dir = {};['horizontal', 'vertical'].forEach(direction => {
    if (mod[direction]) {
      dir[direction] = true;
    }
  });

  return dir
}

function updateClasses (el, dir, scroll) {
  el.classList.add('q-touch');

  if (!scroll) {
    if (dir.horizontal && !dir.vertical) {
      el.classList.add('q-touch-y');
      el.classList.remove('q-touch-x');
    }
    else if (!dir.horizontal && dir.vertical) {
      el.classList.add('q-touch-x');
      el.classList.remove('q-touch-y');
    }
  }
}

function processChanges (evt, ctx, isFinal) {
  let
    direction,
    position = Utils.event.position(evt),
    distX = position.left - ctx.event.x,
    distY = position.top - ctx.event.y,
    absDistX = Math.abs(distX),
    absDistY = Math.abs(distY);

  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    direction = distX < 0 ? 'left' : 'right';
  }
  else if (!ctx.direction.horizontal && ctx.direction.vertical) {
    direction = distY < 0 ? 'up' : 'down';
  }
  else if (absDistX >= absDistY) {
    direction = distX < 0 ? 'left' : 'right';
  }
  else {
    direction = distY < 0 ? 'up' : 'down';
  }

  return {
    evt,
    position,
    direction,
    isFirst: ctx.event.isFirst,
    isFinal: Boolean(isFinal),
    duration: new Date().getTime() - ctx.event.time,
    distance: {
      x: absDistX,
      y: absDistY
    },
    delta: {
      x: position.left - ctx.event.lastX,
      y: position.top - ctx.event.lastY
    }
  }
}

function shouldTrigger (ctx, changes) {
  if (ctx.direction.horizontal && ctx.direction.vertical) {
    return true
  }
  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    return Math.abs(changes.delta.x) > 0
  }
  if (!ctx.direction.horizontal && ctx.direction.vertical) {
    return Math.abs(changes.delta.y) > 0
  }
}

var dTouchPan = {
  bind (el, binding) {
    let ctx = {
      handler: binding.value,
      scroll: binding.modifiers.scroll,
      direction: getDirection(binding.modifiers),

      mouseStart (evt) {
        document.addEventListener('mousemove', ctx.mouseMove);
        document.addEventListener('mouseup', ctx.mouseEnd);
        ctx.start(evt);
      },
      start (evt) {
        let position = Utils.event.position(evt);
        ctx.event = {
          x: position.left,
          y: position.top,
          time: new Date().getTime(),
          detected: false,
          prevent: ctx.direction.horizontal && ctx.direction.vertical,
          isFirst: true,
          lastX: position.left,
          lastY: position.top
        };
      },
      mouseMove (evt) {
        ctx.event.prevent = true;
        ctx.move(evt);
      },
      move (evt) {
        if (ctx.event.prevent) {
          if (!ctx.scroll) {
            evt.preventDefault();
          }
          let changes = processChanges(evt, ctx, false);
          if (shouldTrigger(ctx, changes)) {
            ctx.handler(changes);
            ctx.event.lastX = changes.position.left;
            ctx.event.lastY = changes.position.top;
            ctx.event.isFirst = false;
          }
          return
        }
        if (ctx.event.detected) {
          return
        }

        ctx.event.detected = true;
        let
          position = Utils.event.position(evt),
          distX = position.left - ctx.event.x,
          distY = position.top - ctx.event.y;

        if (ctx.direction.horizontal && !ctx.direction.vertical) {
          if (Math.abs(distX) > Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
        else if (Math.abs(distX) < Math.abs(distY)) {
          ctx.event.prevent = true;
        }
      },
      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.mouseMove);
        document.removeEventListener('mouseup', ctx.mouseEnd);
        ctx.end(evt);
      },
      end (evt) {
        if (!ctx.event.prevent || ctx.event.isFirst) {
          return
        }

        ctx.handler(processChanges(evt, ctx, true));
      }
    };

    Utils.store.add('touchpan', el, ctx);
    updateClasses(el, ctx.direction, ctx.scroll);
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('mousedown', ctx.mouseStart);
    el.addEventListener('touchmove', ctx.move);
    el.addEventListener('touchend', ctx.end);
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      Utils.store.get('touchpan', el).handler = binding.value;
    }
  },
  unbind (el, binding) {
    let ctx = Utils.store.get('touchpan', el);
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('mousedown', ctx.mouseStart);
    el.removeEventListener('touchmove', ctx.move);
    el.removeEventListener('touchend', ctx.end);
    Utils.store.remove('touchpan', el);
  }
};

function getDirection$1 (mod) {
  if (Object.keys(mod).length === 0) {
    return {
      left: true, right: true, up: true, down: true, horizontal: true, vertical: true
    }
  }

  let dir = {};['left', 'right', 'up', 'down', 'horizontal', 'vertical'].forEach(direction => {
    if (mod[direction]) {
      dir[direction] = true;
    }
  });
  if (dir.horizontal) {
    dir.left = dir.right = true;
  }
  if (dir.vertical) {
    dir.up = dir.down = true;
  }
  if (dir.left || dir.right) {
    dir.horizontal = true;
  }
  if (dir.up || dir.down) {
    dir.vertical = true;
  }

  return dir
}

function updateClasses$1 (el, dir) {
  el.classList.add('q-touch');

  if (dir.horizontal && !dir.vertical) {
    el.classList.add('q-touch-y');
    el.classList.remove('q-touch-x');
  }
  else if (!dir.horizontal && dir.vertical) {
    el.classList.add('q-touch-x');
    el.classList.remove('q-touch-y');
  }
}

var dTouchSwipe = {
  bind (el, binding) {
    let ctx = {
      handler: binding.value,
      direction: getDirection$1(binding.modifiers),

      start (evt) {
        let position = Utils.event.position(evt);
        ctx.event = {
          x: position.left,
          y: position.top,
          time: new Date().getTime(),
          detected: false,
          prevent: ctx.direction.horizontal && ctx.direction.vertical
        };
        document.addEventListener('mousemove', ctx.move);
        document.addEventListener('mouseup', ctx.end);
      },
      move (evt) {
        let
          position = Utils.event.position(evt),
          distX = position.left - ctx.event.x,
          distY = position.top - ctx.event.y;

        if (ctx.event.prevent) {
          evt.preventDefault();
          return
        }
        if (ctx.event.detected) {
          return
        }

        ctx.event.detected = true;
        if (ctx.direction.horizontal && !ctx.direction.vertical) {
          if (Math.abs(distX) > Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
        else {
          if (Math.abs(distX) < Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
      },
      end (evt) {
        document.removeEventListener('mousemove', ctx.move);
        document.removeEventListener('mouseup', ctx.end);

        let
          direction,
          position = Utils.event.position(evt),
          distX = position.left - ctx.event.x,
          distY = position.top - ctx.event.y;

        if (distX !== 0 || distY !== 0) {
          if (Math.abs(distX) >= Math.abs(distY)) {
            direction = distX < 0 ? 'left' : 'right';
          }
          else {
            direction = distY < 0 ? 'up' : 'down';
          }

          if (ctx.direction[direction]) {
            ctx.handler({
              evt,
              direction,
              duration: new Date().getTime() - ctx.event.time,
              distance: {
                x: Math.abs(distX),
                y: Math.abs(distY)
              }
            });
          }
        }
      }
    };

    Utils.store.add('touchswipe', el, ctx);
    updateClasses$1(el, ctx.direction);
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('mousedown', ctx.start);
    el.addEventListener('touchmove', ctx.move);
    el.addEventListener('touchend', ctx.end);
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      let ctx = Utils.store.get('touchswipe', el);
      ctx.handler = binding.value;
    }
  },
  unbind (el, binding) {
    let ctx = Utils.store.get('touchswipe', el);
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('mousedown', ctx.start);
    el.removeEventListener('touchmove', ctx.move);
    el.removeEventListener('touchend', ctx.end);
    Utils.store.remove('touchswipe', el);
  }
};

const xhr = XMLHttpRequest;
const send = xhr.prototype.send;

function translate ({p, pos, active, horiz, reverse}) {
  let x = 1, y = 1;

  if (horiz) {
    if (reverse) { x = -1; }
    if (pos === 'bottom') { y = -1; }
    return Utils.dom.cssTransform(`translate3d(${x * (p - 100)}%, ${active ? 0 : y * -200}%, 0)`)
  }

  if (reverse) { y = -1; }
  if (pos === 'right') { x = -1; }
  return Utils.dom.cssTransform(`translate3d(${active ? 0 : x * -200}%, ${y * (p - 100)}%, 0)`)
}

function inc (p, amount) {
  if (typeof amount !== 'number') {
    if (p < 25) {
      amount = Math.random() * (5 - 3 + 1) + 3;
    }
    else if (p < 65) {
      amount = Math.random() * 3;
    }
    else if (p < 90) {
      amount = Math.random() * 2;
    }
    else if (p < 99) {
      amount = 0.5;
    }
    else {
      amount = 0;
    }
  }
  return Utils.format.between(p + amount, 0, 100)
}

function highjackAjax (startHandler, endHandler) {
  xhr.prototype.send = function (...args) {
    startHandler();

    this.addEventListener('abort', endHandler, false);
    this.addEventListener('readystatechange', () => {
      if (this.readyState === 4) {
        endHandler();
      }
    }, false);

    send.apply(this, args);
  };
}

function restoreAjax () {
  xhr.prototype.send = send;
}

var AjaxBar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-loading-bar shadow-1",class:[_vm.position, _vm.animate ? '' : 'no-transition'],style:(_vm.containerStyle)},[_c('div',{staticClass:"q-loading-bar-inner",style:(_vm.innerStyle)})])},staticRenderFns: [],
  props: {
    position: {
      type: String,
      default: 'top',
      validator (val) {
        return ['top', 'right', 'bottom', 'left'].includes(val)
      }
    },
    size: {
      type: String,
      default: '4px'
    },
    color: {
      type: String,
      default: '#e21b0c'
    },
    speed: {
      type: Number,
      default: 250
    },
    delay: {
      type: Number,
      default: 1000
    },
    reverse: Boolean
  },
  data () {
    return {
      animate: false,
      active: false,
      progress: 0,
      calls: 0
    }
  },
  computed: {
    containerStyle () {
      let o = translate({
        p: this.progress,
        pos: this.position,
        active: this.active,
        horiz: this.horizontal,
        reverse: this.reverse
      });
      o[this.sizeProp] = this.size;
      return o
    },
    innerStyle () {
      return {background: this.color}
    },
    horizontal () {
      return this.position === 'top' || this.position === 'bottom'
    },
    sizeProp () {
      return this.horizontal ? 'height' : 'width'
    }
  },
  methods: {
    start () {
      this.calls++;
      if (!this.active) {
        this.progress = 0;
        this.active = true;
        this.animate = false;
        this.$emit('start');
        this.timer = setTimeout(() => {
          this.animate = true;
          this.move();
        }, this.delay);
      }
      else if (this.closing) {
        this.closing = false;
        clearTimeout(this.timer);
        this.progress = 0;
        this.move();
      }
    },
    increment (amount) {
      if (this.active) {
        this.progress = inc(this.progress, amount);
      }
    },
    stop () {
      this.calls = Math.max(0, this.calls - 1);
      if (this.calls > 0) {
        return
      }

      clearTimeout(this.timer);

      if (!this.animate) {
        this.active = false;
        return
      }
      this.closing = true;
      this.progress = 100;
      this.$emit('stop');
      this.timer = setTimeout(() => {
        this.closing = false;
        this.active = false;
      }, 1050);
    },
    move () {
      this.timer = setTimeout(() => {
        this.increment();
        this.move();
      }, this.speed);
    }
  },
  mounted () {
    highjackAjax(this.start, this.stop);
  },
  beforeDestroy () {
    clearTimeout(this.timer);
    restoreAjax();
  }
};

function prevent (e) {
  e.preventDefault();
  e.stopPropagation();
}

var Autocomplete = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',[_vm._t("default",[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],attrs:{"type":"text"},domProps:{"value":(_vm.model)},on:{"input":function($event){if($event.target.composing){ return; }_vm.model=$event.target.value;}}})]),_c('q-popover',{ref:"popover",attrs:{"anchor-click":false}},[_c('div',{staticClass:"list no-border",class:{'item-delimiter': _vm.delimiter},style:(_vm.computedWidth)},_vm._l((_vm.computedResults),function(result,index){return _c('q-list-item',{key:result,attrs:{"item":result,"link":"","active":_vm.selectedIndex === index},nativeOn:{"click":function($event){_vm.setValue(result);}}})}))])],2)},staticRenderFns: [],
  props: {
    value: {
      type: String,
      required: true
    },
    minCharacters: {
      type: Number,
      default: 1
    },
    maxResults: {
      type: Number,
      default: 6
    },
    delay: {
      type: Number,
      default: 500
    },
    staticData: Object,
    delimiter: Boolean
  },
  data () {
    return {
      searchId: '',
      results: [],
      selectedIndex: -1,
      width: 0,
      timer: null,
      avoidTrigger: false
    }
  },
  computed: {
    model: {
      get () {
        if (!this.avoidTrigger) {
          if (document.activeElement === this.inputEl) {
            this.__delayTrigger();
          }
        }
        else {
          this.avoidTrigger = false;
        }
        return this.value
      },
      set (val) {
        this.$emit('input', val);
      }
    },
    computedResults () {
      if (this.maxResults && this.results.length > 0) {
        return this.results.slice(0, this.maxResults)
      }
    },
    computedWidth () {
      return {minWidth: this.width}
    },
    searching () {
      return this.searchId.length > 0
    }
  },
  methods: {
    trigger () {
      this.width = Utils.dom.width(this.inputEl) + 'px';
      const searchId = Utils.uid();
      this.searchId = searchId;

      if (this.model.length < this.minCharacters) {
        this.searchId = '';
        this.close();
        return
      }

      if (this.staticData) {
        this.searchId = '';
        this.results = Utils.filter(this.model, this.staticData);
        if (this.$q.platform.is.desktop) {
          this.selectedIndex = 0;
        }
        this.$refs.popover.open();
        return
      }

      this.$emit('search', this.model, results => {
        if (!results || this.searchId !== searchId) {
          return
        }

        this.searchId = '';
        if (this.results === results) {
          return
        }

        if (Array.isArray(results) && results.length > 0) {
          this.results = results;
          if (this.$refs && this.$refs.popover) {
            if (this.$q.platform.is.desktop) {
              this.selectedIndex = 0;
            }
            this.$refs.popover.open();
          }
          return
        }

        this.close();
      });
    },
    close () {
      this.$refs.popover.close();
      this.results = [];
      this.selectedIndex = -1;
    },
    setValue (result) {
      this.avoidTrigger = true;
      this.model = result.value;
      this.$emit('selected', result);
      this.close();
    },
    move (offset) {
      this.selectedIndex = Utils.format.normalizeToInterval(
        this.selectedIndex + offset,
        0,
        this.computedResults.length - 1
      );
    },
    setCurrentSelection () {
      if (this.selectedIndex >= 0) {
        this.setValue(this.results[this.selectedIndex]);
      }
    },
    __delayTrigger () {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.trigger, this.staticData ? 0 : this.delay);
    },
    __handleKeypress (e) {
      switch (e.keyCode || e.which) {
        case 38: // up
          this.__moveCursor(-1, e);
          break
        case 40: // down
          this.__moveCursor(1, e);
          break
        case 13: // enter
          this.setCurrentSelection();
          prevent(e);
          break
        default:
          this.close();
      }
    },
    __moveCursor (offset, e) {
      prevent(e);

      if (!this.$refs.popover.opened) {
        this.trigger();
      }
      else {
        this.move(offset);
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.inputEl = this.$el.querySelector('input');
      if (!this.inputEl) {
        console.error('Autocomplete needs to contain one input field in its slot.');
        return
      }
      this.inputEl.addEventListener('keydown', this.__handleKeypress);
    });
  },
  beforeDestroy () {
    clearTimeout(this.timer);
    this.inputEl.removeEventListener('keydown', this.__handleKeypress);
    this.close();
  }
};

var Checkbox = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"q-checkbox cursor-pointer",class:{disabled: _vm.disable},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.toggle($event);}}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],attrs:{"type":"checkbox","disabled":_vm.disable},domProps:{"checked":Array.isArray(_vm.model)?_vm._i(_vm.model,null)>-1:(_vm.model)},on:{"click":function($event){$event.stopPropagation();},"change":_vm.__change,"__c":function($event){var $$a=_vm.model,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$c){$$i<0&&(_vm.model=$$a.concat($$v));}else{$$i>-1&&(_vm.model=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.model=$$c;}}}}),_c('div')])},staticRenderFns: [],
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disable: Boolean
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    toggle () {
      if (!this.disable) {
        this.model = !this.model;
      }
    },
    __change (e) {
      if (this.$q.platform.is.ios) {
        this.toggle();
      }
    }
  }
};

var Chips = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-chips group textfield",class:{active: _vm.active, disabled: _vm.disable, readonly: _vm.readonly},on:{"click":_vm.focus}},[_vm._l((_vm.value),function(label,index){return _c('span',{key:index,staticClass:"chip label bg-light text-grey-9"},[_vm._v(_vm._s(label)+" "),_c('i',{staticClass:"on-right",on:{"click":function($event){_vm.remove(index);}}},[_vm._v("close")])])}),_c('div',{staticClass:"q-chips-input chip label text-grey-9"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.input),expression:"input"}],ref:"input",staticClass:"no-style",attrs:{"type":"text","disabled":_vm.disable,"placeholder":_vm.placeholder,"tabindex":"0"},domProps:{"value":(_vm.input)},on:{"keyup":function($event){if(_vm._k($event.keyCode,"enter",13)){ return null; }_vm.add();},"focus":function($event){_vm.active = true;},"blur":function($event){_vm.active = false;},"input":function($event){if($event.target.composing){ return; }_vm.input=$event.target.value;}}}),_vm._v(" "),_c('button',{staticClass:"small",class:{invisible: !_vm.input.length},on:{"click":function($event){_vm.add();}}},[_c('i',[_vm._v("send")])])])],2)},staticRenderFns: [],
  props: {
    value: {
      type: Array,
      required: true
    },
    disable: Boolean,
    readonly: Boolean,
    placeholder: String
  },
  data () {
    return {
      active: false,
      input: ''
    }
  },
  methods: {
    add (value = this.input) {
      if (!this.disable && !this.readonly && value) {
        this.$emit('input', this.value.concat([value]));
        this.input = '';
      }
    },
    remove (index) {
      if (!this.disable && !this.readonly && index >= 0 && index < this.value.length) {
        let value = this.value.slice(0);
        value.splice(index, 1);
        this.$emit('input', value);
      }
    },
    focus () {
      this.$refs.input.focus();
    }
  }
};

const eventName = 'q:collapsible:close';

var Collapsible = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-collapsible"},[_c('div',{staticClass:"item item-link non-selectable item-collapsible",on:{"click":_vm.__toggleItem}},[(_vm.icon)?_c('i',{staticClass:"item-primary",domProps:{"textContent":_vm._s(_vm.icon)}}):_vm._e(),_vm._v(" "),(_vm.img)?_c('img',{staticClass:"item-primary thumbnail",attrs:{"src":_vm.img}}):_vm._e(),(_vm.avatar)?_c('img',{staticClass:"item-primary",attrs:{"src":_vm.avatar}}):_vm._e(),_c('div',{staticClass:"item-content has-secondary"},[_c('div',[_vm._v(_vm._s(_vm.label))])]),_c('i',{staticClass:"item-secondary",class:{'rotate-180': _vm.active},on:{"click":function($event){$event.stopPropagation();_vm.toggle($event);}}},[_vm._v("keyboard_arrow_down")])]),_c('q-transition',{attrs:{"name":"slide"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.active),expression:"active"}]},[_c('div',{staticClass:"q-collapsible-sub-item"},[_vm._t("default")],2)])])],1)},staticRenderFns: [],
  props: {
    opened: Boolean,
    icon: String,
    group: String,
    img: String,
    avatar: String,
    label: String,
    iconToggle: Boolean
  },
  data () {
    return {
      active: this.opened
    }
  },
  watch: {
    opened (value) {
      this.active = value;
    },
    active (value) {
      if (value && this.group) {
        Events.$emit(eventName, this);
      }
    }
  },
  methods: {
    toggle () {
      this.active = !this.active;
    },
    open () {
      this.active = true;
    },
    close () {
      this.active = false;
    },
    __toggleItem () {
      if (!this.iconToggle) {
        this.toggle();
      }
    },
    __eventHandler (comp) {
      if (this.group && this !== comp && comp.group === this.group) {
        this.close();
      }
    }
  },
  created () {
    Events.$on(eventName, this.__eventHandler);
  },
  beforeDestroy () {
    Events.$off(eventName, this.__eventHandler);
  }
};

var ContextMenuDesktop = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-popover',{ref:"popover",attrs:{"anchor-click":false}},[_vm._t("default")],2)},staticRenderFns: [],
  props: {
    disable: Boolean
  },
  methods: {
    close () {
      this.$refs.popover.close();
    },
    __open (evt) {
      if (this.disable) {
        return
      }
      this.close();
      evt.preventDefault();
      evt.stopPropagation();
      /*
        Opening with a timeout for
        Firefox workaround
       */
      setTimeout(() => {
        this.$refs.popover.open(evt);
      }, 100);
    }
  },
  mounted () {
    this.target = this.$refs.popover.$el.parentNode;
    this.target.addEventListener('contextmenu', this.__open);
  },
  beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.__open);
  }
};

var ContextMenuMobile = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-modal',{ref:"dialog",staticClass:"minimized"},[_vm._t("default")],2)},staticRenderFns: [],
  props: {
    disable: Boolean
  },
  methods: {
    open () {
      this.handler();
    },
    close () {
      this.target.classList.remove('non-selectable');
      this.$refs.dialog.close();
    },
    toggle () {
      if (this.$refs.dialog.active) {
        this.close();
      }
      else {
        this.open();
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.target = this.$el.parentNode;

      this.handler = () => {
        if (!this.disable) {
          this.$refs.dialog.open();
        }
      };

      this.touchStartHandler = (event) => {
        this.target.classList.add('non-selectable');
        this.touchTimer = setTimeout(() => {
          event.preventDefault();
          event.stopPropagation();
          this.cleanup();
          setTimeout(() => {
            this.handler();
          }, 10);
        }, 600);
      };
      this.cleanup = () => {
        this.target.classList.remove('non-selectable');
        clearTimeout(this.touchTimer);
        this.touchTimer = null;
      };
      this.target.addEventListener('touchstart', this.touchStartHandler);
      this.target.addEventListener('touchcancel', this.cleanup);
      this.target.addEventListener('touchmove', this.cleanup);
      this.target.addEventListener('touchend', this.cleanup);
    });
  },
  beforeDestroy () {
    this.target.removeEventListener('touchstart', this.touchStartHandler);
    this.target.removeEventListener('touchcancel', this.cleanup);
    this.target.removeEventListener('touchmove', this.cleanup);
    this.target.removeEventListener('touchend', this.cleanup);
  }
};

var ColumnSelection = {
  data () {
    return {
      columnSelection: this.columns.map(col => col.field)
    }
  },
  watch: {
    'config.columnPicker' (value) {
      if (!value) {
        this.columnSelection = this.columns.map(col => col.field);
      }
    }
  },
  computed: {
    cols () {
      return this.columns.filter(col => this.columnSelection.includes(col.field))
    },
    columnSelectionOptions () {
      return this.columns.map(col => {
        return {
          label: col.label,
          value: col.field
        }
      })
    }
  }
};

var TableFilter = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-data-table-toolbar upper-toolbar row auto items-center"},[_c('q-search',{staticClass:"auto",attrs:{"placeholder":_vm.labels.search},model:{value:(_vm.filtering.terms),callback:function ($$v) {_vm.filtering.terms=$$v;}}}),_c('q-select',{staticClass:"text-right",attrs:{"type":"list","options":_vm.filterFields},model:{value:(_vm.filtering.field),callback:function ($$v) {_vm.filtering.field=$$v;}}})],1)},staticRenderFns: [],
  props: ['filtering', 'columns', 'labels'],
  computed: {
    filterFields () {
      let cols = this.columns.map(col => {
        return {
          label: col.label,
          value: col.field
        }
      });

      return [{label: this.labels.allCols, value: ''}].concat(cols)
    }
  }
};

var Filter = {
  data () {
    return {
      filtering: {
        field: '',
        terms: ''
      }
    }
  },
  watch: {
    'filtering.terms' () {
      this.resetBody();
    }
  },
  computed: {
    filteringCols () {
      return this.cols.filter(col => col.filter)
    }
  },
  methods: {
    filter (rows) {
      const
        field = this.filtering.field,
        terms = this.filtering.terms.toLowerCase();

      if (field) {
        return rows.filter(row => (row[field] + '').toLowerCase().indexOf(terms) > -1)
      }

      return rows.filter(row => {
        return this.filteringCols.some(col => (row[col.field] + '').toLowerCase().indexOf(terms) > -1)
      })
    }
  },
  components: {
    TableFilter
  }
};

const labels = {
  columns: 'Columns',
  allCols: 'All Columns',
  rows: 'Rows',
  selected: {
    singular: 'item selected.',
    plural: 'items selected.'
  },
  clear: 'Clear',
  search: 'Search',
  all: 'All'
};

var I18n = {
  computed: {
    labels () {
      if (this.config && this.config.labels) {
        return Utils.extend({}, labels, this.config.labels)
      }
      return labels
    },
    message () {
      if (this.rows.length) {
        return false
      }

      if (this.filtering.terms) {
        return (this.config.messages && this.config.messages.noDataAfterFiltering) || '<i>warning</i> No results. Please refine your search terms.'
      }

      return (this.config.messages && this.config.messages.noData) || '<i>warning</i> No data available to show.'
    }
  }
};

var TablePagination = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-data-table-toolbar bottom-toolbar row reverse-wrap items-baseline justify-end"},[_c('div',[_vm._v(_vm._s(_vm.labels.rows)),_c('q-select',{staticClass:"text-right",attrs:{"type":"list","options":_vm.pagination.options},on:{"input":_vm.resetPage},model:{value:(_vm.pagination.rowsPerPage),callback:function ($$v) {_vm.pagination.rowsPerPage=$$v;}}})],1),(_vm.entries > 0)?_c('div',[_vm._v(_vm._s(_vm.start)+" - "+_vm._s(_vm.end)+" / "+_vm._s(_vm.entries))]):_vm._e(),(_vm.pagination.rowsPerPage > 0)?_c('q-pagination',{attrs:{"max":_vm.max},model:{value:(_vm.pagination.page),callback:function ($$v) {_vm.pagination.page=$$v;}}}):_vm._e()],1)},staticRenderFns: [],
  props: ['pagination', 'entries', 'labels'],
  watch: {
    entries () {
      this.resetPage();
    }
  },
  computed: {
    start () {
      return (this.pagination.page - 1) * this.pagination.rowsPerPage + 1
    },
    end () {
      if (this.pagination.page === this.max || this.pagination.rowsPerPage === 0) {
        return this.entries
      }
      return this.pagination.page * this.pagination.rowsPerPage
    },
    max () {
      return Math.max(1, Math.ceil(this.entries / this.pagination.rowsPerPage))
    }
  },
  methods: {
    resetPage () {
      this.pagination.page = 1;
    }
  }
};

const defaultOptions = [
  { label: 'All', value: 0 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
];

function parseOptions$1 (opts) {
  return [{ label: 'All', value: 0 }].concat(
    opts.map(opt => {
      return {
        label: '' + opt,
        value: Number(opt)
      }
    })
  )
}

var Pagination = {
  data () {
    return {
      _pagination: {
        page: 1,
        entries: 0,
        rowsPerPage: null
      }
    }
  },
  computed: {
    pagination () {
      let self = this,
        cfg = this.config.pagination,
        options = defaultOptions;

      if (cfg) {
        if (cfg.options) {
          options = parseOptions$1(cfg.options);
        }
      }

      options[0].label = this.labels.all;

      return {
        get page () { return self.$data._pagination.page },
        set page (page) { self.$data._pagination.page = page; },
        get entries () { return self.$data._pagination.entries },
        set entries (entries) { self.$data._pagination.entries = entries; },
        get rowsPerPage () {
          let rowsPerPage = self.$data._pagination.rowsPerPage;
          if (rowsPerPage == null) {
            if (cfg && typeof cfg.rowsPerPage !== 'undefined') {
              rowsPerPage = cfg.rowsPerPage;
            }
            else {
              rowsPerPage = 0;
            }
          }
          return rowsPerPage
        },
        set rowsPerPage (rowsPerPage) { self.$data._pagination.rowsPerPage = rowsPerPage; },
        options
      }
    }
  },
  watch: {
    'pagination.page' () {
      this.$refs.body.scrollTop = 0;
    }
  },
  methods: {
    paginate (rows) {
      const
        page = this.pagination.page,
        number = this.pagination.rowsPerPage;

      if (number <= 0) {
        return rows
      }
      return rows.slice((page - 1) * number, page * number)
    }
  },
  components: {
    TablePagination
  }
};

var Responsive = {
  data () {
    return {
      responsive: false
    }
  },
  methods: {
    handleResponsive () {
      if (typeof this.config.responsive !== 'undefined') {
        if (!this.config.responsive) {
          this.responsive = false;
          return
        }
      }
      this.responsive = Utils.dom.viewport().width <= 600;
    }
  },
  watch: {
    'config.responsive' () {
      this.$nextTick(this.handleResponsive);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.handleResponsive();
      window.addEventListener('resize', this.handleResponsive);
    });
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResponsive);
  }
};

function getRowSelection (rows, selection, multiple) {
  if (!selection) {
    return []
  }
  return multiple ? rows.map(() => false) : [-1]
}

var RowSelection = {
  data () {
    return {
      rowSelection: []
    }
  },
  created () {
    this.rowSelection = getRowSelection(this.rows, this.config.selection, this.multipleSelection);
  },
  watch: {
    'config.selection' (value) {
      this.rowSelection = getRowSelection(this.rows, value, value === 'multiple');
    },
    rows (r) {
      this.rowSelection = getRowSelection(r, this.config.selection, this.multipleSelection);
    },
    rowSelection () {
      this.$nextTick(() => {
        if (this.rowsSelected) {
          this.toolbar = 'selection';
          return
        }
        if (this.toolbar === 'selection') {
          this.toolbar = '';
        }
      });
    }
  },
  computed: {
    multipleSelection () {
      return this.config.selection && this.config.selection === 'multiple'
    },
    rowsSelected () {
      if (this.multipleSelection) {
        return this.rowSelection.filter(r => r).length
      }
      return this.rowSelection.length && this.rowSelection[0] !== -1 ? 1 : 0
    },
    selectedRows () {
      if (this.multipleSelection) {
        return this.rowSelection
          .map((selected, index) => [selected, this.rows[index].__index])
          .filter(row => row[0])
          .map(row => {
            return { index: row[1], data: this.data[row[1]] }
          })
      }

      if (!this.rowSelection.length || this.rowSelection[0] === -1) {
        return []
      }
      const
        index = this.rows[this.rowSelection[0]].__index,
        row = this.data[index];

      return [{index, data: row}]
    }
  },
  methods: {
    clearSelection () {
      if (!this.multipleSelection) {
        this.rowSelection = [-1];
        return
      }
      this.rowSelection = this.rows.map(() => false);
    }
  }
};

const wheelOffset = 40;

var Scroll = {
  data () {
    return {
      scroll: {
        horiz: 0,
        vert: 0
      }
    }
  },
  methods: {
    scrollHandler (e) {
      const
        left = e.currentTarget.scrollLeft,
        top = e.currentTarget.scrollTop;

      requestAnimationFrame(() => {
        if (this.$refs.head) {
          this.$refs.head.scrollLeft = left;
        }
        this.updateStickyScroll(top);
      });
    },
    mouseWheel (e) {
      if (!this.scroll.vert) {
        return
      }

      let body = this.$refs.body;
      body.scrollTop -= Utils.event.getMouseWheelDirection(e) * wheelOffset;
      if (body.scrollTop > 0 && body.scrollTop + body.clientHeight < body.scrollHeight) {
        e.preventDefault();
      }
    },
    resize () {
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          if (this.responsive) {
            return
          }
          const
            body = this.$refs.body,
            size = Utils.scrollbar.width();

          this.scroll.horiz = size && body.clientWidth < body.scrollWidth ? size + 'px' : 0;
          this.scroll.vert = size && body.scrollHeight > body.clientHeight ? size + 'px' : 0;
        });
      });
    },
    updateStickyScroll (top) {
      if (this.$refs.stickyLeft) {
        this.$refs.stickyLeft.scrollTop = top;
      }
      if (this.$refs.stickyRight) {
        this.$refs.stickyRight.scrollTop = top;
      }
    }
  },
  watch: {
    $data: {
      deep: true,
      handler () {
        this.resize();
      }
    },
    bodyStyle: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          this.resize();
        });
      }
    },
    rowStyle: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          this.resize();
        });
      }
    },
    rightStickyColumns () {
      this.$nextTick(() => {
        this.updateStickyScroll(this.$refs.body.scrollTop);
      });
    },
    leftStickyColumns () {
      this.$nextTick(() => {
        this.updateStickyScroll(this.$refs.body.scrollTop);
      });
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.resize();
      window.addEventListener('resize', this.resize);
    });
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize);
  }
};

const sortMethod = {
  string: (a, b) => a.localeCompare(b),
  number: (a, b) => a - b,
  date: (a, b) => (new Date(a)) - (new Date(b)),
  moment: (a, b) => moment(a) - moment(b),
  boolean: (a, b) => {
    if (a && !b) { return -1 }
    if (!a && b) { return 1 }
    return 0
  }
};

function nextDirection (dir) {
  if (dir === 0) { return 1 }
  if (dir === 1) { return -1 }
  return 0
}

function getSortFn (sort, type) {
  if (typeof sort === 'function') {
    return sort
  }
  if (type && sortMethod[type]) {
    return sortMethod[type]
  }
}

var Sort = {
  data () {
    return {
      sorting: {
        field: '',
        dir: 0,
        fn: false
      }
    }
  },
  watch: {
    'sorting.dir' () {
      this.resetBody();
    }
  },
  methods: {
    setSortField (col) {
      if (this.sorting.field === col.field) {
        this.sorting.dir = nextDirection(this.sorting.dir);
        if (this.sorting.dir === 0) {
          this.sorting.field = '';
        }
        return
      }

      this.sorting.field = col.field;
      this.sorting.dir = 1;
      this.sorting.fn = getSortFn(col.sort, col.type);
    },
    sort (rows) {
      let sortFn = this.sorting.fn;
      const
        field = this.sorting.field,
        dir = this.sorting.dir;

      if (!sortFn) {
        sortFn = sortMethod[typeof rows[0][field]] || ((a, b) => a - b);
      }
      rows.sort((a, b) => dir * sortFn(a[field], b[field]));
    }
  }
};

var SortIcon = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('i',{staticClass:"cursor-pointer"},[_vm._v(_vm._s(_vm.icon))])},staticRenderFns: [],
  props: {
    field: String,
    sorting: Object
  },
  computed: {
    icon () {
      if (this.sorting.field !== this.field) {
        return 'import_export'
      }
      return this.sorting.dir === 1 ? 'arrow_downward' : 'arrow_upward'
    }
  }
};

var TableSticky = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('table',{staticClass:"q-table horizontal-delimiter"},[_c('colgroup',[(_vm.selection)?_c('col',{staticStyle:{"width":"45px"}}):_vm._e(),_vm._l((_vm.cols),function(col){return _c('col',{style:({width: col.width})})})],2),(!_vm.noHeader)?_c('thead',[_c('tr',[(_vm.selection)?_c('th',[_vm._v(" ")]):_vm._e(),_vm._l((_vm.cols),function(col,index){return _c('th',{class:{invisible: _vm.hidden(index), sortable: col.sort},on:{"click":function($event){_vm.sort(col);}}},[(!_vm.hidden(index))?[(col.sort)?_c('sort-icon',{attrs:{"field":col.field,"sorting":_vm.sorting}}):_vm._e(),_c('span',{domProps:{"innerHTML":_vm._s(col.label)}})]:_vm._e()],2)})],2)]):_vm._e(),(!_vm.head)?_c('tbody',[_vm._t("default")],2):_vm._e()])},staticRenderFns: [],
  props: {
    stickyCols: Number,
    cols: Array,
    head: Boolean,
    noHeader: Boolean,
    right: Boolean,
    sorting: Object,
    scroll: Object,
    selection: [String, Boolean]
  },
  data () {
    return {
      selected: false
    }
  },
  methods: {
    hidden (index) {
      if (this.right) {
        return this.cols.length - this.stickyCols > index
      }
      return index >= this.stickyCols
    },
    sort (col) {
      if (col.sort) {
        this.$emit('sort', col);
      }
    }
  },
  components: {
    SortIcon
  }
};

var StickyColumns = {
  computed: {
    leftStickyColumns () {
      let
        number = this.config.leftStickyColumns || 0,
        cols = number;

      for (let i = 0; i < cols; i++) {
        if (!this.columnSelection.includes(this.columns[i].field)) {
          number--;
        }
      }
      return number
    },
    rightStickyColumns () {
      let
        number = this.config.rightStickyColumns || 0,
        cols = number,
        length = this.columns.length;

      for (let i = 1; i <= cols; i++) {
        if (!this.columnSelection.includes(this.columns[length - i].field)) {
          number--;
        }
      }
      return number
    },
    regularCols () {
      return this.cols.slice(this.leftStickyColumns, this.cols.length - this.rightStickyColumns)
    },
    leftCols () {
      return Array.apply(null, Array(this.leftStickyColumns)).map((col, n) => this.cols[n])
    },
    rightCols () {
      return Array.apply(null, Array(this.rightStickyColumns)).map((col, n) => this.cols[this.cols.length - this.rightStickyColumns + n])
    }
  },
  components: {
    TableSticky
  }
};

var TableContent = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('table',{staticClass:"q-table horizontal-delimiter",style:(_vm.tableStyle)},[_c('colgroup',[(_vm.selection)?_c('col',{staticStyle:{"width":"45px"}}):_vm._e(),_vm._l((_vm.cols),function(col){return _c('col',{style:({width: col.width})})}),(_vm.head && _vm.scroll.horiz)?_c('col',{style:({width: _vm.scroll.horiz})}):_vm._e()],2),(_vm.head)?_c('thead',[_c('tr',[(_vm.selection)?_c('th',[_vm._v(" ")]):_vm._e(),_vm._l((_vm.cols),function(col){return _c('th',{class:{sortable: col.sort},on:{"click":function($event){_vm.sort(col);}}},[(col.sort)?_c('sort-icon',{attrs:{"field":col.field,"sorting":_vm.sorting}}):_vm._e(),_c('span',{domProps:{"innerHTML":_vm._s(col.label)}})],1)}),(_vm.head && _vm.scroll.horiz)?_c('th'):_vm._e()],2)]):_c('tbody',[_vm._t("default")],2)])},staticRenderFns: [],
  props: {
    cols: Array,
    head: Boolean,
    sorting: Object,
    scroll: Object,
    selection: [String, Boolean]
  },
  computed: {
    tableStyle () {
      return {
        width: this.head && this.vert ? `calc(100% - ${this.scroll.vert})` : '100%'
      }
    }
  },
  methods: {
    sort (col) {
      if (col.sort) {
        this.$emit('sort', col);
      }
    }
  },
  components: {
    SortIcon
  }
};

var DataTable = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-data-table"},[(_vm.hasToolbar && _vm.toolbar === '')?[_c('div',{staticClass:"q-data-table-toolbar upper-toolbar row reverse-wrap items-center justify-end"},[(_vm.config.title)?_c('div',{staticClass:"q-data-table-title ellipsis auto",domProps:{"innerHTML":_vm._s(_vm.config.title)}}):_vm._e(),_c('div',{staticClass:"row items-end"},[(_vm.config.refresh && !_vm.refreshing)?_c('button',{staticClass:"primary clear",on:{"click":_vm.refresh}},[_c('i',[_vm._v("refresh")])]):_vm._e(),_vm._v(" "),(_vm.refreshing)?_c('button',{staticClass:"disabled"},[_c('i',{staticClass:"animate-spin-reverse"},[_vm._v("cached")])]):_vm._e(),(_vm.config.columnPicker)?_c('q-select',{staticClass:"text-right",staticStyle:{"margin-left":"10px"},attrs:{"type":"toggle","options":_vm.columnSelectionOptions,"static-label":_vm.labels.columns},model:{value:(_vm.columnSelection),callback:function ($$v) {_vm.columnSelection=$$v;}}}):_vm._e()],1)])]:_vm._e(),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.toolbar === 'selection'),expression:"toolbar === 'selection'"}],staticClass:"q-data-table-toolbar upper-toolbar row reverse-wrap items-center justify-end q-data-table-selection"},[_c('div',{staticClass:"auto"},[_vm._v(_vm._s(_vm.rowsSelected)+" "),(_vm.rowsSelected === 1)?_c('span',[_vm._v(_vm._s(_vm.labels.selected.singular))]):_c('span',[_vm._v(_vm._s(_vm.labels.selected.plural))]),_vm._v(" "),_c('button',{staticClass:"primary clear small",on:{"click":function($event){_vm.clearSelection();}}},[_vm._v(_vm._s(_vm.labels.clear))])]),_c('div',[_vm._t("selection",null,{rows:_vm.selectedRows})],2)]),(_vm.filteringCols.length)?_c('table-filter',{attrs:{"filtering":_vm.filtering,"columns":_vm.filteringCols,"labels":_vm.labels}}):_vm._e(),(_vm.responsive)?[(_vm.message)?_c('div',{staticClass:"q-data-table-message row items-center justify-center",domProps:{"innerHTML":_vm._s(_vm.message)}}):_c('div',{staticStyle:{"overflow":"auto"},style:(_vm.bodyStyle)},[_c('table',{ref:"body",staticClass:"q-table horizontal-delimiter responsive"},[_c('tbody',_vm._l((_vm.rows),function(row,index){return _c('tr',[(_vm.config.selection)?_c('td',[(_vm.config.selection === 'multiple')?_c('q-checkbox',{model:{value:(_vm.rowSelection[index]),callback:function ($$v) {var $$exp = _vm.rowSelection, $$idx = index;if (!Array.isArray($$exp)){_vm.rowSelection[index]=$$v;}else{$$exp.splice($$idx, 1, $$v);}}}}):_c('q-radio',{attrs:{"val":index},model:{value:(_vm.rowSelection[0]),callback:function ($$v) {var $$exp = _vm.rowSelection, $$idx = 0;if (!Array.isArray($$exp)){_vm.rowSelection[0]=$$v;}else{$$exp.splice($$idx, 1, $$v);}}}})],1):_vm._e(),_vm._l((_vm.cols),function(col){return _c('td',{class:_vm.formatClass(col, row[col.field]),style:(_vm.formatStyle(col, row[col.field])),attrs:{"data-th":col.label}},[_vm._t('col-'+col.field,[_c('span',{domProps:{"innerHTML":_vm._s(_vm.format(row, col))}})],{row:row,col:col,data:row[col.field]})],2)})],2)}))])])]:_c('div',{staticClass:"q-data-table-container",on:{"mousewheel":_vm.mouseWheel,"dommousescroll":_vm.mouseWheel}},[(_vm.hasHeader)?_c('div',{ref:"head",staticClass:"q-data-table-head",style:({marginRight: _vm.scroll.vert})},[_c('table-content',{attrs:{"head":"","cols":_vm.cols,"sorting":_vm.sorting,"scroll":_vm.scroll,"selection":_vm.config.selection},on:{"sort":_vm.setSortField}})],1):_vm._e(),_c('div',{ref:"body",staticClass:"q-data-table-body",style:(_vm.bodyStyle),on:{"scroll":_vm.scrollHandler}},[(_vm.message)?_c('div',{staticClass:"q-data-table-message row items-center justify-center",domProps:{"innerHTML":_vm._s(_vm.message)}}):_c('table-content',{attrs:{"cols":_vm.cols,"selection":_vm.config.selection}},_vm._l((_vm.rows),function(row){return _c('tr',{style:(_vm.rowStyle)},[(_vm.config.selection)?_c('td'):_vm._e(),(_vm.leftStickyColumns)?_c('td',{attrs:{"colspan":_vm.leftStickyColumns}}):_vm._e(),_vm._l((_vm.regularCols),function(col){return _c('td',{class:_vm.formatClass(col, row[col.field]),style:(_vm.formatStyle(col, row[col.field]))},[_vm._t('col-'+col.field,[_c('span',{domProps:{"innerHTML":_vm._s(_vm.format(row, col))}})],{row:row,col:col,data:row[col.field]})],2)}),(_vm.rightStickyColumns)?_c('td',{attrs:{"colspan":_vm.rightStickyColumns}}):_vm._e()],2)}))],1),(!_vm.message && (_vm.leftStickyColumns || _vm.config.selection))?[_c('div',{ref:"stickyLeft",staticClass:"q-data-table-sticky-left",style:({bottom: _vm.scroll.horiz})},[_c('table-sticky',{attrs:{"no-header":!_vm.hasHeader,"sticky-cols":_vm.leftStickyColumns,"cols":_vm.cols,"sorting":_vm.sorting,"selection":_vm.config.selection}},_vm._l((_vm.rows),function(row,index){return _c('tr',{style:(_vm.rowStyle)},[(_vm.config.selection)?_c('td',[(_vm.config.selection === 'multiple')?_c('q-checkbox',{model:{value:(_vm.rowSelection[index]),callback:function ($$v) {var $$exp = _vm.rowSelection, $$idx = index;if (!Array.isArray($$exp)){_vm.rowSelection[index]=$$v;}else{$$exp.splice($$idx, 1, $$v);}}}}):_c('q-radio',{attrs:{"val":index},model:{value:(_vm.rowSelection[0]),callback:function ($$v) {var $$exp = _vm.rowSelection, $$idx = 0;if (!Array.isArray($$exp)){_vm.rowSelection[0]=$$v;}else{$$exp.splice($$idx, 1, $$v);}}}})],1):_vm._e(),_vm._l((_vm.leftCols),function(col){return _c('td',{class:_vm.formatClass(col, row[col.field]),style:(_vm.formatStyle(col, row[col.field]))},[_vm._t('col-'+col.field,[_c('span',{domProps:{"innerHTML":_vm._s(_vm.format(row, col))}})],{row:row,col:col,data:row[col.field]})],2)})],2)}))],1),(_vm.hasHeader)?_c('div',{staticClass:"q-data-table-sticky-left",style:({bottom: _vm.scroll.horiz})},[_c('table-sticky',{attrs:{"head":"","sticky-cols":_vm.leftStickyColumns,"scroll":_vm.scroll,"cols":_vm.cols,"sorting":_vm.sorting,"selection":_vm.config.selection},on:{"sort":_vm.setSortField}})],1):_vm._e()]:_vm._e(),(!_vm.message && _vm.rightStickyColumns)?[_c('div',{ref:"stickyRight",staticClass:"q-data-table-sticky-right",style:({right: _vm.scroll.vert, bottom: _vm.scroll.horiz})},[_c('table-sticky',{attrs:{"no-header":!_vm.hasHeader,"right":"","sticky-cols":_vm.rightStickyColumns,"cols":_vm.cols,"sorting":_vm.sorting,"selection":_vm.config.selection}},_vm._l((_vm.rows),function(row){return _c('tr',{style:(_vm.rowStyle)},[(_vm.config.selection)?_c('td',{staticClass:"invisible"}):_vm._e(),_c('td',{staticClass:"invisible",attrs:{"colspan":_vm.cols.length - _vm.rightStickyColumns}}),_vm._l((_vm.rightCols),function(col){return _c('td',{class:_vm.formatClass(col, row[col.field]),style:(_vm.formatStyle(col, row[col.field]))},[_vm._t('col-'+col.field,[_c('span',{domProps:{"innerHTML":_vm._s(_vm.format(row, col))}})],{row:row,col:col,data:row[col.field]})],2)})],2)}))],1),(_vm.hasHeader)?_c('div',{staticClass:"q-data-table-sticky-right",style:({right: _vm.scroll.vert})},[_c('table-sticky',{attrs:{"right":"","head":"","sticky-cols":_vm.rightStickyColumns,"scroll":_vm.scroll,"cols":_vm.cols,"sorting":_vm.sorting,"selection":_vm.config.selection},on:{"sort":_vm.setSortField}})],1):_vm._e()]:_vm._e()],2),(_vm.config.pagination)?_c('table-pagination',{attrs:{"pagination":_vm.pagination,"entries":_vm.pagination.entries,"labels":_vm.labels}}):_vm._e()],2)},staticRenderFns: [],
  mixins: [ColumnSelection, Filter, I18n, Pagination, Responsive, RowSelection, Scroll, Sort, StickyColumns],
  props: {
    data: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      selected: false,
      toolbar: '',
      refreshing: false
    }
  },
  computed: {
    rows () {
      let length = this.data.length;

      if (!length) {
        return []
      }

      let rows = Utils.clone(this.data);

      rows.forEach((row, i) => {
        row.__index = i;
      });

      if (this.filtering.terms) {
        rows = this.filter(rows);
      }

      if (this.sorting.field) {
        this.sort(rows);
      }

      this.pagination.entries = rows.length;
      if (this.pagination.rowsPerPage > 0) {
        rows = this.paginate(rows);
      }

      return rows
    },
    rowStyle () {
      if (this.config.rowHeight) {
        return {height: this.config.rowHeight}
      }
    },
    bodyStyle () {
      return this.config.bodyStyle || {}
    },
    hasToolbar () {
      return this.config.title || this.filteringCols.length || this.config.columnPicker || this.config.refresh
    },
    hasHeader () {
      return !this.config.noHeader
    }
  },
  methods: {
    resetBody () {
      let body = this.$refs.body;

      if (body) {
        body.scrollTop = 0;
      }
      this.pagination.page = 1;
    },
    format (row, col) {
      return col.format ? col.format(row[col.field], row) : row[col.field]
    },
    refresh (state) {
      if (state === false) {
        this.refreshing = false;
      }
      else if (state === true || !this.refreshing) {
        this.refreshing = true;
        this.$emit('refresh', () => {
          this.refreshing = false;
        });
      }
    },
    formatStyle (col, value) {
      return typeof col.style === 'function' ? col.style(value) : col.style
    },
    formatClass (col, value) {
      return typeof col.classes === 'function' ? col.classes(value) : col.classes
    }
  },
  components: {
    TableContent
  }
};

const input = {
  type: {
    type: String,
    default: 'date'
  },
  min: {
    type: String,
    default: ''
  },
  max: {
    type: String,
    default: ''
  },
  format: String,
  noClear: Boolean,
  clearLabel: {
    type: String,
    default: 'Clear'
  },
  okLabel: {
    type: String,
    default: 'Set'
  },
  cancelLabel: {
    type: String,
    default: 'Cancel'
  },
  defaultSelection: String,
  label: String,
  placeholder: String,
  staticLabel: String,
  readonly: Boolean,
  disable: Boolean
};

const inline = {
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'date',
    validator (value) {
      return ['date', 'time', 'datetime'].includes(value)
    }
  },
  min: {
    type: String,
    default: ''
  },
  max: {
    type: String,
    default: ''
  },
  readonly: Boolean,
  disable: Boolean
};

let contentCSS = {
  ios: {
    maxHeight: '80vh',
    height: 'auto',
    boxShadow: 'none',
    backgroundColor: '#e4e4e4'
  },
  mat: {
    maxWidth: '95vw',
    maxHeight: '98vh'
  }
};

var Datetime = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-picker-textfield',{attrs:{"disable":_vm.disable,"readonly":_vm.readonly,"label":_vm.label,"placeholder":_vm.placeholder,"static-label":_vm.staticLabel,"value":_vm.actualValue},nativeOn:{"click":function($event){_vm.__open($event);},"keydown":function($event){if(_vm._k($event.keyCode,"enter",13)){ return null; }_vm.open($event);}}},[(_vm.desktop)?_c('q-popover',{ref:"popup",attrs:{"disable":_vm.disable || _vm.readonly},on:{"open":function($event){_vm.__setModel();}}},[_c('q-inline-datetime',{staticClass:"no-border",attrs:{"type":_vm.type,"min":_vm.min,"max":_vm.max},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v;}}},[_c('div',{staticClass:"modal-buttons row full-width"},[(!_vm.noClear)?_c('button',{staticClass:"primary clear",domProps:{"innerHTML":_vm._s(_vm.clearLabel)},on:{"click":function($event){_vm.clear();}}}):_vm._e(),_c('div',{staticClass:"auto"}),_c('button',{staticClass:"primary clear",domProps:{"innerHTML":_vm._s(_vm.cancelLabel)},on:{"click":function($event){_vm.close();}}}),_vm._v(" "),_c('button',{staticClass:"primary clear",domProps:{"innerHTML":_vm._s(_vm.okLabel)},on:{"click":function($event){_vm.close(_vm.__update);}}})])])],1):_c('q-modal',{ref:"popup",staticClass:"with-backdrop",class:_vm.classNames,attrs:{"transition":_vm.transition,"position-classes":_vm.position,"content-css":_vm.css}},[_c('q-inline-datetime',{staticClass:"no-border full-width",attrs:{"type":_vm.type,"min":_vm.min,"max":_vm.max},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v;}}},[_c('div',{staticClass:"modal-buttons row full-width"},[(!_vm.noClear)?_c('button',{staticClass:"primary clear",domProps:{"innerHTML":_vm._s(_vm.clearLabel)},on:{"click":function($event){_vm.clear();}}}):_vm._e(),_c('div',{staticClass:"auto"}),_c('button',{staticClass:"primary clear",domProps:{"innerHTML":_vm._s(_vm.cancelLabel)},on:{"click":function($event){_vm.close();}}}),_vm._v(" "),_c('button',{staticClass:"primary clear",domProps:{"innerHTML":_vm._s(_vm.okLabel)},on:{"click":function($event){_vm.close(_vm.__update);}}})])])],1)],1)},staticRenderFns: [],
  props: extend({
    value: {
      type: String,
      required: true
    }
  }, input),
  data () {
    let data = Platform.is.desktop ? {} : {
      css: contentCSS[current],
      position: current === 'ios' ? 'items-end justify-center' : 'items-center justify-center',
      transition: current === 'ios' ? 'q-modal-bottom' : 'q-modal',
      classNames: current === 'ios' ? '' : 'minimized'
    };
    data.model = this.value;
    data.desktop = Platform.is.desktop;
    return data
  },
  computed: {
    actualValue () {
      let format;

      if (this.format) {
        format = this.format;
      }
      else if (this.type === 'date') {
        format = 'YYYY-MM-DD';
      }
      else if (this.type === 'time') {
        format = 'HH:mm';
      }
      else {
        format = 'YYYY-MM-DD HH:mm:ss';
      }

      return this.value ? moment(this.value).format(format) : ''
    }
  },
  watch: {
    min () {
      this.__normalizeAndEmit();
    },
    max () {
      this.__normalizeAndEmit();
    }
  },
  methods: {
    open () {
      if (!this.disable && !this.readonly) {
        this.__setModel();
        this.$refs.popup.open();
      }
    },
    close (fn) {
      this.$refs.popup.close(fn);
    },
    clear () {
      this.$refs.popup.close();
      this.$emit('input', '');
    },
    __open () {
      if (!this.desktop) {
        this.open();
      }
    },
    __normalizeValue (value) {
      if (this.min) {
        value = moment.max(moment(this.min).clone(), value);
      }
      if (this.max) {
        value = moment.min(moment(this.max).clone(), value);
      }
      return value
    },
    __setModel () {
      this.model = this.value || this.__normalizeValue(moment(this.defaultSelection)).format();
    },
    __update () {
      this.$emit('input', this.model);
    },
    __normalizeAndEmit () {
      this.$nextTick(() => {
        if (this.value) {
          this.$emit('input', this.__normalizeValue(moment(this.value)).format(this.format));
        }
      });
    }
  }
};

var DatetimeRange = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-datetime-range"},[_c('q-datetime',{class:_vm.className,style:(_vm.css),attrs:{"default-selection":_vm.defaultSelection,"type":_vm.type,"min":_vm.min,"max":_vm.model.to || _vm.max,"format":_vm.format,"no-clear":_vm.noClear,"clear-label":_vm.clearLabel,"ok-label":_vm.okLabel,"cancel-label":_vm.cancelLabel,"label":_vm.label,"placeholder":_vm.placeholder,"static-label":_vm.staticLabel,"readonly":_vm.readonly,"disable":_vm.disable},model:{value:(_vm.model.from),callback:function ($$v) {_vm.model.from=$$v;}}}),_c('q-datetime',{class:_vm.className,style:(_vm.css),attrs:{"default-selection":_vm.defaultSelection,"type":_vm.type,"min":_vm.model.from || _vm.min,"max":_vm.max,"format":_vm.format,"no-clear":_vm.noClear,"clear-label":_vm.clearLabel,"ok-label":_vm.okLabel,"cancel-label":_vm.cancelLabel,"label":_vm.label,"placeholder":_vm.placeholder,"static-label":_vm.staticLabel,"readonly":_vm.readonly,"disable":_vm.disable},model:{value:(_vm.model.to),callback:function ($$v) {_vm.model.to=$$v;}}})],1)},staticRenderFns: [],
  props: extend({
    value: {
      type: Object,
      validator (val) {
        if (typeof val.from !== 'string' || typeof val.to !== 'string') {
          console.error('DatetimeRange requires a valid {from, to} model.');
          return false
        }
        return true
      },
      required: true
    },
    className: [String, Object],
    css: [String, Object]
  }, input),
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value);
      }
    }
  }
};

function convertToAmPm (hour) {
  return hour === 0 ? 12 : (hour >= 13 ? hour - 12 : hour)
}

var InlineDatetimeMaterial = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-datetime inline column gt-md-row",class:{disabled: _vm.disable, readonly: _vm.readonly}},[(!_vm.value)?_c('div',{staticClass:"q-datetime-header column justify-center"},[_vm._v(" ")]):_c('div',{staticClass:"q-datetime-header column justify-center"},[(_vm.typeHasDate)?_c('div',[_c('div',{staticClass:"q-datetime-weekdaystring"},[_vm._v(_vm._s(_vm.weekDayString))]),_c('div',{staticClass:"q-datetime-datestring row gt-md-column items-center justify-center"},[_c('span',{staticClass:"q-datetime-link small",class:{active: _vm.view === 'month'},on:{"click":function($event){_vm.view = 'month';}}},[_vm._v(_vm._s(_vm.monthString)+" ")]),_c('span',{staticClass:"q-datetime-link",class:{active: _vm.view === 'day'},on:{"click":function($event){_vm.view = 'day';}}},[_vm._v(_vm._s(_vm.dayString)+" ")]),_c('span',{staticClass:"q-datetime-link small",class:{active: _vm.view === 'year'},on:{"click":function($event){_vm.view = 'year';}}},[_vm._v(_vm._s(_vm.year))])])]):_vm._e(),(_vm.typeHasTime)?_c('div',{staticClass:"q-datetime-time row gt-md-column items-center justify-center"},[_c('div',{staticClass:"q-datetime-clockstring"},[_c('span',{staticClass:"q-datetime-link",class:{active: _vm.view === 'hour'},on:{"click":function($event){_vm.view = 'hour';}}},[_vm._v(_vm._s(_vm.__pad(_vm.hour, '  '))+" ")]),_c('span',{staticStyle:{"opacity":"0.6"}},[_vm._v(":")]),_vm._v(" "),_c('span',{staticClass:"q-datetime-link",class:{active: _vm.view === 'minute'},on:{"click":function($event){_vm.view = 'minute';}}},[_vm._v(_vm._s(_vm.__pad(_vm.minute)))])]),_c('div',{staticClass:"q-datetime-ampm column justify-around"},[_c('div',{staticClass:"q-datetime-link",class:{active: _vm.am},on:{"click":function($event){_vm.toggleAmPm();}}},[_vm._v("AM")]),_c('div',{staticClass:"q-datetime-link",class:{active: !_vm.am},on:{"click":function($event){_vm.toggleAmPm();}}},[_vm._v("PM")])])]):_vm._e()]),_c('div',{staticClass:"q-datetime-content auto column"},[_c('div',{ref:"selector",staticClass:"q-datetime-selector auto row items-center justify-center"},[(_vm.view === 'year')?_c('div',{staticClass:"q-datetime-view-year full-width full-height"},_vm._l((_vm.yearInterval),function(n){return _c('button',{staticClass:"primary clear full-width",class:{active: n + _vm.yearMin === _vm.year},on:{"click":function($event){_vm.setYear(n + _vm.yearMin);}}},[_vm._v(_vm._s(n + _vm.yearMin))])})):_vm._e(),(_vm.view === 'month')?_c('div',{staticClass:"q-datetime-view-month full-width full-height"},_vm._l((_vm.monthInterval),function(index){return _c('button',{staticClass:"primary clear full-width",class:{active: _vm.month === index + _vm.monthMin},on:{"click":function($event){_vm.setMonth(index + _vm.monthMin, true);}}},[_vm._v(_vm._s(_vm.monthsList[index + _vm.monthMin - 1]))])})):_vm._e(),(_vm.view === 'day')?_c('div',{staticClass:"q-datetime-view-day q-datetime-animate"},[_c('div',{staticClass:"row items-center content-center"},[_c('button',{staticClass:"primary clear",on:{"click":function($event){_vm.setMonth(_vm.month - 1, true);}}},[_c('i',[_vm._v("keyboard_arrow_left")])]),_c('div',{staticClass:"auto"},[_vm._v(_vm._s(_vm.monthStamp))]),_c('button',{staticClass:"primary clear",on:{"click":function($event){_vm.setMonth(_vm.month + 1, true);}}},[_c('i',[_vm._v("keyboard_arrow_right")])])]),_c('div',{staticClass:"q-datetime-weekdays row items-center justify-start"},_vm._l((_vm.daysList),function(day){return _c('div',[_vm._v(_vm._s(day))])})),_c('div',{staticClass:"q-datetime-days row wrap items-center justify-start content-center"},[_vm._l((_vm.fillerDays),function(fillerDay){return _c('div',{staticClass:"q-datetime-fillerday"})}),_vm._l((_vm.beforeMinDays),function(fillerDay){return (_vm.min)?_c('div',{staticClass:"flex items-center content-center justify-center disabled"},[_vm._v(_vm._s(fillerDay))]):_vm._e()}),_vm._l((_vm.daysInterval),function(monthDay){return _c('div',{staticClass:"flex items-center content-center justify-center cursor-pointer",class:{active: _vm.value && monthDay === _vm.day},on:{"click":function($event){_vm.setDay(monthDay);}}},[_vm._v(_vm._s(monthDay))])}),_vm._l((_vm.aferMaxDays),function(fillerDay){return (_vm.max)?_c('div',{staticClass:"flex items-center content-center justify-center disabled"},[_vm._v(_vm._s(fillerDay + _vm.maxDay))]):_vm._e()})],2)]):_vm._e(),(_vm.view === 'hour' || _vm.view === 'minute')?_c('div',{ref:"clock",staticClass:"column items-center content-center justify-center"},[(_vm.view === 'hour')?_c('div',{staticClass:"q-datetime-clock cursor-pointer",on:{"mousedown":_vm.__dragStart,"mousemove":_vm.__dragMove,"mouseup":_vm.__dragStop,"touchstart":_vm.__dragStart,"touchmove":_vm.__dragMove,"touchend":_vm.__dragStop}},[_c('div',{staticClass:"q-datetime-clock-circle full-width full-height"},[_c('div',{staticClass:"q-datetime-clock-center"}),_c('div',{staticClass:"q-datetime-clock-pointer",class:{hidden: !_vm.value},style:(_vm.clockPointerStyle)},[_c('span')]),_vm._l((12),function(n){return _c('div',{staticClass:"q-datetime-clock-position",class:['q-datetime-clock-pos-' + n, _vm.value && n === _vm.hour ? 'active' : '']},[_vm._v(_vm._s(n))])})],2)]):_vm._e(),(_vm.view === 'minute')?_c('div',{staticClass:"q-datetime-clock cursor-pointer",on:{"mousedown":_vm.__dragStart,"mousemove":_vm.__dragMove,"mouseup":_vm.__dragStop,"touchstart":_vm.__dragStart,"touchmove":_vm.__dragMove,"touchend":_vm.__dragStop}},[_c('div',{staticClass:"q-datetime-clock-circle full-width full-height"},[_c('div',{staticClass:"q-datetime-clock-center"}),_c('div',{staticClass:"q-datetime-clock-pointer",style:(_vm.clockPointerStyle)},[_c('span')]),_vm._l((12),function(n){return _c('div',{staticClass:"q-datetime-clock-position",class:['q-datetime-clock-pos-' + (n - 1), (n - 1) * 5 === _vm.minute ? 'active' : '']},[_vm._v(_vm._s((n - 1) * 5))])})],2)]):_vm._e()]):_vm._e()]),_vm._t("default")],2)])},staticRenderFns: [],
  props: inline,
  data () {
    let view;

    switch (this.type) {
      case 'time':
        view = 'hour';
        break
      case 'date':
      default:
        view = 'day';
        break
    }

    this.$nextTick(() => {
      this.date = this.__normalizeValue(this.date);
    });
    return {
      view,
      date: moment(this.value || undefined),
      dragging: false,
      centerClockPosition: 0,
      firstDayOfWeek: moment.localeData().firstDayOfWeek(),
      daysList: moment.weekdaysShort(true),
      monthsList: moment.months()
    }
  },
  watch: {
    value (val) {
      if (!val) {
        this.view = ['date', 'datetime'].includes(this.type) ? 'day' : 'hour';
      }
    },
    model (value) {
      this.date = this.__normalizeValue(moment(value || undefined));
    },
    min () {
      this.$nextTick(() => {
        this.__updateModel();
      });
    },
    max () {
      this.$nextTick(() => {
        this.__updateModel();
      });
    },
    view (value) {
      if (value !== 'year' && value !== 'month') {
        return
      }

      let
        view = this.$refs.selector,
        rows = value === 'year' ? this.year - this.yearMin : this.month - this.monthMin;

      this.$nextTick(() => {
        view.scrollTop = rows * Utils.dom.height(view.children[0].children[0]) - Utils.dom.height(view) / 2.5;
      });
    }
  },
  computed: {
    model: {
      get () {
        return this.value || undefined
      },
      set (value) {
        this.$emit('input', value);
      }
    },
    pmin () {
      return this.min ? moment(this.min) : ''
    },
    pmax () {
      return this.max ? moment(this.max) : ''
    },
    typeHasDate () {
      return this.type === 'date' || this.type === 'datetime'
    },
    typeHasTime () {
      return this.type === 'time' || this.type === 'datetime'
    },

    year () {
      return this.date.year()
    },
    month () {
      return this.date.month() + 1
    },
    day () {
      return this.date.date()
    },
    dayString () {
      return this.date.format('Do')
    },
    monthString () {
      return this.date.format('MMM')
    },
    monthStamp () {
      return this.date.format('MMMM YYYY')
    },
    weekDayString () {
      return this.date.format('dddd')
    },

    yearInterval () {
      let
        min = this.pmin ? this.pmin.year() : 1950,
        max = this.pmax ? this.pmax.year() : 2050;
      return Math.max(1, max - min + 1)
    },
    yearMin () {
      return this.pmin ? this.pmin.year() - 1 : 1949
    },

    monthInterval () {
      let
        min = this.pmin && this.pmin.isSame(this.date, 'year') ? this.pmin.month() : 0,
        max = this.pmax && this.pmax.isSame(this.date, 'year') ? this.pmax.month() : 11;
      return Math.max(1, max - min + 1)
    },
    monthMin () {
      return this.pmin && this.pmin.isSame(this.date, 'year') ? this.pmin.month() : 0
    },

    fillerDays () {
      return Math.max(0, this.date.clone().date(1).day() - this.firstDayOfWeek)
    },
    beforeMinDays () {
      if (!this.pmin || this.pmin.month() !== this.date.month() || this.pmin.year() !== this.date.year()) {
        return false
      }
      return this.pmin.date() - 1
    },
    aferMaxDays () {
      if (!this.pmax || this.pmax.month() !== this.date.month() || this.pmax.year() !== this.date.year()) {
        return false
      }
      return this.daysInMonth - this.maxDay
    },
    maxDay () {
      return this.pmax ? this.pmax.date() : this.daysInMonth
    },
    daysInterval () {
      let max = !this.pmax || this.pmax.month() !== this.date.month() || this.pmax.year() !== this.date.year() ? 0 : this.daysInMonth - this.pmax.date();
      if (this.beforeMinDays || max) {
        let min = this.beforeMinDays ? this.beforeMinDays + 1 : 1;
        return Array.apply(null, {length: this.daysInMonth - min - max + 1}).map((day, index) => {
          return index + min
        })
      }
      return this.daysInMonth
    },
    daysInMonth () {
      return this.date.daysInMonth()
    },

    hour () {
      return convertToAmPm(this.date.hour())
    },
    minute () {
      return this.date.minute()
    },
    am () {
      return this.date.hour() <= 11
    },
    clockPointerStyle () {
      let
        divider = this.view === 'minute' ? 60 : 12,
        degrees = Math.round((this.view === 'minute' ? this.minute : this.hour) * (360 / divider)) - 180;

      return {
        '-webkit-transform': 'rotate(' + degrees + 'deg)',
        '-ms-transform': 'rotate(' + degrees + 'deg)',
        'transform': 'rotate(' + degrees + 'deg)'
      }
    },
    editable () {
      return !this.disable && !this.readonly
    }
  },
  methods: {
    /* date */
    setYear (value) {
      if (!this.editable) {
        return
      }
      this.date.year(this.__parseTypeValue('year', value));
      this.__updateModel();
    },
    setMonth (value, force) {
      if (!this.editable) {
        return
      }
      this.date.month((force ? value : this.__parseTypeValue('month', value)) - 1);
      this.__updateModel();
    },
    setDay (value) {
      if (!this.editable) {
        return
      }
      this.date.date(this.__parseTypeValue('date', value));
      this.__updateModel();
    },

    /* time */
    toggleAmPm () {
      if (!this.editable) {
        return
      }
      let
        hour = this.date.hour(),
        offset = this.am ? 12 : -12;

      this.date.hour(hour + offset);
      this.__updateModel();
    },
    setHour (value) {
      if (!this.editable) {
        return
      }
      value = this.__parseTypeValue('hour', value) % 12;

      if (!this.am) {
        value += 12;
      }

      this.date.hour(value);
      this.__updateModel();
    },
    setMinute (value) {
      if (!this.editable) {
        return
      }
      this.date.minute(this.__parseTypeValue('minute', value));
      this.__updateModel();
    },

    /* helpers */
    __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __dragStart (ev) {
      ev.stopPropagation();
      ev.preventDefault();

      let
        clock = this.$refs.clock,
        clockOffset = Utils.dom.offset(clock);

      this.centerClockPosition = {
        top: clockOffset.top + Utils.dom.height(clock) / 2,
        left: clockOffset.left + Utils.dom.width(clock) / 2
      };

      this.dragging = true;
      this.__updateClock(ev);
    },
    __dragMove (ev) {
      if (!this.dragging) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.__updateClock(ev);
    },
    __dragStop (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      this.dragging = false;
    },
    __updateClock (ev) {
      let
        position = Utils.event.position(ev),
        height = Math.abs(position.top - this.centerClockPosition.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(position.top - this.centerClockPosition.top), 2) +
          Math.pow(Math.abs(position.left - this.centerClockPosition.left), 2)
        ),
        angle = Math.asin(height / distance) * (180 / Math.PI);

      if (position.top < this.centerClockPosition.top) {
        angle = this.centerClockPosition.left < position.left ? 90 - angle : 270 + angle;
      }
      else {
        angle = this.centerClockPosition.left < position.left ? angle + 90 : 270 - angle;
      }

      if (this.view === 'hour') {
        this.setHour(Math.round(angle / 30));
      }
      else {
        this.setMinute(Math.round(angle / 6));
      }
    },
    __parseTypeValue (type, value) {
      if (type === 'month') {
        return Utils.format.between(value, 1, 12)
      }
      if (type === 'date') {
        return Utils.format.between(value, 1, this.daysInMonth)
      }
      if (type === 'year') {
        return Utils.format.between(value, 1950, 2050)
      }
      if (type === 'hour') {
        return Utils.format.between(value, 0, 23)
      }
      if (type === 'minute') {
        return Utils.format.between(value, 0, 59)
      }
    },

    /* common */
    __normalizeValue (value) {
      if (this.pmin) {
        value = moment.max(this.pmin.clone(), value);
      }
      if (this.pmax) {
        value = moment.min(this.pmax.clone(), value);
      }
      return value
    },
    __updateModel () {
      if (this.date) {
        this.date = this.__normalizeValue(this.date);
        this.model = this.date.toISOString();
      }
    }
  }
};

var InlineDatetimeIOS = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-datetime",class:['type-' + _vm.type, _vm.disable ? 'disabled' : '', _vm.readonly ? 'readonly' : '']},[_vm._t("default"),_c('div',{staticClass:"q-datetime-content non-selectable"},[_c('div',{staticClass:"q-datetime-inner full-height flex justify-center"},[(_vm.typeHasDate)?[_c('div',{staticClass:"q-datetime-col q-datetime-col-month",on:{"touchstart":function($event){_vm.__dragStart($event, 'month');},"touchmove":function($event){_vm.__dragMove($event, 'month');},"touchend":function($event){_vm.__dragStop($event, 'month');}}},[_c('div',{ref:"month",staticClass:"q-datetime-col-wrapper",style:(_vm.__monthStyle)},_vm._l((_vm.monthInterval),function(index){return _c('div',{staticClass:"q-datetime-item",on:{"click":function($event){_vm.setMonth(index + _vm.monthMin);}}},[_vm._v(_vm._s(_vm.monthsList[index + _vm.monthMin - 1]))])}))]),_c('div',{staticClass:"q-datetime-col q-datetime-col-day",on:{"touchstart":function($event){_vm.__dragStart($event, 'date');},"touchmove":function($event){_vm.__dragMove($event, 'date');},"touchend":function($event){_vm.__dragStop($event, 'date');}}},[_c('div',{ref:"date",staticClass:"q-datetime-col-wrapper",style:(_vm.__dayStyle)},_vm._l((_vm.daysInterval),function(index){return _c('div',{staticClass:"q-datetime-item",on:{"click":function($event){_vm.setDay(index + _vm.dayMin - 1);}}},[_vm._v(_vm._s(index + _vm.dayMin - 1))])}))]),_c('div',{staticClass:"q-datetime-col q-datetime-col-year",on:{"touchstart":function($event){_vm.__dragStart($event, 'year');},"touchmove":function($event){_vm.__dragMove($event, 'year');},"touchend":function($event){_vm.__dragStop($event, 'year');}}},[_c('div',{ref:"year",staticClass:"q-datetime-col-wrapper",style:(_vm.__yearStyle)},_vm._l((_vm.yearInterval),function(n){return _c('div',{staticClass:"q-datetime-item",on:{"click":function($event){_vm.setYear(n + _vm.yearMin);}}},[_vm._v(_vm._s(n + _vm.yearMin))])}))])]:_vm._e(),(_vm.typeHasTime)?[_c('div',{staticClass:"q-datetime-col q-datetime-col-hour",on:{"touchstart":function($event){_vm.__dragStart($event, 'hour');},"touchmove":function($event){_vm.__dragMove($event, 'hour');},"touchend":function($event){_vm.__dragStop($event, 'hour');}}},[_c('div',{ref:"hour",staticClass:"q-datetime-col-wrapper",style:(_vm.__hourStyle)},_vm._l((_vm.hourInterval),function(n){return _c('div',{staticClass:"q-datetime-item",on:{"click":function($event){_vm.setHour(n + _vm.hourMin - 1);}}},[_vm._v(_vm._s(n + _vm.hourMin - 1))])}))]),_vm._m(0),_c('div',{staticClass:"q-datetime-col q-datetime-col-minute",on:{"touchstart":function($event){_vm.__dragStart($event, 'minute');},"touchmove":function($event){_vm.__dragMove($event, 'minute');},"touchend":function($event){_vm.__dragStop($event, 'minute');}}},[_c('div',{ref:"minute",staticClass:"q-datetime-col-wrapper",style:(_vm.__minuteStyle)},_vm._l((_vm.minuteInterval),function(n){return _c('div',{staticClass:"q-datetime-item",on:{"click":function($event){_vm.setMinute(n + _vm.minuteMin - 1);}}},[_vm._v(_vm._s(_vm.__pad(n + _vm.minuteMin - 1)))])}))])]:_vm._e(),_c('div',{staticClass:"q-datetime-highlight row items-center justify-center",class:{'q-datetime-no-selection': !_vm.value}},[(!_vm.value && _vm.typeHasDate)?[_c('div',{staticClass:"q-datetime-col-month"},[_vm._v("-----")]),_c('div',{staticClass:"q-datetime-col-day"},[_vm._v("--")]),_c('div',{staticClass:"q-datetime-col-year"},[_vm._v("----")])]:_vm._e(),(!_vm.value && _vm.typeHasTime)?[_c('div',{staticClass:"q-datetime-col-hour"},[_vm._v("--")]),_c('div',{staticClass:"q-datetime-col-minute"},[_vm._v("--")])]:_vm._e()],2)],2),_c('div',{staticClass:"q-datetime-mask"})])],2)},staticRenderFns: [function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-datetime-col-divider"},[_c('div',{staticClass:"q-datetime-col-wrapper full-height row items-center justify-center"},[_c('div',[_vm._v(":")])])])}],
  props: inline,
  data () {
    this.$nextTick(() => {
      this.date = this.__normalizeValue(this.date);
    });
    return {
      date: moment(this.value || undefined),
      monthDragOffset: 0,
      dateDragOffset: 0,
      yearDragOffset: 0,
      hourDragOffset: 0,
      minuteDragOffset: 0,
      monthsList: moment.months(),
      dragging: false
    }
  },
  watch: {
    model (value) {
      this.date = this.__normalizeValue(moment(value || undefined));
      this.__updateAllPositions();
    },
    min (value) {
      this.$nextTick(() => {
        this.__updateModel();
        this.__updateAllPositions();
      });
    },
    max (value) {
      this.$nextTick(() => {
        this.__updateModel();
        this.__updateAllPositions();
      });
    }
  },
  computed: {
    model: {
      get () {
        return this.value || undefined
      },
      set (value) {
        this.$emit('input', value);
      }
    },
    pmin () {
      return this.min ? moment(this.min) : false
    },
    pmax () {
      return this.max ? moment(this.max) : false
    },
    typeHasDate () {
      return this.type === 'date' || this.type === 'datetime'
    },
    typeHasTime () {
      return this.type === 'time' || this.type === 'datetime'
    },

    year () {
      return this.date.year()
    },
    yearInterval () {
      let
        min = this.pmin ? this.pmin.year() : 1950,
        max = this.pmax ? this.pmax.year() : 2050;
      return Math.max(1, max - min + 1)
    },
    yearMin () {
      return this.pmin ? this.pmin.year() - 1 : 1949
    },

    month () {
      return this.date.month() + 1
    },
    monthInterval () {
      let
        min = this.pmin && this.pmin.isSame(this.date, 'year') ? this.pmin.month() : 0,
        max = this.pmax && this.pmax.isSame(this.date, 'year') ? this.pmax.month() : 11;
      return Math.max(1, max - min + 1)
    },
    monthMin () {
      return this.pmin && this.pmin.year() === this.date.year() ? this.pmin.month() : 0
    },

    day () {
      return this.date.date()
    },
    dayMin () {
      return this.pmin && this.pmin.isSame(this.date, 'month') ? this.pmin.date() : 1
    },
    dayMax () {
      return this.pmax && this.pmax.isSame(this.date, 'month') ? this.pmax.date() : this.daysInMonth
    },
    daysInterval () {
      return this.dayMax - this.dayMin + 1
    },
    daysInMonth () {
      return this.date.daysInMonth()
    },

    hour () {
      return this.date.hour()
    },
    hourMin () {
      return this.pmin && this.pmin.isSame(this.date, 'day') ? this.pmin.hour() : 0
    },
    hourInterval () {
      return (this.pmax && this.pmax.isSame(this.date, 'day') ? this.pmax.hour() : 23) - this.hourMin + 1
    },

    minute () {
      return this.date.minute()
    },
    minuteMin () {
      return this.pmin && this.pmin.isSame(this.date, 'hour') ? this.pmin.minute() : 0
    },
    minuteInterval () {
      return (this.pmax && this.pmax.isSame(this.date, 'hour') ? this.pmax.minute() : 59) - this.minuteMin + 1
    },

    __monthStyle () {
      return this.__colStyle(82 - (this.month - 1 + this.monthDragOffset) * 36)
    },
    __dayStyle () {
      return this.__colStyle(82 - (this.day + this.dateDragOffset) * 36)
    },
    __yearStyle () {
      return this.__colStyle(82 - (this.year + this.yearDragOffset) * 36)
    },
    __hourStyle () {
      return this.__colStyle(82 - (this.hour + this.hourDragOffset) * 36)
    },
    __minuteStyle () {
      return this.__colStyle(82 - (this.minute + this.minuteDragOffset) * 36)
    },
    editable () {
      return !this.disable && !this.readonly
    }
  },
  methods: {
    /* date */
    setYear (value) {
      if (this.editable) {
        this.date.year(this.__parseTypeValue('year', value));
        this.__updateModel();
      }
    },
    setMonth (value) {
      if (this.editable) {
        this.date.month(this.__parseTypeValue('month', value) - 1);
        this.__updateModel();
      }
    },
    setDay (value) {
      if (this.editable) {
        this.date.date(this.__parseTypeValue('date', value));
        this.__updateModel();
      }
    },

    /* time */
    setHour (value) {
      if (this.editable) {
        this.date.hour(this.__parseTypeValue('hour', value));
        this.__updateModel();
      }
    },
    setMinute (value) {
      if (this.editable) {
        this.date.minute(this.__parseTypeValue('minute', value));
        this.__updateModel();
      }
    },

    /* helpers */
    __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __parseTypeValue (type, value) {
      if (type === 'month') {
        return Utils.format.between(value, 1, 12)
      }
      if (type === 'date') {
        return Utils.format.between(value, 1, this.daysInMonth)
      }
      if (type === 'year') {
        return Utils.format.between(value, 1950, 2050)
      }
      if (type === 'hour') {
        return Utils.format.between(value, 0, 23)
      }
      if (type === 'minute') {
        return Utils.format.between(value, 0, 59)
      }
    },
    __updateAllPositions () {
      this.$nextTick(() => {
        if (this.typeHasDate) {
          this.__updatePositions('month', this.date.month());
          this.__updatePositions('date', this.date.date());
          this.__updatePositions('year', this.date.year());
        }
        if (this.typeHasTime) {
          this.__updatePositions('hour', this.date.hour());
          this.__updatePositions('minute', this.date.minute());
        }
      });
    },
    __updatePositions (type, value) {
      let root = this.$refs[type];
      if (!root) {
        return
      }

      let delta = -value;
      if (type === 'year') {
        delta += this.yearMin + 1;
      }
      else if (type === 'date') {
        delta += this.dayMin;
      }
      else {
        delta += this[type + 'Min'];
      }

      [].slice.call(root.children).forEach(item => {
        Utils.dom.css(item, this.__itemStyle(value * 36, Utils.format.between(delta * -18, -180, 180)));
        delta++;
      });
    },
    __colStyle (value) {
      return {
        '-webkit-transform': 'translate3d(0,' + value + 'px,0)',
        '-ms-transform': 'translate3d(0,' + value + 'px,0)',
        'transform': 'translate3d(0,' + value + 'px,0)'
      }
    },
    __itemStyle (translation, rotation) {
      return {
        '-webkit-transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)',
        '-ms-transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)',
        'transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)'
      }
    },

    /* common */
    __dragStart (ev, type) {
      if (!this.editable) {
        return
      }

      this.__dragCleanup()
      ;['month', 'date', 'year', 'hour', 'minute'].forEach(type => {
        this[type + 'DragOffset'] = 0;
      });
      ev.stopPropagation();
      ev.preventDefault();

      if (!this.value) {
        this.__updateModel();
      }

      this.dragging = type;
      this.__dragPosition = Utils.event.position(ev).top;
    },
    __dragMove (ev, type) {
      if (this.dragging !== type || !this.editable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this[type + 'DragOffset'] = (this.__dragPosition - Utils.event.position(ev).top) / 36;
      this.__updatePositions(type, this.date[type]() + this[type + 'DragOffset']);
    },
    __dragStop (ev, type) {
      if (this.dragging !== type || !this.editable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.dragging = false;

      let
        offset = Math.round(this[type + 'DragOffset']),
        newValue = this.__parseTypeValue(type, this[type === 'date' ? 'day' : type] + offset),
        actualType = type === 'date' ? 'day' : type;

      if (newValue !== this[actualType]) {
        this['set' + actualType.charAt(0).toUpperCase() + actualType.slice(1)](newValue);
        this[type + 'DragOffset'] = 0;
      }
      else {
        this.__updatePositions(type, this.date[type]());
        this.timeout = setTimeout(() => {
          this[type + 'DragOffset'] = 0;
        }, 150);
      }
    },
    __dragCleanup () {
      clearTimeout(this.timeout);
      this.timeout = null;
    },
    __normalizeValue (value) {
      if (this.pmin) {
        value = moment.max(this.pmin.clone(), value);
      }
      if (this.pmax) {
        value = moment.min(this.pmax.clone(), value);
      }
      return value
    },
    __updateModel () {
      if (this.date) {
        this.date = this.__normalizeValue(this.date);
        this.model = this.date.toISOString();
      }
    }
  },
  mounted () {
    this.__updateAllPositions();
  },
  beforeDestroy () {
    this.__dragCleanup();
  }
};

var Drawer = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"drawer",class:{'left-side': !_vm.rightSide, 'right-side': _vm.rightSide, active: _vm.active, 'swipe-only': _vm.swipeOnly}},[_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__openByTouch),expression:"__openByTouch",modifiers:{"horizontal":true}}],staticClass:"drawer-opener touch-only mobile-only",class:{'fixed-left': !_vm.rightSide, 'fixed-right': _vm.rightSide}},[_vm._v(" ")]),_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__closeByTouch),expression:"__closeByTouch",modifiers:{"horizontal":true}}],ref:"backdrop",staticClass:"drawer-backdrop fullscreen",style:(_vm.backdropStyle),on:{"click":function($event){_vm.setState(false);}}}),_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__closeByTouch),expression:"__closeByTouch",modifiers:{"horizontal":true}}],ref:"content",staticClass:"drawer-content",class:{'left-side': !_vm.rightSide, 'right-side': _vm.rightSide},style:(_vm.nodeStyle)},[_vm._t("default")],2)])},staticRenderFns: [],
  props: {
    rightSide: Boolean,
    swipeOnly: Boolean,
    backdropOpacity: {
      type: Number,
      validator (v) {
        return v >= 0 && v <= 1
      },
      default: current === 'ios' ? 0.2 : 0.7
    }
  },
  data () {
    return {
      active: false,
      opened: false,
      nodePosition: 0,
      backPosition: 0,
      nodeAnimUid: Utils.uid(),
      backAnimUid: Utils.uid()
    }
  },
  computed: {
    nodeStyle () {
      let css = Utils.dom.cssTransform(`translateX(${this.nodePosition}px)`);
      if (this.$q.theme === 'ios') {
        if (this.layoutContainer) {
          Utils.dom.css(this.layoutContainer, css);
        }
        return
      }
      return css
    },
    backdropStyle () {
      return {background: `rgba(0,0,0,${this.backPosition})`}
    }
  },
  watch: {
    active (val) {
      document.body.classList[val ? 'add' : 'remove']('with-drawer-opened');
    }
  },
  methods: {
    __animate (done) {
      let finalPos;
      const complete = () => {
        if (!this.opened) {
          this.active = false;
        }
        if (typeof done === 'function') {
          done();
        }
      };

      if (this.$q.theme === 'ios') {
        finalPos = this.opened ? (this.rightSide ? -1 : 1) * this.width : 0;
      }
      else {
        finalPos = this.opened ? 0 : (this.rightSide ? 1 : -1) * this.width;
      }

      if (this.opened) {
        this.active = true;
        if (this.$q.platform.has.popstate) {
          if (!window.history.state) {
            window.history.replaceState({__quasar_drawer: true}, '');
          }
          else {
            window.history.state.__quasar_drawer = true;
          }
          let state = window.history.state || {};
          state.__quasar_drawer = true;
          window.history.replaceState(state, '');
          window.history.pushState({}, '');
          window.addEventListener('popstate', this.__popState);
        }
      }
      else {
        if (this.$q.platform.has.popstate) {
          window.removeEventListener('popstate', this.__popState);
          if (window.history.state && !window.history.state.__quasar_drawer) {
            window.history.go(-1);
          }
        }
      }

      Utils.animate({
        name: this.backAnimUid,
        pos: this.backPosition,
        finalPos: this.opened ? this.backdropOpacity : 0,
        apply: (pos) => {
          this.backPosition = pos;
        },
        threshold: 0.01
      });
      Utils.animate({
        name: this.nodeAnimUid,
        pos: this.nodePosition,
        finalPos,
        apply: (pos) => {
          this.nodePosition = pos;
        },
        done: complete
      });
    },
    __openByTouch (evt) {
      const content = this.$refs.content;

      // on iOS platform it interferes with browser's back/forward swipe feature
      if (this.$q.platform.is.ios || Utils.dom.style(content, 'position') !== 'fixed') {
        return
      }

      let
        position = evt.distance.x,
        percentage;

      if (evt.isFinal) {
        this.opened = position > 75;
      }

      if (this.$q.theme === 'ios') {
        position = Math.min(position, this.width);
        percentage = 1.0 - (this.width - Math.abs(position)) / this.width;
        position = (this.rightSide ? -1 : 1) * position;
      }
      else { // mat
        position = this.rightSide ? Math.max(this.width - position, 0) : Math.min(0, position - this.width);
        percentage = (this.width - Math.abs(position)) / this.width;
      }

      if (evt.isFirst) {
        this.active = true;
      }
      this.nodePosition = position;
      this.backPosition = percentage * this.backdropOpacity;

      if (evt.isFinal) {
        this.__animate();
      }
    },
    __closeByTouch (evt) {
      const content = this.$refs.content;
      let percentage, position, initialPosition;

      if (Utils.dom.style(content, 'position') !== 'fixed') {
        return
      }

      initialPosition = (this.rightSide ? -1 : 1) * this.width;
      position = this.rightSide
        ? Utils.format.between((evt.direction === 'left' ? -1 : 1) * evt.distance.x, 0, this.width)
        : Utils.format.between((evt.direction === 'left' ? -1 : 1) * evt.distance.x, -this.width, 0);

      if (evt.isFinal) {
        this.opened = Math.abs(position) <= 75;
      }

      if (this.$q.theme === 'ios') {
        position = initialPosition + position;
        percentage = (this.rightSide ? -1 : 1) * position / this.width;
      }
      else { // mat
        percentage = 1 + (this.rightSide ? -1 : 1) * position / this.width;
      }

      this.nodePosition = position;
      this.backPosition = percentage * this.backdropOpacity;

      if (evt.isFinal) {
        this.__animate();
      }
    },
    setState (state, done) {
      if (this.active === state || this.active !== this.opened) {
        return
      }

      this.opened = !this.opened;
      this.active = true;
      this.__animate(done);
    },
    __popState () {
      if (this.$q.platform.has.popstate && window.history.state && window.history.state.__quasar_drawer) {
        this.setState(false);
      }
    },
    open (done) {
      this.setState(true, done);
    },
    close (done) {
      this.setState(false, done);
    },
    toggle (done) {
      this.setState(!this.opened, done);
    }
  },
  mounted () {
    this.$nextTick(() => {
      const content = this.$refs.content;
      this.width = Utils.dom.width(content);

      if (this.$q.theme === 'ios') {
        this.layoutContainer = this.$el.closest('.layout') || document.getElementById('q-app');
      }
      else {
        this.nodePosition = this.width * (this.rightSide ? 1 : -1);
      }

      [].slice.call(content.getElementsByClassName('drawer-closer')).forEach(el => {
        el.addEventListener('click', (event) => {
          event.stopPropagation();
          this.setState(false);
        });
      });
    });
  },
  beforeDestroy () {
    this.setState(false);
  }
};

var DrawerLink = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"link",rawName:"v-link.delay",value:(_vm.to),expression:"to",modifiers:{"delay":true}}],staticClass:"item item-link drawer-closer"},[(_vm.icon)?_c('i',{staticClass:"item-primary"},[_vm._v(_vm._s(_vm.icon))]):_vm._e(),_c('div',{staticClass:"item-content"},[_vm._t("default")],2)])},staticRenderFns: [],
  props: {
    icon: String,
    to: {
      type: [Object, String],
      required: true
    }
  }
};

function iosFixNeeded (el) {
  if (Platform.is.mobile && Platform.is.ios) {
    const style = window.getComputedStyle(el);
    return ['fixed', 'absolute'].includes(style.position)
  }
}

var Fab = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-fab flex inline justify-center",class:{opened: _vm.opened}},[_c('div',{staticClass:"backdrop animate-fade",style:(_vm.backdropPosition),on:{"click":function($event){_vm.toggle(true);}}}),_c('button',{staticClass:"circular raised",class:_vm.classNames,on:{"click":function($event){_vm.toggle();}}},[_c('i',{staticClass:"q-fab-icon"},[_vm._v(_vm._s(_vm.icon))]),_vm._v(" "),_c('i',{staticClass:"q-fab-active-icon"},[_vm._v(_vm._s(_vm.activeIcon))])]),_c('div',{staticClass:"q-fab-actions flex inline items-center",class:[_vm.direction]},[_vm._t("default")],2)])},staticRenderFns: [],
  props: {
    classNames: {
      default: 'primary'
    },
    icon: {
      type: String,
      default: 'add'
    },
    activeIcon: {
      type: String,
      default: 'close'
    },
    direction: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      opened: false,
      backdrop: {
        top: 0,
        left: 0
      },
      mounted: false
    }
  },
  methods: {
    open () {
      this.opened = true;
      this.__repositionBackdrop();
    },
    close (fn) {
      this.opened = false;
      if (typeof fn === 'function') {
        fn();
      }
    },
    toggle (fromBackdrop) {
      this.opened = !this.opened;

      if (iosFixNeeded(this.$el)) {
        this.__repositionBackdrop();
      }

      if (!fromBackdrop && !this.opened) {
        this.$emit('click');
      }
    },
    __repositionBackdrop () {
      const {top, left} = Utils.dom.offset(this.$el);
      this.backdrop.top = top;
      this.backdrop.left = left;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.mounted = true;
    });
  },
  computed: {
    backdropPosition () {
      if (this.mounted && iosFixNeeded(this.$el)) {
        return Utils.dom.cssTransform(`translate3d(${-this.backdrop.left}px, ${-this.backdrop.top}px, 0)`)
      }
    }
  }
};

var SmallFab = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('button',{staticClass:"circular small raised",on:{"click":function($event){_vm.$parent.close();}}},[_c('i',[_vm._v(_vm._s(_vm.icon))]),_vm._t("default")],2)},staticRenderFns: [],
  props: {
    icon: {
      type: String,
      required: true
    }
  }
};

var Gallery = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-gallery"},_vm._l((_vm.src),function(img,index){return _c('div',{key:img,style:({width: _vm.width})},[_c('img',{attrs:{"src":img}})])}))},staticRenderFns: [],
  props: {
    src: {
      type: Array,
      required: true
    },
    width: {
      type: String,
      default: '150px'
    }
  }
};

var sliderMixin = {
  props: {
    arrows: Boolean,
    dots: Boolean,
    fullscreen: Boolean,
    infinite: Boolean,
    actions: Boolean,
    animation: {
      type: Boolean,
      default: true
    },
    autoplay: [Number, Boolean]
  }
};

var GallerySlider = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-slider',{ref:"slider",staticClass:"text-white bg-black q-gallery-slider",attrs:{"dots":_vm.dots,"arrows":_vm.arrows,"fullscreen":_vm.fullscreen,"infinite":_vm.infinite,"actions":"","animation":_vm.animation,"autoplay":_vm.autoplay},on:{"slide":_vm.__updateCurrentSlide}},[_vm._l((_vm.src),function(img,index){return _c('div',{key:img,staticClass:"no-padding flex items-center justify-center",slot:"slide"},[_c('div',{staticClass:"full-width"},[_c('img',{attrs:{"src":img}})])])}),_c('div',{staticClass:"q-gallery-slider-overlay",class:{active: _vm.quickView},on:{"click":function($event){_vm.toggleQuickView();}}}),_c('i',{on:{"click":function($event){_vm.toggleQuickView();}},slot:"action"},[_vm._v("view_carousel")]),_c('div',{staticClass:"q-gallery-slider-quickview",class:{active: _vm.quickView}},_vm._l((_vm.src),function(img,index){return _c('div',{key:img},[_c('img',{class:{active: _vm.currentSlide === index},attrs:{"src":img},on:{"click":function($event){_vm.__selectImage(index);}}})])}))],2)},staticRenderFns: [],
  mixins: [sliderMixin],
  props: {
    src: {
      type: Array,
      required: true
    },
    arrows: {
      type: Boolean,
      default: true
    },
    actions: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      quickView: false,
      currentSlide: 0
    }
  },
  methods: {
    toggleQuickView () {
      this.quickView = !this.quickView;
    },
    goToSlide (index, noAnimation) {
      this.$refs.slider.goToSlide(index, noAnimation);
    },
    __selectImage (index) {
      this.goToSlide(index, true);
      this.toggleQuickView();
    },
    __updateCurrentSlide (value) {
      this.currentSlide = value;
      this.$emit('slide', value);
    }
  }
};

var InfiniteScroll = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-infinite-scroll"},[_c('div',{ref:"content",staticClass:"q-infinite-scroll-content"},[_vm._t("default")],2),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.fetching),expression:"fetching"}],staticClass:"q-infinite-scroll-message"},[_vm._t("message")],2)])},staticRenderFns: [],
  props: {
    handler: {
      type: Function,
      required: true
    },
    inline: Boolean,
    offset: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      index: 0,
      fetching: false,
      working: true
    }
  },
  methods: {
    poll () {
      if (this.fetching || !this.working) {
        return
      }

      let
        containerHeight = Utils.dom.height(this.scrollContainer),
        containerBottom = Utils.dom.offset(this.scrollContainer).top + containerHeight,
        triggerPosition = Utils.dom.offset(this.element).top + Utils.dom.height(this.element) - (this.offset || containerHeight);

      if (triggerPosition < containerBottom) {
        this.loadMore();
      }
    },
    loadMore () {
      if (this.fetching || !this.working) {
        return
      }

      this.index++;
      this.fetching = true;
      this.handler(this.index, stopLoading => {
        this.fetching = false;
        if (stopLoading) {
          this.stop();
          return
        }
        if (this.element.closest('body')) {
          this.poll();
        }
      });
    },
    reset () {
      this.index = 0;
    },
    resume () {
      this.working = true;
      this.scrollContainer.addEventListener('scroll', this.poll);
      this.poll();
    },
    stop () {
      this.working = false;
      this.scrollContainer.removeEventListener('scroll', this.poll);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.poll = Utils.debounce(this.poll, 50);
      this.element = this.$refs.content;

      this.scrollContainer = this.inline ? this.$el : Utils.dom.getScrollTarget(this.$el);
      if (this.working) {
        this.scrollContainer.addEventListener('scroll', this.poll);
      }

      this.poll();
    });
  },
  beforeDestroy () {
    this.scrollContainer.removeEventListener('scroll', this.poll);
  }
};

var Knob = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-knob non-selectable",class:{disabled: _vm.disable, 'cursor-pointer': !_vm.readonly},on:{"mousedown":_vm.__dragStart,"mousemove":_vm.__dragMove,"mouseup":_vm.__dragStop,"touchstart":_vm.__dragStart,"touchmove":_vm.__dragMove,"touchend":_vm.__dragStop}},[_c('div',{style:({width: _vm.size, height: _vm.size})},[_c('svg',{attrs:{"viewBox":"0 0 100 100"}},[_c('path',{attrs:{"d":"M 50,50 m 0,-47\n           a 47,47 0 1 1 0,94\n           a 47,47 0 1 1 0,-94","stroke":_vm.trackColor,"stroke-width":_vm.lineWidth,"fill-opacity":"0"}}),_c('path',{style:(_vm.svgStyle),attrs:{"stroke-linecap":"round","fill-opacity":"0","d":"M 50,50 m 0,-47\n           a 47,47 0 1 1 0,94\n           a 47,47 0 1 1 0,-94","stroke":_vm.color,"stroke-width":_vm.lineWidth}})]),_c('div',{staticClass:"q-knob-label row items-center justify-center content-center",style:({color: _vm.color}),domProps:{"innerHTML":_vm._s(_vm.placeholder || _vm.value)}})])])},staticRenderFns: [],
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: '#027be3'
    },
    trackColor: {
      type: String,
      default: '#ececec'
    },
    lineWidth: {
      type: String,
      default: '6px'
    },
    size: {
      type: String,
      default: '100px'
    },
    step: {
      type: Number,
      default: 1
    },
    disable: Boolean,
    readonly: Boolean,
    placeholder: String
  },
  computed: {
    svgStyle () {
      return {
        'stroke-dasharray': '295.31px, 295.31px',
        'stroke-dashoffset': (295.31 * (1.0 - (this.value - this.min) / (this.max - this.min))) + 'px',
        'transition': this.dragging ? '' : 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
      }
    },
    disabled () {
      return this.disable || this.readonly
    }
  },
  data () {
    return {
      dragging: false
    }
  },
  watch: {
    value (value) {
      if (value < this.min) {
        this.$emit('input', this.min);
      }
      else if (value > this.max) {
        this.$emit('input', this.max);
      }
    }
  },
  methods: {
    __dragStart (ev) {
      if (this.disabled) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();

      let knobOffset = Utils.dom.offset(this.$el);

      this.centerPosition = {
        top: knobOffset.top + Utils.dom.height(this.$el) / 2,
        left: knobOffset.left + Utils.dom.width(this.$el) / 2
      };

      this.dragging = true;
      this.__onInput(ev);
    },
    __dragMove (ev) {
      if (!this.dragging || this.disabled) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.__onInput(ev);
    },
    __dragStop (ev) {
      if (this.disabled) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.dragging = false;
    },
    __onInput (ev) {
      let
        position = Utils.event.position(ev),
        height = Math.abs(position.top - this.centerPosition.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(position.top - this.centerPosition.top), 2) +
          Math.pow(Math.abs(position.left - this.centerPosition.left), 2)
        ),
        angle = Math.asin(height / distance) * (180 / Math.PI);

      if (position.top < this.centerPosition.top) {
        angle = this.centerPosition.left < position.left ? 90 - angle : 270 + angle;
      }
      else {
        angle = this.centerPosition.left < position.left ? angle + 90 : 270 - angle;
      }

      let
        model = this.min + (angle / 360) * (this.max - this.min),
        modulo = model % this.step;

      this.$emit('input', Utils.format.between(model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0), this.min, this.max));
    }
  }
};

var Layout = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"layout"},[_c('div',{staticClass:"layout-header"},[_vm._t("header"),(_vm.$q.theme !== 'ios')?_vm._t("navigation"):_vm._e()],2),_c('div',{staticClass:"layout-content"},[_vm._t("default")],2),_c('div',{staticClass:"layout-footer"},[_vm._t("footer"),(_vm.$q.theme === 'ios')?_vm._t("navigation"):_vm._e()],2)])},staticRenderFns: [],};

var ListItem = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"item",class:_vm.itemClass},[(_vm.item.icon)?_c('i',{staticClass:"item-primary"},[_vm._v(_vm._s(_vm.item.icon))]):_vm._e(),_vm._v(" "),(_vm.item.img)?_c('img',{staticClass:"item-primary thumbnail",attrs:{"src":_vm.item.img}}):_vm._e(),_c('div',{staticClass:"item-content",class:{'has-secondary': _vm.item.secondIcon || _vm.item.secondImg || _vm.item.stamp}},[_c('div',{domProps:{"innerHTML":_vm._s(_vm.item.label)}}),(_vm.item.secondLabel)?_c('div',{domProps:{"innerHTML":_vm._s(_vm.item.secondLabel)}}):_vm._e()]),(_vm.item.stamp)?_c('div',{staticClass:"item-secondary stamp",domProps:{"innerHTML":_vm._s(_vm.item.stamp)}}):_vm._e(),(_vm.item.secondIcon)?_c('i',{staticClass:"item-secondary"},[_vm._v(_vm._s(_vm.item.secondIcon))]):_vm._e(),_vm._v(" "),(_vm.item.secondImg)?_c('img',{staticClass:"item-secondary thumbnail",attrs:{"src":_vm.item.secondImg}}):_vm._e()])},staticRenderFns: [],
  props: {
    item: {
      type: Object,
      required: true
    },
    active: Boolean,
    link: Boolean
  },
  computed: {
    itemClass () {
      return {
        active: this.active,
        'item-link': this.link,
        'multiple-lines': this.item.multiline,
        'two-lines': !this.item.multiline && this.item.secondLabel
      }
    }
  }
};

var ToolbarTitle = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"toolbar-content"},[_c('div',{staticClass:"toolbar-title",class:['padding-' + _vm.padding]},[_c('div',[_vm._t("default")],2)])])},staticRenderFns: [],
  props: {
    padding: {
      type: Number,
      default: 1
    }
  }
};

let handlers = [];

if (Platform.is.desktop) {
  window.addEventListener('keyup', evt => {
    if (handlers.length === 0) {
      return
    }

    if (evt.which === 27 || evt.keyCode === 27) {
      handlers[handlers.length - 1]();
    }
  });
}

var EscapeKey = {
  register (handler) {
    if (Platform.is.desktop) {
      handlers.push(handler);
    }
  },
  pop () {
    if (Platform.is.desktop) {
      handlers.pop();
    }
  }
};

const positions = {
  top: 'items-start justify-center with-backdrop',
  bottom: 'items-end justify-center with-backdrop',
  right: 'items-center justify-end with-backdrop',
  left: 'items-center justify-start with-backdrop'
};
const positionCSS = {
  mat: {
    maxHeight: '80vh',
    height: 'auto'
  },
  ios: {
    maxHeight: '80vh',
    height: 'auto',
    boxShadow: 'none'
  }
};

function additionalCSS (theme, position) {
  let css = {};

  if (['left', 'right'].includes(position)) {
    css.maxWidth = '90vw';
  }
  if (theme === 'ios') {
    if (['left', 'top'].includes(position)) {
      css.borderTopLeftRadius = 0;
    }
    if (['right', 'top'].includes(position)) {
      css.borderTopRightRadius = 0;
    }
    if (['left', 'bottom'].includes(position)) {
      css.borderBottomLeftRadius = 0;
    }
    if (['right', 'bottom'].includes(position)) {
      css.borderBottomRightRadius = 0;
    }
  }

  return css
}

let duration = 200;
let openedModalNumber = 0;

var Modal = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":_vm.modalTransition}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.active),expression:"active"}],staticClass:"modal fullscreen flex",class:_vm.modalClasses,on:{"click":function($event){_vm.click();}}},[_c('div',{ref:"content",staticClass:"modal-content scroll",class:_vm.contentClasses,style:(_vm.modalCss),on:{"click":function($event){$event.stopPropagation();}}},[_vm._t("default")],2)])])},staticRenderFns: [],
  props: {
    position: {
      type: String,
      default: '',
      validator (val) {
        return val === '' || ['top', 'bottom', 'left', 'right'].includes(val)
      }
    },
    transition: {
      type: String,
      default: 'q-modal'
    },
    positionClasses: {
      type: String,
      default: 'items-center justify-center'
    },
    contentClasses: [Object, String],
    contentCss: [Object, String],
    noBackdropDismiss: {
      type: Boolean,
      default: false
    },
    noEscDismiss: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    modalClasses () {
      return this.position ? positions[this.position] : this.positionClasses
    },
    modalTransition () {
      return this.position ? `q-modal-${this.position}` : this.transition
    },
    modalCss () {
      if (this.position) {
        return Utils.extend(
          {},
          positionCSS[this.$q.theme],
          additionalCSS(this.$q.theme, this.position),
          this.contentCss
        )
      }
      return this.contentCss
    }
  },
  methods: {
    open (onShow) {
      if (this.minimized && this.maximized) {
        throw new Error('Modal cannot be minimized & maximized simultaneously.')
      }
      if (this.active) {
        return
      }

      document.body.appendChild(this.$el);
      document.body.classList.add('with-modal');
      EscapeKey.register(() => {
        if (this.noEscDismiss) {
          return
        }
        this.close(() => {
          this.$emit('escape-key');
        });
      });

      this.__popstate = () => {
        if (
          Platform.has.popstate &&
          window.history.state &&
          window.history.state.modalId &&
          window.history.state.modalId >= this.__modalId
        ) {
          return
        }
        openedModalNumber--;
        EscapeKey.pop();
        this.active = false;

        if (Platform.has.popstate) {
          window.removeEventListener('popstate', this.__popstate);
        }

        setTimeout(() => {
          if (!openedModalNumber) {
            document.body.classList.remove('with-modal');
          }
          if (typeof this.__onClose === 'function') {
            this.__onClose();
          }
          this.$emit('close');
        }, duration);
      };

      setTimeout(() => {
        let content = this.$refs.content;
        content.scrollTop = 0
        ;['modal-scroll', 'layout-view'].forEach(c => {
          [].slice.call(content.getElementsByClassName(c)).forEach(el => {
            el.scrollTop = 0;
          });
        });
      }, 10);

      this.active = true;
      this.__modalId = ++openedModalNumber;
      if (Platform.has.popstate) {
        window.history.pushState({modalId: this.__modalId}, '');
        window.addEventListener('popstate', this.__popstate);
      }

      setTimeout(() => {
        if (typeof onShow === 'function') {
          onShow();
        }
        this.$emit('open');
      }, duration);
    },
    close (onClose) {
      if (!this.active) {
        return
      }

      this.__onClose = onClose;

      if (!Platform.has.popstate) {
        this.__popstate();
      }
      else {
        window.history.go(-1);
      }
    },
    toggle (done) {
      if (this.active) {
        this.close(done);
      }
      else {
        this.open(done);
      }
    },
    click (onClick) {
      if (this.noBackdropDismiss) {
        return
      }
      this.close(onClick);
    }
  },
  beforeDestroy () {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};

var Numeric = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-numeric textfield row inline items-center",class:{disabled: _vm.disable, readonly: _vm.readonly, 'has-error': _vm.hasError}},[_c('i',{on:{"click":function($event){_vm.__setByOffset(-1);}}},[_vm._v("remove")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model.number",value:(_vm.model),expression:"model",modifiers:{"number":true}}],staticClass:"no-style auto q-input-field",style:({width: _vm.width}),attrs:{"type":"number","pattern":"[0-9]*","disabled":_vm.disable,"readonly":_vm.readonly,"tabindex":"0","step":_vm.step,"min":_vm.min,"max":_vm.max},domProps:{"value":(_vm.model)},on:{"blur":[_vm.__updateValue,function($event){_vm.$forceUpdate();}],"keydown":[function($event){if(_vm._k($event.keyCode,"up",38)){ return null; }_vm.__updateValue($event);},function($event){if(_vm._k($event.keyCode,"down",40)){ return null; }_vm.__updateValue($event);},function($event){if(_vm._k($event.keyCode,"enter",13)){ return null; }_vm.__updateValue($event);},function($event){if(_vm._k($event.keyCode,"esc",27)){ return null; }_vm.model = _vm.value;}],"input":function($event){if($event.target.composing){ return; }_vm.model=_vm._n($event.target.value);}}}),_vm._v(" "),_c('i',{on:{"click":function($event){_vm.__setByOffset(1);}}},[_vm._v("add")])])},staticRenderFns: [],
  props: {
    value: {
      required: true
    },
    step: {
      type: Number,
      default: 1
    },
    min: Number,
    max: Number,
    readonly: Boolean,
    disable: Boolean,
    maxDecimals: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value () {
      this.model = this.value;
    }
  },
  data () {
    return {
      model: this.value
    }
  },
  computed: {
    hasMin () {
      return this.has(this.min)
    },
    hasMax () {
      return this.has(this.max)
    },
    hasError () {
      return (
        this.has(this.model) &&
        (
          (this.hasMin && this.model < this.min) ||
          (this.hasMax && this.model > this.max)
        )
      )
    },
    width () {
      return (this.has(this.model) ? ('' + this.model).length : 1) * 0.7 + 'em'
    }
  },
  methods: {
    has (val) {
      return typeof val !== 'undefined'
    },
    __normalize (value) {
      if (!this.has(value)) {
        value = this.hasMin ? this.min : 0;
      }
      if (this.hasMin && value < this.min) {
        return this.min
      }
      else if (this.hasMax && value > this.max) {
        return this.max
      }

      return parseFloat(this.maxDecimals ? parseFloat(value).toFixed(this.maxDecimals) : value)
    },
    __updateValue () {
      this.$nextTick(() => {
        this.model = this.__normalize(this.model);
        if (!this.disable && !this.readonly && this.value !== this.model) {
          this.$emit('input', this.model);
        }
      });
    },
    __setByOffset (direction) {
      if (this.disable || this.readonly) {
        return
      }

      let newValue;

      if (!this.has(this.model)) {
        newValue = this.__normalize(0);
      }
      else {
        newValue = this.model + direction * this.step;
        if (this.hasMin && newValue < this.min && this.model === this.min) {
          return
        }
        if (this.hasMax && newValue > this.max && this.model === this.max) {
          return
        }
      }

      this.model = newValue;
      this.__updateValue();
    }
  }
};

var Pagination$1 = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-pagination",class:{disabled: _vm.disable}},[_c('button',{staticClass:"primary clear small",class:{disabled: _vm.value === _vm.min},on:{"click":function($event){_vm.set(_vm.min);}}},[_c('i',[_vm._v("first_page")])]),_vm._v(" "),_c('button',{staticClass:"primary clear small",class:{disabled: _vm.value === _vm.min},on:{"click":function($event){_vm.setByOffset(-1);}}},[_c('i',[_vm._v("keyboard_arrow_left")])]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model.number.lazy",value:(_vm.newPage),expression:"newPage",modifiers:{"number":true,"lazy":true}}],ref:"input",style:({width: _vm.inputPlaceholder.length * 10 + 'px'}),attrs:{"type":"number","pattern":"[0-9]*","placeholder":_vm.inputPlaceholder,"disabled":_vm.disable,"tabindex":"0"},domProps:{"value":(_vm.newPage)},on:{"change":function($event){_vm.newPage=_vm._n($event.target.value);},"blur":function($event){_vm.$forceUpdate();}}}),_vm._v(" "),_c('button',{staticClass:"primary clear small",class:{disabled: _vm.value === _vm.max},on:{"click":function($event){_vm.setByOffset(1);}}},[_c('i',[_vm._v("keyboard_arrow_right")])]),_vm._v(" "),_c('button',{staticClass:"primary clear small",class:{disabled: _vm.value === _vm.max},on:{"click":function($event){_vm.set(_vm.max);}}},[_c('i',[_vm._v("last_page")])])])},staticRenderFns: [],
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    },
    disable: Boolean
  },
  data () {
    return {
      newPage: ''
    }
  },
  methods: {
    set (value) {
      if (!this.disable) {
        this.model = value;
      }
    },
    setByOffset (offset) {
      if (!this.disable) {
        this.model = this.value + offset;
      }
    },
    __normalize (value) {
      return Utils.format.between(parseInt(value, 10), 1, this.max)
    }
  },
  watch: {
    newPage (value) {
      var parsed = parseInt(value, 10);

      if (parsed) {
        this.model = parsed;
        this.$refs.input.blur();
      }

      this.newPage = '';
    }
  },
  computed: {
    model: {
      get () {
        return this.__normalize(this.value)
      },
      set (value) {
        if (this.value !== value) {
          this.$emit('input', this.__normalize(value));
        }
        this.$refs.input.blur();
      }
    },
    inputPlaceholder () {
      return this.value + ' / ' + this.max
    }
  }
};

var Parallax = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-parallax column items-center justify-center",style:({height: _vm.height + 'px'})},[_c('div',{staticClass:"q-parallax-image"},[_c('img',{ref:"img",class:{ready: _vm.imageHasBeenLoaded},staticStyle:{"transform":"translate3D(-50%, 0, 0)"},attrs:{"src":_vm.src},on:{"load":function($event){_vm.__processImage();}}})]),_c('div',{staticClass:"q-parallax-text"},[(!_vm.imageHasBeenLoaded)?_vm._t("loading"):_vm._t("default")],2)])},staticRenderFns: [],
  props: {
    src: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      default: 500
    },
    speed: {
      type: Number,
      default: 1,
      validator (value) {
        return value >= 0 && value <= 1
      }
    }
  },
  data () {
    return {
      imageHasBeenLoaded: false
    }
  },
  watch: {
    src () {
      this.imageHasBeenLoaded = false;
    },
    height () {
      this.__updatePosition();
    }
  },
  methods: {
    __processImage () {
      this.imageHasBeenLoaded = true;
      this.__processResize();
    },
    __processResize () {
      if (!this.imageHasBeenLoaded || !this.scrollTarget) {
        return
      }

      this.imageHeight = Utils.dom.height(this.image);
      this.__updatePosition();
    },
    __updatePosition () {
      if (!this.imageHasBeenLoaded) {
        return
      }

      let containerTop, containerHeight, containerBottom, top, bottom;

      if (this.scrollTarget === window) {
        containerTop = 0;
        containerHeight = Utils.dom.viewport().height;
        containerBottom = containerHeight;
      }
      else {
        containerTop = Utils.dom.offset(this.scrollTarget).top;
        containerHeight = Utils.dom.height(this.scrollTarget);
        containerBottom = containerTop + containerHeight;
      }
      top = Utils.dom.offset(this.container).top;
      bottom = top + this.height;

      if (bottom > containerTop && top < containerBottom) {
        let percentScrolled = (containerBottom - top) / (this.height + containerHeight);
        let imageOffset = Math.round((this.imageHeight - this.height) * percentScrolled * this.speed);
        requestAnimationFrame(() => {
          this.$refs.img.style.transform = 'translate3D(-50%,' + imageOffset + 'px, 0)';
        });
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.container = this.$el;
      this.image = this.$refs.img;

      this.scrollTarget = Utils.dom.getScrollTarget(this.$el);
      this.resizeHandler = Utils.debounce(this.__processResize, 50);

      window.addEventListener('resize', this.resizeHandler);
      this.scrollTarget.addEventListener('scroll', this.__updatePosition);
      this.__processResize();
    });
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler);
    this.scrollTarget.removeEventListener('scroll', this.__updatePosition);
  }
};

var PickerTextfield = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-picker-textfield cursor-pointer textfield caret",class:{disabled: _vm.disable, readonly: _vm.readonly, active: _vm.active, 'with-label': _vm.label},attrs:{"tabindex":"0"}},[_c('div',{staticClass:"q-picker-textfield-label ellipsis",domProps:{"innerHTML":_vm._s(_vm.label)}}),_c('div',{staticClass:"q-picker-textfield-value ellipsis",domProps:{"innerHTML":_vm._s(_vm.actualValue)}}),_vm._t("default")],2)},staticRenderFns: [],
  props: {
    label: String,
    placeholder: String,
    staticLabel: String,
    value: String,
    disable: Boolean,
    readonly: Boolean
  },
  computed: {
    active () {
      return this.value.length > 0
    },
    actualValue () {
      return this.staticLabel || (this.label ? this.value : this.value || this.placeholder)
    }
  }
};

var Popover = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-popover animate-scale",style:(_vm.transformCSS),on:{"click":function($event){$event.stopPropagation();}}},[_vm._t("default")],2)},staticRenderFns: [],
  props: {
    anchor: {
      type: String,
      default: 'bottom left',
      validator: Utils.popup.positionValidator
    },
    self: {
      type: String,
      default: 'top left',
      validator: Utils.popup.positionValidator
    },
    fit: Boolean,
    maxHeight: String,
    touchPosition: Boolean,
    anchorClick: {
      /*
        for handling anchor outside of Popover
        example: context menu component
      */
      type: Boolean,
      default: true
    },
    offset: {
      type: Array,
      validator: Utils.popup.offsetValidator
    },
    disable: Boolean
  },
  data () {
    return {
      opened: false,
      progress: false
    }
  },
  computed: {
    transformCSS () {
      return Utils.popup.getTransformProperties({selfOrigin: this.selfOrigin})
    },
    anchorOrigin () {
      return Utils.popup.parsePosition(this.anchor)
    },
    selfOrigin () {
      return Utils.popup.parsePosition(this.self)
    }
  },
  created () {
    this.__debouncedPositionUpdate = Utils.debounce(() => {
      this.reposition();
    }, 70);
  },
  mounted () {
    this.$nextTick(() => {
      this.anchorEl = this.$el.parentNode;
      this.anchorEl.removeChild(this.$el);
      if (this.anchorClick) {
        this.anchorEl.classList.add('cursor-pointer');
        this.anchorEl.addEventListener('click', this.toggle);
      }
    });
  },
  beforeDestroy () {
    if (this.anchorClick) {
      this.anchorEl.removeEventListener('click', this.toggle);
    }
    this.close();
  },
  methods: {
    toggle (event) {
      if (this.opened) {
        this.close();
      }
      else {
        this.open(event);
      }
    },
    open (event) {
      if (this.disable) {
        return
      }
      if (this.opened) {
        this.reposition();
        return
      }
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      this.opened = true;
      document.body.click(); // close other Popovers
      document.body.appendChild(this.$el);
      EscapeKey.register(() => { this.close(); });
      this.scrollTarget = Utils.dom.getScrollTarget(this.anchorEl);
      this.scrollTarget.addEventListener('scroll', this.close);
      window.addEventListener('resize', this.__debouncedPositionUpdate);
      if (this.fit) {
        this.$el.style.minWidth = Utils.dom.width(this.anchorEl) + 'px';
      }
      this.reposition(event);
      this.timer = setTimeout(() => {
        this.timer = null;
        document.addEventListener('click', this.close, true);
        this.$emit('open');
      }, 1);
    },
    close (fn) {
      if (!this.opened || this.progress || (fn && fn.target && this.$el.contains(fn.target))) {
        return
      }

      clearTimeout(this.timer);
      document.removeEventListener('click', this.close, true);
      this.scrollTarget.removeEventListener('scroll', this.close);
      window.removeEventListener('resize', this.__debouncedPositionUpdate);
      EscapeKey.pop();
      this.progress = true;

      /*
        Using setTimeout to allow
        v-models to take effect
      */
      setTimeout(() => {
        this.opened = false;
        this.progress = false;
        document.body.removeChild(this.$el);
        this.$emit('close');
        if (typeof fn === 'function') {
          fn();
        }
      }, 1);
    },
    reposition (event) {
      this.$nextTick(() => {
        Utils.popup.setPosition({
          event,
          el: this.$el,
          offset: this.offset,
          anchorEl: this.anchorEl,
          anchorOrigin: this.anchorOrigin,
          selfOrigin: this.selfOrigin,
          maxHeight: this.maxHeight,
          anchorClick: this.anchorClick,
          touchPosition: this.touchPosition
        });
      });
    }
  }
};

function width$2 (val) {
  return {width: `${val}%`}
}

var Progress = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-progress"},[_c('div',{staticClass:"q-progress-track",style:(_vm.trackStyle)},[_vm._v(" ")]),(_vm.buffer)?_c('div',{staticClass:"q-progress-buffer",style:(_vm.bufferStyle)},[_vm._v(" ")]):_vm._e(),_c('div',{staticClass:"q-progress-model",style:(_vm.modelStyle)},[_vm._v(" ")])])},staticRenderFns: [],
  props: {
    percentage: {
      type: Number,
      default: 0
    },
    buffer: Number
  },
  computed: {
    model () {
      return between(this.percentage, 0, 100)
    },
    bufferModel () {
      return between(this.buffer || 0, 0, 100 - this.model)
    },
    modelStyle () {
      return width$2(this.model)
    },
    bufferStyle () {
      return width$2(this.bufferModel)
    },
    trackStyle () {
      return width$2(this.buffer ? 100 - this.buffer : 100)
    }
  }
};

var ProgressButton = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('button',{staticClass:"q-progress-button",class:{active: _vm.active, indeterminate: _vm.indeterminate}},[(!_vm.indeterminate)?_c('span',{staticClass:"q-progress-button-filler",class:{'q-progress-button-dark-filler': _vm.darkFiller},style:({width: _vm.computedPercentage})}):_vm._e(),_c('div',{staticClass:"q-progress-button-content",class:_vm.stateClass},[_c('div',{staticClass:"q-progress-button-error"},[_c('i',[_vm._v(_vm._s(_vm.errorIcon))])]),_c('div',{staticClass:"q-progress-button-label"},[_vm._t("default")],2),_c('div',{staticClass:"q-progress-button-success"},[_c('i',[_vm._v(_vm._s(_vm.successIcon))])])])])},staticRenderFns: [],
  props: {
    percentage: {
      type: Number,
      required: true
    },
    errorIcon: {
      type: String,
      default: 'warning'
    },
    successIcon: {
      type: String,
      default: 'done'
    },
    darkFiller: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    active () {
      return this.percentage > 0 && this.percentage < 100
    },
    stateClass () {
      if (this.percentage >= 100) {
        return 'q-progress-button-complete'
      }
      if (this.percentage < 0) {
        return 'q-progress-button-incomplete'
      }
      return 'q-progress-button-default'
    },
    computedPercentage () {
      if (this.percentage >= 100) {
        return '0%'
      }

      return Math.max(0, this.percentage) + '%'
    }
  }
};

var PullToRefresh = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pull-to-refresh"},[_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical.scroll",value:(_vm.__pull),expression:"__pull",modifiers:{"vertical":true,"scroll":true}}],staticClass:"pull-to-refresh-container",style:(_vm.style)},[_c('div',{staticClass:"pull-to-refresh-message row items-center justify-center"},[_c('i',{directives:[{name:"show",rawName:"v-show",value:(_vm.state !== 'refreshing'),expression:"state !== 'refreshing'"}],class:{'rotate-180': _vm.state === 'pulled'}},[_vm._v("arrow_downward")]),_vm._v(" "),_c('i',{directives:[{name:"show",rawName:"v-show",value:(_vm.state === 'refreshing'),expression:"state === 'refreshing'"}],staticClass:"animate-spin"},[_vm._v(_vm._s(_vm.refreshIcon))]),_vm._v("    "),_c('span',{domProps:{"innerHTML":_vm._s(_vm.message)}})]),_vm._t("default")],2)])},staticRenderFns: [],
  props: {
    handler: {
      type: Function,
      required: true
    },
    distance: {
      type: Number,
      default: 35
    },
    pullMessage: {
      type: String,
      default: 'Pull down to refresh'
    },
    releaseMessage: {
      type: String,
      default: 'Release to refresh'
    },
    refreshMessage: {
      type: String,
      default: 'Refreshing...'
    },
    refreshIcon: {
      type: String,
      default: 'refresh'
    },
    inline: Boolean,
    disable: Boolean
  },
  data () {
    let height = 65;

    return {
      state: 'pull',
      pullPosition: -height,
      height: height,
      animating: false,
      pulling: false,
      scrolling: false
    }
  },
  computed: {
    message () {
      switch (this.state) {
        case 'pulled':
          return this.releaseMessage
        case 'refreshing':
          return this.refreshMessage
        case 'pull':
        default:
          return this.pullMessage
      }
    },
    style () {
      return Utils.dom.cssTransform(`translateY(${this.pullPosition}px)`)
    }
  },
  methods: {
    __pull (event) {
      if (this.disable) {
        return
      }

      if (event.isFinal) {
        if (this.scrolling) {
          this.scrolling = false;
          this.pulling = false;
          return
        }
        this.scrolling = false;
        this.pulling = false;

        if (this.state === 'pulled') {
          this.state = 'refreshing';
          this.__animateTo(0);
          this.trigger();
        }
        else if (this.state === 'pull') {
          this.__animateTo(-this.height);
        }
        return
      }
      if (this.animating || this.scrolling || this.state === 'refreshing') {
        return true
      }

      let top = Utils.dom.getScrollPosition(this.scrollContainer);
      if (top !== 0 || (top === 0 && event.direction !== 'down')) {
        this.scrolling = true;
        if (this.pulling) {
          this.pulling = false;
          this.state = 'pull';
          this.__animateTo(-this.height);
        }
        return true
      }

      event.evt.preventDefault();
      this.pulling = true;
      this.pullPosition = -this.height + Math.max(0, Math.pow(event.distance.y, 0.85));
      this.state = this.pullPosition > this.distance ? 'pulled' : 'pull';
    },
    __animateTo (target, done, previousCall) {
      if (!previousCall && this.animationId) {
        cancelAnimationFrame(this.animating);
      }

      this.pullPosition -= (this.pullPosition - target) / 7;

      if (this.pullPosition - target > 1) {
        this.animating = requestAnimationFrame(() => {
          this.__animateTo(target, done, true);
        });
      }
      else {
        this.animating = requestAnimationFrame(() => {
          this.pullPosition = target;
          this.animating = false;
          done && done();
        });
      }
    },
    trigger () {
      this.handler(() => {
        this.__animateTo(-this.height, () => {
          this.state = 'pull';
        });
      });
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.scrollContainer = this.inline ? this.$el.parentNode : Utils.dom.getScrollTarget(this.$el);
    });
  }
};

var Radio = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"q-radio cursor-pointer",class:{disabled: _vm.disable},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.select($event);}}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],attrs:{"type":"radio","disabled":_vm.disable},domProps:{"value":_vm.val,"checked":_vm._q(_vm.model,_vm.val)},on:{"click":function($event){$event.stopPropagation();},"change":_vm.__change,"__c":function($event){_vm.model=_vm.val;}}}),_c('div')])},staticRenderFns: [],
  props: {
    value: {
      required: true
    },
    val: {
      required: true
    },
    disable: Boolean
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        if (value !== this.value) {
          this.$emit('input', value);
        }
      }
    }
  },
  methods: {
    select () {
      if (!this.disable) {
        this.model = this.val;
      }
    },
    __change (e) {
      this.model = this.val;
    }
  }
};

var Range = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__pan),expression:"__pan",modifiers:{"horizontal":true}}],staticClass:"q-range non-selectable",class:{disabled: _vm.disable},on:{"click":_vm.__click}},[_c('div',{ref:"handle",staticClass:"q-range-handle-container"},[_c('div',{staticClass:"q-range-track"}),_vm._l((((_vm.max - _vm.min) / _vm.step + 1)),function(n){return (_vm.markers)?_c('div',{staticClass:"q-range-mark",style:({left: (n - 1) * 100 * _vm.step / (_vm.max - _vm.min) + '%'})}):_vm._e()}),_c('div',{staticClass:"q-range-track active-track",class:{'no-transition': _vm.dragging, 'handle-at-minimum': _vm.value === _vm.min},style:({width: _vm.percentage})}),_c('div',{staticClass:"q-range-handle",class:{dragging: _vm.dragging, 'handle-at-minimum': _vm.value === _vm.min},style:({left: _vm.percentage})},[(_vm.label || _vm.labelAlways)?_c('div',{staticClass:"q-range-label",class:{'label-always': _vm.labelAlways}},[_vm._v(_vm._s(_vm.value))]):_vm._e()])],2)])},staticRenderFns: [],
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 5
    },
    step: {
      type: Number,
      default: 1
    },
    snap: Boolean,
    markers: Boolean,
    label: Boolean,
    labelAlways: Boolean,
    disable: Boolean
  },
  data () {
    return {
      dragging: false,
      currentPercentage: (this.value - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentage () {
      if (this.snap) {
        return (this.value - this.min) / (this.max - this.min) * 100 + '%'
      }
      return 100 * this.currentPercentage + '%'
    }
  },
  watch: {
    value (value) {
      if (this.dragging) {
        return
      }
      this.currentPercentage = (value - this.min) / (this.max - this.min);
    },
    min (value) {
      if (this.value < value) {
        this.value = value;
        return
      }
      this.$nextTick(this.__validateProps);
    },
    max (value) {
      if (this.value > value) {
        this.value = value;
        return
      }
      this.$nextTick(this.__validateProps);
    },
    step () {
      this.$nextTick(this.__validateProps);
    }
  },
  methods: {
    __pan (event) {
      if (this.disable) {
        return
      }
      if (event.isFinal) {
        this.__end(event.evt);
      }
      else if (event.isFirst) {
        this.__setActive(event.evt);
      }
      else {
        this.__update(event.evt);
      }
    },
    __click (event) {
      if (this.disable) {
        return
      }
      this.__setActive(event);
      this.__end(event);
    },
    __setActive (event) {
      let container = this.$refs.handle;

      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth
      };
      this.__update(event);
    },
    __update (event) {
      let
        percentage = Utils.format.between((Utils.event.position(event).left - this.dragging.left) / this.dragging.width, 0, 1),
        model = this.min + percentage * (this.max - this.min),
        modulo = (model - this.min) % this.step;

      this.currentPercentage = percentage;
      this.$emit('input', Utils.format.between(model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0), this.min, this.max));
    },
    __end () {
      this.dragging = false;
      this.currentPercentage = (this.value - this.min) / (this.max - this.min);
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max);
      }
      else if ((this.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of max - min', this.$el, this.min, this.max, this.step);
      }
    }
  },
  created () {
    this.__validateProps();
  }
};

var DoubleRange = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-range non-selectable",class:{disabled: _vm.disable},on:{"mousedown":function($event){$event.preventDefault();_vm.__setActive($event);},"touchstart":function($event){$event.preventDefault();_vm.__setActive($event);},"touchend":function($event){$event.preventDefault();_vm.__end($event);},"touchmove":function($event){$event.preventDefault();_vm.__update($event);}}},[_c('div',{ref:"handle",staticClass:"q-range-handle-container"},[_c('div',{staticClass:"q-range-track"}),_vm._l((((_vm.max - _vm.min) / _vm.step + 1)),function(n){return (_vm.markers)?_c('div',{staticClass:"q-range-mark",style:({left: (n - 1) * 100 * _vm.step / (_vm.max - _vm.min) + '%'})}):_vm._e()}),_c('div',{staticClass:"q-range-track active-track",class:{dragging: _vm.dragging, 'track-draggable': _vm.dragRange},style:({left: _vm.percentageMin * 100 + '%', width: _vm.activeTrackWidth})}),_c('div',{staticClass:"q-range-handle q-range-handle-min",class:{dragging: _vm.dragging, 'handle-at-minimum': _vm.value.min === _vm.min, undraggable: _vm.disableMin},style:({left: _vm.percentageMin * 100 + '%'})},[(_vm.label || _vm.labelAlways)?_c('div',{staticClass:"q-range-label",class:{'label-always': _vm.labelAlways}},[_vm._v(_vm._s(_vm.value.min))]):_vm._e()]),_c('div',{staticClass:"q-range-handle q-range-handle-max",class:{dragging: _vm.dragging, 'handle-at-maximum': _vm.value.max === _vm.max, undraggable: _vm.disableMax},style:({left: _vm.percentageMax * 100 + '%'})},[(_vm.label || _vm.labelAlways)?_c('div',{staticClass:"q-range-label",class:{'label-always': _vm.labelAlways}},[_vm._v(_vm._s(_vm.value.max))]):_vm._e()])],2)])},staticRenderFns: [],
  props: {
    value: {
      type: Object,
      required: true,
      validator (value) {
        return typeof value.min !== 'undefined' && typeof value.max !== 'undefined'
      }
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    snap: Boolean,
    markers: Boolean,
    label: Boolean,
    labelAlways: Boolean,
    disable: Boolean,
    disableMin: Boolean,
    disableMax: Boolean,
    dragRange: Boolean
  },
  data () {
    return {
      dragging: false,
      currentMinPercentage: (this.value.min - this.min) / (this.max - this.min),
      currentMaxPercentage: (this.value.max - this.min) / (this.max - this.min),
      sensitivity: 0.02
    }
  },
  computed: {
    percentageMin () {
      return (!this.snap || this.disableMin) ? this.currentMinPercentage : (this.value.min - this.min) / (this.max - this.min)
    },
    percentageMax () {
      return (!this.snap || this.disableMax) ? this.currentMaxPercentage : (this.value.max - this.min) / (this.max - this.min)
    },
    activeTrackWidth () {
      return 100 * (this.percentageMax - this.percentageMin) + '%'
    }
  },
  watch: {
    'value.min' (value) {
      if (this.dragging) {
        return
      }
      if (value > this.value.max) {
        value = this.value.max;
      }
      this.currentMinPercentage = (value - this.min) / (this.max - this.min);
    },
    'value.max' (value) {
      if (this.dragging) {
        return
      }
      if (value < this.value.min) {
        value = this.value.min;
      }
      this.currentMaxPercentage = (value - this.min) / (this.max - this.min);
    },
    min (value) {
      if (this.value.min < value) {
        this.____update({min: value});
      }
      if (this.value.max < value) {
        this.____update({max: value});
      }
      this.$nextTick(this.__validateProps);
    },
    max (value) {
      if (this.value.min > value) {
        this.____update({min: value});
      }
      if (this.value.max > value) {
        this.____update({max: value});
      }
      this.$nextTick(this.__validateProps);
    },
    step () {
      this.$nextTick(this.__validateProps);
    }
  },
  methods: {
    __setActive (event) {
      if (this.disable) {
        return
      }
      let container = this.$refs.handle;
      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth,
        valueMin: this.value.min,
        percentageMin: this.currentMinPercentage,
        percentageMinLimit: this.disableMin ? -1 : 0,
        minPercentageOffset: 0,
        valueMax: this.value.max,
        percentageMax: this.currentMaxPercentage,
        maxPercentageOffset: 0,
        percentageMaxLimit: this.disableMax ? 2 : 1
      };
      let
        offset = Utils.event.position(event).left - this.dragging.left,
        percentage = Math.min(1, Math.max(0, offset / this.dragging.width));

      if (percentage < this.currentMinPercentage + this.sensitivity) {
        if (this.disableMin) {
          this.__cancelDrag();
          return
        }
        this.dragging.byPosition = -1; // Drag min
      }
      else if (percentage > this.currentMaxPercentage - this.sensitivity) {
        if (this.disableMax) {
          this.__cancelDrag();
          return
        }
        this.dragging.byPosition = 1;  // Drag max
      }
      else {
        if (!this.dragRange) {
          this.__cancelDrag();
          return
        }
        this.dragging.byPosition = 0;  // Drag range
        this.dragging.valueRange = this.dragging.valueMax - this.dragging.valueMin;
        this.dragging.minPercentageOffset = this.currentMinPercentage - percentage;
        this.dragging.maxPercentageOffset = this.currentMaxPercentage - percentage;
      }
      this.__update(event);
    },
    __update (event) {
      if (!this.dragging) {
        return
      }

      let percentage = (Utils.event.position(event).left - this.dragging.left) / this.dragging.width;
      percentage = (percentage + this.dragging.minPercentageOffset < this.dragging.percentageMinLimit) ? this.dragging.percentageMinLimit - this.dragging.minPercentageOffset : (percentage + this.dragging.maxPercentageOffset > this.dragging.percentageMaxLimit) ? this.dragging.percentageMaxLimit - this.dragging.maxPercentageOffset : percentage;
      let
        model = this.min + (percentage + this.dragging.minPercentageOffset) * (this.max - this.min),
        modulo = (model - this.min) % this.step;
      model = Math.min(this.max, Math.max(this.min, model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0)));

      if (!this.disableMin && this.dragging.byPosition === -1) {
        if (percentage <= this.dragging.percentageMax) {
          this.currentMinPercentage = percentage;
          this.currentMaxPercentage = this.dragging.percentageMax;
          this.__updateInput({
            min: model,
            max: this.dragging.valueMax
          });
        }
        else {
          this.currentMinPercentage = this.dragging.percentageMax;
          this.currentMaxPercentage = this.disableMax ? this.dragging.percentageMax : percentage;
          this.__updateInput({
            min: this.dragging.valueMax,
            max: this.disableMax ? this.dragging.valueMax : model
          });
        }
      }
      else if (!this.disableMax && this.dragging.byPosition === 1) {
        if (percentage >= this.dragging.percentageMin) {
          this.currentMinPercentage = this.dragging.percentageMin;
          this.currentMaxPercentage = percentage;
          this.__updateInput({
            min: this.dragging.valueMin,
            max: model
          });
        }
        else {
          this.currentMinPercentage = this.disableMin ? this.dragging.percentageMin : percentage;
          this.currentMaxPercentage = this.dragging.percentageMin;
          this.__updateInput({
            min: this.disableMin ? this.dragging.valueMin : model,
            max: this.dragging.valueMin
          });
        }
      }
      else if (this.dragging.byPosition === 0) {
        this.currentMinPercentage =
          this.disableMin ? this.currentMinPercentage : this.disableMax && percentage + this.dragging.minPercentageOffset > this.currentMaxPercentage ? this.currentMaxPercentage : percentage + this.dragging.minPercentageOffset;
        this.currentMaxPercentage = this.disableMax ? this.currentMaxPercentage : this.disableMin && percentage + this.dragging.maxPercentageOffset < this.currentMinPercentage ? this.currentMinPercentage : percentage + this.dragging.maxPercentageOffset;
        this.__updateInput({
          min: this.disableMin ? this.dragging.valueMin : model,
          max: this.disableMax ? this.dragging.valueMax : model + this.dragging.valueRange
        });
      }
    },
    __updateInput ({min = this.value.min, max = this.value.max}) {
      this.$emit('input', {min, max});
    },
    __cancelDrag () {
      this.dragging = false;
    },
    __end () {
      this.__cancelDrag();
      this.currentMinPercentage = (this.value.min - this.min) / (this.max - this.min);
      this.currentMaxPercentage = (this.value.max - this.min) / (this.max - this.min);
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max);
      }
      else if ((this.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of max - min', this.$el, this.min, this.max, this.step);
      }
      else if ((this.value.min - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of initial value.min - min', this.$el, this.value.min, this.min, this.step);
      }
      else if ((this.value.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of initial value.max - min', this.$el, this.value.max, this.max, this.step);
      }
    }
  },
  created () {
    this.__validateProps();
    if (Platform.is.desktop) {
      document.body.addEventListener('mousemove', this.__update);
      document.body.addEventListener('mouseup', this.__end);
    }
  },
  beforeDestroy () {
    if (Platform.is.dekstop) {
      document.body.removeEventListener('mousemove', this.__update);
      document.body.removeEventListener('mouseup', this.__end);
    }
  }
};

var Rating = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-rating",class:{disabled: _vm.disable, editable: _vm.editable}},_vm._l((_vm.max),function(index){return _c('i',{class:{ active: (!_vm.mouseModel && _vm.model >= index) || (_vm.mouseModel && _vm.mouseModel >= index), exselected: _vm.mouseModel && _vm.model >= index && _vm.mouseModel < index, hovered: _vm.mouseModel === index },on:{"click":function($event){_vm.set(index);},"mouseover":function($event){_vm.__setHoverValue(index);},"mouseout":function($event){_vm.mouseModel = 0;}}},[_vm._v(_vm._s(_vm.icon))])}))},staticRenderFns: [],
  props: {
    value: {
      type: Number,
      default: 0,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      default: 'grade'
    },
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    return {
      mouseModel: 0
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        if (this.value !== value) {
          this.$emit('input', value);
        }
      }
    },
    editable () {
      return !this.readonly && !this.disable
    }
  },
  methods: {
    set (value) {
      if (this.editable) {
        this.model = Utils.format.between(parseInt(value, 10), 1, this.max);
        this.mouseModel = 0;
      }
    },
    __setHoverValue (value) {
      if (this.editable) {
        this.mouseModel = value;
      }
    }
  }
};

var Search = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-search",class:{'q-search-centered': _vm.centered, disabled: _vm.disable, readonly: _vm.readonly}},[_c('div',{staticClass:"q-search-input-container"},[_c('button',{staticClass:"q-search-icon"},[_c('i',{staticClass:"on-left"},[_vm._v(_vm._s(_vm.icon))]),_vm._v(" "),_c('span',{directives:[{name:"show",rawName:"v-show",value:(_vm.$q.theme === 'ios' && _vm.isEmpty),expression:"$q.theme === 'ios' && isEmpty"}]},[_vm._v(_vm._s(_vm.placeholder))])]),_vm._v(" "),(_vm.numeric)?_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],staticClass:"q-search-input no-style",attrs:{"type":"number","pattern":"[0-9]*","placeholder":_vm.$q.theme === 'mat' ? _vm.placeholder : '',"disabled":_vm.disable,"readonly":_vm.readonly,"tabindex":"0"},domProps:{"value":(_vm.model)},on:{"focus":_vm.focus,"blur":[_vm.blur,function($event){_vm.$forceUpdate();}],"input":function($event){if($event.target.composing){ return; }_vm.model=$event.target.value;}}}):_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],staticClass:"q-search-input no-style",attrs:{"type":"text","placeholder":_vm.$q.theme === 'mat' ? _vm.placeholder : '',"disabled":_vm.disable,"readonly":_vm.readonly,"tabindex":"0"},domProps:{"value":(_vm.model)},on:{"focus":_vm.focus,"blur":_vm.blur,"input":function($event){if($event.target.composing){ return; }_vm.model=$event.target.value;}}}),_vm._v(" "),_c('button',{staticClass:"q-search-clear",class:{hidden: this.model === ''},on:{"click":_vm.clear}},[_c('i',{staticClass:"mat-only"},[_vm._v("clear")]),_vm._v(" "),_c('i',{staticClass:"ios-only"},[_vm._v("cancel")])])])])},staticRenderFns: [],
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    numeric: Boolean,
    debounce: {
      type: Number,
      default: 300
    },
    icon: {
      type: String,
      default: 'search'
    },
    placeholder: {
      type: String,
      default: 'Search'
    },
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    return {
      focused: false,
      timer: null,
      isEmpty: !this.value && this.value !== 0
    }
  },
  computed: {
    model: {
      get () {
        this.isEmpty = !this.value && this.value !== 0;
        return this.value
      },
      set (value) {
        clearTimeout(this.timer);
        this.isEmpty = !value && value !== 0;
        if (this.value === value) {
          return
        }
        if (this.isEmpty) {
          this.$emit('input', '');
          return
        }
        this.timer = setTimeout(() => {
          this.$emit('input', value);
        }, this.debounce);
      }
    },
    centered () {
      return !this.focused && this.value === ''
    },
    editable () {
      return !this.disable && !this.readonly
    }
  },
  methods: {
    clear () {
      if (this.editable) {
        this.model = '';
      }
    },
    focus () {
      if (this.editable) {
        this.focused = true;
      }
    },
    blur () {
      this.focused = false;
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer);
  }
};

var Select = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-picker-textfield',{attrs:{"disable":_vm.disable,"readonly":_vm.readonly,"label":_vm.label,"placeholder":_vm.placeholder,"static-label":_vm.staticLabel,"value":_vm.actualValue},nativeOn:{"keydown":function($event){if(_vm._k($event.keyCode,"enter",13)){ return null; }_vm.open($event);}}},[_c('q-popover',{ref:"popover",attrs:{"disable":_vm.disable || _vm.readonly,"fit":""}},[_c('div',{staticClass:"q-select-popover list highlight"},[_vm._l((_vm.options),function(radio){return (_vm.type === 'radio')?_c('label',{key:radio,staticClass:"item",on:{"click":_vm.close}},[_c('div',{staticClass:"item-primary"},[_c('q-radio',{attrs:{"val":radio.value},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v;}}})],1),_c('div',{staticClass:"item-content"},[_c('div',{domProps:{"innerHTML":_vm._s(radio.label)}})])]):_vm._e()}),(_vm.type === 'list')?_c('div',{staticClass:"list no-border highlight",class:{'item-delimiter': _vm.delimiter},staticStyle:{"min-width":"100px"}},_vm._l((_vm.options),function(opt){return _c('q-list-item',{key:opt,attrs:{"item":opt,"link":"","active":_vm.model === opt.value},nativeOn:{"click":function($event){_vm.__setAndClose(opt.value);}}})})):_vm._e(),_vm._l((_vm.options),function(checkbox,index){return (_vm.type === 'checkbox')?_c('label',{key:checkbox,staticClass:"item"},[_c('div',{staticClass:"item-primary"},[_c('q-checkbox',{attrs:{"value":_vm.optModel[index]},on:{"input":function($event){_vm.toggleValue(checkbox.value);}}})],1),_c('div',{staticClass:"item-content"},[_c('div',{domProps:{"innerHTML":_vm._s(checkbox.label)}})])]):_vm._e()}),_vm._l((_vm.options),function(toggle,index){return (_vm.type === 'toggle')?_c('label',{key:toggle,staticClass:"item"},[_c('div',{staticClass:"item-content has-secondary"},[_c('div',{domProps:{"innerHTML":_vm._s(toggle.label)}})]),_c('div',{staticClass:"item-secondary"},[_c('q-toggle',{attrs:{"value":_vm.optModel[index]},on:{"input":function($event){_vm.toggleValue(toggle.value);}}})],1)]):_vm._e()})],2)])],1)},staticRenderFns: [],
  props: {
    value: {
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator (options) {
        return !options.some(opt =>
          typeof opt.label === 'undefined' || typeof opt.value === 'undefined'
        )
      }
    },
    type: {
      type: String,
      default: 'list',
      validator (value) {
        return ['radio', 'list', 'checkbox', 'toggle'].includes(value)
      }
    },
    label: String,
    placeholder: String,
    staticLabel: String,
    readonly: Boolean,
    disable: Boolean,
    delimiter: Boolean
  },
  computed: {
    model: {
      get () {
        if (this.multipleSelection && !Array.isArray(this.value)) {
          console.error('Select model needs to be an array when using multiple selection.');
        }
        return this.value
      },
      set (value) {
        this.$emit('input', value);
      }
    },
    optModel () {
      /* Used by multiple selection only */
      if (this.multipleSelection) {
        return this.options.map(opt => this.model.includes(opt.value))
      }
    },
    multipleSelection () {
      return ['checkbox', 'toggle'].includes(this.type)
    },
    actualValue () {
      if (!this.multipleSelection) {
        let option = this.options.find(option => option.value === this.model);
        return option ? option.label : ''
      }

      let options = this.options
        .filter(opt => this.model.includes(opt.value))
        .map(opt => opt.label);

      return !options.length ? '' : options.join(', ')
    }
  },
  methods: {
    open (event) {
      if (!this.disable && !this.readonly) {
        this.$refs.popover.open(event);
      }
    },
    close () {
      this.$refs.popover.close();
    },
    toggleValue (value) {
      let index = this.model.indexOf(value);
      if (index >= 0) {
        this.model.splice(index, 1);
      }
      else {
        this.model.push(value);
      }
    },

    __setAndClose (val) {
      this.model = val;
      this.close();
    }
  }
};

var DialogSelect = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-picker-textfield',{attrs:{"disable":_vm.disable,"readonly":_vm.readonly,"label":_vm.label,"placeholder":_vm.placeholder,"static-label":_vm.staticLabel,"value":_vm.actualValue},nativeOn:{"click":function($event){_vm.pick($event);},"keydown":function($event){if(_vm._k($event.keyCode,"enter",13)){ return null; }_vm.pick($event);}}})},staticRenderFns: [],
  props: {
    value: {
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator (options) {
        return !options.some(option =>
          typeof option.label === 'undefined' || typeof option.value === 'undefined'
        )
      }
    },
    type: {
      type: String,
      required: true,
      validator (value) {
        return ['radio', 'checkbox', 'toggle'].includes(value)
      }
    },
    okLabel: {
      type: String,
      default: 'OK'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    title: {
      type: String,
      default: 'Select'
    },
    message: String,
    label: String,
    placeholder: String,
    staticLabel: String,
    readonly: Boolean,
    disable: Boolean
  },
  computed: {
    actualValue () {
      if (this.type === 'radio') {
        let option = this.options.find(option => option.value === this.value);
        return option ? option.label : ''
      }

      let options = this.options
        .filter(option => this.value.includes(option.value))
        .map(option => option.label);

      return !options.length ? '' : options.join(', ')
    },
    multipleSelection () {
      return ['checkbox', 'toggle'].includes(this.type)
    }
  },
  methods: {
    pick () {
      if (this.disable || this.readonly) {
        return
      }

      let options = this.options.map(option => {
        return {
          value: option.value,
          label: option.label,
          model: this.multipleSelection ? this.value.includes(option.value) : this.value === option.value
        }
      });

      Dialog.create({
        title: this.title,
        message: this.message,
        form: {
          select: {type: this.type, model: this.value, items: options}
        },
        buttons: [
          this.cancelLabel,
          {
            label: this.okLabel,
            handler: data => {
              this.$emit('input', data.select);
            }
          }
        ]
      });
    }
  }
};

var Slider = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-slider",class:{fullscreen: _vm.inFullscreen}},[_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__pan),expression:"__pan",modifiers:{"horizontal":true}}],staticClass:"q-slider-inner"},[_c('div',{ref:"track",staticClass:"q-slider-track",class:{'with-arrows': _vm.arrows, 'with-toolbar': _vm.toolbar, 'infinite-left': _vm.infiniteLeft, 'infinite-right': _vm.infiniteRight},style:(_vm.trackPosition)},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.infiniteRight),expression:"infiniteRight"}]}),_vm._t("slide"),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.infiniteLeft),expression:"infiniteLeft"}]})],2),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.arrows && _vm.canGoToPrevious),expression:"arrows && canGoToPrevious"}],staticClass:"q-slider-left-button row items-center justify-center"},[_c('i',{on:{"click":_vm.previous}},[_vm._v("keyboard_arrow_left")])]),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.arrows && _vm.canGoToNext),expression:"arrows && canGoToNext"}],staticClass:"q-slider-right-button row items-center justify-center",on:{"click":_vm.next}},[_c('i',[_vm._v("keyboard_arrow_right")])]),(_vm.toolbar)?_c('div',{staticClass:"q-slider-toolbar row items-center justify-end"},[_c('div',{staticClass:"q-slider-dots auto row items-center justify-center"},_vm._l((_vm.slidesNumber),function(n){return (_vm.dots)?_c('i',{domProps:{"textContent":_vm._s((n - 1) !== _vm.slide ? 'panorama_fish_eye' : 'lens')},on:{"click":function($event){_vm.goToSlide(n - 1);}}}):_vm._e()})),_c('div',{staticClass:"row items-center"},[_vm._t("action"),(_vm.fullscreen)?_c('i',{on:{"click":_vm.toggleFullscreen}},[_c('span',{directives:[{name:"show",rawName:"v-show",value:(!_vm.inFullscreen),expression:"!inFullscreen"}]},[_vm._v("fullscreen")]),_vm._v(" "),_c('span',{directives:[{name:"show",rawName:"v-show",value:(_vm.inFullscreen),expression:"inFullscreen"}]},[_vm._v("fullscreen_exit")])]):_vm._e()],2)]):_vm._e(),_vm._t("default")],2)])},staticRenderFns: [],
  mixins: [sliderMixin],
  data () {
    return {
      position: 0,
      slide: 0,
      positionSlide: 0,
      slidesNumber: 0,
      inFullscreen: false,
      animUid: uid()
    }
  },
  watch: {
    autoplay () {
      this.__planAutoPlay();
    },
    infinite () {
      this.__planAutoPlay();
    }
  },
  computed: {
    toolbar () {
      return this.dots || this.fullscreen || this.actions
    },
    trackPosition () {
      return cssTransform(`translateX(${this.position}%)`)
    },
    infiniteRight () {
      return this.infinite && this.slidesNumber > 1 && this.positionSlide >= this.slidesNumber
    },
    infiniteLeft () {
      return this.infinite && this.slidesNumber > 1 && this.positionSlide < 0
    },
    canGoToPrevious () {
      return this.infinite ? this.slidesNumber > 1 : this.slide > 0
    },
    canGoToNext () {
      return this.infinite ? this.slidesNumber > 1 : this.slide < this.slidesNumber - 1
    }
  },
  methods: {
    __pan (event) {
      if (this.infinite && this.animationInProgress) {
        return
      }
      if (!this.hasOwnProperty('initialPosition')) {
        this.initialPosition = this.position;
        this.__cleanup();
      }

      let delta = (event.direction === 'left' ? -1 : 1) * event.distance.x;

      if (
        (this.infinite && this.slidesNumber < 2) ||
        (
          !this.infinite &&
          (
            (this.slide === 0 && delta > 0) ||
            (this.slide === this.slidesNumber - 1 && delta < 0)
          )
        )
      ) {
        delta = delta / 10;
      }

      this.position = this.initialPosition + delta / this.$refs.track.offsetWidth * 100;
      this.positionSlide = (event.direction === 'left' ? this.slide + 1 : this.slide - 1);

      if (event.isFinal) {
        this.goToSlide(
          event.distance.x < 100
            ? this.slide
            : this.positionSlide,
          () => {
            delete this.initialPosition;
          }
        );
      }
    },
    __getSlidesNumber () {
      return this.$slots.slide ? this.$slots.slide.length : 0
    },
    previous (done) {
      if (this.canGoToPrevious) {
        this.goToSlide(this.slide - 1, done);
      }
    },
    next (done) {
      if (this.canGoToNext) {
        this.goToSlide(this.slide + 1, done);
      }
    },
    goToSlide (slide, done) {
      this.__cleanup();

      const finish = () => {
        this.$emit('slide', this.slide);
        this.__planAutoPlay();
        if (typeof done === 'function') {
          done();
        }
      };

      if (this.slidesNumber < 2) {
        this.slide = 0;
        this.positionSlide = 0;
      }
      else {
        if (!this.hasOwnProperty('initialPosition')) {
          this.position = -this.slide * 100;
        }

        if (this.infinite) {
          this.slide = normalizeToInterval(slide, 0, this.slidesNumber - 1);
          this.positionSlide = normalizeToInterval(slide, -1, this.slidesNumber);
        }
        else {
          this.slide = between(slide, 0, this.slidesNumber - 1);
          this.positionSlide = this.slide;
        }
      }

      const pos = -this.positionSlide * 100;

      if (!this.animation) {
        this.position = pos;
        finish();
        return
      }

      this.animationInProgress = true;

      start({
        name: this.animUid,
        pos: this.position,
        finalPos: pos,
        apply: pos => {
          this.position = pos;
        },
        done: () => {
          if (this.infinite) {
            this.position = -this.slide * 100;
            this.positionSlide = this.slide;
          }
          this.animationInProgress = false;
          finish();
        }
      });
    },
    toggleFullscreen () {
      if (this.inFullscreen) {
        if (!Platform.has.popstate) {
          this.__setFullscreen(false);
        }
        else {
          window.history.go(-1);
        }
        return
      }

      this.__setFullscreen(true);
      if (Platform.has.popstate) {
        window.history.pushState({}, '');
        window.addEventListener('popstate', this.__popState);
      }
    },
    __setFullscreen (state) {
      if (this.inFullscreen === state) {
        return
      }

      if (state) {
        this.container.replaceChild(this.fillerNode, this.$el);
        document.body.appendChild(this.$el);
        this.inFullscreen = true;
        return
      }

      this.inFullscreen = false;
      this.container.replaceChild(this.$el, this.fillerNode);
    },
    __popState () {
      if (this.inFullscreen) {
        this.__setFullscreen(false);
      }
      window.removeEventListener('popstate', this.__popState);
    },
    stopAnimation () {
      start.stop(this.animUid);
      this.animationInProgress = false;
    },
    __cleanup () {
      this.stopAnimation();
      clearTimeout(this.timer);
    },
    __planAutoPlay () {
      this.$nextTick(() => {
        if (this.autoplay) {
          clearTimeout(this.timer);
          this.timer = setTimeout(
            this.next,
            typeof this.autoplay === 'number' ? this.autoplay : 5000
          );
        }
      });
    }
  },
  beforeUpdate () {
    const slides = this.__getSlidesNumber();
    if (slides !== this.slidesNumber) {
      this.slidesNumber = slides;
      this.goToSlide(this.slide);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fillerNode = document.createElement('span');
      this.container = this.$el.parentNode;
      this.slidesNumber = this.__getSlidesNumber();
      this.__planAutoPlay();
    });
  },
  beforeDestroy () {
    this.__cleanup();
  }
};

var SAudio = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"fill":_vm.color,"width":_vm.size,"height":_vm.size,"viewBox":"0 0 55 80","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"matrix(1 0 0 -1 0 80)"}},[_c('rect',{attrs:{"width":"10","height":"20","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"4.3s","values":"20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"15","width":"10","height":"80","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"2s","values":"80;55;33;5;75;23;73;33;12;14;60;80","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"30","width":"10","height":"50","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"1.4s","values":"50;34;78;23;56;23;34;76;80;54;21;50","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"45","width":"10","height":"30","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"2s","values":"30;45;13;80;56;72;45;76;34;23;67;30","calcMode":"linear","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SBall = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"stroke":_vm.color,"width":_vm.size,"height":_vm.size,"viewBox":"0 0 57 57","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"translate(1 1)","stroke-width":"2","fill":"none","fill-rule":"evenodd"}},[_c('circle',{attrs:{"cx":"5","cy":"50","r":"5"}},[_c('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","values":"50;5;50;50","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"cx","begin":"0s","dur":"2.2s","values":"5;27;49;5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"27","cy":"5","r":"5"}},[_c('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","from":"5","to":"5","values":"5;50;50;5","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"cx","begin":"0s","dur":"2.2s","from":"27","to":"27","values":"27;49;5;27","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"49","cy":"50","r":"5"}},[_c('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","values":"50;50;5;50","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"cx","from":"49","to":"49","begin":"0s","dur":"2.2s","values":"49;5;27;49","calcMode":"linear","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SBars = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"fill":_vm.color,"width":_vm.size,"height":_vm.size,"viewBox":"0 0 135 140","xmlns":"http://www.w3.org/2000/svg"}},[_c('rect',{attrs:{"y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.5s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.5s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"30","y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.25s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.25s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"60","width":"15","height":"140","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"90","y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.25s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.25s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"120","y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.5s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.5s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SCircles = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"fill":_vm.color,"width":_vm.size,"height":_vm.size,"viewBox":"0 0 135 135","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"d":"M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 67 67","to":"-360 67 67","dur":"2.5s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 67 67","to":"360 67 67","dur":"8s","repeatCount":"indefinite"}})],1)])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SDots = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"fill":_vm.color,"width":_vm.size,"height":_vm.size,"viewBox":"0 0 120 30","xmlns":"http://www.w3.org/2000/svg"}},[_c('circle',{attrs:{"cx":"15","cy":"15","r":"15"}},[_c('animate',{attrs:{"attributeName":"r","from":"15","to":"15","begin":"0s","dur":"0.8s","values":"15;9;15","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"fill-opacity","from":"1","to":"1","begin":"0s","dur":"0.8s","values":"1;.5;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"60","cy":"15","r":"9","fill-opacity":".3"}},[_c('animate',{attrs:{"attributeName":"r","from":"9","to":"9","begin":"0s","dur":"0.8s","values":"9;15;9","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"fill-opacity","from":".5","to":".5","begin":"0s","dur":"0.8s","values":".5;1;.5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"105","cy":"15","r":"15"}},[_c('animate',{attrs:{"attributeName":"r","from":"15","to":"15","begin":"0s","dur":"0.8s","values":"15;9;15","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"fill-opacity","from":"1","to":"1","begin":"0s","dur":"0.8s","values":"1;.5;1","calcMode":"linear","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SFacebook = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","xmlns":"http://www.w3.org/2000/svg","preserveAspectRatio":"xMidYMid"}},[_c('g',{attrs:{"transform":"translate(20 50)"}},[_c('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":_vm.color,"opacity":"0.6"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})],1)]),_c('g',{attrs:{"transform":"translate(50 50)"}},[_c('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":_vm.color,"opacity":"0.8"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0.1s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})],1)]),_c('g',{attrs:{"transform":"translate(80 50)"}},[_c('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":_vm.color,"opacity":"0.9"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0.2s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})],1)])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SGears = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"translate(-20,-20)"}},[_c('path',{attrs:{"d":"M79.9,52.6C80,51.8,80,50.9,80,50s0-1.8-0.1-2.6l-5.1-0.4c-0.3-2.4-0.9-4.6-1.8-6.7l4.2-2.9c-0.7-1.6-1.6-3.1-2.6-4.5 L70,35c-1.4-1.9-3.1-3.5-4.9-4.9l2.2-4.6c-1.4-1-2.9-1.9-4.5-2.6L59.8,27c-2.1-0.9-4.4-1.5-6.7-1.8l-0.4-5.1C51.8,20,50.9,20,50,20 s-1.8,0-2.6,0.1l-0.4,5.1c-2.4,0.3-4.6,0.9-6.7,1.8l-2.9-4.1c-1.6,0.7-3.1,1.6-4.5,2.6l2.1,4.6c-1.9,1.4-3.5,3.1-5,4.9l-4.5-2.1 c-1,1.4-1.9,2.9-2.6,4.5l4.1,2.9c-0.9,2.1-1.5,4.4-1.8,6.8l-5,0.4C20,48.2,20,49.1,20,50s0,1.8,0.1,2.6l5,0.4 c0.3,2.4,0.9,4.7,1.8,6.8l-4.1,2.9c0.7,1.6,1.6,3.1,2.6,4.5l4.5-2.1c1.4,1.9,3.1,3.5,5,4.9l-2.1,4.6c1.4,1,2.9,1.9,4.5,2.6l2.9-4.1 c2.1,0.9,4.4,1.5,6.7,1.8l0.4,5.1C48.2,80,49.1,80,50,80s1.8,0,2.6-0.1l0.4-5.1c2.3-0.3,4.6-0.9,6.7-1.8l2.9,4.2 c1.6-0.7,3.1-1.6,4.5-2.6L65,69.9c1.9-1.4,3.5-3,4.9-4.9l4.6,2.2c1-1.4,1.9-2.9,2.6-4.5L73,59.8c0.9-2.1,1.5-4.4,1.8-6.7L79.9,52.6 z M50,65c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15s15,6.7,15,15C65,58.3,58.3,65,50,65z","fill":_vm.color}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"90 50 50","to":"0 50 50","dur":"1s","repeatCount":"indefinite"}})],1)]),_c('g',{attrs:{"transform":"translate(20,20) rotate(15 50 50)"}},[_c('path',{attrs:{"d":"M79.9,52.6C80,51.8,80,50.9,80,50s0-1.8-0.1-2.6l-5.1-0.4c-0.3-2.4-0.9-4.6-1.8-6.7l4.2-2.9c-0.7-1.6-1.6-3.1-2.6-4.5 L70,35c-1.4-1.9-3.1-3.5-4.9-4.9l2.2-4.6c-1.4-1-2.9-1.9-4.5-2.6L59.8,27c-2.1-0.9-4.4-1.5-6.7-1.8l-0.4-5.1C51.8,20,50.9,20,50,20 s-1.8,0-2.6,0.1l-0.4,5.1c-2.4,0.3-4.6,0.9-6.7,1.8l-2.9-4.1c-1.6,0.7-3.1,1.6-4.5,2.6l2.1,4.6c-1.9,1.4-3.5,3.1-5,4.9l-4.5-2.1 c-1,1.4-1.9,2.9-2.6,4.5l4.1,2.9c-0.9,2.1-1.5,4.4-1.8,6.8l-5,0.4C20,48.2,20,49.1,20,50s0,1.8,0.1,2.6l5,0.4 c0.3,2.4,0.9,4.7,1.8,6.8l-4.1,2.9c0.7,1.6,1.6,3.1,2.6,4.5l4.5-2.1c1.4,1.9,3.1,3.5,5,4.9l-2.1,4.6c1.4,1,2.9,1.9,4.5,2.6l2.9-4.1 c2.1,0.9,4.4,1.5,6.7,1.8l0.4,5.1C48.2,80,49.1,80,50,80s1.8,0,2.6-0.1l0.4-5.1c2.3-0.3,4.6-0.9,6.7-1.8l2.9,4.2 c1.6-0.7,3.1-1.6,4.5-2.6L65,69.9c1.9-1.4,3.5-3,4.9-4.9l4.6,2.2c1-1.4,1.9-2.9,2.6-4.5L73,59.8c0.9-2.1,1.5-4.4,1.8-6.7L79.9,52.6 z M50,65c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15s15,6.7,15,15C65,58.3,58.3,65,50,65z","fill":_vm.color}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"90 50 50","dur":"1s","repeatCount":"indefinite"}})],1)])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SGrid = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"fill":_vm.color,"width":_vm.size,"height":_vm.size,"viewBox":"0 0 105 105","xmlns":"http://www.w3.org/2000/svg"}},[_c('circle',{attrs:{"cx":"12.5","cy":"12.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"0s","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"12.5","cy":"52.5","r":"12.5","fill-opacity":".5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"100ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"52.5","cy":"12.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"300ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"52.5","cy":"52.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"600ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"92.5","cy":"12.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"800ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"92.5","cy":"52.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"400ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"12.5","cy":"92.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"700ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"52.5","cy":"92.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"500ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"92.5","cy":"92.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"200ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SHearts = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"fill":_vm.color,"width":_vm.size,"height":_vm.size,"viewBox":"0 0 140 64","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"d":"M30.262 57.02L7.195 40.723c-5.84-3.976-7.56-12.06-3.842-18.063 3.715-6 11.467-7.65 17.306-3.68l4.52 3.76 2.6-5.274c3.716-6.002 11.47-7.65 17.304-3.68 5.84 3.97 7.56 12.054 3.842 18.062L34.49 56.118c-.897 1.512-2.793 1.915-4.228.9z","fill-opacity":".5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"0s","dur":"1.4s","values":"0.5;1;0.5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('path',{attrs:{"d":"M105.512 56.12l-14.44-24.272c-3.716-6.008-1.996-14.093 3.843-18.062 5.835-3.97 13.588-2.322 17.306 3.68l2.6 5.274 4.52-3.76c5.84-3.97 13.593-2.32 17.308 3.68 3.718 6.003 1.998 14.088-3.842 18.064L109.74 57.02c-1.434 1.014-3.33.61-4.228-.9z","fill-opacity":".5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"0.7s","dur":"1.4s","values":"0.5;1;0.5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('path',{attrs:{"d":"M67.408 57.834l-23.01-24.98c-5.864-6.15-5.864-16.108 0-22.248 5.86-6.14 15.37-6.14 21.234 0L70 16.168l4.368-5.562c5.863-6.14 15.375-6.14 21.235 0 5.863 6.14 5.863 16.098 0 22.247l-23.007 24.98c-1.43 1.556-3.757 1.556-5.188 0z"}})])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SHourglass = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',[_c('path',{staticClass:"glass",attrs:{"fill":"none","stroke":_vm.color,"stroke-width":"5","stroke-miterlimit":"10","d":"M58.4,51.7c-0.9-0.9-1.4-2-1.4-2.3s0.5-0.4,1.4-1.4 C70.8,43.8,79.8,30.5,80,15.5H70H30H20c0.2,15,9.2,28.1,21.6,32.3c0.9,0.9,1.4,1.2,1.4,1.5s-0.5,1.6-1.4,2.5 C29.2,56.1,20.2,69.5,20,85.5h10h40h10C79.8,69.5,70.8,55.9,58.4,51.7z"}}),_c('clipPath',{attrs:{"id":"uil-hourglass-clip1"}},[_c('rect',{staticClass:"clip",attrs:{"x":"15","y":"20","width":"70","height":"25"}},[_c('animate',{attrs:{"attributeName":"height","from":"25","to":"0","dur":"1s","repeatCount":"indefinite","vlaues":"25;0;0","keyTimes":"0;0.5;1"}}),_c('animate',{attrs:{"attributeName":"y","from":"20","to":"45","dur":"1s","repeatCount":"indefinite","vlaues":"20;45;45","keyTimes":"0;0.5;1"}})])]),_c('clipPath',{attrs:{"id":"uil-hourglass-clip2"}},[_c('rect',{staticClass:"clip",attrs:{"x":"15","y":"55","width":"70","height":"25"}},[_c('animate',{attrs:{"attributeName":"height","from":"0","to":"25","dur":"1s","repeatCount":"indefinite","vlaues":"0;25;25","keyTimes":"0;0.5;1"}}),_c('animate',{attrs:{"attributeName":"y","from":"80","to":"55","dur":"1s","repeatCount":"indefinite","vlaues":"80;55;55","keyTimes":"0;0.5;1"}})])]),_c('path',{staticClass:"sand",attrs:{"d":"M29,23c3.1,11.4,11.3,19.5,21,19.5S67.9,34.4,71,23H29z","clip-path":"url(#uil-hourglass-clip1)","fill":_vm.color}}),_c('path',{staticClass:"sand",attrs:{"d":"M71.6,78c-3-11.6-11.5-20-21.5-20s-18.5,8.4-21.5,20H71.6z","clip-path":"url(#uil-hourglass-clip2)","fill":_vm.color}}),_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"180 50 50","repeatCount":"indefinite","dur":"1s","values":"0 50 50;0 50 50;180 50 50","keyTimes":"0;0.7;1"}})],1)])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SInfinity = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid"}},[_c('path',{attrs:{"d":"M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z","fill":"none","stroke":_vm.color,"stroke-width":"8","stroke-dasharray":"10.691205342610678 10.691205342610678","stroke-dashoffset":"0"}},[_c('animate',{attrs:{"attributeName":"stroke-dashoffset","from":"0","to":"21.382410685221355","begin":"0","dur":"2s","repeatCount":"indefinite","fill":"freeze"}})])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SIos = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(0 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0s","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(30 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.08333333333333333s","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(60 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.16666666666666666s","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(90 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.25s","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(120 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.3333333333333333s","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(150 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.4166666666666667s","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(180 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.5s","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(210 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.5833333333333334s","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(240 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.6666666666666666s","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(270 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.75s","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(300 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.8333333333333334s","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"46.5","y":"40","width":"7","height":"20","rx":"5","ry":"5","fill":_vm.color,"transform":"rotate(330 50 50) translate(0 -30)"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"1","to":"0","dur":"1s","begin":"0.9166666666666666s","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SOval = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"stroke":_vm.color,"width":_vm.size,"height":_vm.size,"viewBox":"0 0 38 38","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"translate(1 1)","stroke-width":"2","fill":"none","fill-rule":"evenodd"}},[_c('circle',{attrs:{"stroke-opacity":".5","cx":"18","cy":"18","r":"18"}}),_c('path',{attrs:{"d":"M36 18c0-9.94-8.06-18-18-18"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"1s","repeatCount":"indefinite"}})],1)])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SPie = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"d":"M0 50A50 50 0 0 1 50 0L50 50L0 50","fill":_vm.color,"opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"0.8s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M50 0A50 50 0 0 1 100 50L50 50L50 0","fill":_vm.color,"opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"1.6s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M100 50A50 50 0 0 1 50 100L50 50L100 50","fill":_vm.color,"opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"2.4s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M50 100A50 50 0 0 1 0 50L50 50L50 100","fill":_vm.color,"opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"3.2s","repeatCount":"indefinite"}})],1)])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SPuff = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"stroke":_vm.color,"width":_vm.size,"height":_vm.size,"viewBox":"0 0 44 44","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"fill":"none","fill-rule":"evenodd","stroke-width":"2"}},[_c('circle',{attrs:{"cx":"22","cy":"22","r":"1"}},[_c('animate',{attrs:{"attributeName":"r","begin":"0s","dur":"1.8s","values":"1; 20","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.165, 0.84, 0.44, 1","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"0s","dur":"1.8s","values":"1; 0","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.3, 0.61, 0.355, 1","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"22","cy":"22","r":"1"}},[_c('animate',{attrs:{"attributeName":"r","begin":"-0.9s","dur":"1.8s","values":"1; 20","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.165, 0.84, 0.44, 1","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"-0.9s","dur":"1.8s","values":"1; 0","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.3, 0.61, 0.355, 1","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SRadio = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"scale(0.55)"}},[_c('circle',{attrs:{"cx":"30","cy":"150","r":"30","fill":_vm.color}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})]),_c('path',{attrs:{"d":"M90,150h30c0-49.7-40.3-90-90-90v30C63.1,90,90,116.9,90,150z","fill":_vm.color}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0.1","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})]),_c('path',{attrs:{"d":"M150,150h30C180,67.2,112.8,0,30,0v30C96.3,30,150,83.7,150,150z","fill":_vm.color}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0.2","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})])])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var SRings = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"stroke":_vm.color,"width":_vm.size,"height":_vm.size,"viewBox":"0 0 45 45","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"fill":"none","fill-rule":"evenodd","transform":"translate(1 1)","stroke-width":"2"}},[_c('circle',{attrs:{"cx":"22","cy":"22","r":"6"}},[_c('animate',{attrs:{"attributeName":"r","begin":"1.5s","dur":"3s","values":"6;22","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"1.5s","dur":"3s","values":"1;0","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-width","begin":"1.5s","dur":"3s","values":"2;0","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"22","cy":"22","r":"6"}},[_c('animate',{attrs:{"attributeName":"r","begin":"3s","dur":"3s","values":"6;22","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"3s","dur":"3s","values":"1;0","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-width","begin":"3s","dur":"3s","values":"2;0","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"22","cy":"22","r":"8"}},[_c('animate',{attrs:{"attributeName":"r","begin":"0s","dur":"1.5s","values":"6;1;2;3;4;5;6","calcMode":"linear","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var STail = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 38 38","xmlns":"http://www.w3.org/2000/svg"}},[_c('defs',[_c('linearGradient',{attrs:{"x1":"8.042%","y1":"0%","x2":"65.682%","y2":"23.865%","id":"a"}},[_c('stop',{attrs:{"stop-color":_vm.color,"stop-opacity":"0","offset":"0%"}}),_c('stop',{attrs:{"stop-color":_vm.color,"stop-opacity":".631","offset":"63.146%"}}),_c('stop',{attrs:{"stop-color":_vm.color,"offset":"100%"}})],1)],1),_c('g',{attrs:{"transform":"translate(1 1)","fill":"none","fill-rule":"evenodd"}},[_c('path',{attrs:{"d":"M36 18c0-9.94-8.06-18-18-18","stroke":"url(#a)","stroke-width":"2"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"0.9s","repeatCount":"indefinite"}})],1),_c('circle',{attrs:{"fill":_vm.color,"cx":"36","cy":"18","r":"1"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"0.9s","repeatCount":"indefinite"}})],1)])])},staticRenderFns: [],
  props: ['name', 'size', 'color']
};

var Spinner = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('s-' + _vm.name,{tag:"component",attrs:{"size":_vm.size,"color":_vm.color}})},staticRenderFns: [],
  props: {
    name: {
      type: String,
      default: current === 'ios' ? 'ios' : 'tail'
    },
    size: {
      type: Number,
      default: 64
    },
    color: {
      type: String,
      default: '#000'
    }
  },
  components: {
    SAudio,
    SBall,
    SBars,
    SCircles,
    SDots,
    SFacebook,
    SGears,
    SGrid,
    SHearts,
    SHourglass,
    SInfinity,
    SIos,
    SOval,
    SPie,
    SPuff,
    SRadio,
    SRings,
    STail
  }
};

var State = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',[(_vm.active)?_vm._t("active"):_vm._t("default")],2)},staticRenderFns: [],
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  beforeCreate () {
    console.warn('[Quasar] State component has been deprecated and will be soon removed. Use Vue v-if directive instead.');
  }
};

var Stepper = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-stepper timeline",class:_vm.color},[_vm._t("default")],2)},staticRenderFns: [],
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    backLabel: {
      type: String,
      default: 'Back'
    },
    nextLabel: {
      type: String,
      default: 'Continue'
    },
    finishLabel: {
      type: String,
      default: 'Finish'
    }
  },
  data () {
    return {
      config: {
        steps: 0,
        currentStep: 0
      }
    }
  },
  methods: {
    reset () {
      this.config.currentStep = 1;
      this.$emit('step', this.config.currentStep);
    },
    nextStep () {
      this.config.currentStep++;
      this.$emit('step', this.config.currentStep);
      if (this.config.currentStep > this.config.steps) {
        this.$emit('finish');
      }
    },
    previousStep () {
      this.config.currentStep--;
      this.$emit('step', this.config.currentStep);
    },
    finish () {
      this.config.currentStep = this.config.steps + 1;
      this.$emit('step', this.config.currentStep);
      this.$emit('finish');
    }
  },
  mounted () {
    let step = 1;
    this.config.currentStep = this.config.currentStep || 1;
    this.config.steps = this.$children.length;
    this.$emit('step', this.config.currentStep);
    this.$children.forEach(child => {
      child.step = step;
      step++;
    });
  }
};

var Step = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"timeline-item",class:{incomplete: _vm.step > _vm.stepper.currentStep}},[_c('div',{staticClass:"timeline-badge"},[_c('i',{directives:[{name:"show",rawName:"v-show",value:(!_vm.done),expression:"!done"}]},[_vm._v("done ")]),(_vm.icon && _vm.done)?_c('i',[_vm._v(_vm._s(_vm.icon))]):_vm._e(),_vm._v(" "),_c('span',{directives:[{name:"show",rawName:"v-show",value:(!_vm.icon && _vm.done),expression:"!icon && done"}]},[_vm._v(_vm._s(_vm.step))])]),_c('div',{staticClass:"timeline-title text-bold",domProps:{"innerHTML":_vm._s(_vm.title)}}),_c('q-transition',{attrs:{"name":"slide"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.stepper && _vm.step === _vm.stepper.currentStep),expression:"stepper && step === stepper.currentStep"}],staticClass:"timeline-content"},[_vm._t("default"),_c('div',{staticClass:"group",staticStyle:{"margin-top":"1rem","margin-left":"-5px"}},[_c('button',{class:[_vm.color, !_vm.ready ? 'disabled' : ''],on:{"click":function($event){_vm.nextStep();}}},[_vm._v(_vm._s(_vm.stepper && _vm.step === _vm.stepper.steps ? _vm.$parent.finishLabel : _vm.$parent.nextLabel))]),_vm._v(" "),(_vm.step > 1)?_c('button',{staticClass:"clear",class:_vm.color,domProps:{"innerHTML":_vm._s(_vm.$parent.backLabel)},on:{"click":function($event){_vm.previousStep();}}}):_vm._e()])],2)])],1)},staticRenderFns: [],
  props: {
    title: {
      type: String,
      required: true
    },
    ready: {
      type: Boolean,
      default: true
    },
    beforeNext: {
      type: Function,
      default: null
    },
    icon: String
  },
  data () {
    return {
      step: -1
    }
  },
  computed: {
    stepper () {
      return this.$parent.config
    },
    done () {
      return this.step >= this.stepper.currentStep
    },
    color () {
      return this.$parent.color
    }
  },
  methods: {
    nextStep () {
      if (!this.ready) {
        return
      }
      if (this.beforeNext) {
        this.beforeNext(this.$parent.nextStep);
        return
      }
      this.$parent.nextStep();
    },
    previousStep () {
      this.$parent.previousStep();
    },
    finish () {
      this.$parent.finish();
    }
  }
};

var Tab = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.route)?_c('router-link',{ref:"routerLink",staticClass:"q-tab items-center justify-center",class:{ active: _vm.isActive, hidden: _vm.hidden, disabled: _vm.disable, hideIcon: _vm.hide === 'icon', hideLabel: _vm.hide === 'label' },attrs:{"to":_vm.route,"replace":_vm.replace,"append":_vm.append,"exact":_vm.exact,"tag":"div"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.activate();}}},[(_vm.icon)?_c('i',{staticClass:"q-tabs-icon"},[_vm._v(_vm._s(_vm.icon))]):_vm._e(),_vm._v(" "),_c('span',{staticClass:"q-tab-label"},[_vm._t("default")],2)]):_c('div',{staticClass:"q-tab items-center justify-center",class:{ active: _vm.isActive, hidden: _vm.hidden, disabled: _vm.disable, hideIcon: _vm.hide === 'icon', hideLabel: _vm.hide === 'label' },on:{"click":function($event){_vm.activate();}}},[(_vm.icon)?_c('i',{staticClass:"q-tabs-icon"},[_vm._v(_vm._s(_vm.icon))]):_vm._e(),_vm._v(" "),_c('span',{staticClass:"q-tab-label"},[_vm._t("default")],2)])},staticRenderFns: [],
  props: {
    label: String,
    icon: String,
    disable: Boolean,
    hidden: Boolean,
    hide: {
      type: String,
      default: ''
    },
    name: String,
    route: [String, Object],
    replace: Boolean,
    exact: Boolean,
    append: Boolean
  },
  computed: {
    uid () {
      return this.name || Utils.uid()
    },
    isActive () {
      return this.$parent.activeTab === this.uid
    },
    targetElement () {
      return this.$parent.refs && this.$parent.refs[this.uid]
    }
  },
  watch: {
    isActive (value) {
      this.$emit('selected', value);
      this.setTargetVisibility(value);
    }
  },
  created () {
    if (this.route) {
      this.$watch('$route', () => {
        this.$nextTick(() => {
          this.__selectTabIfRouteMatches();
        });
      });
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setTargetVisibility(this.isActive);
      if (this.route) {
        this.__selectTabIfRouteMatches();
      }
    });
  },
  methods: {
    activate () {
      if (!this.isActive && !this.disable) {
        if (this.route) {
          this.$refs.routerLink.$el.click();
        }
        else {
          this.$parent.setActiveTab(this.uid);
        }
      }
    },
    deactivate () {
      if (this.isActive && !this.disable) {
        this.$parent.setActiveTab(false);
      }
    },
    setTargetVisibility (visible) {
      if (this.targetElement) {
        this.targetElement.style.display = visible ? '' : 'none';
      }
    },
    __selectTabIfRouteMatches () {
      this.$nextTick(() => {
        if (this.route && this.$refs.routerLink.$el.classList.contains('router-link-active')) {
          this.$parent.setActiveTab(this.uid);
        }
      });
    }
  }
};

const scrollNavigationSpeed = 5;
const debounceDelay = 50; // in ms

var Tabs = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-tabs row"},[_c('div',{ref:"leftScroll",staticClass:"row items-center justify-center left-scroll"},[_c('i',[_vm._v("chevron_left")])]),_c('div',{ref:"scroller",staticClass:"q-tabs-scroller row"},[_vm._t("default")],2),_c('div',{ref:"rightScroll",staticClass:"row items-center justify-center right-scroll"},[_c('i',[_vm._v("chevron_right")])])])},staticRenderFns: [],
  props: {
    refs: {
      type: Object
    },
    value: [String, Object],
    defaultTab: {
      type: [String, Boolean],
      default: false
    }
  },
  data () {
    return {
      innerValue: false
    }
  },
  computed: {
    activeTab: {
      get () {
        return this.usingModel ? this.value : this.innerValue
      },
      set (value) {
        if (this.usingModel) {
          this.$emit('input', value);
        }
        else {
          this.innerValue = value;
        }
      }
    },
    usingModel () {
      return typeof this.value !== 'undefined'
    }
  },
  watch: {
    activeTab (value) {
      this.$emit('change', value);
      if (!value) {
        return
      }
      this.__findTabAndScroll(value);
    },
    '$children' () {
      this.redraw();
    }
  },
  created () {
    this.scrollTimer = null;
    this.scrollable = !Platform.is.desktop;

    // debounce some costly methods;
    // debouncing here because debounce needs to be per instance
    this.__redraw = Utils.debounce(this.__redraw, debounceDelay);
    this.__updateScrollIndicator = Utils.debounce(this.__updateScrollIndicator, debounceDelay);
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.scroller.addEventListener('scroll', this.__updateScrollIndicator);
      window.addEventListener('resize', this.__redraw);

      // let browser drawing stabilize then
      setTimeout(() => { this.__redraw(); }, debounceDelay);

      if (Platform.is.desktop) {
        var scrollEvents = {
          start: [],
          stop: []
        };

        scrollEvents.start.push('mousedown');
        scrollEvents.stop.push('mouseup');

        if (Platform.has.touch) {
          scrollEvents.start.push('touchstart');
          scrollEvents.stop.push('touchend');
        }

        scrollEvents.start.forEach(evt => {
          this.$refs.leftScroll.addEventListener(evt, () => {
            this.__animScrollTo(0);
          });
          this.$refs.rightScroll.addEventListener(evt, () => {
            this.__animScrollTo(9999);
          });
        });
        scrollEvents.stop.forEach(evt => {
          this.$refs.leftScroll.addEventListener(evt, () => {
            clearInterval(this.scrollTimer);
          });
          this.$refs.rightScroll.addEventListener(evt, () => {
            clearInterval(this.scrollTimer);
          });
        });
      }

      if (this.usingModel && this.defaultTab) {
        console.warn('Tabs ignoring default-tab since using v-model.', this.$el);
      }
      if (this.usingModel) {
        this.__findTabAndScroll(this.activeTab);
      }
      else if (this.defaultTab) {
        this.setActiveTab(this.defaultTab);
        this.__findTabAndScroll(this.defaultTab);
      }
      else {
        this.__findTabAndScroll(this.activeTab);
      }
    });
  },
  beforeDestroy () {
    clearInterval(this.scrollTimer);
    this.$refs.scroller.removeEventListener('scroll', this.__updateScrollIndicator);
    window.removeEventListener('resize', this.__redraw);
  },
  methods: {
    setActiveTab (name) {
      this.activeTab = name;
    },
    __redraw () {
      if (!Platform.is.desktop) {
        return
      }
      if (Utils.dom.width(this.$refs.scroller) === 0 && this.$refs.scroller.scrollWidth === 0) {
        return
      }
      if (Utils.dom.width(this.$refs.scroller) + 5 < this.$refs.scroller.scrollWidth) {
        this.$el.classList.add('scrollable');
        this.scrollable = true;
        this.__updateScrollIndicator();
      }
      else {
        this.$el.classList.remove('scrollable');
        this.scrollable = false;
      }
    },
    __updateScrollIndicator () {
      if (!Platform.is.desktop || !this.scrollable) {
        return
      }

      let action = this.$refs.scroller.scrollLeft + Utils.dom.width(this.$refs.scroller) + 5 >= this.$refs.scroller.scrollWidth ? 'add' : 'remove';

      this.$refs.leftScroll.classList[this.$refs.scroller.scrollLeft <= 0 ? 'add' : 'remove']('disabled');
      this.$refs.rightScroll.classList[action]('disabled');
    },
    __findTabAndScroll (value) {
      setTimeout(() => {
        let tabElement = this.$children.find(child => child.uid === value);
        if (tabElement) {
          this.__scrollToSelectedIfNeeded(tabElement.$el);
        }
      }, debounceDelay * 4);
    },
    __scrollToSelectedIfNeeded (tab) {
      if (!tab || !this.scrollable) {
        return
      }

      let
        contentRect = this.$refs.scroller.getBoundingClientRect(),
        tabRect = tab.getBoundingClientRect(),
        tabWidth = tabRect.width,
        offset = tabRect.left - contentRect.left;

      if (offset < 0) {
        this.__animScrollTo(this.$refs.scroller.scrollLeft + offset);
      }
      else {
        offset += tabWidth - this.$refs.scroller.offsetWidth;
        if (offset > 0) {
          this.__animScrollTo(this.$refs.scroller.scrollLeft + offset);
        }
      }
    },
    __animScrollTo (value) {
      clearInterval(this.scrollTimer);
      this.__scrollTowards(value);
      this.scrollTimer = setInterval(() => {
        if (this.__scrollTowards(value)) {
          clearInterval(this.scrollTimer);
        }
      }, 5);
    },
    __scrollTowards (value) {
      let
        scrollPosition = this.$refs.scroller.scrollLeft,
        direction = value < scrollPosition ? -1 : 1,
        done = false;

      scrollPosition += direction * scrollNavigationSpeed;

      if (scrollPosition < 0) {
        done = true;
        scrollPosition = 0;
      }
      else if (
        (direction === -1 && scrollPosition <= value) ||
        (direction === 1 && scrollPosition >= value)
      ) {
        done = true;
        scrollPosition = value;
      }

      this.$refs.scroller.scrollLeft = scrollPosition;
      return done
    }
  }
};

var Toggle = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{directives:[{name:"touch-swipe",rawName:"v-touch-swipe.horizontal",value:(_vm.__swipe),expression:"__swipe",modifiers:{"horizontal":true}}],staticClass:"q-toggle cursor-pointer",class:{disabled: _vm.disable},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.toggle($event);}}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],attrs:{"type":"checkbox","disabled":_vm.disable},domProps:{"checked":Array.isArray(_vm.model)?_vm._i(_vm.model,null)>-1:(_vm.model)},on:{"click":function($event){$event.stopPropagation();},"change":_vm.__change,"__c":function($event){var $$a=_vm.model,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$c){$$i<0&&(_vm.model=$$a.concat($$v));}else{$$i>-1&&(_vm.model=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.model=$$c;}}}}),_c('div'),(_vm.icon)?_c('i',[_vm._v(_vm._s(_vm.icon))]):_vm._e()])},staticRenderFns: [],
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disable: Boolean,
    icon: String
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        if (value !== this.value) {
          this.$emit('input', value);
        }
      }
    }
  },
  methods: {
    toggle () {
      if (!this.disable) {
        this.model = !this.model;
      }
    },
    __change (e) {
      if (this.$q.platform.is.ios) {
        this.toggle();
      }
    },
    __swipe (evt) {
      if (!this.disable) {
        if (this.model && evt.direction === 'left') {
          this.model = false;
        }
        else if (!this.model && evt.direction === 'right') {
          this.model = true;
        }
      }
    }
  }
};

var Tooltip = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"q-tooltip animate-scale",style:(_vm.transformCSS)},[_vm._t("default")],2)},staticRenderFns: [],
  props: {
    anchor: {
      type: String,
      default: 'top middle',
      validator: Utils.popup.positionValidator
    },
    self: {
      type: String,
      default: 'bottom middle',
      validator: Utils.popup.positionValidator
    },
    offset: {
      type: Array,
      validator: Utils.popup.offsetValidator
    },
    maxHeight: String,
    disable: Boolean
  },
  data () {
    return {
      opened: false
    }
  },
  computed: {
    anchorOrigin () {
      return Utils.popup.parsePosition(this.anchor)
    },
    selfOrigin () {
      return Utils.popup.parsePosition(this.self)
    },
    transformCSS () {
      return Utils.popup.getTransformProperties({
        selfOrigin: this.selfOrigin
      })
    }
  },
  methods: {
    toggle () {
      if (this.opened) {
        this.close();
      }
      else {
        this.open();
      }
    },
    open () {
      if (this.disable) {
        return
      }
      this.opened = true;
      document.body.appendChild(this.$el);
      this.scrollTarget = Utils.dom.getScrollTarget(this.anchorEl);
      this.scrollTarget.addEventListener('scroll', this.close);
      window.addEventListener('resize', this.__debouncedUpdatePosition);
      if (Platform.is.mobile) {
        document.body.addEventListener('click', this.close, true);
      }
      this.__updatePosition();
    },
    close () {
      if (this.opened) {
        this.opened = false;
        this.scrollTarget.removeEventListener('scroll', this.close);
        window.removeEventListener('resize', this.__debouncedUpdatePosition);
        document.body.removeChild(this.$el);
        if (Platform.is.mobile) {
          document.body.removeEventListener('click', this.close, true);
        }
      }
    },
    __updatePosition () {
      Utils.popup.setPosition({
        el: this.$el,
        offset: this.offset,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        maxHeight: this.maxHeight
      });
    }
  },
  created () {
    this.__debouncedUpdatePosition = Utils.debounce(() => {
      this.__updatePosition();
    }, 70);
  },
  mounted () {
    this.$nextTick(() => {
      /*
        The following is intentional.
        Fixes a bug in Chrome regarding offsetHeight by requiring browser
        to calculate this before removing from DOM and using it for first time.
      */
      this.$el.offsetHeight; // eslint-disable-line

      this.anchorEl = this.$el.parentNode;
      this.anchorEl.removeChild(this.$el);
      if (Platform.is.mobile) {
        this.anchorEl.addEventListener('click', this.open);
      }
      else {
        this.anchorEl.addEventListener('mouseenter', this.open);
        this.anchorEl.addEventListener('focus', this.open);
        this.anchorEl.addEventListener('mouseleave', this.close);
        this.anchorEl.addEventListener('blur', this.close);
      }
    });
  },
  beforeDestroy () {
    if (Platform.is.mobile) {
      this.anchorEl.removeEventListener('click', this.open);
    }
    else {
      this.anchorEl.removeEventListener('mouseenter', this.open);
      this.anchorEl.removeEventListener('click', this.open);
      this.anchorEl.removeEventListener('mouseleave', this.close);
      this.anchorEl.removeEventListener('blur', this.close);
    }
    this.close();
  }
};

var QTreeItem = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{staticClass:"q-tree-item"},[_c('div',{class:{'q-tree-expandable-item': _vm.isExpandable, 'q-tree-link': _vm.model.handler},on:{"click":_vm.toggle}},[(_vm.model.icon)?_c('i',[_vm._v(_vm._s(_vm.model.icon))]):_vm._e(),_vm._v(" "),_c('span',{staticClass:"q-tree-label"},[_vm._v(_vm._s(_vm.model.title))]),_vm._v(" "),(_vm.isExpandable)?_c('span',{domProps:{"innerHTML":_vm._s(_vm.model.expanded ? _vm.contractHtml : _vm.expandHtml)}}):_vm._e()]),_c('q-transition',{attrs:{"name":"slide"}},[_c('ul',{directives:[{name:"show",rawName:"v-show",value:(_vm.isExpandable && _vm.model.expanded),expression:"isExpandable && model.expanded"}]},_vm._l((_vm.model.children),function(item){return _c('q-tree-item',{key:item,attrs:{"model":item,"contract-html":_vm.contractHtml,"expand-html":_vm.expandHtml}})}))])],1)},staticRenderFns: [],
  name: 'q-tree-item',
  props: ['model', 'contract-html', 'expand-html'],
  methods: {
    toggle () {
      if (this.isExpandable) {
        this.model.expanded = !this.model.expanded;
        return
      }

      if (typeof this.model.handler === 'function') {
        this.model.handler(this.model);
      }
    }
  },
  computed: {
    isExpandable () {
      return this.model.children && this.model.children.length
    }
  }
};

var Tree = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-tree"},[_c('ul',_vm._l((_vm.model),function(item){return _c('q-tree-item',{key:item,attrs:{"model":item,"contract-html":_vm.contractHtml,"expand-html":_vm.expandHtml}})}))])},staticRenderFns: [],
  props: {
    model: {
      type: Array,
      required: true
    },
    contractHtml: {
      type: String,
      required: true,
      default: '<i>remove_circle</i>'
    },
    expandHtml: {
      type: String,
      required: true,
      default: '<i>add_circle</i>'
    }
  },
  components: {
    QTreeItem
  }
};

var Uploader = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-uploader"},[_c('input',{ref:"file",attrs:{"type":"file","accept":_vm.extensions,"multiple":_vm.multiple},on:{"change":_vm.__add}}),(_vm.uploading)?_c('div',[_c('span',{staticClass:"chip label bg-light q-uploader-progress"},[_c('span',{domProps:{"innerHTML":_vm._s(_vm.computedLabel.uploading)}}),_c('spinner',{attrs:{"size":15}}),_vm._v(_vm._s(_vm.progress)+"%")],1)]):_c('div',{staticClass:"group"},[_c('button',{class:_vm.buttonClass,attrs:{"disabled":_vm.addButtonDisabled},domProps:{"innerHTML":_vm._s(_vm.computedLabel.add)},on:{"click":function($event){_vm.$refs.file.click();}}}),_vm._v(" "),(!_vm.hideUploadButton)?_c('button',{class:_vm.buttonClass,attrs:{"disabled":_vm.files.length === 0},domProps:{"innerHTML":_vm._s(_vm.computedLabel.upload)},on:{"click":_vm.upload}}):_vm._e()]),_c('div',{staticClass:"row wrap items-center group"},[_vm._l((_vm.images),function(img){return _c('div',{key:img.name,staticClass:"card"},[_c('div',{staticClass:"card-title"},[_vm._v(_vm._s(img.name))]),_c('div',{staticClass:"card-media"},[_c('img',{attrs:{"src":img.src}})]),_c('div',{staticClass:"card-content"},[_c('div',{staticClass:"row items-center"},[_c('span',{staticClass:"text-faded"},[_vm._v(_vm._s(img.__file.__size))]),_c('div',{staticClass:"auto"}),_c('button',{directives:[{name:"show",rawName:"v-show",value:(!_vm.uploading),expression:"!uploading"}],staticClass:"primary clear small",domProps:{"innerHTML":_vm._s(_vm.computedLabel.remove)},on:{"click":function($event){_vm.__remove(img.name);}}})])]),(img.__file.__progress)?_c('q-progress',{attrs:{"percentage":img.__file.__progress}}):_vm._e(),(img.__file.__failed)?_c('div',{staticClass:"q-uploader-failed",domProps:{"innerHTML":_vm._s(_vm.computedLabel.failed)}}):_vm._e()],1)}),_vm._l((_vm.otherFiles),function(file){return _c('div',{key:file.name,staticClass:"card"},[_c('div',{staticClass:"card-title"},[_vm._v(_vm._s(file.name))]),_c('div',{staticClass:"card-content"},[_c('div',{staticClass:"row items-center"},[_c('span',{staticClass:"text-faded"},[_vm._v(_vm._s(file.__size))]),_c('div',{staticClass:"auto"}),_c('button',{directives:[{name:"show",rawName:"v-show",value:(!_vm.uploading),expression:"!uploading"}],staticClass:"primary clear small",domProps:{"innerHTML":_vm._s(_vm.computedLabel.remove)},on:{"click":function($event){_vm.__remove(file.name);}}})])]),(file.__progress)?_c('q-progress',{attrs:{"percentage":file.__progress}}):_vm._e(),(file.__failed)?_c('div',{staticClass:"q-uploader-failed",domProps:{"innerHTML":_vm._s(_vm.computedLabel.failed)}}):_vm._e()],1)})],2)])},staticRenderFns: [],
  props: {
    headers: Object,
    url: {
      type: String,
      required: true
    },
    additionalFields: {
      type: Array,
      default: () => []
    },
    buttonClass: {
      type: String,
      default: 'primary'
    },
    labels: {
      type: Object,
      default () {
        return {}
      }
    },
    method: {
      type: String,
      default: 'POST'
    },
    extensions: String,
    multiple: Boolean,
    hideUploadButton: Boolean
  },
  data () {
    return {
      files: [],
      uploading: false,
      uploadedSize: 0,
      totalSize: 0,
      images: [],
      otherFiles: []
    }
  },
  computed: {
    progress () {
      return this.totalSize ? (this.uploadedSize / this.totalSize * 100).toFixed(2) : 0
    },
    computedLabel () {
      return Utils.extend({
        add: this.multiple ? '<i>add</i> Add Files' : '<i>add</i> Pick File',
        remove: '<i>clear</i> Remove',
        upload: '<i>file_upload</i> Upload',
        failed: '<i>warning</i> Failed',
        uploading: 'Uploading...'
      }, this.labels)
    },
    addButtonDisabled () {
      return !this.multiple && this.files.length >= 1
    }
  },
  methods: {
    __add (e) {
      if (!this.multiple && this.files.length >= 1) {
        return
      }

      let files = Array.prototype.slice.call(e.target.files);
      this.$emit('add', files);

      files = files
        .filter(file => !this.files.some(f => file.name === f.name))
        .map(file => {
          file.__failed = false;
          file.__uploaded = 0;
          file.__progress = 0;
          file.__size = Utils.format.humanStorageSize(file.size);
          return file
        });

      files.filter(file => file.type.startsWith('image')).forEach((file, index) => {
        var reader = new FileReader();
        reader.onload = (e) => {
          let img = new Image();
          img.src = e.target.result;
          img.name = file.name;
          img.__file = file;
          this.images.push(img);
        };
        reader.readAsDataURL(file);
      });
      this.otherFiles = this.otherFiles.concat(files.filter(file => !file.type.startsWith('image')));
      this.files = this.files.concat(files);
    },
    __remove (name, done) {
      this.$emit(done ? 'upload' : 'remove', name);
      this.images = this.images.filter(file => file.name !== name);
      this.otherFiles = this.otherFiles.filter(file => file.name !== name);
      this.files = this.files.filter(file => file.name !== name);
    },
    __getUploadPromise (file) {
      var form = new FormData();
      var xhr = new XMLHttpRequest();

      try {
        form.append('Content-Type', file.type || 'application/octet-stream');
        form.append('file', file);
        this.additionalFields.forEach(field => {
          form.append(field.name, field.value);
        });
      }
      catch (e) {
        return
      }

      file.__uploaded = 0;
      file.__progress = 0;
      file.__failed = false;
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', e => {
          e.percent = e.total ? e.loaded / e.total : 0;
          let uploaded = e.percent * file.size;
          this.uploadedSize += uploaded - file.__uploaded;
          file.__uploaded = uploaded;
          file.__progress = parseInt(e.percent * 100, 10);
        }, false);

        xhr.onreadystatechange = () => {
          if (xhr.readyState < 4) {
            return
          }
          if (xhr.status && xhr.status < 400) {
            this.__remove(file.name, true);
            resolve(file);
          }
          else {
            file.__failed = true;
            reject(xhr);
          }
        };

        xhr.onerror = () => {
          reject(xhr);
        };

        xhr.open(this.method, this.url, true);
        if (this.headers) {
          Object.keys(this.headers).forEach(key => {
            xhr.setRequestHeader(key, this.headers[key]);
          });
        }
        xhr.send(form);
      })
    },
    upload () {
      let filesDone = 0;
      const length = this.files.length;

      if (!length) {
        return
      }

      this.uploadedSize = 0;
      this.totalSize = this.files.map(file => file.size).reduce((total, size) => total + size);
      this.uploading = true;
      this.$emit('start');

      let solved = () => {
        filesDone++;
        if (filesDone === length) {
          this.uploading = false;
          this.$emit('finish');
        }
      };

      this.files.map(file => this.__getUploadPromise(file)).forEach(promise => {
        promise.then(solved).catch(solved);
      });
    }
  }
};

var Video = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"video"},[_c('iframe',{attrs:{"src":_vm.src,"frameborder":"0","allowfullscreen":""}})],1)},staticRenderFns: [],
  props: ['src']
};

function registerDirectives (_Vue) {
  [
    ['back-to-top', dBackToTop],
    ['go-back', dGoBack],
    ['link', dLink],
    ['scroll-fire', dScrollFire],
    ['scroll', dScroll],
    ['touch-hold', dTouchHold],
    ['touch-pan', dTouchPan],
    ['touch-swipe', dTouchSwipe]
  ].forEach(d => {
    _Vue.directive(d[0], d[1]);
  });
}

function registerComponents (_Vue) {
  _Vue.component('spinner', Spinner);
  _Vue.component('q-transition', Transition)

  ;[
    ['ajax-bar', AjaxBar],
    ['autocomplete', Autocomplete],
    ['checkbox', Checkbox],
    ['chips', Chips],
    ['collapsible', Collapsible],
    ['context-menu', Platform.is.desktop ? ContextMenuDesktop : ContextMenuMobile],
    ['data-table', DataTable],
    ['inline-datetime', current === 'ios' ? InlineDatetimeIOS : InlineDatetimeMaterial],
    ['datetime', Datetime],
    ['datetime-range', DatetimeRange],
    ['drawer', Drawer],
    ['drawer-link', DrawerLink],
    ['fab', Fab],
    ['small-fab', SmallFab],
    ['gallery', Gallery],
    ['gallery-slider', GallerySlider],
    ['checkbox', Checkbox],
    ['infinite-scroll', InfiniteScroll],
    ['knob', Knob],
    ['layout', Layout],
    ['list-item', ListItem],
    ['toolbar-title', ToolbarTitle],
    ['modal', Modal],
    ['numeric', Numeric],
    ['pagination', Pagination$1],
    ['parallax', Parallax],
    ['picker-textfield', PickerTextfield],
    ['popover', Popover],
    ['progress', Progress],
    ['progress-button', ProgressButton],
    ['pull-to-refresh', PullToRefresh],
    ['radio', Radio],
    ['range', Range],
    ['double-range', DoubleRange],
    ['rating', Rating],
    ['search', Search],
    ['select', Select],
    ['dialog-select', DialogSelect],
    ['slider', Slider],
    ['state', State],
    ['stepper', Stepper],
    ['step', Step],
    ['tab', Tab],
    ['tabs', Tabs],
    ['toggle', Toggle],
    ['tooltip', Tooltip],
    ['tree', Tree],
    ['uploader', Uploader],
    ['video', Video]
  ].forEach(c => {
    _Vue.component('q-' + c[0], c[1]);
  });
}

var Vue;

var install$$1 = function (_Vue) {
  if (this.installed) {
    console.warn('Quasar already installed in Vue.');
    return
  }

  Vue = _Vue;

  install$1(_Vue);
  registerDirectives(_Vue);
  registerComponents(_Vue);
  install$2(_Vue);

  _Vue.prototype.$q = {
    version,
    platform: Platform,
    theme: current,
    events: Events
  };
};

var start$1 = function (callback = function () {}) {
  /*
    if on Cordova, but not on an iframe,
    like on Quasar Play app
   */
  if (Platform.is.cordova && !Platform.within.iframe) {
    var tag = document.createElement('script');

    document.addEventListener('deviceready', callback, false);

    tag.type = 'text/javascript';
    document.body.appendChild(tag);
    tag.src = 'cordova.js';

    return
  }

  callback();
};

var standaloneInstall = function (Quasar) {
  // auto install in standalone mode
  if (typeof window !== 'undefined' && window.Vue) {
    if (!Quasar.theme.current) {
      Quasar.theme.set('mat');
    }

    window.Quasar = Quasar;
    window.Vue.use(Quasar);
  }
};

function addClass (className) {
  document.body.classList.add(className);
}

Utils.dom.ready(() => {
  addClass(Platform.is.desktop ? 'desktop' : 'mobile');
  addClass(Platform.has.touch ? 'touch' : 'no-touch');

  if (Platform.is.ios) {
    addClass('platform-ios');
  }
  else if (Platform.is.android) {
    addClass('platform-android');
  }

  if (Platform.within.iframe) {
    addClass('within-iframe');
  }

  if (Platform.is.cordova) {
    addClass('cordova');
  }

  if (Platform.is.electron) {
    addClass('electron');
  }
});

/* eslint-disable no-extend-native, one-var, no-self-compare */

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchEl, startFrom) {
    'use strict';

    let O = Object(this);
    let len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false
    }
    let n = parseInt(startFrom, 10) || 0;
    let k;
    if (n >= 0) {
      k = n;
    }
    else {
      k = len + n;
      if (k < 0) { k = 0; }
    }
    let curEl;
    while (k < len) {
      curEl = O[k];
      if (searchEl === curEl ||
         (searchEl !== searchEl && curEl !== curEl)) { // NaN !== NaN
        return true
      }
      k++;
    }
    return false
  };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (str, position) {
    position = position || 0;
    return this.substr(position, str.length) === str
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (str, position) {
    let subjectString = this.toString();

    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= str.length;

    let lastIndex = subjectString.indexOf(str, position);

    return lastIndex !== -1 && lastIndex === position
  };
}

if (typeof Element.prototype.matches !== 'function') {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function matches (selector) {
    let
      element = this,
      elements = (element.document || element.ownerDocument).querySelectorAll(selector),
      index = 0;

    while (elements[index] && elements[index] !== element) {
      ++index;
    }

    return Boolean(elements[index])
  };
}

if (typeof Element.prototype.closest !== 'function') {
  Element.prototype.closest = function closest (selector) {
    let el = this;
    while (el && el.nodeType === 1) {
      if (el.matches(selector)) {
        return el
      }
      el = el.parentNode;
    }
    return null
  };
}

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value (predicate) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined')
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function')
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value
        }
      }
      return undefined
    }
  });
}

/*
 * Capture errors
 */
window.onerror = function (message, source, lineno, colno, error) {
  Events.$emit('app:error', {
    message: message,
    source: source,
    lineno: lineno,
    colno: colno,
    error: error
  });
};

if (Platform.has.touch) {
  Utils.dom.ready(() => {
    FastClick.attach(document.body);
  });
}

if (Platform.is.mobile && !Platform.is.cordova) {
  Utils.dom.ready(() => {
    // add meta tag for mobile address bar coloring
    let tempDiv = document.createElement('div');
    tempDiv.style.height = '10px';
    tempDiv.style.position = 'absolute';
    tempDiv.style.top = '-100000px';
    tempDiv.className = 'bg-primary';
    document.body.appendChild(tempDiv);

    let primaryColor = window.getComputedStyle(tempDiv).getPropertyValue('background-color');

    document.body.removeChild(tempDiv);

    let rgb = primaryColor.match(/\d+/g);
    let hex = '#' + Utils.colors.rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));

    // http://stackoverflow.com/a/33193739
    let metaTag = document.createElement('meta');

    if (Platform.is.winphone) {
      // <meta name="msapplication-navbutton-color" content="#4285f4">
      metaTag.setAttribute('name', 'msapplication-navbutton-color');
    }

    // Chrome, Firefox OS, Opera, Vivaldi
    if (Platform.is.webkit || Platform.is.vivaldi) {
      // <meta name="theme-color" content="#4285f4">
      metaTag.setAttribute('name', 'theme-color');
    }

    if (Platform.is.safari) {
      // <meta name="apple-mobile-web-app-status-bar-style" content="#4285f4">
      metaTag.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
    }
    metaTag.setAttribute('content', hex);

    document.getElementsByTagName('head')[0].appendChild(metaTag);
  });
}

var ActionSheets = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-modal',{ref:"dialog",attrs:{"position":"bottom","content-css":_vm.contentCss},on:{"close":function($event){_vm.__dismiss();}}},[(_vm.$q.theme === 'mat')?_vm._m(0):_vm._e(),(_vm.$q.theme === 'ios')?_vm._m(1):_vm._e()])},staticRenderFns: [function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(_vm.title)?_c('div',{staticClass:"modal-header",domProps:{"innerHTML":_vm._s(_vm.title)}}):_vm._e(),_c('div',{staticClass:"modal-scroll"},[(_vm.gallery)?_c('div',{staticClass:"q-action-sheet-gallery row wrap items-center justify-center"},_vm._l((_vm.actions),function(button){return _c('div',{staticClass:"cursor-pointer column inline items-center justify-center",class:button.classes,attrs:{"tabindex":"0"},on:{"click":function($event){_vm.close(button.handler);},"keydown":function($event){if(_vm._k($event.keyCode,"enter",13)){ return null; }_vm.close(button.handler);}}},[(button.icon)?_c('i',[_vm._v(_vm._s(button.icon))]):_vm._e(),_vm._v(" "),(button.avatar)?_c('img',{staticClass:"avatar",attrs:{"src":button.avatar}}):_vm._e(),_vm._v(" "),_c('span',[_vm._v(_vm._s(button.label))])])})):_c('div',{staticClass:"list no-border"},_vm._l((_vm.actions),function(button){return _c('div',{staticClass:"item item-link",class:button.classes,attrs:{"tabindex":"0"},on:{"click":function($event){_vm.close(button.handler);},"keydown":function($event){if(_vm._k($event.keyCode,"enter",13)){ return null; }_vm.close(button.handler);}}},[(button.icon)?_c('i',{staticClass:"item-primary"},[_vm._v(_vm._s(button.icon))]):_vm._e(),_vm._v(" "),(button.avatar)?_c('img',{staticClass:"item-primary",attrs:{"src":button.avatar}}):_vm._e(),_c('div',{staticClass:"item-content inset"},[_vm._v(_vm._s(button.label))])])}))]),(_vm.dismiss)?_c('div',{staticClass:"list no-border"},[_c('div',{staticClass:"item item-link",class:_vm.dismiss.classes,attrs:{"tabindex":"0"},on:{"click":function($event){_vm.close();},"keydown":function($event){if(_vm._k($event.keyCode,"enter",13)){ return null; }_vm.close();}}},[(_vm.dismiss.icon)?_c('i',{staticClass:"item-primary"},[_vm._v(_vm._s(_vm.dismiss.icon))]):_vm._e(),_c('div',{staticClass:"item-content inset"},[_vm._v(_vm._s(_vm.dismiss.label))])])]):_vm._e()])},function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"q-action-sheet"},[(_vm.title)?_c('div',{staticClass:"modal-header",domProps:{"innerHTML":_vm._s(_vm.title)}}):_vm._e(),_c('div',{staticClass:"modal-scroll"},[(_vm.gallery)?_c('div',{staticClass:"q-action-sheet-gallery row wrap items-center justify-center"},_vm._l((_vm.actions),function(button){return _c('div',{staticClass:"cursor-pointer column inline items-center justify-center",class:button.classes,attrs:{"tabindex":"0"},on:{"click":function($event){_vm.close(button.handler);},"keydown":function($event){if(_vm._k($event.keyCode,"enter",13)){ return null; }_vm.close(button.handler);}}},[(button.icon)?_c('i',[_vm._v(_vm._s(button.icon))]):_vm._e(),_vm._v(" "),(button.avatar)?_c('img',{staticClass:"avatar",attrs:{"src":button.avatar}}):_vm._e(),_vm._v(" "),_c('span',[_vm._v(_vm._s(button.label))])])})):_c('div',{staticClass:"list no-border"},_vm._l((_vm.actions),function(button){return _c('div',{staticClass:"item item-link",class:button.classes,attrs:{"tabindex":"0"},on:{"click":function($event){_vm.close(button.handler);},"keydown":function($event){if(_vm._k($event.keyCode,"enter",13)){ return null; }_vm.close(button.handler);}}},[(button.icon)?_c('i',{staticClass:"item-primary"},[_vm._v(_vm._s(button.icon))]):_vm._e(),_vm._v(" "),(button.avatar)?_c('img',{staticClass:"item-primary",attrs:{"src":button.avatar}}):_vm._e(),_c('div',{staticClass:"item-content inset"},[_vm._v(_vm._s(button.label))])])}))])]),(_vm.dismiss)?_c('div',{staticClass:"q-action-sheet"},[_c('div',{staticClass:"item item-link",class:_vm.dismiss.classes,attrs:{"tabindex":"0"},on:{"click":function($event){_vm.close();},"keydown":function($event){if(_vm._k($event.keyCode,"enter",13)){ return null; }_vm.close();}}},[_c('div',{staticClass:"item-content row justify-center"},[_vm._v(_vm._s(_vm.dismiss.label))])])]):_vm._e()])}],
  props: {
    title: String,
    gallery: Boolean,
    actions: {
      type: Array,
      required: true
    },
    dismiss: Object
  },
  computed: {
    opened () {
      return this.$refs.dialog.active
    },
    actionButtons () {
      return this.buttons.slice(0, this.buttons.length - 2)
    },
    dismissButton () {
      return this.buttons[this.buttons.length - 1]
    },
    contentCss () {
      if (this.$q.theme === 'ios') {
        return {backgroundColor: 'transparent'}
      }
    }
  },
  methods: {
    close (fn) {
      if (!this.opened) {
        return
      }
      const hasFn = typeof fn === 'function';

      if (hasFn) {
        this.__runCancelHandler = false;
      }
      this.$refs.dialog.close(() => {
        if (hasFn) {
          fn();
        }
      });
    },
    __dismiss () {
      this.$root.$destroy();
      if (this.__runCancelHandler && this.dismiss && typeof this.dismiss.handler === 'function') {
        this.dismiss.handler();
      }
    }
  },
  mounted () {
    this.__runCancelHandler = true;
    this.$nextTick(() => {
      this.$refs.dialog.open();
      this.$root.quasarClose = this.close;
    });
  }
};

var actionSheet = ModalGenerator(ActionSheets);

function isActive () {
  return document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
}

function request (target) {
  target = target || document.documentElement;

  if (isActive()) {
    return
  }

  if (target.requestFullscreen) {
    target.requestFullscreen();
  }
  else if (target.msRequestFullscreen) {
    target.msRequestFullscreen();
  }
  else if (target.mozRequestFullScreen) {
    target.mozRequestFullScreen();
  }
  else if (target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT); // eslint-disable-line no-undef
  }
}

function exit () {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function toggle (target) {
  if (isActive()) {
    exit();
  }
  else {
    request(target);
  }
}

var appFullscreen = {
  isActive,
  request,
  exit,
  toggle
};

let hidden = 'hidden';
let appVisibility = 'visible';

function onchange (evt) {
  let
    v = 'visible',
    h = 'hidden',
    state,
    evtMap = {
      focus: v,
      focusin: v,
      pageshow: v,
      blur: h,
      focusout: h,
      pagehide: h
    };

  evt = evt || window.event;

  if (evt.type in evtMap) {
    state = evtMap[evt.type];
  }
  else {
    state = this[hidden] ? h : v;
  }

  appVisibility = state;
  Events.$emit('app:visibility', state);
}

Utils.dom.ready(() => {
  // Standards:
  if (hidden in document) {
    document.addEventListener('visibilitychange', onchange);
  }
  else if ((hidden = 'mozHidden') in document) {
    document.addEventListener('mozvisibilitychange', onchange);
  }
  else if ((hidden = 'webkitHidden') in document) {
    document.addEventListener('webkitvisibilitychange', onchange);
  }
  else if ((hidden = 'msHidden') in document) {
    document.addEventListener('msvisibilitychange', onchange);
  }
  // IE 9 and lower:
  else if ('onfocusin' in document) {
    document.onfocusin = document.onfocusout = onchange;
  }
  // All others:
  else {
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if (document[hidden] !== undefined) {
    onchange({type: document[hidden] ? 'blur' : 'focus'});
  }
});

var appVisibility$1 = {
  isVisible: () => appVisibility === 'visible'
};

function encode (string) {
  return encodeURIComponent(string)
}

function decode (string) {
  return decodeURIComponent(string)
}

function stringifyCookieValue (value) {
  return encode(value === Object(value) ? JSON.stringify(value) : '' + value)
}

function read (string) {
  if (string === '') {
    return string
  }

  if (string.indexOf('"') === 0) {
    // This is a quoted cookie as according to RFC2068, unescape...
    string = string.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  // Replace server-side written pluses with spaces.
  // If we can't decode the cookie, ignore it, it's unusable.
  // If we can't parse the cookie, ignore it, it's unusable.
  string = decode(string.replace(/\+/g, ' '));

  try {
    string = JSON.parse(string);
  }
  catch (e) {}

  return string
}

function set$1 (key, value, options = {}) {
  let
    days = options.expires,
    time;

  if (typeof options.expires === 'number') {
    time = new Date();
    time.setMilliseconds(time.getMilliseconds() + days * 864e+5);
  }

  document.cookie = [
    encode(key), '=', stringifyCookieValue(value),
    time ? '; expires=' + time.toUTCString() : '', // use expires attribute, max-age is not supported by IE
    options.path ? '; path=' + options.path : '',
    options.domain ? '; domain=' + options.domain : '',
    options.secure ? '; secure' : ''
  ].join('');
}

function get$1 (key) {
  let
    result = key ? undefined : {},
    cookies = document.cookie ? document.cookie.split('; ') : [],
    i = 0,
    l = cookies.length,
    parts,
    name,
    cookie;

  for (; i < l; i++) {
    parts = cookies[i].split('=');
    name = decode(parts.shift());
    cookie = parts.join('=');

    if (!key) {
      result[name] = cookie;
    }
    else if (key === name) {
      result = read(cookie);
      break
    }
  }

  return result
}

function remove$1 (key, options) {
  set$1(key, '', Utils.extend(true, {}, options, {
    expires: -1
  }));
}

function has (key) {
  return get$1(key) !== undefined
}

var cookies = {
  get: get$1,
  set: set$1,
  has,
  remove: remove$1,
  all: () => get$1()
};

var Loading = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-loading animate-fade fullscreen column items-center justify-center z-absolute"},[_c('spinner',{attrs:{"name":_vm.spinner,"color":_vm.spinnerColor,"size":_vm.spinnerSize}}),(_vm.message)?_c('div',{style:({color: _vm.messageColor})},[_vm._v(_vm._s(_vm.message))]):_vm._e()],1)},staticRenderFns: [],
  props: {
    message: [String, Boolean],
    spinner: String,
    spinnerSize: {
      type: Number,
      default: 80
    },
    spinnerColor: {
      type: String,
      default: '#fff'
    },
    messageColor: {
      type: String,
      default: 'white'
    }
  }
};

let vm;
let appIsInProgress = false;
let timeout;
let props = {};

function isActive$1 () {
  return appIsInProgress
}

function show ({
  delay = 500,
  spinner = current === 'ios' ? 'ios' : 'tail',
  message = false,
  spinnerSize,
  spinnerColor,
  messageColor
} = {}) {
  props.spinner = spinner;
  props.message = message;
  props.spinnerSize = spinnerSize;
  props.spinnerColor = spinnerColor;
  props.messageColor = messageColor;

  if (appIsInProgress) {
    vm && vm.$forceUpdate();
    return
  }

  timeout = setTimeout(() => {
    timeout = null;

    const node = document.createElement('div');
    document.body.appendChild(node);
    document.body.classList.add('with-loading');

    vm = new Vue({
      el: node,
      render: h => h(Loading, {props})
    });
  }, delay);

  appIsInProgress = true;
  Events.$emit('app:loading', true);
}

function hide () {
  if (!appIsInProgress) {
    return
  }

  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  else {
    vm.$destroy();
    document.body.classList.remove('with-loading');
    document.body.removeChild(vm.$el);
    vm = null;
  }

  appIsInProgress = false;
  Events.$emit('app:loading', false);
}

var loading = {
  isActive: isActive$1,
  show,
  hide
};

function encode$1 (value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return '__q_date|' + value.toUTCString()
  }
  if (Object.prototype.toString.call(value) === '[object RegExp]') {
    return '__q_expr|' + value.source
  }
  if (typeof value === 'number') {
    return '__q_numb|' + value
  }
  if (typeof value === 'boolean') {
    return '__q_bool|' + (value ? '1' : '0')
  }
  if (typeof value === 'string') {
    return '__q_strn|' + value
  }
  if (typeof value === 'function') {
    return '__q_strn|' + value.toString()
  }
  if (value === Object(value)) {
    return '__q_objt|' + JSON.stringify(value)
  }

  // hmm, we don't know what to do with it,
  // so just return it as is
  return value
}

function decode$1 (value) {
  let type, length, source;

  length = value.length;
  if (length < 10) {
    // then it wasn't encoded by us
    return value
  }

  type = value.substr(0, 8);
  source = value.substring(9);

  switch (type) {
    case '__q_date':
      return new Date(source)

    case '__q_expr':
      return new RegExp(source)

    case '__q_numb':
      return Number(source)

    case '__q_bool':
      return Boolean(source === '1')

    case '__q_strn':
      return '' + source

    case '__q_objt':
      return JSON.parse(source)

    default:
      // hmm, we reached here, we don't know the type,
      // then it means it wasn't encoded by us, so just
      // return whatever value it is
      return value
  }
}

function generateFunctions (fn) {
  return {
    local: fn('local'),
    session: fn('session')
  }
}

let hasStorageItem = generateFunctions(
    (type) => (key) => window[type + 'Storage'].getItem(key) !== null
  );
let getStorageLength = generateFunctions(
    (type) => () => window[type + 'Storage'].length
  );
let getStorageItem = generateFunctions((type) => {
    let
      hasFn = hasStorageItem[type],
      storage = window[type + 'Storage'];

    return (key) => {
      if (hasFn(key)) {
        return decode$1(storage.getItem(key))
      }
      return null
    }
  });
let getStorageAtIndex = generateFunctions((type) => {
    let
      lengthFn = getStorageLength[type],
      getItemFn = getStorageItem[type],
      storage = window[type + 'Storage'];

    return (index) => {
      if (index < lengthFn()) {
        return getItemFn(storage.key(index))
      }
    }
  });
let getAllStorageItems = generateFunctions((type) => {
    let
      lengthFn = getStorageLength[type],
      storage = window[type + 'Storage'],
      getItemFn = getStorageItem[type];

    return () => {
      let
        result = {},
        key,
        length = lengthFn();

      for (let i = 0; i < length; i++) {
        key = storage.key(i);
        result[key] = getItemFn(key);
      }

      return result
    }
  });
let setStorageItem = generateFunctions((type) => {
    let storage = window[type + 'Storage'];
    return (key, value) => { storage.setItem(key, encode$1(value)); }
  });
let removeStorageItem = generateFunctions((type) => {
    let storage = window[type + 'Storage'];
    return (key) => { storage.removeItem(key); }
  });
let clearStorage = generateFunctions((type) => {
    let storage = window[type + 'Storage'];
    return () => { storage.clear(); }
  });
let storageIsEmpty = generateFunctions((type) => {
    let getLengthFn = getStorageLength[type];
    return () => getLengthFn() === 0
  });

var LocalStorage = {
  has: hasStorageItem.local,
  get: {
    length: getStorageLength.local,
    item: getStorageItem.local,
    index: getStorageAtIndex.local,
    all: getAllStorageItems.local
  },
  set: setStorageItem.local,
  remove: removeStorageItem.local,
  clear: clearStorage.local,
  isEmpty: storageIsEmpty.local
};

var SessionStorage = { // eslint-disable-line one-var
  has: hasStorageItem.session,
  get: {
    length: getStorageLength.session,
    item: getStorageItem.session,
    index: getStorageAtIndex.session,
    all: getAllStorageItems.session
  },
  set: setStorageItem.session,
  remove: removeStorageItem.session,
  clear: clearStorage.session,
  isEmpty: storageIsEmpty.session
};

let Quasar = {
  version,
  install: install$$1,
  start: start$1,
  theme
};

standaloneInstall(Quasar);

export { actionSheet as ActionSheet, Dialog, appFullscreen as AppFullscreen, appVisibility$1 as AppVisibility, cookies as Cookies, Platform, Events, loading as Loading, toast$1 as Toast, Utils, LocalStorage, SessionStorage, theme };export default Quasar;
