/*jslint browser: true, nomen: true, regexp: true, vars: true, white: true */
/*global define, window, console, describe, it, before, beforeEach, after, afterEach */

define(['knockout', 'messagequeue'],
function(ko, mq) {
    'use strict';
    
    function ViewModel(params) {
        var filelist = ko.utils.unwrapObservable(params.value);
        
        console.log('[api:selected:filelist:ViewModel]', filelist);
        
        this.scenarios = ko.observableArray(filelist.scenarios);
        this.scenario = ko.observable(filelist.scenarios[Object.keys(filelist.scenarios)[0]]);
        this.fileList = ko.observableArray(filelist[this.scenario()]);
        
        var model = this;
        
        this.select = function(selected) {
            console.log('[api:selected:filelist:ViewModel:select]', selected, arguments);
            model.scenario(selected);
            model.fileList(filelist[selected]);
        };
        
        this.selectFile = function(selected) {
            console.log('[api:selected:filelist:ViewModel:select]', selected, arguments);
            selected.config = filelist.config;
            mq.publish('popup', selected);
        };
        
        this.active = function(selected) {
            console.log('[api:selected:filelist:ViewModel:active]', selected, model.scenario());
            return (selected === model.scenario());
        };
        
        var subscription = params.value.subscribe(function(filelist) {
            this.scenarios(filelist.scenarios);
            this.scenario(filelist.scenarios[Object.keys(filelist.scenarios)[0]]);
            this.fileList(filelist[this.scenario()]);
        });
        
        this.dispose = function() {
            console.log('[api:selected:filelist:ViewModel:dispose]', arguments);
            subscription.dispose();
        };
    }
    ViewModel.prototype = {};
    
    return {
        viewModel: ViewModel,
        template: { require: 'text!templates/file-list.html' }
    };
});