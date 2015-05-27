var DEFAULT_CATEGORY = 'all';
var DEFAULT_ACTION = 'click';
var DEFAULT_LABEL = '';

/**
 * @class ReactI13nGoogleAnalytics
 * @param {String} tracking id
 * @constructor
 */
var ReactI13nGoogleAnalytics = function (trackingId) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', trackingId, 'auto');
};

/**
 * get plugin object
 * @method getPlugin
 * @return {Object} plugin object
 */
ReactI13nGoogleAnalytics.prototype.getPlugin = function () {
    return {
        name: 'ga',
        eventHandlers: {
            /**
             * pageview handler
             * @method pageview
             * @param {Object} payload payload object
             * @param {Object} payload.title page title
             * @param {Object} payload.url current url
             * @param {Function} calback callback function
             */
            pageview: function (payload, callback) {
                ga('send', 'pageview', {
                    page: payload.url,
                    title: payload.title,
                    hitCallback: callback
                });
            },

            /**
             * pageview handler
             * @method pageview
             * @param {Object} payload payload object
             * @param {Object} payload.title page title
             * @param {Object} payload.url current url
             * @param {Function} calback callback function
             */
            click: function (payload, callback) {
                var i13nNode = payload.i13nNode;
                var params = ['send', 'event']
                if (i13nNode) {
                    var model = i13nNode.getMergedModel();
                    params.push(model.category || DEFAULT_CATEGORY);
                    params.push(model.action || DEFAULT_ACTION);
                    params.push(model.label || i13nNode.getText(payload.target) || DEFAULT_LABEL);
                    if (model.value) {
                        params.push(model.value);
                    }
                    params.push({
                        hitCallback: callback
                    });
                    ga.apply(this, params);
                } else {
                    callback();
                }
            }
        }
    };
}

module.exports = ReactI13nGoogleAnalytics;
