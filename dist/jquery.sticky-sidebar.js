(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
})((function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var stickySidebar = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  {
	    factory(exports);
	  }
	})(commonjsGlobal, function (exports) {

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  var _createClass = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }

	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();

	  /**
	   * Sticky Sidebar v2 JavaScript Plugin.
	   * @version 1.3.0
	   * @author Øystein Blixhavn <oystein@blixhavn.no>
	   * @license The MIT License (MIT)
	   */
	  var StickySidebar = function () {

	    // ---------------------------------
	    // # Define Constants
	    // ---------------------------------
	    //
	    var EVENT_KEY = '.stickySidebar';

	    var DEFAULTS = {
	      /**
	       * Additional top spacing of the element when it becomes sticky.
	       * @type {Numeric|Function}
	       */
	      topSpacing: 0,

	      /**
	       * Additional bottom spacing of the element when it becomes sticky.
	       * @type {Numeric|Function}
	       */
	      bottomSpacing: 0,

	      /**
	       * Container sidebar selector to know what the beginning and end of sticky element.
	       * @type {String|False}
	       */
	      containerSelector: false,

	      /**
	       * Parent element where the scrolling happens.
	       */
	      scrollContainer: false,

	      /**
	       * Inner wrapper selector.
	       * @type {String}
	       */
	      innerWrapperSelector: '.inner-wrapper-sticky',

	      /**
	       * Another column inside the same container. When set, the shorter of the two
	       * columns is the sticky one, and this follows later changes in either column's height.
	       * @type {String|False}
	       */
	      otherColumnSelector: false,

	      /**
	       * The name of CSS class to apply to elements when they have become stuck.
	       * @type {String|False}
	       */
	      stickyClass: 'is-affixed',

	      /**
	       * The sidebar returns to its normal position if its width below this value.
	       * @type {Numeric}
	       */
	      minWidth: false
	    };

	    // ---------------------------------
	    // # Class Definition
	    // ---------------------------------
	    //
	    /**
	     * Sticky Sidebar Class.
	     * @public
	     */

	    var StickySidebar = function () {

	      /**
	       * Sticky Sidebar Constructor.
	       * @constructor
	       * @param {HTMLElement|String} sidebar - The sidebar element or sidebar selector.
	       * @param {Object} options - The options of sticky sidebar.
	       */
	      function StickySidebar(sidebar) {
	        var _this = this;

	        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	        _classCallCheck(this, StickySidebar);

	        this.options = StickySidebar.extend(DEFAULTS, options);

	        // Sidebar element query if there's no one, throw error.
	        this.sidebar = 'string' === typeof sidebar ? document.querySelector(sidebar) : sidebar;
	        if (!this.sidebar) throw new Error("There is no specific sidebar element.");

	        this.sidebarInner = false;
	        this.container = this.sidebar.parentElement;

	        // Current Affix Type of sidebar element.
	        this.affixedType = 'STATIC';
	        this.direction = 'down';
	        this.support = {
	          transform: false,
	          transform3d: false
	        };

	        this._initialized = false;
	        this._reStyle = false;
	        this._breakpoint = false;
	        // Set when the sticky column changes. The new column has no tracked position yet.
	        this._reacquire = false;

	        // Dimensions of sidebar, container and screen viewport.
	        this.dimensions = {
	          translateY: 0,
	          maxTranslateY: 0,
	          topSpacing: 0,
	          lastTopSpacing: 0,
	          bottomSpacing: 0,
	          lastBottomSpacing: 0,
	          sidebarHeight: 0,
	          sidebarOuterHeight: 0,
	          sidebarWidth: 0,
	          containerTop: 0,
	          containerHeight: 0,
	          viewportHeight: 0,
	          viewportTop: 0,
	          lastViewportTop: 0
	        };

	        // Bind event handlers for referencability.
	        ['handleEvent'].forEach(function (method) {
	          _this[method] = _this[method].bind(_this);
	        });

	        // Initialize sticky sidebar for first time.
	        this.initialize();
	      }

	      /**
	       * Initializes the sticky sidebar by adding inner wrapper, define its container,
	       * min-width breakpoint, calculating dimensions, adding helper classes and inline style.
	       * @private
	       */


	      _createClass(StickySidebar, [{
	        key: 'initialize',
	        value: function initialize() {
	          var _this2 = this;

	          this._setSupportFeatures();

	          // The element passed to the constructor. this.sidebar follows whichever column
	          // is currently sticky, which can be the other column.
	          this.primaryColumn = this.sidebar;
	          this.primaryInner = this.sidebarInner = this._ensureInnerWrapper(this.sidebar);
	          this.otherColumn = false;
	          this.otherColumnInner = false;

	          // Container wrapper of the sidebar.
	          if (this.options.containerSelector) {
	            var containers = document.querySelectorAll(this.options.containerSelector);
	            containers = Array.prototype.slice.call(containers);

	            containers.forEach(function (container, item) {
	              if (!container.contains(_this2.sidebar)) return;
	              _this2.container = container;
	            });

	            if (!containers.length) throw new Error("The container does not contains on the sidebar.");
	          }

	          if (this.options.otherColumnSelector) {
	            var columns = document.querySelectorAll(this.options.otherColumnSelector);
	            columns = Array.prototype.slice.call(columns);

	            columns.some(function (column) {
	              if (column === _this2.primaryColumn || !_this2.container.contains(column)) return;
	              if (_this2.primaryColumn.contains(column) || column.contains(_this2.primaryColumn)) return;
	              _this2.otherColumn = column;
	              return true;
	            });

	            if (!this.otherColumn) throw new Error("The other column must be another element inside the container.");

	            this.otherColumnInner = this._ensureInnerWrapper(this.otherColumn);
	          }

	          // Get scroll container, if provided
	          this.scrollContainer = this.options.scrollContainer ? document.querySelector(this.options.scrollContainer) : undefined;

	          // If top/bottom spacing is not function parse value to integer.
	          if ('function' !== typeof this.options.topSpacing) this.options.topSpacing = parseInt(this.options.topSpacing) || 0;

	          if ('function' !== typeof this.options.bottomSpacing) this.options.bottomSpacing = parseInt(this.options.bottomSpacing) || 0;

	          // Breakdown sticky sidebar if screen width below `options.minWidth`.
	          this._widthBreakpoint();

	          // Calculate dimensions of sidebar, container and viewport.
	          this.calcDimensions();

	          // Affix sidebar in proper position.
	          this.stickyPosition();

	          // Bind all events.
	          this.bindEvents();

	          // Inform other properties the sticky sidebar is initialized.
	          this._initialized = true;
	        }
	      }, {
	        key: 'bindEvents',
	        value: function bindEvents() {
	          var _this3 = this;

	          this.eventTarget = this.scrollContainer ? this.scrollContainer : window;

	          // Listen with the bound function rather than `this`, so destroy() can remove the
	          // listeners even when called through a proxy of the instance (e.g. Vue 3 reactivity).
	          window.addEventListener('resize', this.handleEvent, { passive: true, capture: false });
	          this.eventTarget.addEventListener('scroll', this.handleEvent, { passive: true, capture: false });

	          this.primaryColumn.addEventListener('update' + EVENT_KEY, this.handleEvent);

	          if ('undefined' !== typeof ResizeObserver) {
	            this.resizeObserver = new ResizeObserver(function () {
	              return _this3.handleEvent();
	            });
	            this.resizeObserver.observe(this.primaryInner);
	            this.resizeObserver.observe(this.container);
	            if (this.otherColumnInner) this.resizeObserver.observe(this.otherColumnInner);
	          }
	        }
	      }, {
	        key: '_ensureInnerWrapper',
	        value: function _ensureInnerWrapper(column) {
	          var inner = this.options.innerWrapperSelector && column.querySelector(this.options.innerWrapperSelector);

	          if (!inner) {
	            inner = document.createElement('div');
	            inner.setAttribute('class', 'inner-wrapper-sticky');
	            column.appendChild(inner);

	            while (column.firstChild != inner) {
	              inner.appendChild(column.firstChild);
	            }
	          }

	          return inner;
	        }
	      }, {
	        key: '_selectStickyColumn',
	        value: function _selectStickyColumn() {
	          if (!this.otherColumn) return;

	          var primaryHeight = this._columnContentHeight(this.primaryColumn, this.primaryInner);
	          var otherHeight = this._columnContentHeight(this.otherColumn, this.otherColumnInner);
	          var column = primaryHeight <= otherHeight ? this.primaryColumn : this.otherColumn;
	          var inner = column === this.primaryColumn ? this.primaryInner : this.otherColumnInner;

	          if (column === this.sidebar) return;

	          var previous = this.sidebar;
	          var previousType = this.affixedType;

	          // The column we leave is back in normal flow. Tell its listeners, since later
	          // affix events are fired on the column that is sticking now.
	          if ('STATIC' !== previousType) StickySidebar.eventTrigger(previous, 'affix.static' + EVENT_KEY);

	          this._clearColumn(previous, this.sidebarInner);
	          this.sidebar = column;
	          this.sidebarInner = inner;
	          this.affixedType = 'STATIC';
	          this.dimensions.translateY = 0;
	          this._reStyle = true;
	          this._reacquire = true;

	          if ('STATIC' !== previousType) StickySidebar.eventTrigger(previous, 'affixed.static' + EVENT_KEY);
	        }
	      }, {
	        key: '_columnContentHeight',
	        value: function _columnContentHeight(column, inner) {
	          // display:none has no box, so a height of 0 would win and stick an invisible column.
	          if (null === column.offsetParent && 0 === column.offsetHeight) return Infinity;
	          return inner.offsetHeight + this._getExtraHeight(column, inner);
	        }
	      }, {
	        key: 'handleEvent',
	        value: function handleEvent(event) {
	          this.updateSticky(event);
	        }
	      }, {
	        key: 'calcDimensions',
	        value: function calcDimensions() {
	          if (this._breakpoint) return;
	          this._selectStickyColumn();
	          var dims = this.dimensions;

	          // Container of sticky sidebar dimensions.
	          dims.containerTop = StickySidebar.offsetRelative(this.container).top;
	          dims.containerHeight = this.container.clientHeight;
	          dims.containerBottom = dims.containerTop + dims.containerHeight;

	          // Sidebar dimensions.
	          dims.sidebarHeight = this.sidebarInner.offsetHeight;
	          dims.sidebarWidth = this.sidebarInner.offsetWidth;

	          // Height the sidebar's content needs in the container. Measured from the inner
	          // wrapper rather than the sidebar itself, which may be stretched to the container
	          // height (flex/grid) or pinned to the inner wrapper's height while affixed.
	          dims.sidebarOuterHeight = this._columnContentHeight(this.sidebar, this.sidebarInner);

	          // Screen viewport dimensions.
	          dims.viewportHeight = window.innerHeight;

	          // Maximum sidebar translate Y.
	          dims.maxTranslateY = dims.containerHeight - dims.sidebarHeight;

	          this._calcDimensionsWithScroll();
	        }
	      }, {
	        key: '_getExtraHeight',
	        value: function _getExtraHeight(column, innerElement) {
	          var px = function (style, property) {
	            return Math.max(0, parseFloat(style[property]) || 0);
	          };
	          var sidebar = getComputedStyle(column);
	          var inner = getComputedStyle(innerElement);

	          var extra = px(sidebar, 'paddingTop') + px(sidebar, 'paddingBottom') + px(sidebar, 'borderTopWidth') + px(sidebar, 'borderBottomWidth') + px(inner, 'marginTop') + px(inner, 'marginBottom');

	          // Only a plain block wrapper lets child margins collapse through it; fixed or
	          // absolute positioning makes it contain them, so they count in offsetHeight.
	          var collapses = 'block' === inner.display && 'visible' === inner.overflow && ('static' === inner.position || 'relative' === inner.position);

	          if (collapses) {
	            var first = innerElement.firstElementChild;
	            var last = innerElement.lastElementChild;

	            if (first && !px(inner, 'paddingTop') && !px(inner, 'borderTopWidth')) extra += px(getComputedStyle(first), 'marginTop');

	            if (last && !px(inner, 'paddingBottom') && !px(inner, 'borderBottomWidth')) extra += px(getComputedStyle(last), 'marginBottom');
	          }

	          return extra;
	        }
	      }, {
	        key: '_calcDimensionsWithScroll',
	        value: function _calcDimensionsWithScroll() {
	          var dims = this.dimensions;
	          var lastViewportLeft = dims.viewportLeft;

	          dims.sidebarLeft = StickySidebar.offsetRelative(this.sidebar).left;

	          if (this.scrollContainer) {
	            dims.viewportTop = this.scrollContainer.scrollTop;
	            dims.viewportLeft = this.scrollContainer.scrollLeft;
	          } else {
	            dims.viewportTop = document.documentElement.scrollTop || document.body.scrollTop;
	            dims.viewportLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
	          }
	          dims.viewportBottom = dims.viewportTop + dims.viewportHeight;

	          dims.topSpacing = this.options.topSpacing;
	          dims.bottomSpacing = this.options.bottomSpacing;

	          if ('function' === typeof dims.topSpacing) dims.topSpacing = parseInt(dims.topSpacing(this.sidebar)) || 0;

	          if ('function' === typeof dims.bottomSpacing) dims.bottomSpacing = parseInt(dims.bottomSpacing(this.sidebar)) || 0;

	          if ('VIEWPORT-TOP' === this.affixedType) {
	            // Adjust translate Y in the case decrease top spacing value.
	            if (dims.topSpacing < dims.lastTopSpacing) {
	              dims.translateY += dims.lastTopSpacing - dims.topSpacing;
	              this._reStyle = true;
	            } else if (lastViewportLeft !== dims.viewportLeft) {
	              this._reStyle = true;
	            }
	          } else if ('VIEWPORT-BOTTOM' === this.affixedType) {
	            // Adjust translate Y in the case decrease bottom spacing value.
	            if (dims.bottomSpacing < dims.lastBottomSpacing) {
	              dims.translateY += dims.lastBottomSpacing - dims.bottomSpacing;
	              this._reStyle = true;
	            } else if (lastViewportLeft !== dims.viewportLeft) {
	              this._reStyle = true;
	            }
	          }

	          dims.lastTopSpacing = dims.topSpacing;
	          dims.lastBottomSpacing = dims.bottomSpacing;
	        }
	      }, {
	        key: 'isSidebarFitsViewport',
	        value: function isSidebarFitsViewport() {
	          return this.dimensions.viewportHeight >= this.dimensions.lastBottomSpacing + this.dimensions.lastTopSpacing + this.dimensions.sidebarHeight;
	        }
	      }, {
	        key: 'observeScrollDir',
	        value: function observeScrollDir() {
	          var dims = this.dimensions;
	          if (dims.lastViewportTop === dims.viewportTop) return;

	          var furthest = 'down' === this.direction ? Math.min : Math.max;

	          // If the browser is scrolling not in the same direction.
	          if (dims.viewportTop === furthest(dims.viewportTop, dims.lastViewportTop)) this.direction = 'down' === this.direction ? 'up' : 'down';
	        }
	      }, {
	        key: 'getAffixType',
	        value: function getAffixType() {
	          this._calcDimensionsWithScroll();
	          var dims = this.dimensions;
	          var colliderTop = dims.viewportTop + dims.topSpacing;
	          var affixType = this.affixedType;

	          // Scroll-up positioning continues from the current translate. A column that just
	          // became sticky has none, so place it as if scrolling down once, then keep going
	          // with the real scroll direction.
	          var reacquire = this._reacquire;
	          this._reacquire = false;

	          if (colliderTop <= dims.containerTop || dims.containerHeight <= dims.sidebarOuterHeight) {
	            dims.translateY = 0;
	            affixType = 'STATIC';
	          } else if (reacquire || 'up' !== this.direction) {
	            affixType = this._getAffixTypeScrollingDown();
	          } else {
	            affixType = this._getAffixTypeScrollingUp();
	          }

	          // Make sure the translate Y is not bigger than container height.
	          dims.translateY = Math.max(0, dims.translateY);
	          dims.translateY = Math.min(dims.containerHeight, dims.translateY);
	          dims.translateY = Math.round(dims.translateY);

	          dims.lastViewportTop = dims.viewportTop;
	          return affixType;
	        }
	      }, {
	        key: '_getAffixTypeScrollingDown',
	        value: function _getAffixTypeScrollingDown() {
	          var dims = this.dimensions;
	          var sidebarBottom = dims.sidebarHeight + dims.containerTop;
	          var colliderTop = dims.viewportTop + dims.topSpacing;
	          var colliderBottom = dims.viewportBottom - dims.bottomSpacing;
	          var affixType = this.affixedType;

	          if (this.isSidebarFitsViewport()) {
	            if (dims.sidebarHeight + colliderTop >= dims.containerBottom) {
	              dims.translateY = dims.containerBottom - sidebarBottom;
	              affixType = 'CONTAINER-BOTTOM';
	            } else if (colliderTop >= dims.containerTop) {
	              dims.translateY = colliderTop - dims.containerTop;
	              affixType = 'VIEWPORT-TOP';
	            }
	          } else {
	            if (dims.containerBottom <= colliderBottom) {
	              dims.translateY = dims.containerBottom - sidebarBottom;
	              affixType = 'CONTAINER-BOTTOM';
	            } else if (sidebarBottom + dims.translateY <= colliderBottom) {
	              dims.translateY = colliderBottom - sidebarBottom;
	              affixType = 'VIEWPORT-BOTTOM';
	            } else if (dims.containerTop + dims.translateY <= colliderTop && 0 !== dims.translateY && dims.maxTranslateY !== dims.translateY) {
	              affixType = 'VIEWPORT-UNBOTTOM';
	            }
	          }

	          return affixType;
	        }
	      }, {
	        key: '_getAffixTypeScrollingUp',
	        value: function _getAffixTypeScrollingUp() {
	          var dims = this.dimensions;
	          var sidebarBottom = dims.sidebarHeight + dims.containerTop;
	          var colliderTop = dims.viewportTop + dims.topSpacing;
	          var colliderBottom = dims.viewportBottom - dims.bottomSpacing;
	          var affixType = this.affixedType;

	          if (colliderTop <= dims.translateY + dims.containerTop) {
	            dims.translateY = colliderTop - dims.containerTop;
	            affixType = 'VIEWPORT-TOP';
	          } else if (dims.containerBottom <= colliderBottom) {
	            dims.translateY = dims.containerBottom - sidebarBottom;
	            affixType = 'CONTAINER-BOTTOM';
	          } else if (!this.isSidebarFitsViewport()) {

	            if (dims.containerTop <= colliderTop && 0 !== dims.translateY && dims.maxTranslateY !== dims.translateY) {
	              affixType = 'VIEWPORT-UNBOTTOM';
	            }
	          }

	          return affixType;
	        }
	      }, {
	        key: '_getStyle',
	        value: function _getStyle(affixType) {
	          if ('undefined' === typeof affixType) return;

	          var style = { inner: {}, outer: {} };
	          var dims = this.dimensions;

	          switch (affixType) {
	            case 'VIEWPORT-TOP':
	              style.inner = { position: 'fixed', top: dims.topSpacing,
	                left: dims.sidebarLeft - dims.viewportLeft, width: dims.sidebarWidth };
	              break;
	            case 'VIEWPORT-BOTTOM':
	              style.inner = { position: 'fixed', top: 'auto', left: dims.sidebarLeft - dims.viewportLeft,
	                bottom: dims.bottomSpacing, width: dims.sidebarWidth };
	              break;
	            case 'CONTAINER-BOTTOM':
	            case 'VIEWPORT-UNBOTTOM':
	              var translate = this._getTranslate(0, dims.translateY + 'px');

	              if (translate) style.inner = { transform: translate };else style.inner = { position: 'absolute', top: dims.translateY, width: dims.sidebarWidth };
	              break;
	          }

	          switch (affixType) {
	            case 'VIEWPORT-TOP':
	            case 'VIEWPORT-BOTTOM':
	            case 'VIEWPORT-UNBOTTOM':
	            case 'CONTAINER-BOTTOM':
	              style.outer = { height: dims.sidebarHeight, position: 'relative' };
	              break;
	          }

	          style.outer = StickySidebar.extend({ height: '', position: '' }, style.outer);
	          style.inner = StickySidebar.extend({ position: 'relative', top: '', left: '',
	            bottom: '', width: '', transform: '' }, style.inner);

	          return style;
	        }
	      }, {
	        key: 'stickyPosition',
	        value: function stickyPosition(force) {
	          if (this._breakpoint) return;

	          force = this._reStyle || force || false;
	          this._reStyle = false;

	          this.options.topSpacing;
	          this.options.bottomSpacing;

	          var affixType = this.getAffixType();
	          var style = this._getStyle(affixType);

	          if ((this.affixedType != affixType || force) && affixType) {
	            var typeChanged = this.affixedType != affixType;

	            if (typeChanged) {
	              var affixEvent = 'affix.' + affixType.toLowerCase().replace('viewport-', '') + EVENT_KEY;
	              StickySidebar.eventTrigger(this.sidebar, affixEvent);
	            }

	            if ('STATIC' === affixType) StickySidebar.removeClass(this.sidebar, this.options.stickyClass);else StickySidebar.addClass(this.sidebar, this.options.stickyClass);

	            for (var key in style.outer) {
	              var unit = 'number' === typeof style.outer[key] ? 'px' : '';
	              this.sidebar.style[key] = style.outer[key] + unit;
	            }

	            for (var _key in style.inner) {
	              var _unit = 'number' === typeof style.inner[_key] ? 'px' : '';
	              this.sidebarInner.style[_key] = style.inner[_key] + _unit;
	            }

	            if (typeChanged) {
	              var affixedEvent = 'affixed.' + affixType.toLowerCase().replace('viewport-', '') + EVENT_KEY;
	              StickySidebar.eventTrigger(this.sidebar, affixedEvent);
	            }
	          } else {
	            if (this._initialized) this.sidebarInner.style.left = style.inner.left;
	          }

	          this.affixedType = affixType;
	        }
	      }, {
	        key: '_widthBreakpoint',
	        value: function _widthBreakpoint() {

	          if (window.innerWidth <= this.options.minWidth) {
	            this._breakpoint = true;
	            this.affixedType = 'STATIC';

	            this._clearColumn(this.primaryColumn, this.primaryInner);
	            if (this.otherColumn) this._clearColumn(this.otherColumn, this.otherColumnInner);
	            this.sidebar = this.primaryColumn;
	            this.sidebarInner = this.primaryInner;
	          } else {
	            this._breakpoint = false;
	          }
	        }
	      }, {
	        key: 'updateSticky',
	        value: function updateSticky() {
	          var _this4 = this;

	          var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	          // A resize can arrive while a scroll update is waiting for its frame. Dropping it
	          // would miss a column-height change. Remember it and run it after this frame.
	          if (this._running) {
	            if (!this._pendingEvent || 'scroll' === this._pendingEvent.type) this._pendingEvent = event;
	            return;
	          }
	          this._running = true;

	          (function (eventType) {
	            _this4._animationFrame = requestAnimationFrame(function () {
	              switch (eventType) {
	                // When browser is scrolling and re-calculate just dimensions
	                // within scroll.
	                case 'scroll':
	                  _this4._calcDimensionsWithScroll();
	                  _this4.observeScrollDir();
	                  _this4.stickyPosition();
	                  break;

	                // When browser is resizing or there's no event, observe width
	                // breakpoint and re-calculate dimensions.
	                case 'resize':
	                default:
	                  _this4._widthBreakpoint();
	                  _this4.calcDimensions();
	                  _this4.observeScrollDir();
	                  _this4.stickyPosition(true);
	                  break;
	              }
	              _this4._running = false;
	              if (_this4._pendingEvent) {
	                var pending = _this4._pendingEvent;
	                _this4._pendingEvent = null;
	                _this4.updateSticky(pending);
	              }
	            });
	          })(event.type);
	        }
	      }, {
	        key: '_setSupportFeatures',
	        value: function _setSupportFeatures() {
	          var support = this.support;

	          support.transform = StickySidebar.supportTransform();
	          support.transform3d = StickySidebar.supportTransform(true);
	        }
	      }, {
	        key: '_getTranslate',
	        value: function _getTranslate() {
	          var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	          var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	          var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	          if (this.support.transform3d) return 'translate3d(' + y + ', ' + x + ', ' + z + ')';else if (this.support.translate) return 'translate(' + y + ', ' + x + ')';else return false;
	        }
	      }, {
	        key: 'destroy',
	        value: function destroy() {
	          window.removeEventListener('resize', this.handleEvent, { capture: false });
	          this.eventTarget.removeEventListener('scroll', this.handleEvent, { capture: false });

	          this.primaryColumn.removeEventListener('update' + EVENT_KEY, this.handleEvent);

	          if (this.resizeObserver) {
	            this.resizeObserver.disconnect();
	            this.resizeObserver = null;
	          }

	          if (this._running) {
	            cancelAnimationFrame(this._animationFrame);
	            this._running = false;
	            this._pendingEvent = null;
	          }

	          this._clearColumn(this.primaryColumn, this.primaryInner);
	          if (this.otherColumn) this._clearColumn(this.otherColumn, this.otherColumnInner);
	        }
	      }, {
	        key: '_clearColumn',
	        value: function _clearColumn(column, inner) {
	          if (!column) return;

	          column.classList.remove(this.options.stickyClass);
	          column.style.minHeight = '';
	          column.style.height = '';
	          column.style.position = '';

	          if (!inner) return;

	          inner.style.position = '';
	          inner.style.top = '';
	          inner.style.left = '';
	          inner.style.bottom = '';
	          inner.style.width = '';
	          inner.style.transform = '';
	        }
	      }], [{
	        key: 'supportTransform',
	        value: function supportTransform(transform3d) {
	          var result = false,
	              property = transform3d ? 'perspective' : 'transform',
	              upper = property.charAt(0).toUpperCase() + property.slice(1),
	              prefixes = ['Webkit', 'Moz', 'O', 'ms'],
	              support = document.createElement('support'),
	              style = support.style;

	          (property + ' ' + prefixes.join(upper + ' ') + upper).split(' ').forEach(function (property, i) {
	            if (style[property] !== undefined) {
	              result = property;
	              return false;
	            }
	          });
	          return result;
	        }
	      }, {
	        key: 'eventTrigger',
	        value: function eventTrigger(element, eventName, data) {
	          try {
	            var event = new CustomEvent(eventName, { detail: data });
	          } catch (e) {
	            var event = document.createEvent('CustomEvent');
	            event.initCustomEvent(eventName, true, true, data);
	          }
	          element.dispatchEvent(event);
	        }
	      }, {
	        key: 'extend',
	        value: function extend(defaults, options) {
	          var results = {};
	          for (var key in defaults) {
	            if ('undefined' !== typeof options[key]) results[key] = options[key];else results[key] = defaults[key];
	          }
	          return results;
	        }
	      }, {
	        key: 'offsetRelative',
	        value: function offsetRelative(element) {
	          var result = { left: 0, top: 0 };

	          do {
	            var offsetTop = element.offsetTop;
	            var offsetLeft = element.offsetLeft;

	            if (!isNaN(offsetTop)) result.top += offsetTop;

	            if (!isNaN(offsetLeft)) result.left += offsetLeft;

	            element = 'BODY' === element.tagName ? element.parentElement : element.offsetParent;
	          } while (element);
	          return result;
	        }
	      }, {
	        key: 'addClass',
	        value: function addClass(element, className) {
	          if (!StickySidebar.hasClass(element, className)) {
	            if (element.classList) element.classList.add(className);else element.className += ' ' + className;
	          }
	        }
	      }, {
	        key: 'removeClass',
	        value: function removeClass(element, className) {
	          if (StickySidebar.hasClass(element, className)) {
	            if (element.classList) element.classList.remove(className);else element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	          }
	        }
	      }, {
	        key: 'hasClass',
	        value: function hasClass(element, className) {
	          if (element.classList) return element.classList.contains(className);else return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
	        }
	      }, {
	        key: 'defaults',
	        get: function () {
	          return DEFAULTS;
	        }
	      }]);

	      return StickySidebar;
	    }();

	    return StickySidebar;
	  }();

	  exports.default = StickySidebar;


	  // Global
	  // -------------------------
	  if ('undefined' !== typeof window) window.StickySidebar = StickySidebar;
	});
	});

	unwrapExports(stickySidebar);

	var jquery_stickySidebar = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  {
	    factory(stickySidebar);
	  }
	})(commonjsGlobal, function (_stickySidebar) {

	  var _stickySidebar2 = _interopRequireDefault(_stickySidebar);

	  function _interopRequireDefault(obj) {
	    return obj && obj.__esModule ? obj : {
	      default: obj
	    };
	  }

	  (function () {
	    if ('undefined' === typeof window) return;

	    var plugin = window.$ || window.jQuery || window.Zepto;
	    var DATA_NAMESPACE = 'stickySidebar';

	    // Make sure the site has jquery or zepto plugin.
	    if (plugin) {
	      var _jQueryPlugin = function (config) {
	        return this.each(function () {
	          var $this = plugin(this),
	              data = plugin(this).data(DATA_NAMESPACE);

	          if (!data) {
	            data = new _stickySidebar2.default(this, typeof config == 'object' && config);
	            $this.data(DATA_NAMESPACE, data);
	          }

	          if ('string' === typeof config) {
	            if (data[config] === undefined && ['destroy', 'updateSticky'].indexOf(config) === -1) throw new Error('No method named "' + config + '"');

	            data[config]();

	            // Forget the destroyed instance so the plugin can be initialized again.
	            if ('destroy' === config) $this.removeData(DATA_NAMESPACE);
	          }
	        });
	      };

	      plugin.fn.stickySidebar = _jQueryPlugin;
	      plugin.fn.stickySidebar.Constructor = _stickySidebar2.default;

	      var old = plugin.fn.stickySidebar;

	      /**
	       * Sticky Sidebar No Conflict.
	       */
	      plugin.fn.stickySidebar.noConflict = function () {
	        plugin.fn.stickySidebar = old;
	        return this;
	      };
	    }
	  })();
	});
	});

	unwrapExports(jquery_stickySidebar);

}));
