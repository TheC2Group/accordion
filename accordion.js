/*!
 * accordion
 * version: 0.0.0
 * https:
 */

/*exported Accordion */

var Accordion = (function ($) {
    'use strict';

    var defaults = {
        item: '.item',
        wrap: '<div class="control" />',
        target: '.target',
        control: '.control',
        panel: '.panel',
        attribute: 'data-status',
        open: 'open',
        closed: 'closed',
        allowMultiple: true,
        fixedLayout: false
    };

    var open = function (index) {
        var thisItem = this.items[index];
        if (thisItem.isOpen) return;

        if (this.opts.fixedLayout) {
            thisItem.$el.height(this.tallest);
        } else {
            thisItem.$el.height(thisItem.fullHeight);
        }

        thisItem.$el.attr(this.opts.attribute, this.opts.open);
        thisItem.isOpen = true;
    };

    var close = function (index) {
        var thisItem = this.items[index];
        if (!thisItem.isOpen) return;

        thisItem.$el.height(thisItem.controlHeight);

        thisItem.$el.attr(this.opts.attribute, this.opts.closed);
        thisItem.isOpen = false;
    };

    var activate = function (index) {
        var self = this;
        var thisItem = this.items[index];

        if (thisItem.isOpen) {

            if (!this.opts.allowMultiple && this.opts.fixedLayout) return;

            close.call(this, index);
            return;
        }

        if (!this.opts.allowMultiple) {
            this.items.forEach(function (item, i) {
                if (i === index) return;
                if (item.isOpen) {
                    close.call(self, i);
                }
            });
        }

        open.call(this, index);
    };

    var resize = function () {
        var self = this;
        var tallest = 0;

        this.items.forEach(function (item) {
            var controlHeight = item.$control.height();
            var panelHeight = item.$panel.outerHeight();

            var fullHeight = controlHeight + panelHeight;
            if (fullHeight > tallest) {
                tallest = fullHeight;
            }

            var height = (item.isOpen) ? controlHeight + panelHeight : controlHeight;
            if (height !== item.height && (!self.opts.fixedLayout || !item.isOpen)) {
                item.$el.height(height);
                item.height = height;
            }

            item.controlHeight = controlHeight;
            item.fullHeight = fullHeight;
        });

        this.tallest = tallest;

        if (this.opts.fixedLayout) {
            this.items.forEach(function (item) {
                if (item.isOpen && item.height !== tallest) {
                    item.$el.height(tallest);
                    item.height = tallest;
                }
            });
        }
    };

    var bindEvents = function () {
        var self = this;

        this.items.forEach(function (item, i) {
            item.$el.on('click', self.opts.target, function (e) {
                e.preventDefault();
                activate.call(self, i);
            });
        });

        $(window).on('load resize', function () {
            resize.call(self);
        });
    };

    var createItems = function () {
        var self = this;

        return $.map(this.$el.find(this.opts.item), function (item) {
            var $el = $(item);
            $el.wrapInner(self.opts.wrap);
            var $control = $el.find(self.opts.control);
            var $panel = $el.find(self.opts.panel);

            var isOpen = ($el.attr(self.opts.attribute) === self.opts.open);

            return {
                $el: $el,
                $control: $control,
                $panel: $panel,
                isOpen: isOpen,
                height: 0,
                controlHeight: 0,
                fullHeight: 0
            };
        });
    };

    var Group = function (el, options) {
        this.$el = $(el);
        this.opts = $.extend({}, defaults, options);

        this.items = createItems.call(this);
        this.tallest = 0;
        resize.call(this);

        bindEvents.call(this);
    };

    return Group;
}(jQuery));
