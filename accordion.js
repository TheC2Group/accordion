/*!
 * accordion
 * version: 2.0.0
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
        attribute: 'data-status',
        expanded: 'expanded',
        contracted: 'contracted',
        prefix: 'Accordion-',
        transition: 'height .3s'
    };

    var transitionEnd = function (index) {
        var thisItem = this.items[index];

        thisItem.$el.removeAttr('style');

        if (!thisItem.isExpanded) {
            thisItem.$panel.attr('aria-hidden', 'true');
        }

        thisItem.inTransition = false;
    };

    var expand = function (index) {
        var thisItem = this.items[index];
        if (thisItem.isExpanded) return;

        var controlHeight = thisItem.$control.outerHeight();

        if (!thisItem.inTransition) {
            thisItem.$el.height(controlHeight);

            // repaint for iOS, kind of a hack
            thisItem.el.getBoundingClientRect();

            thisItem.el.style.transition = this.opts.transition;

            thisItem.inTransition = true;
        }

        thisItem.$el.attr(this.opts.attribute, this.opts.expanded);
        thisItem.$target.attr('aria-expanded', 'true');
        thisItem.$panel.attr('aria-hidden', 'false');

        var panelHeight = thisItem.$panel.outerHeight();

        thisItem.$el.height(controlHeight + panelHeight);
        thisItem.isExpanded = true;
    };

    var contract = function (index) {
        var thisItem = this.items[index];
        if (!thisItem.isExpanded) return;

        var controlHeight = thisItem.$control.outerHeight();

        if (!thisItem.inTransition) {
            var panelHeight = thisItem.$panel.outerHeight();

            thisItem.$el.height(controlHeight + panelHeight);

            // repaint for iOS, kind of a hack
            thisItem.el.getBoundingClientRect();

            thisItem.el.style.transition = this.opts.transition;

            thisItem.inTransition = true;
        }

        thisItem.$el.attr(this.opts.attribute, this.opts.contracted);
        thisItem.$target.attr('aria-expanded', 'false');

        thisItem.$el.height(controlHeight);
        thisItem.isExpanded = false;
    };

    var activate = function (index) {
        var self = this;
        var thisItem = this.items[index];

        if (thisItem.isExpanded) {

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

    var bindEvents = function () {
        var self = this;

        this.items.forEach(function (item, i) {
            item.$el.on('click', self.opts.target, function (e) {
                e.preventDefault();
                activate.call(self, i);
            });

            item.$el.on('transitionend', function () {
                transitionEnd.call(self, i);
            });
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
                el: item,
                $target: $target,
                $control: $control,
                $panel: $panel,
                isExpanded: isExpanded,
                inTransition: false
            };
        });
    };

    var Group = function (el, options) {
        count += 1;
        this.count = count;
        this.$el = $(el);
        this.opts = $.extend({}, defaults, options);

        this.items = createItems.call(this);

        bindEvents.call(this);
    };

    Group.prototype.activate = activate;
    Group.prototype.expand = expand;
    Group.prototype.contract = contract;

    return Group;
}(jQuery));
