/*jslint browser: true, nomen: true, regexp: true, vars: true, white: true */
/*global define, window, console, describe, it, before, beforeEach, after, afterEach */

define(['jquery', 'underscore', 'knockout', 'domain', 'messagequeue', 'lib/codemirror'],
function($, _, ko, domain, mq, CodeMirror) {
    'use strict';
    
    function setupEditor(element, mode, options, bindings) {
		options = options || {};
		options.mode = mode;
		options.onChange = function(cm) {
			console.log("[Editor:onChange]");
			bindings.value(cm.getValue());
		};
		var editor = CodeMirror.fromTextArea(element, options);
		editor.on('change', function(cm) {
			console.log("[Editor:on:change]");
            bindings.value(cm.getValue());
        });
		element.editor = editor;
		if (bindings.value()) {
			_.debounce(function() {
			console.log("[Editor:value]");
				editor.setValue(bindings.value());
			});
		}
		editor.refresh();
		var wrapper = $(editor.getWrapperElement());
		function resizer() {
			console.log("[Editor:resizer]");
			_.debounce(function() {
				editor.refresh();
			});
		}
		$(window).resize(resizer);
		ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
			console.log("[Editor:dispose]");
            wrapper.remove();
            $(window).off("resize", resizer);
        });
		
	}
	var editors = {
		css: function(element, options, bindings) {
			setupEditor(element, "css", options, bindings);
		},
		html: function(element, options, bindings) {
			setupEditor(element, "htmlmixed", options, bindings);
		},
		xml: function(element, options, bindings) {
			setupEditor(element, "xml", options, bindings);
		},
		js: function(element, options, bindings) {
			setupEditor(element, "javascript", options, bindings);
		}
	};
	ko.bindingHandlers.editor = {
		init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			console.log("[ko:editor:init]", arguments);
			var mode = ko.utils.unwrapObservable(valueAccessor());
			if (editors.hasOwnProperty(mode)) {
				editors[mode](element, allBindings.get('codemirror'), allBindings());
			}
		},
		
		update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			console.log("[ko:editor:update]", arguments);
			if(element.editor) {
                element.editor.refresh();
            }
		}
	};
    
    function FileModel() {
        this.show = ko.observable(false);
        this.name = ko.observable();
        this.href = ko.observable();
        this.content = ko.observable();
    }
    FileModel.prototype = {
        set: function(params) {
            this.name(params.name);
            this.href(params.href);
            this.content(params.content);
            this.show(true);
        },
        
        clear: function() {
            this.show(false);
            this.name("");
            this.href("");
            this.content("");
        },
        
        toJson: function() {
            return {
                name: this.name(),
                href: this.href(),
                content: this.content()
            };
        },
        
        toString: function() {
            return JSON.stringify(this.toJson());
        }
    };
    
    function ViewModel(params) {
        var model = this;
        
        this.show = ko.observable();
        this.file1 = new FileModel();
        this.file2 = new FileModel();
        
        this.single = ko.pureComputed(function() {
            return this.show() ? "two" : "one";
        }, this.file2);
        
        var subscription = params.value.subscribe(function(value) {
            console.log('[popup:ViewModel]', value);
            if (value.file2) {
                model.file2.set(value.file2);
            }
            if (value.file1) {
                model.file1.set(value.file1);
                model.show(true);
            }
        });
        
        this.save = function(model) {
            console.log('[popup:ViewModel:save]', model.file1.toString(), model.file2.toString());
            domain.save('file', { file1: model.file1.toString(), file2: model.file2.toString() }, function() {
                console.log('[popup:ViewModel:save:domain]', arguments);
                model.show(false);
                model.file1.clear();
                model.file2.clear();
            });
        };
        
        this.dispose = function() {
            this.single.dispose();
            subscription.dispose();
        };
    }
    ViewModel.prototype = {
        save: function () {
            console.log('[popup:ViewModel:save', arguments);
            this.show(false);
            //TODO: save changes
        },
        
        close: function () {
            console.log('[popup:ViewModel:close', arguments);
            this.show(false);
            this.file1.clear();
            this.file2.clear();
        },
        
        dispose: function() {
            console.log('[popup:ViewModel:dispose]', arguments);
        }
    };
    
    return {
        viewModel: ViewModel,
        template: { require: 'text!templates/popup.html' }
    };
});