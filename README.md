# react-i13n-ga

Google Analytics plugin for [react-i13n](https://github.com/yahoo/react-i13n)

[![npm version](https://badge.fury.io/js/react-i13n-ga.svg)](http://badge.fury.io/js/react-i13n-ga) [![Build Status](https://travis-ci.org/kaesonho/react-i13n-ga.svg?branch=master)](https://travis-ci.org/kaesonho/react-i13n-ga)

## Features
* Integrate [react-i13n](https://github.com/yahoo/react-i13n) to provide instrumentation approach using [Google Analytics](http://www.google.com/analytics/).
* [react-i13n](https://github.com/yahoo/react-i13n) handles the beaconing management and handle the click events, this plugin provides [event handlers](https://github.com/yahoo/react-i13n/blob/master/docs/guides/createPlugins.md) to handle these events and firing `ga beacons`.

## Install

```
npm install react-i13n-ga
```

## Usage
You will need to create a instance of `react-i13n-ga` first, then use `getPlugin` to get the plugin object, then pass it into [setupI13n](https://github.com/yahoo/react-i13n/blob/master/docs/api/setupI13n.md) provided by [react-i13n](https://github.com/yahoo/react-i13n), then it will help to decorate your `Top Level Component` with i13n `react-i13n-ga` plugin functionalities.

```js
var reactI13nGoogleAnalytics = require('react-i13n-ga');
var setupI13n = require('react-i13n').setupI13n;

var reactI13nGoogleAnalytics = new ReactI13nGoogleAnalytics([your tracking id]); // create reactI13nGoogleAnalytics instance with your tracking id
// or
var reactI13nGoogleAnalytics = new ReactI13nGoogleAnalytics({
    trackingId: [mandatory, your tracking id],
    cookieDomain: [optional, cookie domain name, by default "auto"],
    name: [optional, customized tracker name],
    userId: [optional]
}); // create reactI13nGoogleAnalytics instance with config object

// Suppose that Application is your top level component, use setupI13n with this plugin
Application = setupI13n(Application, {}, [reactI13nGoogleAnalytics.getPlugin()]);
```

## Pageview Event
* Integrate [page tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/pages),

```js
var ReactI13n = require('react-i13n').ReactI13n;

// fire pageview at whatever you want, typically we do it at componentDidMount
ReactI13n.getInstance().execute('pageview', {
    tracker: [tracker name], // optional
    location: [page location], // get the page location, or keep empty to let google analytics handle it
    url: [page url], // get the page url, or keep empty to let google analytics handle it
    title: [page title] // get the page title, or keep empty to let google analytics handle it
});

// in component (React 0.14+)
this.props.i13n.executeEvent('pageview', {
    tracker: [tracker name], // optional
    location: [page location],
    url: [page url],
    title: [page title]
});
```

## Click Event
* Integrate [event tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)
* Define the keys in `i13nModel`:
   * `tracker` - tracker name, default is undefined.
   * `category` - Typically the object that was interacted with, default set as `all`.
   * `action` - The type of interaction, default set as `click`.
   * `label` - Useful for categorizing events, default set as the value of [i13nNode.getText](https://github.com/yahoo/react-i13n/blob/master/docs/api/I13nNode.md#gettexttarget).
   * `value` - Values must be non-negative. Useful to pass counts (e.g. 4 times).
   * `nonInteraction` - Boolean to indicate a [non-interaction event](https://support.google.com/analytics/answer/1033068#NonInteractionEvents).


You can integrate I13nAnchor provided by react-i13n to track the normal links.

```js
var I13nAnchor = require('react-i13n').I13nAnchor;

// in template, will fire event beacon as ga('send', 'event', 'foo', 'click', 'Foo');
<I13nAnchor i13nModel={{category: 'foo', action: 'click'}}>Foo</I13nAnchor>
```
You can also integrate integrate [createI13nNode](https://github.com/yahoo/react-i13n/blob/master/docs/api/createI13nNode.md#createi13nnodecomponent-options) or [I13nMixin](https://github.com/yahoo/react-i13n/blob/master/docs/api/createI13nNode.md#i13nmixin) to get your custom component be tracked

```js

var createI13nNode = require('react-i13n').createI13nNode;
var Foo = React.createClass({
    ...
});

Foo = createI13nNode(Foo, {
    isLeafNode: true,
    bindClickEvent: true,
    follow: false
});

// in template
<Foo i13nModel={{category: 'foo', action: 'click', label: 'Foo'}}>
    // if Foo is clicked, it will fire event beacon as ga('send', 'event', 'foo', 'click', 'Foo');
    ...
</Foo>
```

```js

var I13nMixin = require('react-i13n').I13nMixin;
var Foo = React.createClass({
    mixins: [I13nMixin],
    // you can set the default props or pass them as props when you are using Foo
    getDefaultProps: {
        isLeafNode: true,
        bindClickEvent: true,
        follow: false
    }
    ...
});

// in template
<Foo i13nModel={{category: 'foo', action: 'click', label: 'Foo'}}>
    // if Foo is clicked, it will fire event beacon as ga('send', 'event', 'foo', 'click', 'Foo');
    ...
</Foo>
```

For better instrumentation integration, you can leverage the [inherit architecture](https://github.com/yahoo/react-i13n/blob/master/docs/guides/integrateWithComponents.md), e.g., create a parent and define the `category` with default tracker, or specify `tracker`, so that all the links inside will apply it.

```js

var createI13nNode = require('react-i13n').createI13nNode;
var I13nAnchor = require('react-i13n').createI13nNode;
var Foo = React.createClass({
    ...
    render: function () {
        return (
            // all the links inside Foo will apply category=foo as their i13n model
            <I13nAnchor href="/foo">...</I13nAnchor>
            <I13nAnchor href="/bar">...</I13nAnchor>
            <I13nAnchor href="/baz">...</I13nAnchor>
        );
    }
});

Foo = createI13nNode(Foo, {
    isLeafNode: false,
    bindClickEvent: false,
    follow: false
});

// in template
<Foo i13nModel={{tracker: 'myTracker', category: 'foo'}} />
```


## Tracker Settings

You can also use the following methods to set properties of GA like [User Id](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id) or [dimension](https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets).

```js
var userId = 'aa4ebd41203df5b8639e9fe48d4c6c7de7c4b053';
var dimension1 = 'administrator';
ReactI13n.getInstance().execute('setUsername', { userId: userId });
ReactI13n.getInstance().execute('setSuperProperties', { dimension1: dimension1 });
ReactI13n.getInstance().execute('setUserProperties', { dimension1: dimension1 });
ReactI13n.getInstance().execute('setUserPropertiesOnce', { dimension1: dimension1 });
```

## ga command queue
* [ga command queue](https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference)

You can also execute ga command queue by calling executeEvent.  It's also possible to execute  command on specific *tracker* . The following are sample usage:
```js
// send by default tracker
this.props.i13n.executeEvent('command', {
    commandName: 'send',
    arguments: [
        hitType,
        [...fields],
        [fieldsObject])
    ]
});

// send by specific tracker
this.props.i13n.executeEvent('command', {
    tracker: 'myTracker', // tracker name: myTracker
    commandName: 'send',
    arguments: [
       ...
    ]
});

// require on default tracker
this.props.i13n.executeEvent('command', {
    commandName: 'require',
    arguments: [
        pluginName,
        [pluginOptions]
    ]
});

// require plugin for specific tracker
this.props.i13n.executeEvent('command', {
    tracker: 'myTracker',
    commandName: 'require',
    arguments: [
       ...
    ]
});

// more and more, such as ga('[myTracker.]set', ...)
// ...
```
