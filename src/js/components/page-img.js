/**
 * @fileoverview page-img component
 * @author clakenen
 */

/**
 * page-img component used to display raster image instead of SVG content for
 * browsers that do not support SVG
 */
Crocodoc.addComponent('page-img', function (scope) {

    'use strict';

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    var browser = scope.getUtility('browser');

    var $img, $el,
        $loadImgPromise,
        page,
        removeOnUnload = browser.mobile;

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        /**
         * Initialize the page-img component
         * @param  {Element} el     The element to insert the image into
         * @param  {number} pageNum The page number
         * @returns {void}
         */
        init: function (el, pageNum) {
            $el = $(el);
            page = pageNum;
        },

        /**
         * Destroy the page-img component
         * @returns {void}
         */
        destroy: function () {
            $el.empty();
        },

        /**
         * Preload does nothing in this component -- it's here for
         * consistency with the page-svg component API
         * @returns {void}
         */
        preload: function () { /* noop */ },

        /**
         * Load the image
         * @returns {$.Promise}    A jQuery Promise object
         */
        load: function () {
            if (!$loadImgPromise) {
                $loadImgPromise = scope.get('page-img', page)
                    .then(function loadImgSuccess(img) {
                        $img = $(img).appendTo($el);
                    })
                    .fail(function loadImgFail(error) {
                        if (error) {
                            scope.broadcast('asseterror', error);
                        }
                    });
            }
            return $loadImgPromise;
        },

        /**
         * Unload (or hide) the img
         * @returns {void}
         */
        unload: function () {
            if ($loadImgPromise) {
                $loadImgPromise.abort();
                $loadImgPromise = null;
            }
            if ($img && removeOnUnload) {
                $img.remove();
                $img = null;
            } else if ($img) {
                $img.hide();
            }
        }
    };
});
