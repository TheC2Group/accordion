accordion
=========

Accessible accordion using CSS transition to expand and contract. Aria states are automatically added. Depends on jQuery.

Basic Example
-------------

```html
<div class="Accordion">
    <div class="item" data-status="disabled">
        <a class="target" href="#">...</a>
        <div class="panel">...</div>
    </div>
    <div class="item" data-status="disabled">
        <a class="target" href="#">...</a>
        <div class="panel">...</div>
    </div>
    <div class="item" data-status="disabled">
        <a class="target" href="#">...</a>
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
    fixedLayout: false,
    attribute: 'data-status',
    expanded: 'expanded',
    contracted: 'contracted',
    prefix: 'Accordion-'
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


Known issues
------------

If opening an accordion causes a scrollbar to appear. That scrollbar may cause a change in heights because the viewport size has changed. This viewport resize does not trigger the window resize event.
