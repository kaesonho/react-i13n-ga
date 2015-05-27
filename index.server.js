var ReactI13nGoogleAnalytics = function (trackingId) {
};

ReactI13nGoogleAnalytics.prototype.getPlugin = function () {
    return {
        name: 'ga',
        eventHandlers: {
            pageview: function (payload, callback) {
            },
            click: function (payload, callback) {
            }
        }
    };
}

module.exports = ReactI13nGoogleAnalytics;
