/*jslint browser: true, nomen: true, regexp: true, vars: true, white: true */
/*global define, window, console, describe, it, before, beforeEach, after, afterEach */

define(['jquery', 'underscore', 'knockout', 'messagequeue', 'path', 'fs'],
function($, _, ko, mq, path, fs) {
    'use strict';
    
    function ViewModel(params) {
        this.files = ko.observableArray();
    }
    ViewModel.prototype = {
        addFile: function(model, event) {
            var path = require('path'),
                file = $(event.currentTarget).val();
            
            console.log('[file-list:addFile]', arguments, file);
            model.files.push({
                name: path.basename(file),
                path: file
            });
        },
        merge: function(model, event) {
            console.log('[file-list:merge]', arguments);
            var fs = require('fs'),
                merge = {};
            _.each(model.files(), function(file) {
                console.log('[file-list:merge]', file.name);
                var content = fs.readFileSync(file.path, { encoding: 'utf-8'});
                var list = content.match(/[^=\n]+\s*=\s*.*/mig);
                _.each(list, function(property) {
                    property.replace(/([^=\n]+)\s*=\s*(.*)/, function(match, key, value) {
                        merge[key] = value;
                    });
                });
            });
            console.log('[file-list:merge]', merge);
            mq.publish('file-merged-object', merge);
        }
    };
    
    return {
        viewModel: ViewModel,
        template: { require: 'text!templates/file-list.html' }
    };
});