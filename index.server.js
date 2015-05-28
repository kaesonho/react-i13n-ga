var ReactI13nGoogleAnalytics = function (trackingId) {
};

ReactI13nGoogleAnalytics.prototype.getPlugin = function () {
    return {
        name: 'ga',
        eventHandlers: {
            pageview: function (payload, callback) {
                // we are able to fire server side beacon,
                // and we can execute pageview event on componentWillMount to make it happen on server side
                // do nothing for now
            }
        }
    };
}

module.exports = ReactI13nGoogleAnalytics;
