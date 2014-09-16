/*jslint browser: true, nomen: true, regexp: true, vars: true, white: true */
/*global define, window, console, describe, it, before, beforeEach, after, afterEach */

define(['knockout', 'underscore'],
function(ko, _) {
    'use strict';
    
    function ViewModel(params) {
        this.template = ko.observable(params.template);
        this.className = ko.observable(params['class'] || '');
    }
    ViewModel.prototype = {};
    
    return {
        viewModel: ViewModel,
        template: { require: 'text!templates/panel.html' }
    };
});