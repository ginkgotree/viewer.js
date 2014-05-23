/**
 * @fileoverview A standard data provider for page elements
 * @author nsilva
 * @author lakenen
 */
Crocodoc.addDataProvider('page-svg', function(scope) {
    'use strict';

    var MAX_DATA_URLS = 1000;

    var util = scope.getUtility('common'),
        ajax = scope.getUtility('ajax'),
        browser = scope.getUtility('browser'),
        subpx = scope.getUtility('subpx'),
        config = scope.getConfig(),
        baseURL = util.makeAbsolute(config.url);

    /**
     * Process SVG text and return the embeddable result
     * @param   {string} text The original SVG text
     * @returns {string}      The processed SVG text
     * @private
     */
    function processSVGContent(text) {
        var query = config.queryString.replace('&', '&#38;'),
            dataUrlCount,
            stylesheetHTML;

        dataUrlCount = util.countInStr(text, 'xlink:href="data:image');
        // remove data:urls from the SVG content if the number exceeds MAX_DATA_URLS
        if (dataUrlCount > MAX_DATA_URLS) {
            // remove all data:url images that are smaller than 5KB
            text = text.replace(/<image[\s\w-_="]*xlink:href="data:image\/[^"]{0,5120}"[^>]*>/ig, '');
        }

        // @TODO: remove this, because we no longer use any external assets in this way
        // modify external asset urls for absolute path
        text = text.replace(/href="([^"#:]*)"/g, function (match, group) {
            return 'href="' + baseURL + group + query + '"';
        });

        // CSS text
        stylesheetHTML = '<style>' + config.cssText + '</style>';

        // If using Firefox with no subpx support, add "text-rendering" CSS.
        // @NOTE(plai): We are not adding this to Chrome because Chrome supports "textLength"
        // on tspans and because the "text-rendering" property slows Chrome down significantly.
        // In Firefox, we're waiting on this bug: https://bugzilla.mozilla.org/show_bug.cgi?id=890692
        // @TODO: Use feature detection instead (textLength)
        if (browser.firefox && !subpx.isSubpxSupported()) {
            stylesheetHTML += '<style>text { text-rendering: geometricPrecision; }</style>';
        }

        // inline the CSS!
        text = text.replace(/<xhtml:link[^>]*>/, stylesheetHTML);

        return text;
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        /**
         * Retrieve a SVG asset from the server
         *
         * @param {string} modelName The name of the requested model (page-svg)
         * @param {number} pageNum   The page number for which to request the SVG
         * @returns {$.Promise}      A promise with an additional abort() method that will abort the XHR request.
         */
        get: function(modelName, pageNum) {
            var svgPath = util.template(config.template.svg, { page: pageNum }),
                url = baseURL + svgPath + config.queryString,
                $promise = ajax.fetch(url, 1);

            return $promise.then(processSVGContent).promise({
                abort: $promise.abort
            });
        }
    };
});
