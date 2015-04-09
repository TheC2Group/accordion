/*!
 * accordion
 * version: 1.0.0
 * https://stash.c2mpg.com:8443/projects/C2/repos/accordion
 */

/* exported Accordion */

var Accordion = (function ($) {
    'use strict';

    var count = 0;

    var defaults = {
        item: '.item',
        target: '.target',
        control: '.target',
        panel: '.panel',
        allowMultiple: true,
        fixedLayout: false,
        attribute: 'data-status',
        expanded: 'expanded',
        contracted: 'contracted',
        prefix: 'Accordion-'
    };

    var expand = function (index) {
        var thisItem = this.items[index];
        if (thisItem.isExpanded) return;

        if (this.opts.fixedLayout) {
            thisItem.$el.height(this.tallest);
        } else {
            thisItem.$el.height(thisItem.fullHeight);
        }

        thisItem.$el.attr(this.opts.attribute, this.opts.expanded);
        thisItem.$target.attr('aria-expanded', 'true');
        thisItem.$panel.attr('aria-hidden', 'false');
        thisItem.isExpanded = true;
    };

    var contract = function (index) {
        var thisItem = this.items[index];
        if (!thisItem.isExpanded) return;

        thisItem.$el.height(thisItem.controlHeight);

        thisItem.$el.attr(this.opts.attribute, this.opts.contracted);
        thisItem.$target.attr('aria-expanded', 'false');
        thisItem.$panel.attr('aria-hidden', 'true');
        thisItem.isExpanded = false;
    };

    var activate = function (index) {
        var self = this;
        var thisItem = this.items[index];

        if (thisItem.isExpanded) {

            if (!this.opts.allowMultiple && this.opts.fixedLayout) return;

            contract.call(this, index);
            return;
        }

        if (!this.opts.allowMultiple) {
            this.items.forEach(function (item, i) {
                if (i === index) return;
                if (item.isExpanded) {
                    contract.call(self, i);
                }
            });
        }

        expand.call(this, index);
    };

    var resize = function () {
        var self = this;
        var tallest = 0;

        this.items.forEach(function (item) {
            var controlHeight = item.$control.outerHeight();
            var panelHeight = item.$panel.outerHeight();

            var fullHeight = controlHeight + panelHeight;
            if (fullHeight > tallest) {
                tallest = fullHeight;
            }

            var height = (item.isExpanded) ? controlHeight + panelHeight : controlHeight;
            if (height !== item.height && (!self.opts.fixedLayout || !item.isExpanded)) {
                item.$el.height(height);
                item.height = height;
            }

            item.controlHeight = controlHeight;
            item.fullHeight = fullHeight;
        });

        this.tallest = tallest;

        if (this.opts.fixedLayout) {
            this.items.forEach(function (item) {
                if (item.isExpanded && item.height !== tallest) {
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

        return $.map(this.$el.find(this.opts.item), function (item, i) {
            var $el = $(item);
            var $target = $el.find(self.opts.target);
            var $control = (self.opts.target === self.opts.control) ? $target : $el.find(self.opts.control);
            var $panel = $el.find(self.opts.panel);

            var attribute = $el.attr(self.opts.attribute);
            var isExpanded = (attribute === self.opts.expanded);
            if (!attribute) {
                $el.attr(self.opts.attribute, (isExpanded) ? self.opts.expanded : self.opts.contracted);
            }
            $target.attr('aria-expanded', isExpanded);
            $panel.attr('aria-hidden', !isExpanded);

            var id = $panel.attr('id');
            if (!id) {
                id = self.opts.prefix + self.count + '-' + (i + 1);
                $panel.attr('id', id);
            }
            $target.attr('aria-controls', id);

            return {
                $el: $el,
                $target: $target,
                $control: $control,
                $panel: $panel,
                isExpanded: isExpanded,
                height: 0,
                controlHeight: 0,
                fullHeight: 0
            };
        });
    };

    var Group = function (el, options) {
        count += 1;
        this.count = count;
        this.$el = $(el);
        this.opts = $.extend({}, defaults, options);

        this.items = createItems.call(this);
        this.tallest = 0;
        resize.call(this);

        bindEvents.call(this);
    };

    Group.prototype.resize = resize;
    Group.prototype.activate = activate;
    Group.prototype.expand = expand;
    Group.prototype.contract = contract;

    return Group;
}(jQuery));
