/*jslint browser: true, nomen: true, regexp: true, vars: true, white: true */
/*global define, window, console, describe, it, before, beforeEach, after, afterEach */

define(['jquery', 'underscore', 'knockout', 'domain', 'messagequeue'],
function($, _, ko, domain, mq) {
    'use strict';
    
    var model = {
        create: function() {
            
            return Object.create(this);
        }
    };
    
    return model;
});