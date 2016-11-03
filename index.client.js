'use strict';
var debug = require('debug')('GAI13nPlugin');
var DEFAULT_CATEGORY = 'all';
var DEFAULT_ACTION = 'click';
var DEFAULT_LABEL = '';
var DEFAULT_VALUE = 0;
var DEFAULT_TRANSPORT = 'none';
var DEFAULT_NON_INTERACTION = false;

var _command = function (payload, callback) {
    ga.apply(this, [(payload.tracker ? (payload.tracker + '.') : '') + payload.commandName].concat(payload.arguments));
    callback && callback();
};
/**
 * @class ReactI13nGoogleAnalytics
 * @param {String} tracking id
 * @constructor
 */
var ReactI13nGoogleAnalytics = function (config) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    var _config = config || {},
        trackingId = '';

    trackingId = typeof(config) == 'object' ? config.trackingId : config;

    if (!trackingId) {
        debug('trackingId is mandatory');
    }

    ga('create', {
        trackingId: trackingId,
        cookieDomain: _config.cookieDomain || 'auto',
        name: _config.name || undefined,
        userId: _config.userId || undefined
    });
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
             * @param {Object} payload.tracker page title
             * @param {Object} payload.title page title
             * @param {Object} payload.location page location
             * @param {Object} payload.url current url
             * @param {Function} calback callback function
             */
            pageview: function (payload, callback) {
                var args = {},
                    argsKeys = ['location', 'page', 'title'];

                argsKeys.forEach(function consumer(prop) {
                    if (payload.hasOwnProperty(prop)) {
                        args[prop] = payload[prop];
                    }
                });

                args.hitCallback = callback;
                // `page` is alias to `url`
                if (payload.hasOwnProperty('url')) {
                    args.page = payload.url
                }

                _command.call(this, {
                    tracker: payload.tracker || '',
                    commandName: 'send',
                    arguments: [
                        'pageview',
                        args
                    ]
                });
            },

            /**
             * click handler
             * @method pageview
             * @param {Object} payload payload object
             * @param {Object} payload.category category
             * @param {Object} payload.action action
             * @param {Object} payload.label label
             * @param {Function} calback callback function
             */
            click: function (payload, callback) {
                var i13nNode = payload.i13nNode;
                if (i13nNode) {
                    var model = i13nNode.getMergedModel();
                    var hitType = 'event';
                    var params = {
                        hitType: hitType,
                        eventCategory: model.category || DEFAULT_CATEGORY,
                        eventAction: model.action || DEFAULT_ACTION,
                        eventLabel: model.label || i13nNode.getText(payload.target) || DEFAULT_LABEL,
                        eventValue: model.value || DEFAULT_VALUE,
                        transport: model.transport || DEFAULT_TRANSPORT,
                        nonInteraction: model.nonInteraction || DEFAULT_NON_INTERACTION,
                        hitCallback: callback
                    };
                    _command.call(this, {
                        tracker: model.tracker || '',
                        commandName: 'send',
                        arguments: [
                            hitType,
                            params
                        ]
                    });
                } else {
                    callback && callback();
                }
            },

            setUsername: function (properties) {
                _command.call(this, {
                    commandName: 'set',
                    arguments: [
                        'userId',
                        properties.userId
                    ]
                });
            },
            setSuperProperties: function (properties) {
                _command.call(this, {
                    commandName: 'set',
                    arguments: [
                        properties
                    ]
                });
            },
            setUserProperties: function (properties) {
                _command.call(this, {
                    commandName: 'set',
                    arguments: [
                        properties
                    ]
                });
            },
            setUserPropertiesOnce: function (properties) {
                _command.call(this, {
                    commandName: 'set',
                    arguments: [
                        properties
                    ]
                });
            },

            /**
             * expose cmd interface to execute ga command
             * @method command
             * @param {Object} payload payload object
             * @param {Object} payload.tracker tracker
             * @param {Object} payload.commandName command
             * @param {Function} calback callback function
             */
            command: _command.bind(this)
        }
    };
}

module.exports = ReactI13nGoogleAnalytics;
