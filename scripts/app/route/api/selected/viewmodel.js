/*jslint browser: true, nomen: true, regexp: true, vars: true, white: true */
/*global define, window, console, describe, it, before, beforeEach, after, afterEach */

define(['knockout', 'domain'],
function(ko, domain) {
    'use strict';
    
    function ViewModel(params) {
        var api = ko.utils.unwrapObservable(params.value);
        var selected = ko.utils.unwrapObservable(params.selected);
        var config = ko.utils.unwrapObservable(params.config);
        console.log('[api:selected:ViewModel]', api, selected, config);
        
        this.title = ko.observable(selected);
        this.api = ko.observable(api[selected]);
        this.fileList = ko.observableArray();
        
        var model = this;
        domain.fileList({config: config, api: selected}, function(data) {
            console.log('[api:selected:ViewModel:fileList]', data);
            model.fileList(data);
        });
        
        var subscription = params.selected.subscribe(function(selected) {
            model.title(selected);
            model.api(api[selected]);
            model.fileList(null);
            
            domain.fileList({config: config, api: selected}, function(data) {
                console.log('[api:selected:ViewModel:fileList]', data);
                model.fileList(data);
            });
        });
        
        this.select = function(file) {
            console.log('[api:selected:ViewModel:select]', arguments);
            mq.publish('popup', file);
        };
        
        this.dispose = function() {
            console.log('[api:selected:ViewModel:dispose]', arguments);
            subscription.dispose();
        };
    }
    ViewModel.prototype = {};
    
    return {
        viewModel: ViewModel,
        template: { require: 'text!templates/selected-api.html' }
    };
});