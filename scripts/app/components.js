/*jslint browser: true, nomen: true, regexp: true, vars: true, white: true */
/*global define, window, console, describe, it, before, beforeEach, after, afterEach */

define(['knockout'],
function(ko) {
    'use strict';
    console.log('[components] register components');
    
    ko.components.register('show', { require: 'app/components/show-model' });
    ko.components.register('edit', { require: 'app/components/edit-model' });
    
    ko.components.register('board', { require: 'app/components/board' });
    ko.components.register('panel', { require: 'app/components/panel' });
    
    ko.components.register('file-list', { require: 'app/components/file-list' });
    ko.components.register('merge-result', { require: 'app/components/merge-result' });
});