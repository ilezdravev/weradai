(function() {
  var $ = jQuery;

  window.slate = window.slate || {};
  window.theme = window.theme || {};
  
  /*================ Helpers ================*/
  var outerClick = function(elem, secondElem) {
    $(document).mouseup(function (e) {
      var container = $(elem);
      var second = $(secondElem);
      if (second) {
        if (!container.is(e.target) && !second.is(e.target) && container.has(e.target).length === 0 && second.has(e.target).length === 0) {
          container.addClass('hide');
        }
      } else {
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          container.addClass('hide');
        }
      }
    });
  }
  
  
  window.qty = function (operation, element) {
    if (element == 'cart') {
      var id = event.target.dataset.id
      var _input = document.querySelector('#qty-id-' + id);
      var _error = document.querySelector('#qty-id-error-' + id);
      var _errors = document.querySelectorAll('[data-qty-error]');
      var resetErrors = function() {
        _errors.forEach(function(err) {
          err.classList.add('hide');
          err.innerHTML = '';
        })
      }
      if (_input.value == 1 && operation == 'decr') return false
    
      
        var line = _input.dataset.line;
        var qty = _input.value*1;
        var _btn = event.target;
        _btn.disabled = true;
        resetErrors();
        switch (operation) {
          case 'incr':
            CartJS.addItem(id, 1, {}, {
              "success": function (data, textStatus, jqXHR) {
                _input.value = qty+1;
                _btn.disabled = false;
              },
              "error": function (jqXHR, textStatus, errorThrown) {
                console.error("cart add error:", jqXHR, textStatus, errorThrown);
                _error.classList.remove('hide');
                _error.innerHTML = "Sorry, we only have "+qty+" in stock";
                _btn.disabled = false;
              }
            });
            break;
          case 'decr':
            qty--;
            CartJS.updateItem(line, qty, {}, {
              "success": function (data, textStatus, jqXHR) {
                _input.value = qty;
                _btn.disabled = false;
              },
              "error": function (jqXHR, textStatus, errorThrown) {
                console.error("cart update error:", jqXHR, textStatus, errorThrown);
                _btn.disabled = false;
              }
            });
            break;
          default:
            // statements_def
            break;
        }
        // $.post('/cart/change.js', {
        //   quantity: qty,
        //   line: line
        // }).done(function (data, textStatus, jqXHR) {
        //   console.log("cart update success", data, textStatus, jqXHR);
        //   _input.value = qty;
        // }).fail(function (jqXHR, textStatus, errorThrown) {
        //   console.error("cart update error", jqXHR, textStatus, errorThrown);
        // })
    }
    if (element == 'minicart') {
      var id = event.target.dataset.id;
      var _input = document.getElementById(id);
       _input.value = _input.getAttribute('data-qty');

      var _error = document.querySelector('[error-id="'+ id +'"]');
      //console.log('_error', _error)
      var _errors = document.querySelectorAll('[data-qty-error]');
      var resetErrors = function() {
        _errors.forEach(function(err) {
          err.classList.add('hide');
          err.innerHTML = '';
        })
      }
      
      if (_input.value == 1 && operation == 'decr') return false

      var line = parseInt(_input.dataset.line) + 1;
      //console.log('line-', line)
      var qty = _input.value*1;
      var _btn = event.target;
      _btn.disabled = true;
      switch (operation) {
        case 'incr':
          CartJS.addItem(id, 1, {}, {
            "success": function (data, textStatus, jqXHR) {
              _input.value = qty+1;
              _btn.disabled = false;
            },
            "error": function (jqXHR, textStatus, errorThrown) {
              console.error("cart add error:", jqXHR, textStatus, errorThrown);
              console.log("Sorry, we only have "+qty+" in stock");
              _error.classList.remove('hide');
              _error.innerHTML = "Sorry, we only have "+qty+" in stock";
              _btn.disabled = false;
            }
          });
          break;
        case 'decr':
          qty--;
          CartJS.updateItem(line, qty, {}, {
            "success": function (data, textStatus, jqXHR) {
              _input.value = qty;
              _btn.disabled = false;
              console.log('data-', data)
            },
            "error": function (jqXHR, textStatus, errorThrown) {
              console.error("cart update error:", jqXHR, textStatus, errorThrown);
            }
          });
          break;
        default:
          // statements_def
          break;
      }
     
    }
    if (element == 'product') {
      var _cartBtn = document.querySelector('.js-add-to-cart');
      console.log(_cartBtn.dataset);
      switch (operation) {
        case 'incr':
          _cartBtn.dataset.quantity++
          break;
        case 'decr':
          _cartBtn.dataset.quantity--
          break;
        default:
          // statements_def
          break;
      }
    }
  }
  var rteLiFix = function(elem, secondElem) {
    var p = $('.utils').find('p');
    p.each(function (index, element) {
      var text = $(element).text();
      if (text.indexOf('▪') > -1 || text.indexOf('--') > -1) {
        text = text.replace('▪', '');
        text = text.replace('--', '');
        $(element).addClass('li').text(text);
      }
    });
  }
  
  
  /**
   * @arr array for search in
   * @partArray potential subset
   */
  var checkInArray = function (arr, partArray) {
    return arr.filter(function (elem) {
      return partArray.indexOf(elem) > -1;
    }).length == partArray.length
  }
  
  var arrayDel = function(arr, element) {
    return arr.filter(function(e) { return e !== element });
  };
  
  var msg = function(el, index) {
    console.log("%c\nprocessing "+ typeof el+":", "color: gold");
    console.log(el);
  	if (typeof index === "number") {
    	console.log("For loop level:", index)
    }
  }
  
  /*================ Slate ================*/
  /**
   * A11y Helpers
   * -----------------------------------------------------------------------------
   * A collection of useful functions that help make your theme more accessible
   * to users with visual impairments.
   *
   *
   * @namespace a11y
   */
  
  slate.a11y = {
  
    /**
     * For use when focus shifts to a container rather than a link
     * eg for In-page links, after scroll, focus shifts to content area so that
     * next `tab` is where user expects if focusing a link, just $link.focus();
     *
     * @param {JQuery} $element - The element to be acted upon
     */
    pageLinkFocus: function($element) {
      var focusClass = 'js-focus-hidden';
  
      $element.first()
        .attr('tabIndex', '-1')
        .focus()
        .addClass(focusClass)
        .one('blur', callback);
  
      function callback() {
        $element.first()
          .removeClass(focusClass)
          .removeAttr('tabindex');
      }
    },
  
    /**
     * If there's a hash in the url, focus the appropriate element
     */
    focusHash: function() {
      var hash = window.location.hash;
  
      // is there a hash in the url? is it an element on the page?
      if (hash && document.getElementById(hash.slice(1))) {
        this.pageLinkFocus($(hash));
      }
    },
  
    /**
     * When an in-page (url w/hash) link is clicked, focus the appropriate element
     */
    bindInPageLinks: function() {
      $('a[href*=#]').on('click', function(evt) {
        this.pageLinkFocus($(evt.currentTarget.hash));
      }.bind(this));
    },
  
    /**
     * Traps the focus in a particular container
     *
     * @param {object} options - Options to be used
     * @param {jQuery} options.$container - Container to trap focus within
     * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
     * @param {string} options.namespace - Namespace used for new focus event handler
     */
    trapFocus: function(options) {
      var eventName = options.namespace
        ? 'focusin.' + options.namespace
        : 'focusin';
  
      if (!options.$elementToFocus) {
        options.$elementToFocus = options.$container;
      }
  
      options.$container.attr('tabindex', '-1');
      options.$elementToFocus.focus();
  
      $(document).on(eventName, function(evt) {
        if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
          options.$container.focus();
        }
      });
    },
  
    /**
     * Removes the trap of focus in a particular container
     *
     * @param {object} options - Options to be used
     * @param {jQuery} options.$container - Container to trap focus within
     * @param {string} options.namespace - Namespace used for new focus event handler
     */
    removeTrapFocus: function(options) {
      var eventName = options.namespace
        ? 'focusin.' + options.namespace
        : 'focusin';
  
      if (options.$container && options.$container.length) {
        options.$container.removeAttr('tabindex');
      }
  
      $(document).off(eventName);
    }
  };
  
  /**
   * Cart Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Cart template.
   *
   * @namespace cart
   */
  
  slate.cart = {
    
    /**
     * Browser cookies are required to use the cart. This function checks if
     * cookies are enabled in the browser.
     */
    cookiesEnabled: function() {
      var cookieEnabled = navigator.cookieEnabled;
  
      if (!cookieEnabled){
        document.cookie = 'testcookie';
        cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
      }
      return cookieEnabled;
    }
  };
  
  /**
   * Utility helpers
   * -----------------------------------------------------------------------------
   * A collection of useful functions for dealing with arrays and objects
   *
   * @namespace utils
   */
  
  slate.utils = {
  
    /**
     * Return an object from an array of objects that matches the provided key and value
     *
     * @param {array} array - Array of objects
     * @param {string} key - Key to match the value against
     * @param {string} value - Value to get match of
     */
    findInstance: function(array, key, value) {
      for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
          return array[i];
        }
      }
    },
  
    /**
     * Remove an object from an array of objects by matching the provided key and value
     *
     * @param {array} array - Array of objects
     * @param {string} key - Key to match the value against
     * @param {string} value - Value to get match of
     */
    removeInstance: function(array, key, value) {
      var i = array.length;
      while(i--) {
        if (array[i][key] === value) {
          array.splice(i, 1);
          break;
        }
      }
  
      return array;
    },
  
    /**
     * _.compact from lodash
     * Remove empty/false items from array
     * Source: https://github.com/lodash/lodash/blob/master/compact.js
     *
     * @param {array} array
     */
    compact: function(array) {
      var index = -1;
      var length = array == null ? 0 : array.length;
      var resIndex = 0;
      var result = [];
  
      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    },
  
    /**
     * _.defaultTo from lodash
     * Checks `value` to determine whether a default value should be returned in
     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
     * or `undefined`.
     * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
     *
     * @param {*} value - Value to check
     * @param {*} defaultValue - Default value
     * @returns {*} - Returns the resolved value
     */
    defaultTo: function(value, defaultValue) {
      return (value == null || value !== value) ? defaultValue : value
    }
  };
  
  /**
   * Rich Text Editor
   * -----------------------------------------------------------------------------
   * Wrap iframes and tables in div tags to force responsive/scrollable layout.
   *
   * @namespace rte
   */
  
  slate.rte = {
    /**
     * Wrap tables in a container div to make them scrollable when needed
     *
     * @param {object} options - Options to be used
     * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
     * @param {string} options.tableWrapperClass - table wrapper class name
     */
    wrapTable: function(options) {
      var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;
  
      options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
    },
  
    /**
     * Wrap iframes in a container div to make them responsive
     *
     * @param {object} options - Options to be used
     * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
     * @param {string} options.iframeWrapperClass - class name used on the wrapping div
     */
    wrapIframe: function(options) {
      var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;
  
      options.$iframes.each(function() {
        // Add wrapper to make video responsive
        $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');
        
        // Re-set the src attribute on each iframe after page load
        // for Chrome's "incorrect iFrame content on 'back'" bug.
        // https://code.google.com/p/chromium/issues/detail?id=395791
        // Need to specifically target video and admin bar
        this.src = this.src;
      });
    }
  };
  
  slate.Sections = function Sections() {
    this.constructors = {};
    this.instances = [];
  
    $(document)
      .on('shopify:section:load', this._onSectionLoad.bind(this))
      .on('shopify:section:unload', this._onSectionUnload.bind(this))
      .on('shopify:section:select', this._onSelect.bind(this))
      .on('shopify:section:deselect', this._onDeselect.bind(this))
      .on('shopify:section:reorder', this._onReorder.bind(this))
      .on('shopify:block:select', this._onBlockSelect.bind(this))
      .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
  };
  
  slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
    _createInstance: function(container, constructor) {
      var $container = $(container);
      var id = $container.attr('data-section-id');
      var type = $container.attr('data-section-type');
  
      constructor = constructor || this.constructors[type];
  
      if (typeof constructor === 'undefined') {
        return;
      }
  
      var instance = $.extend(new constructor(container), {
        id: id,
        type: type,
        container: container
      });
  
      this.instances.push(instance);
    },
  
    _onSectionLoad: function(evt) {
      var container = $('[data-section-id]', evt.target)[0];
      if (container) {
        this._createInstance(container);
      }
    },
  
    _onSectionUnload: function(evt) {
      var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);
  
      if (!instance) {
        return;
      }
  
      if (typeof instance.onUnload === 'function') {
        instance.onUnload(evt);
      }
  
      this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
    },
  
    _onSelect: function(evt) {
      var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);
  
      if (instance && typeof instance.onSelect === 'function') {
        instance.onSelect(evt);
      }
    },
  
    _onDeselect: function(evt) {
      var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);
  
      if (instance && typeof instance.onDeselect === 'function') {
        instance.onDeselect(evt);
      }
    },
  
    _onReorder: function(evt) {
      var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);
  
      if (instance && typeof instance.onReorder === 'function') {
        instance.onReorder(evt);
      }
    },
  
    _onBlockSelect: function(evt) {
      var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);
  
      if (instance && typeof instance.onBlockSelect === 'function') {
        instance.onBlockSelect(evt);
      }
    },
  
    _onBlockDeselect: function(evt) {
      var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);
  
      if (instance && typeof instance.onBlockDeselect === 'function') {
        instance.onBlockDeselect(evt);
      }
    },
  
    register: function(type, constructor) {
      this.constructors[type] = constructor;
  
      $('[data-section-type=' + type + ']').each(function(index, container) {
        var registered = $(container).data('section-registered');
        if (registered != undefined) {
          if (registered == false) {
            this._createInstance(container, constructor);
            $(container).data('section-registered', true)
          }
        }
        else {
          this._createInstance(container, constructor);
        }
      }.bind(this));
    }
  });
  
  /**
   * Currency Helpers
   * -----------------------------------------------------------------------------
   * A collection of useful functions that help with currency formatting
   *
   * Current contents
   * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
   *
   */
  
  slate.Currency = (function () {
    var moneyFormat = '${{amount}}';
  
    /**
     * Format money values based on your shop currency settings
     * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
     * or 3.00 dollars
     * @param  {String} format - shop money_format setting
     * @return {String} value - formatted value
     */
    function formatMoney(cents, format) {
      if (typeof cents === 'string') {
        cents = cents.replace('.', '');
      }
      var value = '';
      var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      var formatString = (format || moneyFormat);
  
      function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = slate.utils.defaultTo(precision, 2);
        thousands = slate.utils.defaultTo(thousands, ',');
        decimal = slate.utils.defaultTo(decimal, '.');
  
        if (isNaN(number) || number == null) {
          return 0;
        }
  
        number = (number / 100.0).toFixed(precision);
  
        var parts = number.split('.');
        var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
        var centsAmount = parts[1] ? (decimal + parts[1]) : '';
  
        return dollarsAmount + centsAmount;
      }
  
      switch (formatString.match(placeholderRegex)[1]) {
        case 'amount':
          value = formatWithDelimiters(cents, 2);
          break;
        case 'amount_no_decimals':
          value = formatWithDelimiters(cents, 0);
          break;
        case 'amount_with_comma_separator':
          value = formatWithDelimiters(cents, 2, '.', ',');
          break;
        case 'amount_no_decimals_with_comma_separator':
          value = formatWithDelimiters(cents, 0, '.', ',');
          break;
      }
  
      return formatString.replace(placeholderRegex, value);
    }
  
    return {
      formatMoney: formatMoney
    };
  })();
  
  /**
   * Image Helper Functions
   * -----------------------------------------------------------------------------
   * A collection of functions that help with basic image operations.
   *
   */
  
  slate.Image = (function() {
  
    /**
     * Preloads an image in memory and uses the browsers cache to store it until needed.
     *
     * @param {Array} images - A list of image urls
     * @param {String} size - A shopify image size attribute
     */
  
    function preload(images, size) {
      if (typeof images === 'string') {
        images = [images];
      }
  
      for (var i = 0; i < images.length; i++) {
        var image = images[i];
        this.loadImage(this.getSizedImageUrl(image, size));
      }
    }
  
    /**
     * Loads and caches an image in the browsers cache.
     * @param {string} path - An image url
     */
    function loadImage(path) {
      new Image().src = path;
    }
  
    /**
     * Find the Shopify image attribute size
     *
     * @param {string} src
     * @returns {null}
     */
    function imageSize(src) {
      var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
  
      if (match) {
        return match[1];
      } else {
        return null;
      }
    }
  
    /**
     * Adds a Shopify size attribute to a URL
     *
     * @param src
     * @param size
     * @returns {*}
     */
    function getSizedImageUrl(src, size) {
      if (size === null) {
        return src;
      }
  
      if (size === 'master') {
        return this.removeProtocol(src);
      }
  
      var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
  
      if (match) {
        var prefix = src.split(match[0]);
        var suffix = match[0];
  
        return this.removeProtocol(prefix[0] + '_' + size + suffix);
      } else {
        return null;
      }
    }
  
    function removeProtocol(path) {
      return path.replace(/http(s)?:/, '');
    }
  
    return {
      preload: preload,
      loadImage: loadImage,
      imageSize: imageSize,
      getSizedImageUrl: getSizedImageUrl,
      removeProtocol: removeProtocol
    };
  })();
  
  /**
   * Variant Selection scripts
   * ------------------------------------------------------------------------------
   *
   * Handles change events from the variant inputs in any `cart/add` forms that may
   * exist. Also updates the master select and triggers updates when the variants
   * price or image changes.
   *
   * @namespace variants
   */
  
  slate.Variants = (function() {
  
    /**
     * Variant constructor
     *
     * @param {object} options - Settings from `product.js`
     */
    function Variants(options) {
      this.$container = options.$container;
      this.product = options.product;
      this.singleOptionSelector = options.singleOptionSelector;
      this.originalSelectorId = options.originalSelectorId;
      this.enableHistoryState = options.enableHistoryState;
      this.addToCartSelector = options.addToCartSelector;
      this.className = options.className;
      this.currentVariant = this._getVariantFromOptions();
      var $selector = $(this.singleOptionSelector, this.$container);
      // console.log('$selector', $selector);
      $selector.on('change', this._onSelectChange.bind(this));
    }
  
    Variants.prototype = $.extend({}, Variants.prototype, {
  
      /**
       * Get the currently selected options from add-to-cart form. Works with all
       * form input elements.
       *
       * @return {array} options - Values of currently selected variants
       */
      _getCurrentOptions: function() {
        var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
          var $element = $(element);
          var type = $element.attr('type');
          var currentOption = {};
  
          if (type === 'radio' || type === 'checkbox') {
            if ($element[0].checked) {
              currentOption.value = $element.val();
              currentOption.index = $element.data('index');
  
              return currentOption;
            } else {
              return false;
            }
          } else {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');
            return currentOption;
          }
        });
  
        // remove any unchecked input values if using radio buttons or checkboxes
        currentOptions = slate.utils.compact(currentOptions);
  
        return currentOptions;
      },
  
      /**
       * Find variant based on selected values.
       *
       * @param  {array} selectedValues - Values of variant inputs
       * @return {object || undefined} found - Variant object from product.variants
       */
      _getVariantFromOptions: function() {
        var selectedValues = this._getCurrentOptions();
        // console.log('selectedValues', selectedValues);
        var variants = this.product.variants;
        var found = false;
  
        variants.forEach(function(variant) {
          var satisfied = true;
  
          selectedValues.forEach(function(option) {
            if (satisfied) {
              satisfied = (option.value === variant[option.index]);
            }
          });
  
          if (satisfied) {
            found = variant;
          }
        });
  
        return found || null;
      },
  
      /**
       * Event handler for when a variant input changes.
       */
       /**
    * Event handler for when a variant input changes.
    */
   _onSelectChange: function() {
     var variant = this._getVariantFromOptions();
     this.$container.trigger({
       type: 'variantChange',
       variant: variant
     });
  
     if (!variant) {
       return;
     }
  
   // BEGIN SWATCHES
   var selector = this.originalSelectorId;
   if (variant) {
       var form = $(selector).closest('form');
       for (var i=0,length=variant.options.length; i<length; i++) {
           var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]');
          
       }
   }
   // END SWATCHES
  
     this._updateMasterSelect(variant);
     this._updateImages(variant);
     this._updatePrice(variant);
     this.currentVariant = variant;
  
     if (this.enableHistoryState) {
       this._updateHistoryState(variant);
     }
   },
  
      /**
       * Trigger event when variant image changes
       *
       * @param  {object} variant - Currently selected variant
       * @return {event}  variantImageChange
       */
      _updateImages: function(variant) {
        var variantImage = variant.featured_image || {};
        var currentVariantImage = this.currentVariant.featured_image || {};
  
        if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
          return;
        }
  
        this.$container.trigger({
          type: 'variantImageChange',
          variant: variant
        });
      },
  
      /**
       * Trigger event when variant price changes.
       *
       * @param  {object} variant - Currently selected variant
       * @return {event} variantPriceChange
       */
      _updatePrice: function(variant) {
        if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
          return;
        }
  
        this.$container.trigger({
          type: 'variantPriceChange',
          variant: variant
        });
      },
  
      /**
       * Update history state for product deeplinking
       *
       * @param {object} variant - Currently selected variant
       */
      _updateHistoryState: function(variant) {
        if (!history.replaceState || !variant) {
          return;
        }
  
        var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
        window.history.replaceState({path: newurl}, '', newurl);
      },
  
      /**
       * Update hidden master select of variant change
       *
       * @param {object} variant - Currently selected variant
       */
      _updateMasterSelect: function(variant) {
        $(this.originalSelectorId, this.$container)[0].value = variant.id;
        $(this.addToCartSelector, this.$container).attr('data-variant', variant.id).data('variant', variant.id);
      }
    });
  
    return Variants;
  })();
  
  
  /*================ Sections ================*/
  /**
   * Product Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Product template.
   *
     * @namespace product
   */
  
  theme.Product = (function() {
  
    var selectors = {
      addToCart: '[data-add-to-cart]',
      addToCartText: '[data-add-to-cart-text]',
      notifyMe: '[data-notify-me]',
      swatchVariantOne: '#variant-0 .swatch-element',
      swatchVariantTwo: '#variant-1 .swatch-element',
      lengthDD: '.length-dropdown',
      sizeDD: '.size-dropdown',
      size: '[data-option-index="0"]',
      sizeBubbles: '[data-option-index="0"] .swatch-element',
      comparePrice: '[data-compare-price]',
      comparePriceText: '[data-compare-text]',
      originalSelectorId: '[data-product-select]',
      priceWrapper: '[data-price-wrapper]',
      productFeaturedImage: '[data-product-featured-image]',
      productJson: '[data-product-json]',
      variantsJson: '[data-variants-json]',
      productPrice: '[data-product-price]',
      productThumbs: '[data-product-single-thumbnail]',
      singleOptionSelector: '[data-single-option-selector]',
      stockAmount: '[data-stock-amount]',
      colorPicker: '[data-picker-title]',
      quickAdd: '.quick-add',
      quickAddPlace: '[data-quick-add-place]'
    };
  
    /**
     * Product section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    function Product(container) {
      // console.log('start product');
      this.$container = $(container);
      // Stop parsing if we don't have the product json script tag when loading
      // section in the Theme Editor
      if (!$(selectors.productJson, this.$container).html()) {
        return;
      }
      // console.log("registered", this.$container);
      var sectionId = this.$container.attr('data-section-id');
      this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());
      this.variantsObject = JSON.parse($(selectors.variantsJson, this.$container).html());
  
      var options = {
        $container: this.$container,
        enableHistoryState: this.$container.data('enable-history-state') || false,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject,
        addToCartSelector: selectors.addToCart
      };
  
      this.settings = {};
      this.namespace = '.product';
      this.variants = new slate.Variants(options);
      this.$featuredImage = $(selectors.productFeaturedImage, this.$container);
  
      this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
      this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));
      // On Variant change
      //this.$container.on('variantChange' + this.namespace, this.updateVariantStockStatus.bind(this));
      
      if (this.$featuredImage.length > 0) {
        this.settings.imageSize = slate.Image.imageSize(this.$featuredImage.attr('src'));
        slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);
  
        this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
      }
      
      if (this.$container.data('section-type') == 'quickAdd-grid-item' || this.$container.data('section-type') == 'quickAdd-minicart') {
        this.$container.on('click', selectors.colorPicker, this.replaceQuickAddProduct.bind(this));
        this.$container.on('change', 'select', this.updateQuickAddProduct.bind(this));
      }
  
      // Init default variant on register
      // if (this.$container.data('section-type') == 'product' && $(selectors.singleOptionSelector, this.$container).length == 1) {
      //   $(selectors.singleOptionSelector, this.$container).trigger('change');
      // }
    }
  
    Product.prototype = $.extend({}, Product.prototype, {
  
      /**
       * Updates the DOM state of the add to cart button
       *
       * @param {boolean} enabled - Decides whether cart is enabled or disabled
       * @param {string} text - Updates the text notification content of the cart
       */
      updateAddToCartState: function(evt) {
        var variant = evt.variant;
        console.log('updateAddToCartState', variant);
        var textAddToCart = $(selectors.addToCart, this.$container).data('add-text') || theme.strings.addToCart;
        var textSoldOut = $(selectors.addToCart, this.$container).data('sold-text') || theme.strings.soldOut;
        var textUnavailable = ($(selectors.lengthDD, this.$container).length == 0) 
          ? textAddToCart 
          : theme.strings.unavailable;
        var makeUnavailable = function(_this) {
          console.log("makeUnavailable")
          $(selectors.addToCart, _this.$container).prop('disabled', true);
          $(selectors.addToCartText, _this.$container).html(textUnavailable);
          $(selectors.priceWrapper, _this.$container).addClass('hide');
          _this.updateSoldoutState(variant);
        }
        var makeSoldout = function(_this) {
          console.log("makeSoldout")
          $(selectors.addToCart, _this.$container).prop('disabled', true);
          $(selectors.addToCartText, _this.$container).html(textSoldOut);
          $(selectors.notifyMe, _this.$container).show().addClass('is-enabled');
        }
        var makeAvailable = function(_this) {
          console.log("makeAvailable")
          $(selectors.addToCart, _this.$container).prop('disabled', false);
          $(selectors.addToCartText, _this.$container).html(textAddToCart);
          $(selectors.notifyMe, _this.$container).hide().removeClass('is-enabled');
        }
        var makeDisabled = function(_this) {
          console.log("makeDisabled")
          $(selectors.addToCart, _this.$container).prop('disabled', true);
          $(selectors.addToCartText, _this.$container).html(textAddToCart);
          $(selectors.notifyMe, _this.$container).hide().removeClass('is-enabled');
        }
  
        
  
        if (variant) {
          $(selectors.priceWrapper, this.$container).removeClass('hide');
          this.updateSoldoutState(variant);
          this.updateVariantStockInfo(variant);
        } else {
          makeUnavailable(this);
          return; 
        }
  
        if (variant.available) {
          makeAvailable(this);
          return; 
        } else {
          makeSoldout(this);
          return; 
        }
  
        if ($(selectors.lengthDD, this.$container).length
          && $(selectors.sizeDD, this.$container).length 
          && !$(selectors.sizeDD, this.$container).val()) {
          makeDisabled(this);
          return;
        }
  
  
      },
  
      updateSoldoutState: function(variant) {
        console.log('updateSoldoutState');
        var variants = this.variants.product.variants;
        var _this = this;
        // Case for regular product page (circle size):
        if (variant) {
          var currentOption2 = variant.option2;
          $(selectors.swatchVariantOne, this.$container).removeClass('soldout');
          $(selectors.sizeDD+' option', this.$container).removeAttr('disabled');
          variants.forEach(function(_variant) {
            if (_variant.option2 == currentOption2 && _variant.available == false) {
              $(selectors.swatchVariantOne+'[data-value='+_variant.option1+']', _this.$container).addClass('soldout');
              $(selectors.sizeDD+' option[value='+_variant.option1+']', _this.$container).attr('disabled', true);
            }
          });
        }
        // Case for quick add (dropdown size):
        else if ($(selectors.lengthDD, this.$container).length == 0) {
          $(selectors.sizeDD, this.$container).removeAttr('disabled');
          variants.forEach(function(_variant) {
            if (_variant.available == false) {
              $(selectors.sizeDD+' option[value='+_variant.option1+']', _this.$container).attr('disabled', true);
            }
          });
        }
  
      },
  
      updateVariantStockInfo: function(variant) {
        var qty;
        this.variantsObject.forEach(function(v) {
          if ( v.id === variant.id ) {
            qty = v.inventory_quantity;
          }
        })
        if (qty !== undefined && qty <= 3 && qty > 0) {
          $(selectors.stockAmount, this.$container).text(qty).parent().addClass('is-visible');
        } else {
          $(selectors.stockAmount, this.$container).text(qty).parent().removeClass('is-visible');
        }
      },
  
      /**
       * Updates variants based on their stock
       */
      // updateVariantStockStatus: function(evt) {
      //   var variant = evt.variant; 
      //   this.firstVariantRow = '#variant-0 .swatch-element';
  
      //   if (variant.available) {
      //     $(selectors.swatchVariantTwo, this.$container).addClass('available');
      //     $(selectors.swatchVariantTwo, this.$container).removeClass('soldout');
      //   } else {
      //     $(selectors.swatchVariantTwo, this.$container).addClass('soldout');
      //     $(selectors.swatchVariantTwo, this.$container).removeClass('available');
      //   }
      // },
  
      /**
       * Updates the DOM with specified prices
       *
       * @param {string} productPrice - The current price of the product
       * @param {string} comparePrice - The original price of the product
       */
      updateProductPrices: function(evt) {
        var variant = evt.variant;
        var $comparePrice = $(selectors.comparePrice, this.$container);
        var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);
  
        $(selectors.productPrice, this.$container)
          .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));
  
        if (variant.compare_at_price > variant.price) {
          $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
          $compareEls.removeClass('hide');
        } else {
          $comparePrice.html('');
          $compareEls.addClass('hide');
        }
      },
  
      replaceQuickAddProduct: function(evt) {
        evt.preventDefault();
        
        var _this = this;
        var $quickAddPlace = this.$container.closest(selectors.quickAddPlace);
        var quickAddTemplate = this.$container.data('section-type');
        var productUrl = $(evt.currentTarget).attr('href')+'?view='+quickAddTemplate;
  
        if (productUrl.indexOf('/products/') > -1) {
          $.ajax({
            type: "GET",
            url: productUrl,
            success: function (response) {
              _this.$container.off();
              $quickAddPlace.html(response);
              var sections = new slate.Sections();
              sections.register(quickAddTemplate, theme.Product);
  
              // update colors list ordering:
              const $colors = $quickAddPlace.data('colors-list');
              $('.colors-wrapper .swatch-element', $quickAddPlace).html($colors);
            }
          });
        }
      },
  
      updateQuickAddProduct: function(evt) {
        // quick add panel toggle:
        $(selectors.quickAdd).removeClass('is-active');
        this.$container.addClass('is-active');
      },
  
      /**
       * Updates the DOM with the specified image URL
       *
       * @param {string} src - Image src URL
       */
      updateProductImage: function(evt) {
        var variant = evt.variant;
        var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);
  
        this.$featuredImage.attr('src', sizedImgUrl);
      },
  
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        this.$container.off(this.namespace);
      }
    });
  
    return Product;
  })();
  
  
  /*================ Templates ================*/
  /**
   * Customer Addresses Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Customer Addresses
   * template.
   *
   * @namespace customerAddresses
   */
  
  theme.customerAddresses = function() {
    var $newAddressForm = $('#AddressNewForm');
  
    if (!$newAddressForm.length) {
      return;
    }
  
    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew'
      });
    }
  
    // Initialize each edit form's country/province selector
    $('.address-country-option').each(function() {
      var formId = $(this).data('form-id');
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;
  
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });
  
    // Toggle new/edit address forms
    $('.address-new-toggle').on('click', function() {
      $newAddressForm.toggleClass('hide');
    });
  
    $('.address-edit-toggle').on('click', function() {
      var formId = $(this).data('form-id');
      $('#EditAddress_' + formId).toggleClass('hide');
    });
  
    $('.address-delete').on('click', function() {
      var $el = $(this);
      var formId = $el.data('form-id');
      var confirmMessage = $el.data('confirm-message');
      if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
        Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
      }
    });
  };
  
  /**
   * Password Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Password template.
   *
   * @namespace password
   */
  
  theme.customerLogin = function() {
    var config = {
      recoverPasswordForm: '#RecoverPassword',
      hideRecoverPasswordLink: '#HideRecoverPasswordLink'
    };
  
    if (!$(config.recoverPasswordForm).length) {
      return;
    }
  
    checkUrlHash();
    resetPasswordSuccess();
  
    $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
    $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);
  
    function onShowHidePasswordForm(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm();
    }
  
    function checkUrlHash() {
      var hash = window.location.hash;
  
      // Allow deep linking to recover password form
      if (hash === '#recover') {
        toggleRecoverPasswordForm();
      }
    }
  
    /**
     *  Show/Hide recover password form
     */
    function toggleRecoverPasswordForm() {
      $('#RecoverPasswordForm').toggleClass('hide');
      $('#CustomerLoginForm').toggleClass('hide');
    }
  
    /**
     *  Show reset password success message
     */
    function resetPasswordSuccess() {
      var $formState = $('.reset-password-success');
  
      // check if reset password form was successfully submited.
      if (!$formState.length) {
        return;
      }
  
      // show success message
      $('#ResetSuccess').removeClass('hide');
    }
  };
  
  
  /*================ Modules ================*/
  var modules = {};
  modules.header = function () {
      // ------------------------- CHANGE LOGO SIZE ON SCROLL -------------------------
      $(window).scroll(function() {
          var $logo = $('#logo');
          var nav = $('.primary-nav-link');
          var navDropdown = $('.nav-dropdown');
          var st = $(this).scrollTop();
          if( st > 5 ) {
              $logo.addClass("scroll-resize");
              nav.addClass("scroll-resize");
              navDropdown.addClass("reduced-padding");
          } else if (st < 48) {
              $logo.removeClass("scroll-resize");
              nav.removeClass("scroll-resize");
              navDropdown.removeClass("reduced-padding");
          }
      });
      // ------------------------- MOBILE MENU HAMBURGER X ANIMATION -------------------------
      $("[data-mobile-menu-open]").on('change', function(){
          $('.hamburger-menu').toggleClass("change");
          $('.fade-wrapper').toggleClass("active");
      });
      $('[data-mobile-menu-close]').click(function() {
          $("[data-mobile-menu-open]").trigger('click');
      })
      // ------------------------- MEGA MENU -------------------------
      var navbar_height = $(".navigation-bar").height();
      $(".dropdown-nav-link").on({
          mouseenter: function () {
              $(this).find(".mega-menu").each(function(el) {
                  $(this).addClass("active");
              });
          },
          mouseleave: function () {
              $(this).find(".mega-menu").each(function(el) {
                  $(this).removeClass("active");
              });
          }
      });
      // ------------------------- MOBILE MENU DROPDOWN NAV -------------------------
      $(".nav-mobile .primary-nav-link > a").click(function(e){
          e.preventDefault();
          var active = $(this).parent();
          $(active).toggleClass("active");
          $(active).find(".secondary-nav").slideToggle();
          $(".primary-nav-link").not(active).find(".secondary-nav").slideUp();
          $(".primary-nav-link").not(active).removeClass("active");
      });
      // Hide links that sit under {bold} subtitle
      $('.third-nav').each(function(){
          if($(this).parent().find('.links-heading').length) {
              $(this).find('.third-nav-links').hide();
          }
       });
  
      $(".third-nav .links-heading").click(function(e){
          e.preventDefault();
          //var third_parent = $(this).parents().eq(2);
          //var third_parent_non_active = $(third_parent).find(".third-nav").not(".active");
          $(this).toggleClass("active");
          var $parent = $(this).parent();
          var title = $(this).data('parent-link');
          $parent.find(".third-nav-links").filter('[data-child-link='+title+']').slideToggle();
          //$(third_parent_non_active).find(".third-nav-links").slideUp();
          //$(third_parent).find(".third-nav").not(".active").$(".third-nav-links").removeClass("active");
      });
      // ------------------------- DESKTOP SEARCH -------------------------
      $(".show-search-btn").click(function(){
          $(".right-nav .navigation").slideUp();
          $(".medium-search").slideUp();
          $(".desktop-search").slideDown();
          $(".close-search").addClass('move-up');
      });
      $(".close-search").click(function(){
          $(".desktop-search").slideUp();
          $(".medium-search").slideDown();
          $(".right-nav .navigation").slideDown();
          $(".close-search").removeClass('move-up');
      });
    
      // -------------------- Discount Promo Message Hide ---------------------------
      $(".minicart__promo-title .icon-close").on('click', function(){
        $('.minicart__promo-notice').hide();
      });
      // -------------------- Discount Promo Message Hide ---------------------------
      
    // ------------------------- MOBILE SEARCH -------------------------
      $(".show-search-btn-mbl").click(function(){
        $(".mobile-search").addClass('active');
        $(".mobile-search input").trigger("focus");
      });
    	
    
     // --------------- Scroll to newsletter section ----------------------
    scrollToNewsLetter(".message-bar span");
    scrollToNewsLetter(".message-bar-mobile span");
    
    function scrollToNewsLetter(elem){
       $(elem).click(function(e) {
        e.preventDefault();
        if( $(this).find('a').attr('href') != 'undefined' && $(this).find('a').attr('href') != '#'){
          //console.log('link', $(this).find('a').attr('href'))
          window.location.href = $(this).find('a').attr('href');
        }else{
           var newsletterSection = '';
          if ((window.location.href.indexOf("collections") > -1) || (window.location.href.indexOf("products") > -1) || (window.location.href.indexOf("blogs") > -1) || (window.location.href.indexOf("pages") > -1)) {
            newsletterSection =  $('.newsletter-block');
          }else{
            newsletterSection =  $('.newsletter-side');
          }
          $('html, body').animate({
              scrollTop: newsletterSection.offset().top - 50
          }, 2000);
          
        }
      });
    }
  }
  modules.testimonials = function () {
    var $sliders = $('[data-slider]');
  
    $sliders.each(function (index, element) {
      // Recalc AOS plugin after slider init:
      var $slider = $(element);
      var $sliderContainer = $slider.closest('[data-slider-container]');
      var $thumb = $('[data-slider-thumb]', $sliderContainer);
      $slider.on('init', function () {
        AOS.refreshHard();
      })
      //Slick slider initialize
      $slider.slick({
        arrows:false,
        dots: false,
        infinite:true,
        speed: 500,
        autoplay:false,
        autoplaySpeed: 3000,
        draggable: true,
        arrows: false,
        dots: true,
        cssEase: 'ease-in-out',
        adaptiveHeight: true,
        slidesToShow:1,
        slidesToScroll:1
      });
      //On click of slider-nav childern,
      //Slick slider navigate to the respective index.
      $thumb.click(function() {
        $thumb.removeClass("active");
        $(this).addClass("active");
        $slider.slick('slickGoTo', $(this).index());
      });
      $slider.on('afterChange', function() {
        var currentIndex = $('.slick-current', $slider).attr('data-slick-index');
        $thumb.removeClass("active");
        $thumb.eq(currentIndex).addClass("active");
      })
    });
  }
  modules.aos = function () {
      AOS.init();
  }
  modules.subscriptionPopup = function () {
    /******************
    COOKIE NOTICE
    ******************/
    var selectors = {
      popup: '[data-s-popup]',
      overlay: '[data-s-popup-overlay]'
    }
    // var timeToShow = 100;
    var timeToShow = 8000;
    if (getCookie('show_cookie_message') != 'no') {
      $(selectors.popup+', '+selectors.overlay).delay(timeToShow).queue(function () {
        $(this).addClass("show").dequeue();
      });
    }
  
    $(selectors.popup).find('.close-btn').click(function () {
      $(selectors.popup+', '+selectors.overlay).removeClass("show");
      setCookie('show_cookie_message', 'no');
      return false;
    });
  
    // Cookie Settings (for Popup)
    function setCookie(cookie_name, value) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + (365 * 25));
      document.cookie = cookie_name + "=" + escape(value) + "; expires=" + exdate.toUTCString() + "; path=/";
    }
  
    function getCookie(cookie_name) {
      if (document.cookie.length > 0) {
        cookie_start = document.cookie.indexOf(cookie_name + "=");
        if (cookie_start != -1) {
          cookie_start = cookie_start + cookie_name.length + 1;
          cookie_end = document.cookie.indexOf(";", cookie_start);
          if (cookie_end == -1) {
            cookie_end = document.cookie.length;
          }
          return unescape(document.cookie.substring(cookie_start, cookie_end));
        }
      }
      return "";
    }
  
    function formError(id) {
      console.log(id);
      $(`#${id} #mce-success-response`).hide();
      $(`#${id} #mce-error-response`).show();
    }
  
    function formSuccess(id) {
      console.log(id);
      $(`#${id} #mce-error-response`).hide();
      $(`#${id} #mce-success-response`).show();
    }
  
    function register($form) {
      const id = $form.attr('id');
      var blackFridayPage = ".black-friday-form";
  
      jQuery.ajax({
        type: "GET",
        url: $form.attr('action'),
        data: $form.serialize(),
        cache: false,
        dataType: 'jsonp',
        contentType: "application/json; charset=utf-8",
        error: function (err) {
          console.error('Error sending form', err)
        },
        success: function (data) {
          if (data.result != "success") {
            console.log('error');
            formError(id);
          } else {
            console.log('success');
            if ($(`#${id}`).is(blackFridayPage)) {
              $(location).attr("href", '/pages/black-friday-confirmation');
            } else {
              formSuccess(id);
            }
          }
        }
      });
    }
  
    // waits for form to appear rather than appending straight to the form. Also helps if you have more than one type of form that you want to use this action on.
    const forms = ['#mc-embedded-subscribe-form-1', '#mc-embedded-subscribe-form-2', '#mc-embedded-subscribe-form-3', '#mc-embedded-subscribe-form-4', '.js-landing-forms'].join(',');
  
    $(forms).on('submit', function (event) {
      try {
        //define argument as the current form especially if you have more than one
        var $form = jQuery(this);
        // stop open of new tab
        event.preventDefault();
        // submit form via ajax
        register($form);
      } catch (error) {
  
      }
    });
  }
  modules.productPhotoSlider = function () {
    var $slider = $('.product-photo-slider');
    if ($slider.length == 0) return false;
    
    function initSlider () {
      if ($slider.hasClass('slick-initialized')) {
        $slider.slick('unslick');
      }
  
      if ($(window).width() < 750) {
        // Recalc AOS plugin after slider init:
        $slider.on('init', function () {
          AOS.refreshHard();
        })
        $slider.slick({
          draggable: true,
          arrows: true,
          speed: 300,
          infinite: true,
          dots: true,
          cssEase: 'ease-in-out',
          nextArrow: '<div class="arrow-wrapper right"><i class="arrow-right"></div>',
          prevArrow: '<div class="arrow-wrapper left"><i class="arrow-left"></div>'
        });
      }
    }
    $(window).resize(function() {
      initSlider();
    })
    initSlider();
  }
  modules.dropdownToRadio = function () {
  // ------------------------- hack for triggering slate/variants/singleOptionSelector -------------------------
  $(function() {
      $(document).on('change', '.swatch :radio, .size-dropdown', function() {
        // do nothing if length option exists and it's not picked:
        var $form = $(this).closest('form');
        console.log('change size');
        console.log($form);
  
        if ($('.length-dropdown', $form).length && $('.length-dropdown', $form).val() == null) return false;
  
        var optionIndex = $(this).closest('.swatch').attr('data-option-index');
        var optionValue = $(this).val();
        $form
          .find('.single-option-selector')
          .eq(optionIndex)
          .val(optionValue)
          .trigger('change');
      });
  
      $(document).on('change', '.length-dropdown', function () {
        var optionIndex = $(this).closest('.swatch').attr('data-option-index');
        var optionValue = $(this).val();
        var $form = $(this).closest('form');
        console.log('change length');
        console.log($form.parent().find('.single-option-selector').eq(optionIndex));
  
  
        $form.parent()
          .find('.single-option-selector')
          .eq(optionIndex)
          .val(optionValue)
          .trigger('change');
  
  
  
        var $sizeDD = $('.size-dropdown', $form);
        if ($sizeDD.length) {
          var size = $sizeDD.val();
          console.log('size:', size); 
          if (size) {
            $sizeDD.val(size).trigger('change');
          }
        }
        else {
          var $size = $('.swatch input:checked', $form).length ? $('.swatch input:checked', $form) : $('.swatch input[data-default]', $form);
          console.log('size:', $size); 
          $size.attr('checked', true).change();
        }
      });
  
    });
  }
 modules.zoomInPhoto = function () {
    // ------------------------- ZOOM IN ON PRODUCT PAGE PHOTO -------------------------
    if(iPhoneDevices()){
        $('.image-zoom')
        .wrap('<span style="display:inline-block"></span>')
        .css('display', 'block')
        .parent()
        .zoom({
          magnify: 0.5,
          url: $(this).find('img').attr('data-zoom')
        });
      } else {
         $('.image-zoom')
          .wrap('<span></span>')
          .css('display', 'block')
          .parent()
          .zoom({
            on: 'mouseover',
            magnify: 0.5,
            touch: true,
            url: $(this).find('img').attr('data-zoom'),
            onZoomIn: function() {
              $(this).addClass('is-active');
              //$(this).parent().find('.zoomImg').addClass('is-active');
            },
            onZoomOut: function() {
              $(this).removeClass('is-active');
              //$(this).parent().find('.zoomImg').removeClass('is-active');
            }
        });
      }
  
    }
  modules.responsiveTabs = function () {
    // ------------------------- TABS (RESPONSIVE INTO ACCORDION) -------------------------
    $(".tab_content").hide();
    $(".d_active + .tab_content").show();
  
    /* if in tab mode */
    $("ul.tabs li").click(function () {
  
      $(".tab_content").hide();
      var activeTab = $(this).attr("rel");
      $("#" + activeTab).fadeIn();
  
      $("ul.tabs li").removeClass("active");
      $(this).addClass("active");
  
      $(".tab_drawer_heading").removeClass("d_active");
      $(".tab_drawer_heading[rel^='" + activeTab + "']").addClass("d_active");
  
    });
    /* if in drawer mode */
    $(".tab_drawer_heading").click(function () {
      $(this).toggleClass("d_active");
      var d_activeTab = $(this).attr("rel");
      $("#" + d_activeTab).slideToggle(function() {
        $(document).trigger('accordionToggle')
      });
    });
  
    /* Extra class "tab_last"
       to add border to right side
       of last tab */
    $('ul.tabs li').last().addClass("tab_last");
  }
  modules.popup = function () {
      // ------------------------- POP UP -------------------------
  	//open popup
  	$('.cd-popup-trigger').on('click', function(event){
  		event.preventDefault();
      var link_id = $(this).attr("href");
  		$(link_id).addClass('is-visible');
      
  	});
  
  	//close popup
  	$('.cd-popup').on('click', function(event){
  		if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup') ) {
  			event.preventDefault();
  			$(this).removeClass('is-visible');
  			$(this).find('#entry-form').show();
          	$(this).find('#success-msg').hide();
  		}
      });
      if(event && event.which=='27'){
  		$('.cd-popup').removeClass('is-visible');
        }
  }
  modules.geolocation = function () {
    var selectors = {
      locationPicker: '[data-location-picker]',
      translate: '[data-translate]',
      popup: '[data-popup="location"]'
    };
    if ($(selectors.popup).length == 0) return false;
     
    var api = window.GEO_API;
    if (api == undefined) return console.error("Wrong translate api url settings");
    var locationCode = localStorage.getItem('locationCode')
  
    // Different script for UK and US domains 
    var websiteDomain = document.location.hostname;
    if (websiteDomain == 'daiwear.com') {
      //
      $(selectors.locationPicker).on('mousedown touchstart', function () {
        var code = $(this).data('code');
        if (code === 'gb' || code === 'uk') {
          localStorage.setItem('locationCode', code);
        }
      })
      // Init
      if (locationCode == undefined && locationCode !== 'gb' && locationCode !== 'uk') {
        $.get(api, function (geo, status) {
          if (status == 'error') {
            console.error('Geo api '+ api + ' returned an error');
            return;
          }
          var code = geo.country_code.toLowerCase();
          console.log('Location detected from api:', code);
          if (code !== 'gb' && code !== 'uk') {
            $(selectors.popup).removeClass('hide');
          }
        }).fail(function() {
          console.error('Geo api is missing', api);
        })
      } else {
        console.log('Location detected from localstorage:', locationCode);
      }
    } else {
      //
      $(selectors.locationPicker).on('mousedown touchstart', function () {
        var code = $(this).data('code');
        if (code === 'us') {
          localStorage.setItem('locationCode', code);
        }
      })
      // Init
      if (locationCode == undefined && locationCode !== 'us') {
        $.get(api, function (geo, status) {
          if (status == 'error') {
            console.error('Geo api '+ api + ' returned an error');
            return;
          }
          var code = geo.country_code.toLowerCase();
          console.log('Location detected from api:', code);
          if (code !== 'us') {
            $(selectors.popup).removeClass('hide');
          }
        }).fail(function() {
          console.error('Geo api is missing', api);
        })
      } else {
        console.log('Location detected from localstorage:', locationCode);
      }
    }
  
  
    // Popup
    $('.js-popup-close').on('mousedown touchstart', function () {
      $(this).closest('.js-popup').addClass('hide');
    })
  
  }
  // =require productThumbs.js
  modules.quiz = function (settings) {
    if (!settings || typeof settings !== 'object') {
      console.error("quiz error: wrong settings")
      return false;
    }
    
    var prev = [];
    var tags = []; 
  
    var selectors = {
      next: "[data-tpfilter-next]",
      prev: "[data-tpfilter-prev]",
      item: "[data-tpfilter-item]",
      main: "[data-tpfilter]",
      answer: "[data-tpfilter-answer]",
      tagInput: "[data-tpfilter-tag]",
      again: "[data-tpfilter-again]",
      email: "[data-tpfilter-email]",
      product: "[data-tpfilter-product]",
      productGa: "[data-tpfilter-product-ga]",
      slider: "[data-tpfilter-slider]",
      colorPicker: "[data-color-picker]",
      signInCheck: "[data-signin-checkbox]",
      signInForm: "[data-signin-form]",
      signInSubmit: "[data-signin-submit]",
      agePopup: "[data-age-popup]",
      age: "[data-age]",
      extraProducts: "[data-tpfilter-extra-products]",
      extraProduct: "[data-tpfilter-extra-product]",
      noResults: "[data-tpfilter-noResults]",
      tallSelector: "[data-tall-selector]",
      submit: "[data-tpfilter-submit]",
    }

    var progressBar = document.getElementById("tff-v2__progress-bar");
    var progressNext = document.getElementsByClassName("tpfilter-item__btn--next");
    var progressPrev = document.getElementsByClassName("tpfilter-item__btn--prev");
    var steps = document.querySelectorAll(".tpfilter-item");
    //console.log('steps-', steps.length);
    var active = 1;

    var navigatePreload = function (event){
      var direction = event.data.direction;
      var params = getItemParams(this);
      var isFormFieldsFilled = true;
      $('.email-capture__form input[type="text"]').each(function (){
        if(!$(this).val()){
          isFormFieldsFilled = false;
        }
        if(!isEmail($('#k_id_email').val())){
          isFormFieldsFilled = false;
          //console.log('inva-', $('#invalid-email').length);
          if($('#invalid-email').length == 0) {
            $('#k_id_email').after('<div id="invalid-email">'+ invalidEmail +'</div>');
          }
        }else {
          if($('#invalid-email').length > 0) {
            $('#invalid-email').remove();
          }            
        }
      });
      if(isFormFieldsFilled){  
        if (direction === 'next') {
          var ok = checkItemParams(params);
          
          active++;
          if (active > steps.length) {
            active = steps.length;
          }
          if (ok) {
            updateProgress();
            updateTags(params.$current, params.currentName);
            goNext(params.currentName);
            sendItemToGa(params.currentName);
          } else {
            console.log("Not ok");
          }
        } else if (direction === 'prev') {
          var _prev = prev.pop();
          showItem(_prev);
          resetAnswer(params.$current);
          active--;
          if (active < 1) {
            active = 1;
          }
          if(active == 1){
            $('#tff-v2__progress').addClass('inactive')
          }
          updateProgress();
        }      
        //goNext(params.currentName);
      }
    }

    var navigateNext = function (event){
      var direction = event.data.direction;
      var params = getItemParams(this);
      if (direction === 'next') {
        var ok = checkItemParams(params);
        if(($('input[name="height_type"]:checked').val() == 'FT') && ($('#customer-height-ft').val() != '') && ($('#customer-height-inch').val() != '')){
          active++;
          if (active > steps.length) {
            active = steps.length;
          }
          if (ok) {
            updateProgress();
            updateTags(params.$current, params.currentName);
             // delay .75 sec for automatic load next question
             setTimeout(function() { 
              goNext(params.currentName);
            }, 750)
            // delay .75 sec for automatic load next question
            sendItemToGa(params.currentName);
          } else {
            console.log("Not ok");
          }
        }else if(($('input[name="height_type"]:checked').val() == 'CM') && ($('#customer-height-centimeter').val().length >= 3)){
          active++;
          if (active > steps.length) {
            active = steps.length;
          }
          if (ok) {
            updateProgress();
            updateTags(params.$current, params.currentName);
            // delay .75 sec for automatic load next question
            setTimeout(function() { 
              goNext(params.currentName);
            }, 750)
            // delay .75 sec for automatic load next question
            sendItemToGa(params.currentName);
          } else {
            console.log("Not ok");
          }
        }
      } else if (direction === 'prev') {
        var _prev = prev.pop();
        showItem(_prev);
        resetAnswer(params.$current);
        active--;
        if (active < 1) {
          active = 1;
        }
        if(active == 1){
          $('#tff-v2__progress').addClass('inactive')
        }
        updateProgress();
      }
      
    }
   
    var navigate = function (event) {
      if ($(this).attr('disabled') == 'disabled') return false;
      var direction = event.data.direction;
      var params = getItemParams(this);
      if (direction === 'next') {
        var ok = checkItemParams(params);        
        // VARIATION-2: skip two steps: progress bar 
        if(params.currentName == 'q1' && ((selectedAnswer() == 'I want to try something new') || (selectedAnswer() == 'I am reinventing myself') || (selectedAnswer() == 'Too many things to list!') || (selectedAnswer() == 'I don’t know what trousers suit me best'))){
          active = active + 3;
        }else if(params.currentName == 'q1' && (selectedAnswer() == 'My body has changed recently' || selectedAnswer() == 'I don’t usually wear trousers, but would like to try.')){// VARIATION-1,3: skip one step: progress bar 
          active = active + 2;
        }else{
          active++;
        }
        if (active > steps.length) {
          active = steps.length;
        }
        if (ok) {
          if(($('input[name="height_type"]:checked').val() == 'FT') && ($('#customer-height-ft').val() != '') && ($('#customer-height-inch').val() != '')){
            var lengthStr = '<strong>Length</strong> ';
            var height = $('#customer-height-ft').val() + $('#customer-height-inch').val();
            if (height !=''){
              if(height <= 53){
                lengthStr += ' 5\'3" and below (25" / 71cm)';
              } else if(height >= 54 && height <= 56 ){
                lengthStr += ' 5\'4" to 5\'6" (25" / 71cm)';
              } else if(height >= 57 && height <= 59 ){
                lengthStr += ' 5\'7" to 5\'9" (28" / 76cm)';
              } else {
                lengthStr += ' 5\'10" and above (30" / 81cm)';
              }

              var height_in_inches = (height * 12) / 10 + '"';

              $('.tff-v2__summery-length-text.desktop').html(lengthStr);
              $('.tff-v2__summery-length-text.mobile').html(lengthStr);
              $('.age-popup__length-text').html(lengthStr);
              $('#k_id_body_length').val(height_in_inches);
              if(getCookie('SelectedLength')){
                delete_cookie('SelectedLength')
                setCookie('SelectedLength', lengthStr, 1)
              }else{
                setCookie('SelectedLength', lengthStr, 1)
              }
            }
          }else if(($('input[name="height_type"]:checked').val() == 'CM') && ($('#customer-height-centimeter').val().length >= 3)){
              // length
              var lengthStr = '<strong>Length</strong> ';
              var height_in_centimeter = $('#customer-height-centimeter').val();
              if (height_in_centimeter !=''){
                if(height_in_centimeter <= 162){
                  lengthStr += ' 5\'3" and below (25" / 71cm)';
                } else if(height_in_centimeter >= 163 && height_in_centimeter <= 171 ){
                  lengthStr += ' 5\'4" to 5\'6" (25" / 71cm)';
                } else if(height_in_centimeter >= 172 && height_in_centimeter <= 180 ){
                  lengthStr += ' 5\'7" to 5\'9" (28" / 76cm)';
                } else {
                  lengthStr += ' 5\'10" and above (30" / 81cm)';
                }
                var height_in_inches = (height_in_centimeter * 0.393701) + '"';
                
                $('.tff-v2__summery-length-text.desktop').html(lengthStr);
                $('.tff-v2__summery-length-text.mobile').html(lengthStr);
                $('.age-popup__length-text').html(lengthStr);
                $('#k_id_body_length').val(height_in_inches);
                if(getCookie('SelectedLength')){
                  delete_cookie('SelectedLength')
                  setCookie('SelectedLength', lengthStr, 1)
                }else{
                  setCookie('SelectedLength', lengthStr, 1)
                }
              } 
            }
          
          updateTags(params.$current, params.currentName);
          
          // delay .2 sec for automatic load next question
          if(params.currentName == 'welcome'){
            goNext(params.currentName);
          }else{
            //setTimeout(function() { 
              updateProgress();
              goNext(params.currentName);
            //}, 200)
          }
          // delay .2 sec for automatic load next question

          sendItemToGa(params.currentName);
        } else {
          console.log("Error!");
        }
        if($('#tff-v2__progress').hasClass('inactive')){
          $('#tff-v2__progress').removeClass('inactive')
        }
        if(!$('footer').hasClass('hide_footer')){
          $('footer').addClass('hide_footer')
        }
      } else if (direction === 'prev') {
        var _prev = prev.pop();
        showItem(_prev);
        resetAnswer(params.$current);
       // console.log('params.currentName-', params.currentName)
        active--;
        if (active < 1) {
          active = 1;
        }
        if(active == 1){
          $('#tff-v2__progress').addClass('inactive')
        }
        updateProgress();
      }
    }

    var updateProgress = function () {
      var params = getItemParams(this);
      steps.forEach((step, i) => {
        if (i < active) {
          step.classList.add("active");
        } else {
          step.classList.remove("active");
        }
      });
     //console.log('active-', active)
      progressBar.style.width = ((active - 1) / (steps.length - 1)) * 100 + "%";
      if (active === 1) {
        progressPrev.disabled = true;
      } else if (active === steps.length) {
        progressNext.disabled = true;
      } else {
        progressPrev.disabled = false;
        progressNext.disabled = false;
      }
    };

    var enableNextButtonOnInputFocus = function (){
      if($(this).closest(selectors.item).data('tpfilter-item') == 'q5'){ 
        var $next = $(this).closest(selectors.item).find(selectors.next);
        if(($('input[name="height_type"]:checked').val() == 'FT') && ($('#customer-height-ft').val() != '') && ($('#customer-height-inch').val() != '')){
          if ($next.attr('disabled') == 'disabled') {
            $next.attr('disabled', false);
          }
        }else if(($('input[name="height_type"]:checked').val() == 'CM') && ($('#customer-height-centimeter').val().length >= 3)){
          if ($next.attr('disabled') == 'disabled') {
            $next.attr('disabled', false);
          }
        }else{
          $next.attr('disabled', true);
        }        
      }
    }
    
    
     var enableNextButton = function () {
      if($(this).closest(selectors.item).data('tpfilter-item') == 'q13'){ // form validation has been applied
        var isFormFieldsFilled = true;
        $('.email-capture__form input[name="email"]').on('keyup', function (){
          if($(this).val() == ''){
            isFormFieldsFilled = false;
            if($('#invalid-email').length > 0) {
              $('#invalid-email').remove();
              $('#k_id_email').after('<div id="invalid-email">E-mail address is required</div>');
            }
          }else if($(this).val() != '' && !isEmail($('#k_id_email').val())){
            isFormFieldsFilled = false;
            if($('#invalid-email').length == 0) {
              $('#k_id_email').after('<div id="invalid-email">'+ invalidEmail +'</div>');
            }else{
              $('#invalid-email').remove();
              $('#k_id_email').after('<div id="invalid-email">'+ invalidEmail +'</div>');
            }
          }else {
            if($('#invalid-email').length > 0) {
              $('#invalid-email').remove();
            }            
          }
        });
        
        var $next = $(this).closest(selectors.item).find(selectors.next);
        if (($next.attr('disabled') == 'disabled') && isFormFieldsFilled == true) {
          $next.attr('disabled', false);
        }else {
          $next.attr('disabled', true);
        }
      } else if($(this).closest(selectors.item).data('tpfilter-item') == 'q7'){ 
        $('.tpfilter-options.trouser-size-wrapper .tpfilter-option--square input').on('change', function(){
          var $next = $(this).closest(selectors.item).find(selectors.next);
          if ($next.attr('disabled') == 'disabled') {
            $next.attr('disabled', false);
          }
        });
        if($('input[name=trouser_size]').is(':checked')){
          var $next = $(this).closest(selectors.item).find(selectors.next);
          if ($next.attr('disabled') == 'disabled') {
            $next.attr('disabled', false);
          }
        }

      } else { // For normal questions step
        var $next = $(this).closest(selectors.item).find(selectors.next);
        if ($next.attr('disabled') == 'disabled') {
          $next.attr('disabled', false);
        }
      }
      
    }
    
    
    var getItemToShow = function(nextObj) {
      //console.log('getItemToShow tags', tags);
      var transform = function(itemArr) {
        var arr = []
        itemArr.forEach(function(condString, index) {
          arr[index] = [];
          var tmpArr = condString.split(' && ');
          tmpArr.forEach(function (el) {
            if (el.indexOf('/') > -1) {
              el = el.split('/');
            }
            arr[index].push(el);
          })
        })
        return arr;
      }
    
      var matches = [];
      var results = [];
      for (itemName in nextObj) {
        var itemArr = nextObj[itemName];
        var transformedItemArr = transform(itemArr);
        console.log('transformedItemArr', transformedItemArr);
        matches[itemName] = [];
        transformedItemArr.forEach(function (itemArrLevel0, index) {
          matches[itemName][index] = [];
          itemArrLevel0.forEach(function(el0) {
            var tagstr = tags.join(', ');
            if (typeof el0 === 'object') {
              var tmpMatches = []
              el0.forEach(function(el1) {
                tmpMatches.push(tagstr.indexOf(el1) > -1);
              })
              matches[itemName][index].push(tmpMatches.indexOf(true) > -1);
            } else {
              matches[itemName][index].push(tagstr.indexOf(el0) > -1);
            }
          })
          if (matches[itemName][index].indexOf(false) == -1) {
            results.push(itemName);
          }
        });
      }
      //console.log('getItemToShow matches', matches);
      //console.log('getItemToShow results', results);
    
      if (results.length) return results[0];
      return false;
    }

    // All 3 variations
    // $('.tpfilter-options.brings-today .tpfilter-option--rect input').on('change', function(event){
    //   var val = $(this).val();
    //   var params = getItemParams(this);
    //   var ok = checkItemParams(params);
    //   console.log('params.currentName-', params.currentName)

    // });
    
    var selectedAnswer = function(){
      return $('*[data-tpfilter-item="q1"] ' + selectors.answer+':checked').val();
    }

    
    var goNext = function (currentName) {
      var success = false;
      
      if(currentName == 'q1' && selectedAnswer() != 'My body has changed recently'){        
        var nextVisibleQues = '';
        if(selectedAnswer() == 'My body has changed recently'){
          nextVisibleQues = 'q1'
        } else if((selectedAnswer() == 'I want to try something new') || (selectedAnswer() == 'I am reinventing myself') || (selectedAnswer() == 'Too many things to list!')  || (selectedAnswer() == 'I don’t know what trousers suit me best')){ // VARIATION-2: skip two steps: next step is being selected accordingly
          nextVisibleQues = 'q3'
        } else if(selectedAnswer() == 'I don’t usually wear trousers, but would like to try.'){ // VARIATION-3: skip one steps: next step is being selected accordingly
          nextVisibleQues = 'q2'
        }
        var next = items[nextVisibleQues] ? items[nextVisibleQues].next : false;
        var afterNext = items[nextVisibleQues] ? (items[nextVisibleQues].afterNext ? items[nextVisibleQues].afterNext : false) : false;
      } else if(currentName == 'q2' && selectedAnswer() == 'My body has changed recently'){ // VARIATION-1: skip one steps: next step is being selected accordingly
        var next = items['q3'] ? items['q3'].next : false;
        var afterNext = items['q3'] ? (items['q3'].afterNext ? items['q3'].afterNext : false) : false;
      } else{
        var next = items[currentName] ? items[currentName].next : false;
        var afterNext = items[currentName] ? (items[currentName].afterNext ? items[currentName].afterNext : false) : false;
      }
      
      if (!next) {
        console.error("tpfilter can't go next from item:", currentName, ". Next is:", next, "or it is not exists in markup.");
        return false;
      }
      if (typeof next === 'string') {
        success = showItem(next);
      // Branching:
      } else if (typeof next === 'object') {
        var itemName = getItemToShow(next);
        if (itemName === false) {
          console.error("tpfilter goNext: error in branching");
          return false;
        }
        success = showItem(itemName);
      }
     
      // Callback:
      if (success) {
        prev.push(currentName);
       
        if (typeof afterNext === 'function') {         
          afterNext();
        }
        if (typeof items.alwaysAfterNext === 'function') {
          items.alwaysAfterNext();
        }
      } else {
        console.error("tpfilter goNext: success is false")
      }
    }
    
    var getItemParams = function (itemChild) {
      var $current = $(itemChild).closest(selectors.item),
        currentName = $current.data('tpfilter-item'),
        hasAnswer = $current.find(selectors.answer) ? $current.find(selectors.answer).length : false,
        answer = hasAnswer ? getAnswer($current) : undefined;
      return {
        $current: $current,
        currentName: currentName,
        hasAnswer: hasAnswer,
        answer: answer
      };
    }
    
    var checkItemParams = function (params) {
      var success = true;
      //console.log('beforeNext-', beforeNext)
      var beforeNext = items[params.currentName] ? (items[params.currentName].beforeNext ? items[params.currentName].beforeNext : false) : false;
      if (params.currentName == undefined || params.currentName == "") {
        console.error("tpfilter navigate: invalid markup");
        success = false;
      }
      if (params.hasAnswer && (params.answer == undefined || params.answer == '') && params.currentName !== 'q5' && params.currentName !== 'email') {
        console.error("tpfilter navigate: wrong answer");
        success = false;
      }
      if (typeof beforeNext === 'function') {
        success = beforeNext(params);
      }
      return success;
    }
    
    var showItem = function (itemToShow) {
      var success = false;
      $(selectors.item).each(function (index, element) {
        var $el = $(element);
        var elName = $el.data('tpfilter-item');
        
        // if(itemToShow == 'q5'){
        //   itemToShow == 'q6';
        // }
        if (elName == itemToShow) {
          $el.removeClass('is-hidden');
          success = true;
        } else {
          $el.addClass('is-hidden');
        }
      });
      $("html, body").animate({
        scrollTop: 0
      }, "slow");
      return success;
    }
    
    var startAgain = function () {
      tags = [];
      prev = [];
      $(selectors.answer).each(function (index, element) {
        var $input = $(element);
        var $current = $(element).closest(selectors.item);
        var currentName = $current.data('tpfilter-item');
        switch ($input.attr('type')) {
          case 'text':
            $input.val($input.data("default-value"));
            break;
          case 'radio':
            $input.prop('checked', false);
            $current.find(selectors.next).attr('disabled', true);
            break;
          default:
            console.error('tpfilter startAgain: input type unknown');
            break;
        }
      });
      $("input#tall").val($("input#tall").data("default-value"));
      showItem('welcome');
    }
    
    var getAnswer = function ($item) {
      var answer;
      if ($item.find(selectors.answer) && $item.find(selectors.answer).length) {
        var $input = $item.find(selectors.answer);
        switch ($input.attr('type')) {
          case 'text':
            answer = $input.val();
            break;
          case 'radio':
            answer = $input.filter('input:checked').val();
            break;
          case 'checkbox':              
            answer = $input.filter('input:checked').val();
            break;
          case 'number':              
            answer = $input.filter('input').val();
            break;
          default:
            console.error('tpfilter input type unknown');
            break;
        }
      } else {
        console.error("tpfilter: can't get answer");
      }
      return answer;
    }
    
    var resetAnswer = function ($item) {
      if ($item.find(selectors.answer) && $item.find(selectors.answer).length) {
        var $input = $item.find(selectors.answer);       
        switch ($input.attr('type')) {
          case 'text':
            if ($input.attr('name') === 'tall') {
              $(selectors.tallSelector).trigger('setDefaults');
            } else {
              $input.val('');
            }
            break;
          case 'number':
            $input.val('');
            $input.parent().parent().parent().find('.tpfilter-item__btn--next').attr('disabled', 'disabled');
            break;
          case 'checkbox':
              $input.prop('checked', false);
              $input.parent().find('.icon').addClass('is-unchecked');
              $input.parent().parent().parent().find('.tpfilter-item__btn--next').attr('disabled', 'disabled');
              break;
          case 'radio':
            if($item.data('tpfilter-item') == 'q7'){
              $('input[name=trouser_size]').prop('checked', false);            
            } else {
              $input.prop('checked', false);
            }
            $input.parent().find('.icon').addClass('is-unchecked');
            $input.parent().parent().parent().find('.tpfilter-item__btn--next').attr('disabled', 'disabled');
            break;
          default:
            console.error('tpfilter input type unknown');
            break;
        }
      } else {
        console.error("tpfilter: can't get answer");
      }
    }
    var sendGa = function(fields, callback) {
      if (typeof fields !== 'object') {
        console.error("Tpfilter error in google analytics: issue in fields");
        return false;
      }
      if (typeof ga === 'function') {
        if (typeof callback === 'function') {
          fields.hitCallback = callback;
        }
        //console.log('ga fields', fields);
        ga('send', 'event', fields);
      } else {
        console.error("Tpfilter error in google analytics: 'ga' function not exists")
      }
    }
    
    var sendItemToGa = function(currentName) {
      if (items[currentName] && typeof items[currentName].gaFields === 'object') {
        if (!gaFields || typeof gaFields !== 'object') {
          console.error("Tpfilter error in google analytics: 'gaFields' object is wrong or not exists");
          return false;
        }
        var fields = {};
        fields = getGaFields(gaFields);
        var itemGaFields = items[currentName].gaFields;
        for (var key in itemGaFields) {
          fields[key] = itemGaFields[key];
        }
        sendGa(fields);
      }
    }
    function redirect_blank(url) {
      var a = document.createElement('a');
      a.target="_blank";
      a.href=url;
      a.click();
    }
    var sendProductToGa = function (evt) {
      evt.preventDefault();
      var href = $(this).attr('href');
      var productTitle = $(this).data('tpfilter-product-ga');
      if (typeof productTitle !== 'string' || productTitle === '') {
        console.error("sendProductToGa error: wrong product title", productTitle);
        return false;
      }
      var fields = {};
      if ($(this).closest(selectors.product).length) {
        fields = getGaFields(gaProductFields, productTitle);
      } else if ($(this).closest(selectors.extraProduct).length) {
        fields = getGaFields(gaExtraProductFields, productTitle);
      } else {
        console.error("sendProductToGa error: wrong selector");
        return false;
      }
      sendGa(fields, function() {
        console.log("sendga success");
        if (typeof href === 'string' && href !== '') {
          redirect_blank(href)
        } else {
          console.error("Tpfilter error in ga callback: can't go to href", href);
        }
      });
    }
    
    var getGaFields = function (obj, productTitle) {
      var fields = {};
      for (var key in obj) {
        var val = obj[key];
        val = (val.indexOf('{{ productTitle }}') > -1 && productTitle) ? val.replace('{{ productTitle }}', productTitle) : val;
        fields[key] = val;
      }
      return fields;
    }
    var updateTags = function ($current, currentName) {
      normalizeTagInputs($current, currentName);
      tags = [];
      $(selectors.tagInput).each(function (index, element) {
        var tag;
        var $input = $(element);
        switch ($input.attr('type')) {
          case 'text':
            tag = $input.data('tpfilter-tag');
            break;
          case 'radio':
            tag = $input.filter('input:checked').data('tpfilter-tag');
            break;
          default:
            console.error('tpfilter updateTags: input type is unknown');
            break;
        }
        if (tag) {
          tags.push(tag);
        }
      });
      if (tags.length) {
        console.log("tags", tags);
      }
    }
    
    var normalizeTagInputs = function ($current, currentName) {
      var $input = $current.find(selectors.answer);
      var value = $input.val();
      switch (currentName) {
        case 'q1':
          value = parseInt(value);
          if (value <= 159) {
            $input.data('tpfilter-tag', 'tpfilter:petite');
            $input.data('value', 'Petite');
          } else if (value >= 160 && value <= 170) {
            $input.data('tpfilter-tag', 'tpfilter:regular');
            $input.data('value', 'Regular');
          } else if (value >= 171) {
            $input.data('tpfilter-tag', 'tpfilter:tall');
            $input.data('value', 'Tall');
          }
          break;
        default:
          break;
      }
    }
    
    var getAliases = function(tag) {
      return aliases.find(function(alias) {
        return alias.tag == tag;
      })
    }
    
    var getProductTags = function (product) {
      var productTags = $(product).data('tpfilter-product-tags');
      if (typeof productTags == "string") {
        return productTags.split(",");
      } else {
        console.error("Can't convert product tags to js array");
        return [];
      }
    }
    var filterProducts = function () {
      var getMatches = function(productTags) {
        var matches = [];
        tags.forEach(function (tag) {
          tagAliases = getAliases(tag);
          if (tagAliases) {
            var aliasesMatches = [];
            tagAliases.tags.forEach(function(tag) {
              aliasesMatches.push(checkInArray(productTags, [tag]));
            })
            matches.push(checkInArray(aliasesMatches, [true]));
          } else {
            matches.push(checkInArray(productTags, [tag]));
          }
        });
        return matches;
      }
      $(selectors.product).each(function (index, product) {
        var productTags = getProductTags(product);
        var matches = getMatches(productTags);
        msg(matches);
        var show = matches.indexOf(false) == -1;
        console.log($(product).text(), show);
        if (show) {
          $(product).show();
          msg(productTags);
        } else {
          $(product).hide()
        }
      })
    }
    
    var filterExtraProducts = function() {
      var productsToShow = "";
      extraProductTags.forEach(function (extra) {
        if (checkInArray(tags, [extra.tag])) {
          productsToShow = extra.products;
        }
      });
      if (typeof productsToShow === 'object' && productsToShow.length) {
        $(selectors.extraProducts).show();
        $(selectors.extraProduct).each(function(index, product) {
          var handle = $(product).data('tpfilter-extra-product');
          if (checkInArray(productsToShow, [handle])) {
            $(product).show()
          } else {
            $(product).hide()
          }
        })
      } else if (typeof productsToShow === 'object') {
        console.error("filterExtraProducts");
      } else {
        console.log("hide extra products");
        $(selectors.extraProducts).hide();
      }
    }

    var tffv2Summery = function() {
      setTimeout(function () {
        var resultWrapper = $('.tff-v2__result-wrapper'); 
        var questionsWrapper = $('.tff-v2-question-wrapper'); 
        var tffv2Popup = $('.age-popup'); 
        resultWrapper.removeClass('is-hidden');
        questionsWrapper.addClass('is-hidden');
        tffv2Popup.addClass('show');
        tffv2Popup.find('.icon-close').on('click', function(){
          tffv2Popup.removeClass('show');
        });
        tffv2Popup.find('.age-popup__btn').on('click', function(){
          tffv2Popup.removeClass('show');
        });
        sendAnswers();
        modules.productPhotoSlider();
      }, 2000);


    };

    var insertTagsToProducts = function () {
      var _tags = "";
      tags.forEach(function (tag) {
        _tags += tag + "<br>";
      })
      setTimeout(function () {
        goNext('preloader');
        $('.tpfilter-tags').html(_tags);
      }, 2000);
    }
    
    var mailHandler = function () {
      if ($(selectors.signInCheck).is(':checked')) {
        $('button', selectors.signInForm).trigger('click');
      }
    }
     
    var sendAnswers = function () {
      var answers = [];
      var selectedAnswers = $(selectors.answer).serializeArray();
      $(selectors.answer).each(function (index, element) {
        var name = $(element).attr('name');
        if (answers.indexOf(name) == -1) {
          answers.push(name);
          if (JSON.stringify(selectedAnswers).indexOf('"name":"' + name + '"') == -1) {
            selectedAnswers.push({
              name: name,
              value: "-"
            })
          }
        }
        
      });

      generatedUrl = 'https://daiwear.com/collections/' + trouser_fit_finder_collection + '/';
      selectedAnswers.forEach(function(item) {   
        
         switch(item.name) {
          case 'body_shape':
            var filterVal = '';
            var val = item.value.toLowerCase();
             //console.log('filterVal-', val);
            var splitval = val.split(' ');
            if(splitval.length > 1){
              filterVal = splitval[0] + '-' + splitval[1];
            }else{
              filterVal = val;
            }
            generatedUrl = generatedUrl + 'tpfilter-' + filterVal + '+';
           break;
          case 'trouser_cut_size':
             var filterValCut = '';
            var val = item.value.toLowerCase();
            var splitval = val.split(' ');
            if(splitval.length > 1){
              filterValCut = splitval[0] + '-' + splitval[1];
            }else{
              filterValCut = val;
            }
            generatedUrl = generatedUrl + 'tpfilter-' + filterValCut;
           break;
          case 'height_in_ft':
            height_in_ft = item.value;
           break;          
          case 'height_in_inch':
            if (height_in_ft !=''){
              var height = parseInt(height_in_ft + item.value);
              if(height <= 53){
                generatedUrl = generatedUrl + 'tpfilter-petite' + '+';
              } else if(height >= 54 && height <= 56 ){
                generatedUrl = generatedUrl + 'tpfilter-regshort' + '+';
              } else if(height >= 57 && height <= 59 ){
                generatedUrl = generatedUrl + 'tpfilter-regtall' + '+';
              } else {
                generatedUrl = generatedUrl + 'tpfilter-tall' + '+';
              }            
            }
            break;
           case 'height_in_centimeter':
            var height_in_centimeter = item.value;
            if (height_in_centimeter !=''){
              if(height_in_centimeter <= 162){
                generatedUrl = generatedUrl + 'tpfilter-petite' + '+';
              } else if(height_in_centimeter >= 163 && height_in_centimeter <= 171 ){
                generatedUrl = generatedUrl + 'tpfilter-regshort' + '+';
              } else if(height_in_centimeter >= 172 && height_in_centimeter <= 180 ){
                generatedUrl = generatedUrl + 'tpfilter-regtall' + '+';
              } else {
                generatedUrl = generatedUrl + 'tpfilter-tall' + '+';
              }         
            }   
            break;
          default:
            break;
         }  
      })
      $('.fiter-result-page-url').attr("href", generatedUrl)

            
      $.ajax({
        type: "POST",
        url: 'https://www.formbackend.com/f/d51b76992253561a',
        data: selectedAnswers, 
        success: function(){
        }
      });

      $('.klaviyo_submit_button').trigger('click');
    }
    
    var noResultsHandler = function() {
      var noResults = $(selectors.product).filter(':visible').length ? false : true;
      noResults ? $(selectors.noResults).show() : $(selectors.noResults).hide();
    }


  
  
    var items = settings.items; 
    var gaFields = settings.gaFields; 
    var gaProductFields = settings.gaProductFields; 
    var gaExtraProductFields = settings.gaExtraProductFields; 
    var aliases = settings.aliases; 
    var extraProductTags = settings.extraProductTags; 
    var formServiceUrl = settings.formServiceUrl;
  
    $(selectors.next).on('click', {direction: 'next'}, navigate);    
    $(selectors.prev).on('click', {direction: 'prev'}, navigate);
    $(selectors.again).on('click', startAgain);
    
    $(selectors.submit).on('click', {direction: 'next'}, navigatePreload);
    $(selectors.answer).on('change', enableNextButton);

    //$(selectors.answer+":input[type='radio']").on('change', {direction: 'next'},  navigate);
    //$(selectors.answer+":input[type='number']").on('keyup', {direction: 'next'}, navigateNext);
    //$(selectors.answer).on('change', enableNextButtonOnInputFocus);
    
    $(selectors.signInSubmit).on('click', mailHandler);

    // Display radio checked icon on answer options
    makeRadioChecked();
    $(".tpfilter-options input[type='radio']").on("change",function(){
      makeRadioChecked();
    });

     // Display checkboxchecked  icon on answer options
     makeCheckboxChecked();
     $(".tpfilter-options input[type='checkbox']").on("change",function(){
      makeCheckboxChecked();
     });

    // Show customer selected size
    $('.tpfilter-options.trouser-size-wrapper .tpfilter-option--square input').on('change', function(){
      var sizeEle = $('.age-popup__customer-size');
      var sumSizeEle = $('.tff-v2__summery-customer-size');
      var val = $(this).val();
      var countryCode = $('input[name=country_code]:checked').val();
      var sizeStr = '';
      if(countryCode == 'UK'){
        switch (true) {
          case (val == '6' ):
            sizeStr = countryCode + ' ' + val + ' / XS'; 
            break;
          case (val == '8' || val == '10'):
            sizeStr = countryCode + ' ' + val + ' / S';
            break;
          case (val == '12' || val == '14'):
            sizeStr = countryCode + ' ' + val + ' / M';
            break;
          case (val == '16' ):
            sizeStr = countryCode + ' ' + val + ' / L';
            break;
          case (val == '18' || val == '20' ):
            sizeStr = countryCode + ' ' + val + ' / XL';
            break;
          default:
            break;
        }
      }else if(countryCode == 'US'){
        switch (true) {
          case (val == '0' ):
            sizeStr = countryCode + ' ' + val + ' / XS'; 
            break;
          case (val == '2' || val == '4'):
            sizeStr = countryCode + ' ' + val + ' / S';
            break;
          case (val == '6' || val == '8'):
            sizeStr = countryCode + ' ' + val + ' / M';
            break;
          case (val == '10' ):
            sizeStr = countryCode + ' ' + val + ' / L';
            break;
          case (val == '12' || val == '14' ):
            sizeStr = countryCode + ' ' + val + ' / XL';
            break;
          default:
            break;
        }
      }
      //console.log('sizeStr-', sizeStr)
      $('#k_id_body_size').val(sizeStr);
      

      sizeEle.html(sizeStr);
      sumSizeEle.html(sizeStr);
      if(getCookie('selectedSize')){
        delete_cookie('selectedSize')
        setCookie('selectedSize', sizeStr, 1)
      }else{
        setCookie('selectedSize', sizeStr, 1)
      }
      
      
    });
    // TFF 2.0 Display Body Shape
    $('.tpfilter-options.body-shape .tpfilter-option--card input').on('change', function(){
      var bodyShapeEle = $('.selected_body_shape');
      var val = $(this).val();
      bodyShapeEle.html(val)
      $('#k_id_body_shape').val(val);
      var valSlider = val.replace(/\s/g, '');
        valSlider = valSlider.toLowerCase();
        $('.tff-v2__slider-collection-items.'+valSlider).removeClass('is-hidden');
        $('.tff-v2__collection-wrapper .collection-items.'+valSlider).removeClass('is-hidden');
    });

    //  TFF 2.0 Summery Filter
    $('.tpfilter-item__btn--filter').on('click', function() {
      $('#gf-tree').css({'left':'0%'});
      $('#gf-tree .gf-filter-header span').remove();
      $( '<span class="tff-v2-filter-close-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z" fill="#5C5F62"></path></svg></span>' ).insertAfter( ".gf-filter-header .gf-filter-heading" );
    });
    

    //  TFF 2.0 Summery Retake the Quiz
    $('.tff-v2__icon-retake').on('click', function() {
      window.location.reload();
    });


    $('.height-wrapper input').on('change', function() {
      if($('input[name=height_type]:checked').val() === 'CM'){
        $('.tff-v2__centimeter').removeClass('is-hidden');
        $('.ft-input-wrapper .ft-input').addClass('is-hidden');
      }else if($('input[name=height_type]:checked').val() === 'FT'){
        $('.tff-v2__centimeter').addClass('is-hidden');
        $('.ft-input-wrapper .ft-input').removeClass('is-hidden');
      }
    });

    $('.customer-trouser-size input').on('change', function() {
      if($('input[name=country_code]:checked').val() === 'US'){
        $('.trouser-size-wrapper.us').removeClass('is-hidden');
        $('.trouser-size-wrapper.uk').addClass('is-hidden');
      }else if($('input[name=country_code]:checked').val() === 'UK'){
        $('.trouser-size-wrapper.us').addClass('is-hidden');
        $('.trouser-size-wrapper.uk').removeClass('is-hidden');
      }
    });
  
    return {
      selectors: selectors,
      sendProductToGa: sendProductToGa,
      insertTagsToProducts: insertTagsToProducts,
      tffv2Summery: tffv2Summery,
      sendAnswers: sendAnswers,
      filterProducts: filterProducts,
      filterExtraProducts: filterExtraProducts,
      noResultsHandler: noResultsHandler
    }
  }
  modules.agePopup = function(popupData) {
    var selectors = {
      agePopup: "[data-age-popup]",
      agePopupTitle: "[data-age-popup-title]",
      agePopupText: "[data-age-popup-text]",
      agePopupCta: "[data-age-popup-cta]",
      agePopupOverlay: "[data-age-popup-overlay]",
    }
    var show = function() {
      $(selectors.agePopupTitle).text(popupData.title);
      $(selectors.agePopupText).text(popupData.text);
      $(selectors.agePopupCta).text(popupData.cta);
      setTimeout(function() {
        $(selectors.agePopup).addClass('show');
      }, 200);
    }
    $(selectors.agePopupOverlay + ", " + selectors.agePopupCta).click(function (e) {
      $(selectors.agePopup).removeClass('show').data('enabled', false);
      $(this).unbind('click');
    })
    return { show: show }
  };
  modules.quizTFF = function () {
    if ($('#tff-quiz').length == 0) return false;
    var settings = {
      // Routing between items:
      items: {
        welcome: {
          next: 'q1',          
          gaFields: {
            eventAction: 'Started Trouser Fit Finder'
          }
        },
        q1: {
          next: 'q2',
          gaFields: {
            eventAction: 'Completed brings here today question'
          }          
        },
        q2: {
          next: 'q3',
          gaFields: {
            eventAction: 'Completed recently changed question'
          }
        },
        q3: {
          next: 'q4',
          gaFields: {
            eventAction: 'Completed preferred style question'
          }
        },
        q4: {
          next: 'q5',
          gaFields: {
            eventAction: 'Completed brand question'
          }
        },
        q5: {
          next: 'q6',
          gaFields: {
            eventAction: 'Completed height option'
          }
        },
        q6: {
          next: 'q7',
          gaFields: {
            eventAction: 'Completed body shape question'
          }
        },
        q7: {
          next: 'q8',
          gaFields: {
            eventAction: 'Completed trouser size question'
          }
        },
        q8: {
          next: 'q9',
          gaFields: {
            eventAction: 'Completed tweener question'
          }
        },
        q9: {
          next: 'q11',
          gaFields: {
            eventAction: 'Completed trouser cut question'
          }
        },
        q10: {
          next: 'q11',
          gaFields: {
            eventAction: 'Completed preferred length question'
          }
        },
        q11: {
          next: 'q12',
          gaFields: {
            eventAction: 'Completed age question '
          }
        },
        q12: {
          next: 'q13',
          gaFields: {
            eventAction: 'Completed top size question '
          }
        },
        q13: {
          next: 'preloader',
          gaFields: {
            eventAction: 'Completed email collection'
          },
          afterNext: function () {
            quiz.tffv2Summery()
          }
        },
        preloader: {
          next: 'products',
          afterNext: function () {
            quiz.tffv2Summery(),
            quiz.sendAnswers()
            //quiz.insertTagsToProducts(),
            
          }
        },
        products: {
          afterNext: function () {
            //quiz.filterProducts(),
            //quiz.filterExtraProducts(),
            //quiz.noResultsHandler(),
            //quiz.tffv2Summery()
            //$(selectors.slider).slick('refresh')
          }
        }
       
      },
    
      // Google analytics event parameters (can be overwritten in item):
      gaFields: {
        eventCategory: 'Trouser Fit Finder',
        eventAction: 'Default',
        eventLabel: 'Trouser Fit Finder'
      },
      gaProductFields: {
        eventCategory: 'Trouser Fit Finder',
        eventAction: 'Clicked on {{ productTitle }}',
        eventLabel: 'Results TFF'
      },
      gaExtraProductFields: {
        eventCategory: 'Trouser Fit Finder',
        eventAction: 'Clicked on {{ productTitle }}',
        eventLabel: 'Looking for more TFF'
      },
    
      aliases: [
        {
          "tag": "tpfilter:bothgood",
          "tags": ['tpfilter:fulllength', 'tpfilter:cropped']
        },
        {
          "tag": "tpfilter:skinnybothgood",
          "tags": ['tpfilter:skinnyfulllength', 'tpfilter:skinnycropped']
        },
        {
          "tag": "tpfilter:waistlineboth",
          "tags": ['tpfilter:normal', 'tpfilter:high']
        }
      ],
    
      // Extra Products for some tags
      // "tag": if this tag selected
      // "products": list of handles for products which will be shown for this tag
      extraProductTags: [
        {
          "tag": "tpfilter:skinny",
          "products": ["cream-of-the-crop-trousers-black", "collateral-pant-black"]
        },
        {
          "tag": "tpfilter:straight",
          "products": ["cream-of-the-crop-trousers-black", "collateral-pant-black"]
        },
        {
          "tag": "tpfilter:relaxed",
          "products": ["power-move-trousers-black-2-0", "straight-up-trousers-black"]
        },
        {
          "tag": "tpfilter:wideleg",
          "products": ["power-move-trousers-black-2-0", "straight-up-trousers-black"]
        }
      ]
    }
    

    
  
    var quiz = modules.quiz(settings);
    if (!quiz) return false;
    
    var selectors = quiz.selectors;
  
    var getColorPickers = function () {
      $(selectors.colorPicker).each(function (index, element) {
        var url = $(element).data('url');
        $.ajax({
          type: "GET",
          url: url,
          success: function (response) {
            var $colorPicker = $(response).find('.colors-wrapper');
            $(element).html($colorPicker);
          }
        });
      });
    }
  
    var showAgePopup = function () {
      var popupData = $(this).data('age');
      if (typeof popupData !== 'object') {
        console.error("Can't show popup for age");
        return false;
      }
      var popup = modules.agePopup(popupData);
      popup.show();
    }
    $(selectors.age).on('change', showAgePopup);
    $(selectors.product).on('click',  selectors.productGa, quiz.sendProductToGa);
    $(selectors.extraProduct).on('click',  selectors.productGa, quiz.sendProductToGa);
  
    // Scripts for products:
    getColorPickers();
    $(selectors.slider).slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      nextArrow: '<div class="arrow-wrapper right"><i class="arrow-right"></div>',
      prevArrow: '<div class="arrow-wrapper left"><i class="arrow-left"></div>',
      responsive: [{
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
          }
        }
      ]
    });
  
  }
  modules.quizBody = function () {
    if ($('#quiz-body').length == 0) return false;
      var settings = {
        // Routing between items:
        items: {
          alwaysAfterNext: function() {
            quiz.filterProducts(),
            quiz.noResultsHandler()
            console.log('alwaysAfterNext');
          },
          q1: {
            next: {
              'q2a': ['Shoulders < hips', 'Hips = shoulders'],
              'q2b': ['Hips < shoulders']
            },
          },
          q2a: {
            next: {
              'email': ['Hips = shoulders && Curving inwards'],
              'q3': ['']
            },
          },
          q2b: {
            next: {
              'q3': ['']
            },
          },
          q3: {
            next: 'email'
          },
          email: {
            next: 'results',
            afterNext: function () {
              //quiz.sendAnswers()
            }
          }
          
        },
      
        // Google analytics event parameters (can be overwritten in item):
        gaFields: {
          eventCategory: 'Trouser Fit Finder',
          eventAction: 'Default',
          eventLabel: 'Trouser Fit Finder'
        },
        gaProductFields: {
          eventCategory: 'Trouser Fit Finder',
          eventAction: 'Clicked on {{ productTitle }}',
          eventLabel: 'Results TFF'
        },
        gaExtraProductFields: {
          eventCategory: 'Trouser Fit Finder',
          eventAction: 'Clicked on {{ productTitle }}',
          eventLabel: 'Looking for more TFF'
        },
      
        aliases: [
          {
            "tag": "tpfilter:bothgood",
            "tags": ['tpfilter:fulllength', 'tpfilter:cropped']
          },
          {
            "tag": "tpfilter:skinnybothgood",
            "tags": ['tpfilter:skinnyfulllength', 'tpfilter:skinnycropped']
          },
          {
            "tag": "tpfilter:waistlineboth",
            "tags": ['tpfilter:normal', 'tpfilter:high']
          }
        ],
      
        // Extra Products for some tags
        // "tag": if this tag selected
        // "products": list of handles for products which will be shown for this tag
        extraProductTags: [
          {
            "tag": "tpfilter:skinny",
            "products": ["cream-of-the-crop-trousers-black", "collateral-pant-black"]
          },
          {
            "tag": "tpfilter:straight",
            "products": ["cream-of-the-crop-trousers-black", "collateral-pant-black"]
          },
          {
            "tag": "tpfilter:relaxed",
            "products": ["power-move-trousers-black-2-0", "straight-up-trousers-black"]
          },
          {
            "tag": "tpfilter:wideleg",
            "products": ["power-move-trousers-black-2-0", "straight-up-trousers-black"]
          }
        ]
      }
      
    var quiz = modules.quiz(settings);
    if (!quiz) return false;
  }
  modules.tallSelector = function () {
    var selectors = {
      main: '[data-tall-selector]',
      foot: '[data-tall-selector-foot]',
      cm: '[data-tall-selector-cm]',
      action: '[data-tall-selector-action]'
    }
  
    var update = function(action) {
      console.log("action", action);
      var inches = getInches();
      if (action == 'plus') {
        inches += 1;
      } else if (action == 'minus') {
        inches >= 12 ? inches -= 1 : inches = inches;
      } else {
        console.error('tallSelector update error');
        return false;
      }
      var cm = inches * 2.54;
      setFoot(inches);
      setCm(cm);
    }
  
    var setFoot = function(inches) {
      var foot = parseInt(inches / 12);
      var inch = inches % 12;
      var val = inch ? foot + ' ft ' + inch + ' inch' : foot + ' ft';
      $(selectors.foot).val(val);
    }
    
    var setCm = function(cm) {
      $(selectors.cm).val(Math.round(cm, 0)+ 'cm');
    }
  
    var getInches = function() {
      var val = $(selectors.foot).val().split('ft');
      var foot = val[0].trim();
      var inch = val[1].split('inch')[0].trim();
      var inches = parseInt(foot * 12) + (inch ? parseInt(inch) : 0);
      return inches;
    }
  
    var setDefaults = function() {
      $(selectors.foot).val($(selectors.foot).data('default-value'));
      $(selectors.cm).val($(selectors.cm).data('default-value'));
    }
  
    var timeoutId = 0;
    var mousePressed = false;
      
    $(selectors.action).on('touchstart click', function (event) {
      event.preventDefault();
      var action = $(this).data('tall-selector-action');
      update(action);
    })
  
    $(selectors.main).on('setDefaults', setDefaults);
    
  }
  
  modules.widget = function() {
    var toggle = '[data-widget-toggle]';
    $(toggle).on('click', function(evt) {
      evt.preventDefault();
      var widget = $(this).data("widget-toggle");
      $('[data-widget=' + widget +']').toggleClass('hide');
  
      var search = $('[data-widget=' + widget + ']').find('input[name="q"]')
      if (search.length) {
        search.val("");
        search.focus();
      }
  
    });
    $('[data-widget]').each(function() {
      var widget = $(this).data("widget");
      outerClick('[data-widget=' + widget + ']', '[data-widget-toggle=' + widget + ']');
    });
  
  
  }
  /**
   * Minicart module
   * ------------------------------------------------------------------------------
   * Depends:
   * cart.min.js,
   * rivets.bundled.min.js
   * @namespace minicart
   */
  modules.minicart = function () {
    var data = {
      cart: {}
    };
    // Add to cart button must have data-variant or data-multi-variants attributes with variant id!
    var addToCart = function () {
      var add = function(id, properties) {
        if (window.CartJS && id) {
          CartJS.addItem(id, 1, properties, {
            success: function (data, textStatus, jqXHR) {
              // auto-open cart:
              if (!window.DISABLE_MINICART_OPENING) {
                $('[data-minicart]').removeClass('hide');
                minicartSlider();
                $('.minicart__perfect-match-text-container').slick('setPosition');
              }
            },
            error: function (x) {
              console.error("Add item to cart: ajax error", x)
            }
          });
        } else {
          console.error("Can't add item", id, " to the cart!");
        }
      }
      if ($(this).data('variant')) {
        var $form = $(this).closest('form');
        var id = $(this).data('variant');
        // Combine properties if they exists:
        var properties = [];
        $form.find('[data-product-property]').each(function (index, element) {
          var key = $(element).data('product-property');
          var value = $(element).val();
          if (key && key != 'hidden' && value) {
            properties[key] = value;
          }
        });
        add(id, properties);
      } else if ($(this).data('multi-variants')) {
        var variants = $(this).data('multi-variants');
        variants.forEach(function(id) {
          console.log(id);
          add(id);
        });
      } else {
        console.error("Can't add item to the cart since data-variant or data-multi-variants are not present in the add-to-cart button!");
      }
    }
  
    var removeFromCart = function () {
      if ($(this).data('line') != undefined) {
        var id = $(this).data('line');
        if (window.CartJS && id != undefined) {
          console.log("remove", id);
          CartJS.removeItem(id + 1);
        } else {
          console.error("Can't remove item", id, " from the cart!");
        }
      } else {
        console.error("Can't remove item to the cart since data-line is not present in the remove-from-cart button!");
      }
    }
  
    // Handler for adding / removing items to cart:
    var initUI = function() {
      var btnAdd = '[data-add-to-cart]';
      var btnAddUpsell = '[data-add-to-cart-upsell]';
      var btnRemove = '[data-remove-from-cart]';
  
      $(document).on('click', btnAdd, addToCart);
      $(document).on('click', btnAddUpsell, addToCart);
      $(document).on('click', btnRemove, removeFromCart);
    }
  
    // minicart template updates and cart count updates:
    var updateCart = function() {
      $.get('/cart.js', function(cart) {
        cart = JSON.parse(cart);
        console.log(cart);
        
  
        
        // bold currency convertor fix:
        if (window.BOLD && BOLD.common && BOLD.common.cartDoctor && typeof BOLD.common.cartDoctor.fix === 'function') {
          data.cart = {};
          data.cart = BOLD.common.cartDoctor.fix(cart);
        }
        if (window.BOLD && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function') {
          BOLD.common.eventEmitter.emit('BOLD_COMMON_cart_loaded', data.cart);
        }
        // cart count:
        var cartCount = '[data-cart-count]';
        $(cartCount).text(cart.item_count);
        if (cart.item_count == 0) {
          $('.mobile-cart').addClass('empty-bag');
        } else {
          $('.mobile-cart').removeClass('empty-bag');
        }
        // mobile minicart layout
        if ( $('.minicart__item').length > 1 ) {
          $('.minicart').addClass('is-full');
          $('.minicart__perfect-match-text-container').slick('setPosition');
        } else {
          $('.minicart').removeClass('is-full');
        }
        //toggleUpsell(cart);
      })
    }
  
    var toggleUpsell = function(cart) {
      var $quickAdd = $('[data-quick-add-handle]');
      var handles = cart.items.map(function(item) {
        return item.handle;
      })
      var handle = $quickAdd.data('quick-add-handle');
      //console.log('handles', handles);
      //console.log('handle', handle);
      if (handles.indexOf(handle) > -1 || cart.item_count == 0) {
        $quickAdd.hide();
        $('.minicart__items').addClass('m-full');
      }
      else {
        $quickAdd.show();
        $('.minicart__items').removeClass('m-full');
      }
      if (!$quickAdd.length) {
        $('.minicart__items').addClass('m-full');
      }
    }

     var minicartSlider = function (){
      $('.minicart__perfect-match-text-container').addClass('loaded');
      $(window).trigger('resize');
          if ($('.minicart__perfect-match-text-container').hasClass('slick-initialized')) {
            $('.minicart__perfect-match-text-container').slick('destroy');
          }
          $('.minicart__perfect-match-text-container').slick('setPosition');
          setTimeout(function() {
            $( '.minicart__perfect-match-text-container' ).slick({
              arrows:false,
              infinite:true,
              speed: 500,
              autoplay:false,
              centerMode: false,
              autoplaySpeed: 2000,
              draggable: false,
              dots: true,
              adaptiveHeight: false,
              cssEase: 'ease-in-out',
              slidesToShow:1,
              slidesToScroll:1
            });
          }, 1000);
          $(".minicart__perfect-match-text-container").hide();
          setTimeout(function() { $(".minicart__perfect-match-text-container").show(); 
          $('.minicart__perfect-matchs-list ul li').on('click', function(e){
            $('.minicart__perfect-match-text-container').removeClass('loaded')
            $('.minicart__perfect-match-text-container').toggleClass('active')
          });
        }, 1000);  
    };
  
  
  
  
    var init = function () {
      if (window.rivets) {
        rivets.bind($('[data-minicart]'), data);
      } else {
        console.error("Rivets not connected!");
        return false;
      }
  
      initUI();
  
      $(document).on('cart.requestComplete', function (event, cart) {
        updateCart();
      });
      $(document).ready(function() {
        updateCart();
      });
    }
  
    init();
  }

  modules.shopAllCollectionSlider = function () {
    if($(window).width() <= 1024){
      var $slider = $('[data-collection-featur-slider]');
      if ($slider.length) {
        // Recalc AOS plugin after slider init:
        $slider.on('init', function() {
          AOS.refreshHard();
        })
        
        $slider.slick({
          infinite: false,
          slidesToShow: 4,
          slidesToScroll: 1,          
          touchThreshold: 100,
          touchMove: true,
          nextArrow: '<div class="arrow-wrapper right"><i class="arrow-right"></div>',
          prevArrow: '<div class="arrow-wrapper left"><i class="arrow-left"></div>',
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
              }
            },
            {
              breakpoint: 768,
              settings: {
                  slidesToShow: 5,
                  slidesToScroll: 1,
              }
            },
            {
              breakpoint: 620,
              settings: {
                  slidesToShow: 4,
                  slidesToScroll: 1,
              }
            },
            {
              breakpoint: 480,
              settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
              }
            }
          ]
        })
      }
    }
  }

   modules.homePageBannerSlider = function () {
    if($(window).width() <= 1024){
      var $slider = $('[data-home-page-banner-slider]');
      if ($slider.length) {
        // Recalc AOS plugin after slider init:
        $slider.on('init', function() {
          AOS.refreshHard();
        })
        
        $slider.slick({
          infinite: false,
          slidesToShow: 5,
          slidesToScroll: 1,          
          touchThreshold: 100,
          touchMove: true,
          nextArrow: '<div class="arrow-wrapper right"><i class="arrow-right"></div>',
          prevArrow: '<div class="arrow-wrapper left"><i class="arrow-left"></div>',
          responsive: [
            {
              breakpoint: 768,
              settings: {
                  slidesToShow: 4,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 570,
              settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 440,
              settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
              }
            }
          ]
        })
      }
    }
  }

  modules.performanceSlider = function () {
    if($(window).width() >= 1024){
      var $slider = $('[data-tailored-performance-slider]');
      if ($slider.length) {
        // Recalc AOS plugin after slider init:
        $slider.on('init', function() {
          AOS.refreshHard();
        })
        
        $slider.slick({
          infinite: false,
          slidesToShow: 4,
          slidesToScroll: 4,          
          touchThreshold: 100,
          touchMove: true,
          speed: 700,
          nextArrow: '<div class="arrow-wrapper right"><i class="arrow-right"></div>',
          prevArrow: '<div class="arrow-wrapper left"><i class="arrow-left"></div>',
          responsive: [
            {
              breakpoint: 768,
              settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 570,
              settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 414,
              settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1
              }
            }
          ]
        })
      }
    }
  }


  
  
  modules.landingSlider = function () {
    var $slider = $('[data-landing-slider]');
    if ($slider.length) {
      // Recalc AOS plugin after slider init:
      $slider.on('init', function() {
        AOS.refreshHard();
      })
      
      $slider.slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: '<div class="arrow-wrapper right"><i class="arrow-right"></div>',
        prevArrow: '<div class="arrow-wrapper left"><i class="arrow-left"></div>',
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            }
          }
        ]
      })
    }
  }
  modules.testimonialsSlider = function () {
    var $slider = $('[data-testimonials-slider]');
    if ($slider.length) {
      // Recalc AOS plugin after slider init:
      $slider.on('init', function () {
        AOS.refreshHard();
      })
      $slider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: '<div class="arrow-wrapper right"><i class="arrow-right"></div>',
        prevArrow: '<div class="arrow-wrapper left"><i class="arrow-left"></div>',
        adaptiveHeight: true
      })
    }
  }


  modules.changeCountrySelect = function () {
      var selectors = { 
          countrySelectorWrapper: '[data-location-selector-wrapper]',
          countrySelector: '[data-location-selector]',
          popup: '[data-popup="location"]'
        };
  
        $(selectors.countrySelector).on('click', function () {
          //console.log("works");
          $(selectors.countrySelectorWrapper).find('.dropdown-options').toggleClass('active');
      })
  }
  modules.topMessage = function () {
  
      var message_wrapper = $('.message-bar');
      var message = $('.message-bar span');
      var message_amount = message.length; // check how many messages
  
      // Show different messages on loop (1 at the time)
      setInterval(function(){
          if (message_amount > 1) { // check if more than 1 message to enable looping
              var active = $(".message-bar span.active").removeClass('active');
              if(active.next() && active.next().length){
                  active .next().addClass('active');
              }
              else{
                  active.siblings(":first").addClass('active');
              }
          } else {
              $(message).addClass('active'); // simply display message if only 1
          }
      }, 5000);
  
      // Get the height of the longest message and add it to the message wrapper
      // This helps to prevent making top nav bigger if length of the messages are unequal 
      checkMessageLength = function() {
          var max = -1;
          $(message).each(function() {
              var h = $(this).height(); 
              max = h > max ? h : max;
          });
          $(message_wrapper).css('height',max)
      }
  
      $(document).ready(checkMessageLength);
      $(window).resize(checkMessageLength); 
  
  }
  modules.slider = function () {
    var SLIDER_SPEED = 6000;
    if (window.SECTION_SLIDER_SPEED) {
      SLIDER_SPEED = window.SECTION_SLIDER_SPEED;
    }
    var init = function () {
      $('.js-slider').each(function (index, element) {
        var $slider = $(element);
        var effect = $slider.data('effect');
        var autoplay = $slider.data('autoplay');
        var mobileOnly = $slider.data('mobile-only');
        
        if ($slider.hasClass('.slick-initialized')) {
          $slider.slick('unslick');
        }
        
        setTimeout(function() {
          if (mobileOnly == false || (mobileOnly && $(window).width() <= 750)) {
            $slider.slick({
              autoplay: (autoplay === false) ? false : true,
              arrows: false,
              dots: true,
              fade: (effect === 'slide') ? false : true,
              autoplaySpeed: SLIDER_SPEED,
            });
          }
        }, 250);
      });
    }
    init();
    $(window).resize(init);
  }
  
  modules.quickAdd = function () {
    var selectors = {
      product: '[data-quick-add-place]',
      size: '[data-option-index="0"]',
      sizeBubbles: '[data-option-index="0"] .swatch-element'
    }
    var quickAddLoad = function() {
      var $productWrap = $(selectors.product);
      $productWrap.each(function (index, product) {
        var $product = $(product);
        var url = $product.data('quick-add-place');
        if ($product.html().length == 0) {
          $.ajax({
            type: "GET",
            url: url,
            success: function (response) {
              $product.html(response);
              var sections = new slate.Sections();
              if (url.indexOf('quickAdd-minicart') > -1) {
                sections.register('quickAdd-minicart', theme.Product);
              }
              if (url.indexOf('quickAdd-grid-item') > -1) {
                sections.register('quickAdd-grid-item', theme.Product);
                $(document).trigger('quickAddLoaded');
              }
              
              // Init colors list
              const $colors = $('[data-picker-title]', $product).clone();
              $product.data('colors-list', $colors);
  
            }
          });
        }
      });
    }
  
    $(window).on('globoFilterRenderCompleted', function () {
      quickAddLoad();
    });
    $(document).ready(function () {
      quickAddLoad();
    });
  }
  
  modules.accordion = function () {
      $(function () {
          var Accordion = function (el, multiple) {
              this.el = el || {};
              this.multiple = multiple || false;
  
              var links = this.el.find('.article-title');
              links.on('click', {
                  el: this.el,
                  multiple: this.multiple
              }, this.dropdown)
          }
  
          Accordion.prototype.dropdown = function (e) {
              var $el = e.data.el;
              $this = $(this),
                  $next = $this.next();
  
              $next.slideToggle();
              $this.parent().toggleClass('open');
  
              if (!e.data.multiple) {
                  $el.find('.accordion-content').not($next).slideUp().parent().removeClass('open');
              };
          }
          var accordion = new Accordion($('.accordion-container'), false);
      });
  }
  modules.everyCollection = function () {
      $( ".ec-button" ).click(function() {
          var productName = $(this).attr("data-product");
          $('.ec-collection-popup').find('#mce-EVERYCOLL').val(productName);
      }); 
  }
  modules.sustainabilityAccordion = function(popupData) {
      $(function() {
          // (Optional) Active an item if it has the class "is-active"	
          $(".accordion > .accordion-item.is-active").children(".accordion-panel").slideDown();
          
          $(".accordion > .accordion-item").click(function() {
              // Cancel the siblings
              $(this).siblings(".accordion-item").removeClass("is-active").children(".accordion-panel").slideUp();
              // Toggle the item
              $(this).toggleClass("is-active").children(".accordion-panel").slideToggle("ease-out");
          });
      }); 
      $(function() {
          $(".sub-menu__mobile .link").click(function(){
              $(this).find('.chevron').toggleClass('active');
              $(this).find('.dropdown-content').toggleClass('active');
          });
      }); 
  }
  modules.smoothScroll = function () {
      // https://twitter.com/uixmat
  
  function scrollNav() {
      $('.js-scroll').click(function(){
        
        $('html, body').stop().animate({
          scrollTop: $($(this).attr('href')).offset().top - 100
        }, 300);
        return false;
      });
    }
    scrollNav();
  }
  modules.range = function () {
    var selectors = {
      area: '[data-range-area]',
      slider: '[data-range-slider]',
      shutter: '[data-range-shutter]'
    }
  
    function setPos (e, $shutter, $slider) {
      var pageX = (e.type.toLowerCase() === 'mousemove')
        ? e.pageX
        : e.originalEvent.touches[0].pageX;
      
      var limit = $shutter.outerWidth() / 2;
      var ofLeft = $shutter.offset().left;
      var posLeft = $shutter.position().left;
      var right = $slider.outerWidth();
      let left = posLeft + pageX - ofLeft;
    
      left = (left <= 0 + limit) ? limit : 
        (left >= right - limit) ? right - limit : 
          left
    
      $shutter.css('left', left);
    }
    
    $(selectors.slider).each(function (index, slider) {
      var $slider = $(slider);
      var $area = $(slider).closest(selectors.area);
      var $shutter = $(selectors.shutter, $area);
      
      var dragging = false;
      function enable () { dragging = true };
      function disable () { dragging = false };
      
      $shutter.on('mousedown touchstart', enable)
        .on('mouseup touchend', disable);
      $(window).on('mousemove touchmove', function(e) {
        if (dragging) setPos(e, $shutter, $slider);
      }).on('mouseup', disable);
    });
  }
  
  modules.logoCarousel = function () {
      var $sliders = $('[data-logo-slider]');
    
      $sliders.each(function (index, element) {
        // Recalc AOS plugin after slider init:
        var $slider = $(element);
        $slider.on('init', function () {
          AOS.refreshHard();
        })
        //Slick slider initialize
        $slider.slick({
          mobileFirst: true,
          arrows:false,
          dots: false,
          infinite:true,
          speed: 500,
          autoplay:true,
          autoplaySpeed: 3000,
          draggable: true,
          arrows: false,
          dots: false,
          cssEase: 'ease-in-out',
          slidesToShow: 2,
          slidesToScroll:1,
        });
      });
    }
  modules.productPanel = function () {
    var $header = $('[data-site-header]');
    var $detailsWrap = $('[data-product-details-wrapper]');
    var $details = $('[data-product-details]');
    var headerHeight, detailsWrapHeight, detailsHeight, detailsOffset;
  
    function init() {
      setTimeout(function() {
        $details.removeClass('is-fixed');
        $detailsWrap.css('paddingTop', 0);
        if ($(window).width() > 750) {
          //console.log('$(window).width() > 750');
          headerHeight = $header.height();
          detailsWrapHeight = $detailsWrap.height();
          detailsHeight = $details.height();
          detailsOffset = $details.offset().top + detailsHeight - headerHeight;
  
          $(document).scroll();
        }
      }, 0);
    }
    
    if ($details.length) {
      init();
      $(window).resize(init);
      $(document).on('quickAddLoaded accordionToggle', init)
  
      $(document).scroll(function () {
        if ($(window).width() > 750) {
          var scrollTop = $(this).scrollTop();
          if (scrollTop >= detailsOffset) {
            $detailsWrap.css('paddingTop', detailsHeight);
            $details.addClass('is-fixed');
          }
          else {
            $detailsWrap.css('paddingTop', 0);
            $details.removeClass('is-fixed');
          }
        }
      })
    }
  }
  
  modules.instagramSlider = function () {
      var $slider = $('[data-instagram-slider]');
      if ($slider.length) {
          // Recalc AOS plugin after slider init:
          $slider.on('init', function() {
          AOS.refreshHard();
          })
          
          $slider.slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          nextArrow: '<div class="arrow-wrapper right"><i class="arrow-right"></div>',
          prevArrow: '<div class="arrow-wrapper left"><i class="arrow-left"></div>',
          responsive: [
              {
                  breakpoint: 1024,
                  settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                  }
              },
              {
              breakpoint: 767,
              settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
              }
              }
          ]
          })
      }
    }
    
  modules.instaReels = function () {
      var $video = $(".reel-video"), //jquery-wrapped video element
      mousedown = false;
  
      $video.click(function(){
          $(this).parent('.dna-service-ig__post').find('.play-icon').hide();
          if (this.paused) {
              this.play();
              return false;
          } else {
              this.pause();
          }
          return true;
      });
  
      $video.on('mousedown', function () {
          mousedown = true;
      });
  
      $(window).on('mouseup', function () {
          mousedown = false;
      });
  
      $video.on('play', function () {
          $(this).attr('controls', '');
      });
  
      $video.on('pause', function () {
          if (!mousedown) {
              $(this).parent('.dna-service-ig__post').find('.play-icon').show();
              $(this).removeAttr('controls');
          }
      });
    }
    
  modules.stylistProducts = function () {
      var $slider = $('[data-stylistproducts-slider]');
      if ($slider.length) {
        // Recalc AOS plugin after slider init:
        $slider.on('init', function () {
          AOS.refreshHard();
        })
        $slider.slick({
          slidesToShow: 4,
          slidesToScroll: 1,
          nextArrow: '<div class="arrow-wrapper right"><i class="arrow-right"></div>',
          prevArrow: '<div class="arrow-wrapper left"><i class="arrow-left"></div>',
          adaptiveHeight: true,
          responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                }
              },
              {
                  breakpoint: 767,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                  }
                }
            ]
        })
      }
    }
  modules.collectionLoading = function () {
      $(".preload").fadeOut(2500, function() {
          $(".collection__wrapper").fadeIn(1000);        
      });
  }

  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  function iPhoneDevices () {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }

  function makeRadioChecked(){
    $(".tpfilter-options input[type='radio']").each(function(){
      if($(this).prop("checked")){
        $(this).parent().find('svg').removeClass('is-unchecked')        
      } else {
        $(this).parent().find('svg').addClass('is-unchecked')  
      }
    });
  }
  function makeCheckboxChecked(){
    $(".tpfilter-options input[type='checkbox']").each(function(){
      if($(this).prop("checked")){
        $(this).parent().find('svg').removeClass('is-unchecked')        
      } else {
        $(this).parent().find('svg').addClass('is-unchecked')  
      }
    });
  }

  function replaceTrouserLength(elem, value){
    $(elem).contents().eq(1).filter(function() {
      return this.nodeType == 3; 
    }).first().replaceWith(value);
  }

  function printInvoice(printArea) {
      var printAreaId = "#"+ printArea;
      var tagname =  $(printAreaId).prop("tagName").toLowerCase() ;
      var attributes = ""; 
      var attrs = document.getElementById(printArea).attributes;
        $.each(attrs,function(i,elem){
          attributes +=  " "+  elem.name+" ='"+elem.value+"' " ;
        })
      var divToPrint= $(printAreaId).html() ;
      var head = "<html><head>"+ $("head").html() + "</head>" ;
      var allcontent = head + "<body  onload='window.print()' >"+ "<" + tagname + attributes + ">" +  divToPrint + "</" + tagname + ">" +  "</body></html>"  ;
      var newWin=window.open('','Print-Window');
      newWin.document.open();
      newWin.document.write(allcontent);
      newWin.document.close();
    }
    function reloadItems(param) {
      $(param).on('click', function(e) {
        window.location.reload();
      });
    }
    function reloadInSorting(param) {
      $(param).on('change', function(e) {
        window.location.reload();
      });
    }


  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  function delete_cookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  
  
  
  $(document).ready(function() {
    //  TFF 2.0 Summery Retake the Quiz
    $('.tff-v2__icon-retake').on('click', function() {
      window.location.href= 'https://daiwear.com/collections/trouser-fit-finder';
    });
    
    if($('.tff-v2__slider-collection-items').length > 1){
      var currentFilterUrl = window.location.href.split('tpfilter-');
      if(currentFilterUrl.length > 3){
        var bodyshape = currentFilterUrl[2].slice(0,-1);
        $('.tff-v2__slider-collection-items.'+bodyshape).removeClass('is-hidden');
        $('.selected_body_shape').text(bodyshape)
        var sumSizeEle = $('.tff-v2__summery-customer-size');
        var selectedSize = getCookie("selectedSize");
        var SelectedLength = getCookie("SelectedLength");
        $('.tff-v2__summery-length-text.desktop').html(SelectedLength);
        $('.tff-v2__summery-length-text.mobile').html(SelectedLength);
        sumSizeEle.html(selectedSize);
      }      
    }
    
    // swym custom button initialize after reload
    setTimeout(function() { 
      reloadItems('.selected-item.gf-option-label a');
      reloadItems('.gf-refine-toggle');
      reloadItems('span.gf-clear');
      reloadItems('.gf-option-box li a');
      reloadItems('#gf_pagination_wrap #pagination span');
      reloadInSorting('#setLimit');
      reloadItems('#globo-dropdown-sort_options span');
    }, 2000);

    
      // customer acccount page
       $('.address-new-toggle').on('click', function (event) {
          if(!$('.add-new-btn-wrapper').hasClass('hidden')){
            $('.add-new-btn-wrapper').addClass('hidden')
          }else{
            $('.add-new-btn-wrapper').removeClass('hidden')
          }
      });
      $('.order-link').on('click', function (event) {
          if(!$('.customer-mobile-header').hasClass('hidden')){
            $('.customer-mobile-header').addClass('hidden');
          }
      });
      $('button#printBtn').on('click', function (event) {
          printInvoice('print_area')
      });
        
      $('.sidebar-menu__link').each(function (e) {
          $(this).on('click', function (event) {
            $('.sidebar-menu__item').removeClass('active');
            if($(this).data('item') == 'order') {
              $('.account-information-wrapper').addClass('information-hidden');
              $('.order-items-wrapper').removeClass('hidden');
              $(this).parent().addClass('active');
            }else if($(this).data('item') == 'account'){
              $(this).parent().addClass('active');
              $('.account-information-wrapper').removeClass('information-hidden');
              $('.order-items-wrapper').addClass('hidden');
            }          
          })        
      });
    
      if(window.location.href.split('#order').length > 1){
        $('.account-information-wrapper').addClass('information-hidden');
        $('.order-items-wrapper').removeClass('hidden');
        $('.sidebar-menu__item').removeClass('active');
        $('.order-link').addClass('active');
         $('.customer-mobile-header').addClass('hidden');
      }
    if(window.location.href.split('/orders').length > 1){
         $('.customer-mobile-header').addClass('hidden');
      }
      // if(window.location.href.split('/account/').length > 1){
      //   $('ul.sidebar-menu').addClass('hidden')
      // }else{
      //   if($('ul.sidebar-menu').hasClass('hidden')){
      //     $('ul.sidebar-menu').removeClass('hidden')
      //   }        
      // }

      $('.change_password').on('click', function (e) {
        $(this).parent().parent().parent().find('div.row:not(.update_password)').addClass('hidden');
        $('.update_password').removeClass('hidden');
        $('.change_password').addClass('hidden');
      });

      $('.change_email').on('click', function (e) {
        $(this).parent().parent().parent().find('div.row:not(.update_email)').addClass('hidden');
        $('.update_email').removeClass('hidden');
        $('.change_email').addClass('hidden');
        $('.change_password').addClass('hidden');
        $('.email_label').addClass('hidden');
      });

      $('.reset_password').on('click', function (e) {
        $('#RecoverPasswordForm').removeClass('hidden');
        $('.customer-page-wrapper').addClass('hidden');
      });
      if ($(window).width() < 767) { 
        $('.account-information-wrapper').addClass('hidden');
        $('.sidebar-menu__link').on('click', function (e) {
          $('.account-information-wrapper').removeClass('hidden');
          $('.account-information-wrapper').removeClass('mobile-hidden');
          $('.sidebar-menu.mobile-sidebar-menu').addClass('hidden');
          $('.back_dashboard').removeClass('hidden');
        });
        $('.back_dashboard').on('click', function (e) {
          $('.account-information-wrapper').addClass('hidden');
          $('.address-items').addClass('hidden');
          $('.order-items-wrapper').addClass('hidden');
          $('.sidebar-menu.mobile-sidebar-menu').removeClass('hidden');
        });

        if(window.location.href.split('/account/').length > 1){
          $('ul.sidebar-menu.mobile-sidebar-menu').addClass('hidden')
        }
        if(window.location.href.split('#order').length > 1){           
          $('.sidebar-menu.mobile-sidebar-menu').addClass('hidden');
        }
      }
     

      $('#newsletter_subscription').on('click', function(e){
        var email = $('#k_id_email').val();
        if($(this).is(':checked')){
          $('.klaviyo_newsletter_signup_submit_button').trigger('click');          
        }else{
           $('.klaviyo_newsletter_unsubscribe_button').trigger('click');   
        }
      });

    
    
    //Collection Page Shortcuts - Homepage
    $('body').on('click', '.tailored-performance-section .left.slick-arrow', function () {
      $('.tailored-performance-item div').removeAttr('class')
      $('.tailored-performance-item').each(function(e) {
        var i = $(this).data('slick-index');
        switch(i) {
          case 0:
            $(this).find('>div').addClass('ij pp pa pb ph pd pe oy');            
          break;
          case 1:
            $(this).find('>div').addClass('ij pp pa pb pg pd pe oy');            
          break;
          case 2:
            $(this).find('>div').addClass('ij pp pa pb pf pd pe oy');            
          break;
          case 3:
            $(this).find('>div').addClass('ij pp pa pb pc pd pe oy');
          break;
          case 4:
            $(this).find('>div').addClass('ij pp pa pb pc pd pi oy');            
          break;
          case 5:
            $(this).find('>div').addClass('ij pp pa pb pf pd pi oy');            
          break;
          case 6:
            $(this).find('>div').addClass('ij pp pa pb pg pd pi oy');            
          break;
          case 7:
            $(this).find('>div').addClass('ij pp pa pb ph pd pi oy');           
          break;
          default:
          // code to be executed if n is different from case 1 and 2
        }         
      });
      setTimeout(function(){
        $('.tailored-performance-section').find('.pp').removeClass('pp').addClass('pq');
      }, 100)
    })
    $('body').on('click', '.tailored-performance-section .right.slick-arrow', function () {
      $('.tailored-performance-item div').removeAttr('class')
      $('.tailored-performance-item').each(function(e) {
        var i = $(this).data('slick-index');
        switch(i) {
          case 0:
            $(this).find('>div').addClass('ij oz pa pb pc pd pi oy');           
          break;
          case 1:
            $(this).find('>div').addClass('ij oz pa pb pf pd pi oy');           
          break;
          case 2:
            $(this).find('>div').addClass('ij oz pa pb pg pd pi oy');          
          break;
          case 3:
            $(this).find('>div').addClass('ij oz pa pb ph pd pi oy');           
          break;
          case 4:
            $(this).find('>div').addClass('ij oz pa pb pc pd pe oy');           
          break;
          case 5:
            $(this).find('>div').addClass('ij oz pa pb pf pd pe oy');           
          break;
          case 6:
            $(this).find('>div').addClass('ij oz pa pb pg pd pe oy');            
          break;
          case 7:
            $(this).find('>div').addClass('ij oz pa pb ph pd pe oy');           
          break;
          default:
          // code to be executed if n is different from case 1 and 2
        }
      });
      setTimeout(function(){
        $('.tailored-performance-section').find('.oz').removeClass('oz').addClass('pm');
      }, 100)
    
    })
    
    // Remove header banner from shop all collection
    var shopAllUrl = window.location.href.split('/collections/');
    if(shopAllUrl.length > 1 && shopAllUrl[1] == 'all-products'){
      if($('.collection-header-img').length > 0 ){
        $('.collection-header-img').addClass('hide-banner');
      }
    }
    // Remove header banner from shop all collection
    if($('.tpfilter-item.welcome').length > 0) {
      $('.tpfilter-item.welcome').parent().parent().parent().addClass('tff-header')
    }
    
    // Filter Collection Name
    var currentUrl = window.location.href.split('/collections/all/');
    if(currentUrl.length > 1 ){
      var collectionName = currentUrl[1].replace(/\-/g, ' ');
      $('.collection-filter-header-title').text(collectionName);
    }
    // Filter Collection Name
    
    $(".tff-v2-loader").show();
    $(window).on('load', function () {
      $(".tff-v2-loader").hide();
    })
    $(document).on('DOMNodeInserted', '.tff-v2-filter-close-btn', function (e) {
      var element = e.target;
      $(element).on('click', function(evt) {
        $('#gf-tree').css({'left':'-80%'});
      });
    })


    var sections = new slate.Sections();
    sections.register('product', theme.Product);

  
  
    // Common a11y fixes
    slate.a11y.pageLinkFocus($(window.location.hash));
  
    $('.in-page-link').on('click', function(evt) {
      slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
    });
  
    // Target tables to make them scrollable
    var tableSelectors = '.rte table';
  
    slate.rte.wrapTable({
      $tables: $(tableSelectors),
      tableWrapperClass: 'rte__table-wrapper',
    });
  
    // Target iframes to make them responsive
    var iframeSelectors =
      '.rte iframe[src*="youtube.com/embed"],' +
      '.rte iframe[src*="player.vimeo"]';
  
    slate.rte.wrapIframe({
      $iframes: $(iframeSelectors),
      iframeWrapperClass: 'rte__video-wrapper'
    });
  
    // Apply a specific class to the html element for browser support of cookies.
    if (slate.cart.cookiesEnabled()) {
      document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
    }
  
    // Rivets config
    if (slate.Currency) {
      rivets.formatters.formatMoney = slate.Currency.formatMoney;
      rivets.formatters.isDefaultTitle = function (title) {
        if (title.toLowerCase() == "default title") return true;
        return false;
      };
      rivets.formatters.append = function(value, append) {
        return value+append;
      }
    }
  
    // Modules:
    modules.header();
    modules.aos(); 
    modules.testimonials();
    modules.subscriptionPopup(); 
    modules.productPhotoSlider();
    modules.dropdownToRadio();
    modules.zoomInPhoto();
    modules.responsiveTabs();
    modules.popup();
    modules.geolocation();
    modules.quizTFF();
    modules.quizBody();
    modules.tallSelector();
    modules.widget();
    modules.minicart();
    modules.landingSlider();
    modules.shopAllCollectionSlider();
    modules.homePageBannerSlider();
    modules.performanceSlider();
    modules.testimonialsSlider();
    modules.changeCountrySelect();
    modules.topMessage();
    modules.slider();
    modules.quickAdd();
    modules.accordion();
    rteLiFix();
    theme.customerLogin();
    theme.customerAddresses();
    modules.everyCollection();
    modules.sustainabilityAccordion();
    modules.smoothScroll();
    modules.range();
    modules.logoCarousel();
    modules.productPanel();
    modules.instagramSlider();
    modules.instaReels();
    modules.stylistProducts();
    modules.collectionLoading();
  });
  
})()