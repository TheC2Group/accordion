var $ = require('jquery');
var Accordion = require('../../cjs/accordion.js');

var defaultAcc = new Accordion('.Example1');

var multipleAcc = new Accordion('.Example2', {
    allowMultiple: false,
    setFocus: 'panel'
});

var hashAcc = new Accordion('.Example3', {
    hashEnabled: true,
    allowMultiple: false
});

$('.destroy').click(function () {
    defaultAcc.destroy();
});

$('.enable').click(function() {
    defaultAcc = new Accordion('.Example1');
});
