/*jslint browser: true, nomen: true, regexp: true, vars: true, white: true */
/*global define, window, console, describe, it, before, beforeEach, after, afterEach */

define(['jquery','underscore','knockout','utils', 'viewmodel', 'components'],
function($, _, ko, U, ViewModel) {
    'use strict';
    
    return {
        start: function() {
            ko.applyBindings(ViewModel.create());
        }
    };
});