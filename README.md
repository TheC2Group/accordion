accordion
=========

Accessible accordion using CSS transition to expand and contract. Aria states are automatically added. Depends on jQuery.

Basic Example
-------------

```html
<div class="Accordion">
    <div class="item" data-status="disabled">
        <div class="target">...</div>
        <div class="panel">...</div>
    </div>
    <div class="item" data-status="disabled">
        <div class="target">...</div>
        <div class="panel">...</div>
    </div>
    <div class="item" data-status="disabled">
        <div class="target">...</div>
        <div class="panel">...</div>
    </div>
</div>
```

```js
// This wouldn't be necessary since all these options are the defaults
var options = {
    item: '.item',
    target: '.target',
    control: '.target', // in this case the target is also acting as the control
    panel: '.panel',
    allowMultiple: true,
    attribute: 'data-status',
    expanded: 'expanded',
    contracted: 'contracted',
    prefix: 'Accordion-',
    transition: 'height .3s'
};

new Accordion('.Accordion', options);
```

Since the height of the "control" and the height of the "panel" make up the height of the item. It is sometimes not the case that the "target" is the same as the "control". Below is an example of this:

```html
<div class="Accordion">
    <div class="item" data-status="disabled">
        <div class="control">
            <a class="target" href="#">...</a>
        </div>
        <div class="panel">...</div>
    </div>
    <div class="item" data-status="disabled">
        <div class="control">
            <a class="target" href="#">...</a>
        </div>
        <div class="panel">...</div>
    </div>
    <div class="item" data-status="disabled">
        <div class="control">
            <a class="target" href="#">...</a>
        </div>
        <div class="panel">...</div>
    </div>
</div>
```

```js
new Accordion('.Accordion', {
    control: '.control'
});
```

Accessibility
-------------

[http://www.w3.org/TR/wai-aria-practices/#accordion](http://www.w3.org/TR/wai-aria-practices/#accordion)

Here is what the markup looks like after accessibility is added with JavaScript. It may be beneficial to add the aria attributes before JavaScript runs.

```html
<div class="Accordion" role="tablist" aria-multiselectable="true">
    <div class="item" data-status="expanded">
        <div class="target" role="tab" aria-expanded="true" tabindex="0" id="Accordion-1-1">...</div>
        <div class="panel" role="tabpanel" aria-hidden="false" tabindex="-1" aria-labelledby="Accordion-1-1">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target" role="tab" aria-expanded="false" tabindex="0" id="Accordion-1-2">...</div>
        <div class="panel" role="tabpanel" aria-hidden="true" tabindex="-1" aria-labelledby="Accordion-1-2">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target" role="tab" aria-expanded="false" tabindex="0" id="Accordion-1-3">...</div>
        <div class="panel" role="tabpanel" aria-hidden="true" tabindex="-1" aria-labelledby="Accordion-1-3">...</div>
    </div>
</div>
```

Or if `allowMultiple` is set to `false`.

```html
<div class="Accordion" role="tablist">
    <div class="item" data-status="expanded">
        <div class="target" role="tab" aria-expanded="true" aria-selected="true" tabindex="0" id="Accordion-2-1">...</div>
        <div class="panel" role="tabpanel" aria-hidden="false" tabindex="-1" aria-labelledby="Accordion-2-1">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target" role="tab" aria-expanded="false" aria-selected="false" tabindex="0" id="Accordion-2-2">...</div>
        <div class="panel" role="tabpanel" aria-hidden="true" tabindex="-1" aria-labelledby="Accordion-2-2">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target" role="tab" aria-expanded="false" aria-selected="false" tabindex="0" id="Accordion-2-3">...</div>
        <div class="panel" role="tabpanel" aria-hidden="true" tabindex="-1" aria-labelledby="Accordion-2-3">...</div>
    </div>
</div>
```
