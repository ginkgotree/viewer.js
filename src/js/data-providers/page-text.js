/**
 * @fileoverview A standard data provider for page text
 * @author nsilva
 */
Crocodoc.addDataProvider('page-text', function(scope) {
    'use strict';

    var ajax = scope.getUtility('ajax');

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        /**
         * Retrieve a model object from the server
         *
         * @param {string} modelName The caller will pass the modelName ('page-svg', etc) just in case
         * @param {string} url       The full path to the asset on the server
         * @returns {$.Promise}      A promise with an additional abort() method that will abort the XHR request.
         */
        get: function(modelName, url) {
            return ajax.fetch(url, 1);
        }
    };
});
