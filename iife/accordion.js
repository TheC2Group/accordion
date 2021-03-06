/*!
 * c2-accordion
 * https://github.com/TheC2Group/accordion
 * @version 2.8.4
 * @license MIT (c) The C2 Group (c2experience.com)
 */
var Accordion = (function ($) {
    'use strict';

    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

    var count = 0;
    var defaults = {
      item: '.item',
      target: '.target',
      control: '.target',
      panel: '.panel',
      allowMultiple: true,
      attribute: 'data-status',
      expanded: 'expanded',
      contracted: 'contracted',
      prefix: 'Accordion-',
      transition: 'height .3s',
      transitionSupport: true,
      setFocus: 'none',
      // options: none, item, panel, target, control, first
      hashEnabled: false
    };

    var focusPreviousTarget = function focusPreviousTarget(index) {
      var previous = index - 1;

      if (previous < 0) {
        previous = this.items.length - 1;
      }

      this.items[previous].target.focus();
    };

    var focusNextTarget = function focusNextTarget(index) {
      var next = index + 1;

      if (next >= this.items.length) {
        next = 0;
      }

      this.items[next].target.focus();
    };

    var setFocusEnd = function setFocusEnd(item) {
      var target = this.opts.setFocus;

      switch (target) {
        case 'item':
          item.el.focus();
          break;

        case 'panel':
        case 'target':
        case 'control':
          item[target].focus();
          break;

        case 'first':
          item.$panel.find('a, :input').first().each(function () {
            this.focus();
          });
          break;
      }
    };

    var transitionEnd = function transitionEnd(index) {
      var thisItem = this.items[index];
      thisItem.$el.removeAttr('style');

      if (thisItem.isExpanded) {
        setFocusEnd.call(this, thisItem);
      } else {
        thisItem.$panel.attr('aria-hidden', 'true');
      }

      thisItem.inTransition = false;
    };

    var expand = function expand(index) {
      var thisItem = this.items[index];
      if (thisItem.isExpanded) return;
      var controlHeight = thisItem.$control.outerHeight();

      if (!thisItem.inTransition) {
        thisItem.$el.height(controlHeight); // repaint for iOS, kind of a hack

        thisItem.el.getBoundingClientRect();
        thisItem.el.style.transition = this.opts.transition;
        thisItem.inTransition = true;
      }

      thisItem.$el.attr(this.opts.attribute, this.opts.expanded);
      thisItem.$target.attr('aria-expanded', 'true');

      if (!this.opts.allowMultiple) {
        thisItem.$target.attr('aria-selected', 'true');
      }

      thisItem.$panel.attr('aria-hidden', 'false');
      var panelHeight = thisItem.$panel.outerHeight();

      if (this.opts.transitionSupport) {
        thisItem.$el.height(controlHeight + panelHeight);
      }

      thisItem.isExpanded = true;

      if (this.opts.setFocus === 'target') {
        thisItem.target.focus();
      }
    };

    var contract = function contract(index) {
      var thisItem = this.items[index];
      if (!thisItem.isExpanded) return;
      var controlHeight = thisItem.$control.outerHeight();

      if (!thisItem.inTransition) {
        var panelHeight = thisItem.$panel.outerHeight();
        thisItem.$el.height(controlHeight + panelHeight); // repaint for iOS, kind of a hack

        thisItem.el.getBoundingClientRect();
        thisItem.el.style.transition = this.opts.transition;
        thisItem.inTransition = true;
      }

      thisItem.$el.attr(this.opts.attribute, this.opts.contracted);
      thisItem.$target.attr('aria-expanded', 'false');

      if (!this.opts.allowMultiple) {
        thisItem.$target.attr('aria-selected', 'false');
      }

      if (this.opts.transitionSupport) {
        thisItem.$el.height(controlHeight);
      }

      thisItem.isExpanded = false;

      if (!this.opts.transitionSupport) {
        transitionEnd.call(this, index);
      }
    };

    var contractAll = function contractAll(skip) {
      var self = this;
      this.items.forEach(function (item, i) {
        if (i === skip) return;

        if (item.isExpanded) {
          contract.call(self, i);
        }
      });
    };

    var activate = function activate(index) {
      var thisItem = this.items[index];

      if (thisItem.isExpanded) {
        contract.call(this, index);
        return;
      }

      if (!this.opts.allowMultiple) {
        contractAll.call(this, index);
      }

      expand.call(this, index);
    };

    var keyEvent = function keyEvent(e, index) {
      // enter, space
      if (e.which === 13 || e.which === 32) {
        e.preventDefault();
        activate.call(this, index);
        return;
      } // end


      if (e.which === 35) {
        e.preventDefault();
        this.items[this.items.length - 1].target.focus();
        return;
      } // home


      if (e.which === 36) {
        e.preventDefault();
        this.items[0].target.focus();
        return;
      } // left arrow, up arrow


      if (e.which === 37 || e.which === 38) {
        e.preventDefault();
        focusPreviousTarget.call(this, index);
        return;
      } // right arrow, down arrow


      if (e.which === 39 || e.which === 40) {
        e.preventDefault();
        focusNextTarget.call(this, index);
        return;
      }
    };

    var bindEvents = function bindEvents() {
      var self = this;
      this.items.forEach(function (item, i) {
        item.$target.on('click', function (e) {
          if (!self._enabled) return;
          e.preventDefault();
          activate.call(self, i);
        });
        item.$el.on('transitionend', function (e) {
          if (!self._enabled || e.target !== e.delegateTarget) return;
          transitionEnd.call(self, i);
        });
        item.$target.on('keydown', function (e) {
          if (!self._enabled) return;
          keyEvent.call(self, e, i);
        });
      });
      $(window).on('hashchange', function () {
        if (self.opts.hashEnabled && self._enabled) {
          checkHash.call(self);
        }
      });
    };

    var unbindEvents = function unbindEvents() {
      this.items.forEach(function (item, i) {
        item.$target.off('click keydown');
        item.$el.off('transitionend');
      });
      this._enabled = false;
    };

    var createItems = function createItems() {
      var self = this;
      return $.map(this.$el.find(this.opts.item), function (item, i) {
        var $el = $(item);
        var $target = $el.find(self.opts.target);
        var $control = self.opts.target === self.opts.control ? $target : $el.find(self.opts.control);
        var $panel = $el.find(self.opts.panel);

        if (!$target.attr('role')) {
          $target.attr('role', 'tab');
        }

        if (!$panel.attr('role')) {
          $panel.attr('role', 'tabpanel');
        }

        var attribute = $el.attr(self.opts.attribute);
        var isExpanded = attribute === self.opts.expanded;

        if (!attribute) {
          $el.attr(self.opts.attribute, isExpanded ? self.opts.expanded : self.opts.contracted);
        }

        $target.attr('aria-expanded', isExpanded);

        if (!self.opts.allowMultiple) {
          $target.attr('aria-selected', isExpanded);
        }

        $panel.attr('aria-hidden', !isExpanded);

        switch (self.opts.setFocus) {
          case 'item':
            if ($el.attr('tabindex')) return;
            $el.attr('tabindex', '-1');
            break;

          case 'panel':
            if ($panel.attr('tabindex')) return;
            $panel.attr('tabindex', '-1');
            break;

          case 'target':
            if ($target.attr('tabindex')) return;
            $target.attr('tabindex', '0');
            break;

          case 'control':
            if ($control.attr('tabindex')) return;
            $control.attr('tabindex', '-1');
            break;
        }

        var id = $target.attr('id');

        if (!id) {
          id = self.opts.prefix + self.count + '-' + (i + 1);
          $target.attr('id', id);
        } else {
          $target.attr('data-original-id', true);
        }

        if (!$panel.attr('aria-labelledby')) {
          $panel.attr('aria-labelledby', id);
        } else {
          $panel.attr('data-original-labelledBy', true);
        }

        return {
          $el: $el,
          el: item,
          $target: $target,
          target: $target[0],
          $control: $control,
          control: $control[0],
          $panel: $panel,
          panel: $panel[0],
          isExpanded: isExpanded,
          inTransition: false
        };
      });
    };

    var removeAriaAttributes = function removeAriaAttributes() {
      var self = this;
      this.$el.removeAttr('role aria-multiselectable');
      this.$el.find(this.opts.item).each(function () {
        var $el = $(this);
        var $target = $el.find(self.opts.target);
        var $control = self.opts.target === self.opts.control ? $target : $el.find(self.opts.control);
        var $panel = $el.find(self.opts.panel);
        $el.removeAttr('tabindex');
        $target.removeAttr('role aria-expanded aria-selected tabindex');
        $panel.removeAttr('role aria-hidden tabindex');
        $control.removeAttr('tabindex');

        if (!$target.attr('data-original-id')) {
          $target.removeAttr('id');
        } else {
          $target.removeAttr('data-original-id');
        }

        if (!$panel.attr('data-original-labelledBy')) {
          $panel.removeAttr('aria-labelledby');
        } else {
          $panel.removeAttr('data-original-labelledBy');
        }
      });
    };

    var destroy = function destroy() {
      removeAriaAttributes.call(this);
      unbindEvents.call(this);
    };

    var checkHash = function checkHash() {
      var self = this;

      if (document.location.hash) {
        var hashKey = document.location.hash.split('#')[1];
        self.items.forEach(function (item, i) {
          var thisHash = item.el.dataset.hash;

          if (thisHash === hashKey) {
            activate.call(self, i);
          }
        });
      }
    };

    var Group = function Group(el, options) {
      count += 1;
      this.count = count;
      this.$el = $(el);
      this.opts = $.extend({}, defaults, options);
      this._enabled = true;

      if (!this.$el.attr('role')) {
        this.$el.attr('role', 'tablist');
      }

      if (this.opts.allowMultiple) {
        this.$el.attr('aria-multiselectable', 'true');
      }

      this.items = createItems.call(this);
      bindEvents.call(this);

      if (this.opts.hashEnabled) {
        checkHash.call(this);
      }
    };

    Group.prototype.activate = activate;
    Group.prototype.expand = expand;
    Group.prototype.contract = contract;
    Group.prototype.contractAll = contractAll;

    Group.prototype.enable = function () {
      this._enabled = true;
      return this;
    };

    Group.prototype.disable = function () {
      this._enabled = false;
      return this;
    };

    Group.prototype.destroy = destroy;

    return Group;

}(jQuery));
