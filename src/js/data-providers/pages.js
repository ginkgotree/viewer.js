/**
 * @fileoverview A standard data provider for page elements
 * @author nsilva
 */
Crocodoc.addDataProvider(['page-text', 'page-svg'], function(scope) {
    'use strict';

    var ajax = scope.getUtility('ajax');

    /**
     *
     * @param {string} assetSrc A url for a page-svg or page-text asset
     * @returns {$.Promise}     A promise with an additional abort() method that will abort the XHR request.
     */
    function getAsset(assetSrc) {
        var $deferred = $.Deferred();

        var request = ajax.request(assetSrc, {
            success: function () {
                if (this.responseText.length === 0) {
                    $deferred.reject({
                        error: 'empty response',
                        status: this.status,
                        resource: assetSrc
                    });
                } else {
                    $deferred.resolve(this.responseText);
                }
            },
            fail: function () {
                $deferred.reject({
                    error: this.statusText,
                    status: this.status,
                    resource: assetSrc
                });
            }
        });

        return $deferred.promise({
            abort: function() {
                $deferred.reject();
                request.abort();
            }
        });
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        /**
         * Retrieve a model object from the server
         *
         * @param {string} modelName The caller will pass the modelName ('page-svg', etc) just in case
         * @param {string} src       The full path to the asset on the server
         * @returns {$.Promise}      A promise with an additional abort() method that will abort the XHR request.
         */
        get: function(modelName, src) {
            return getAsset(src);
        }
    };
});
