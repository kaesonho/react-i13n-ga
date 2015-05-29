# react-i13n-ga

Google Analytics plugin for react-i13n

## Features
 * Integrate [react-i13n](https://github.com/yahoo/react-i13n) to provide instrumentation approach using [Google Analytics](http://www.google.com/analytics/).
 * Provide [event handlers](https://github.com/yahoo/react-i13n/blob/master/docs/guides/createPlugins.md) to handle pageview and click events.

## Usage
```js
var reactI13nGoogleAnalytics = require('react-i13n-ga');
var setupI13n = require('react-i13n').setupI13n;
var reactI13nGoogleAnalytics = new ReactI13nGoogleAnalytics([your tracking id]); 
Application = setupI13n(Application, {}, [reactI13nGoogleAnalytics.getPlugin()]);
```

## Pageview Event
 * Integrate [page tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/pages), 

```js
var ReactI13n = require('react-i13n').ReactI13n;

// fire pageview at whatever you want, typically we do it at componentDidMount
ReactI13n.getInstance().execute('pageview', {
    page: [page url], // get the page url, or keep empty to let google analytics handle it
    title: [page title] // get the page title, or keep empty to let google analytics handle it
});
```

## Click Event
 * Integrate [event tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)
 * Define the keys in `i13nModel`:
    * `category` - Typically the object that was interacted with, default set as `all`.
    * `action` - The type of interaction, default set as `click`.
    * `label` - Useful for categorizing events, default set as the value of [i13nNode.getText](https://github.com/yahoo/react-i13n/blob/master/docs/api/I13nNode.md#gettexttarget).
    * `value` - Values must be non-negative. Useful to pass counts (e.g. 4 times).

## Install

```
npm install react-i13n-ga
```
