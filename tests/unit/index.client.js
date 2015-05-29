var expect = require('chai').expect;
var jsdom = require('jsdom');
var I13nNode = require('react-i13n').I13nNode;
var gaPlugin;
'use strict';

describe('ga plugin client', function () {
    beforeEach(function (done) {
        jsdom.env('<html><head><script src="foo"/></head><body></body></html>', [], function (err, window) {
            global.window = window;
            global.document = window.document;
            global.navigator = window.navigator;
            global.location = window.location;
            global.ga = function () {};

            ReactI13nGoogleAnalytics = require('../../index.client');
            done();
        });
    });

    it('ga will be created once we create a plugin instance', function (done) {
        var mockTrackingId = 'foo';
        global.ga = function (actionName, trackingId) {
            expect(actionName).to.eql('create');
            expect(trackingId).to.eql(mockTrackingId);
            done();
        };
        var reactI13nGoogleAnalytics = new ReactI13nGoogleAnalytics(mockTrackingId);
    });
    
    it('ga will fire pageview beacon for pageview handler', function (done) {
        var reactI13nGoogleAnalytics = new ReactI13nGoogleAnalytics('foo');
        global.ga = function (actionSend, actionName, options) {
            expect(actionSend).to.eql('send');
            expect(actionName).to.eql('pageview');
            expect(options.page).to.eql('/foo');
            expect(options.title).to.eql('Foo');
            options.hitCallback && options.hitCallback();
        };
        reactI13nGoogleAnalytics.getPlugin().eventHandlers.pageview({
            url: '/foo',
            title: 'Foo'
        }, function beaconCallback () {
            done();
        });
    });
    
    it('ga will fire event beacon for click handler', function (done) {
        var reactI13nGoogleAnalytics = new ReactI13nGoogleAnalytics('foo');
        var i13nNode = new I13nNode(null, {category: 'foo', action: 'bar', label: 'baz', value: 1});
        global.ga = function (actionSend, actionName, category, action, label, value, options) {
            expect(actionSend).to.eql('send');
            expect(actionName).to.eql('pageview');
            expect(category).to.eql('foo');
            expect(action).to.eql('bar');
            expect(label).to.eql('baz');
            expect(value).to.eql(1);
            options.hitCallback && options.hitCallback();
        };
        reactI13nGoogleAnalytics.getPlugin().eventHandlers.click({
        }, function beaconCallback () {
            done();
        });
    });
}); 
