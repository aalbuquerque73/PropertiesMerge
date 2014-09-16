/*jslint browser: true, nomen: true, regexp: true, vars: true, white: true */
/*global define, window, console, describe, it, before, beforeEach, after, afterEach */

define(['underscore', 'knockout', 'messagequeue'],
function(_, ko, mq) {
    'use strict';
    
    function ViewModel(params) {
        this.text = ko.observable();
        this.object = ko.observable();
        
        var subscription = mq.subscribe('file-merged-object', function(object) {
            console.log('[merge-result:subscription]', object);
            var result = {};
            var text = "";
            _.each(object, function(value, key) {
                result[key] = ko.observable(value);
                text += key + "=" + value + "\n";
            });
            this.object(result);
            this.text(text);
        }, this);
        
        this.dispose = function() {
            subscription.dispose();
        };
    }
    ViewModel.prototype = {};
    
    return {
        viewModel: ViewModel,
        template: { require: 'text!templates/merge-result.html' }
    };
});