/**
 * @fileoverview A standard data provider for page text
 * @author nsilva
 * @author lakenen
 */
Crocodoc.addDataProvider('page-text', function(scope) {
    'use strict';

    var MAX_TEXT_BOXES = 256;

    var util = scope.getUtility('common'),
        ajax = scope.getUtility('ajax'),
        config = scope.getConfig();

    /**
     * Process HTML text and return the embeddable result
     * @param   {string} text The original HTML text
     * @returns {string}      The processed HTML text
     * @private
     */
    function processTextContent(text) {
        // in the text layer, divs are only used for text boxes, so
        // they should provide an accurate count
        var numTextBoxes = util.countInStr(text, '<div');
        // too many textboxes... don't load this page for performance reasons
        if (numTextBoxes > MAX_TEXT_BOXES) {
            return;
        }

        // remove reference to the styles
        text = text.replace(/<link rel="stylesheet".*/, '');

        return text;
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        /**
         * Retrieve a text asset from the server
         *
         * @param {string} modelName The name of the requested model (page-text)
         * @param {number} pageNum   The page number for which to request the text HTML
         * @returns {$.Promise}      A promise with an additional abort() method that will abort the XHR request.
         */
        get: function(modelName, pageNum) {
            var textPath = util.template(config.template.html, { page: pageNum }),
                url = config.url + textPath + config.queryString,
                $promise = ajax.fetch(url, Crocodoc.ASSET_REQUEST_RETRIES);

            // @NOTE: promise.then() creates a new promise, which does not copy
            // custom properties, so we need to create a futher promise and add
            // an object with the abort method as the new target
            return $promise.then(processTextContent).promise({
                abort: $promise.abort
            });
        }
    };
});
