CLNDR.js
========

CLNDR is a jQuery calendar plugin. It was created- you've heard this before- out of frustration with the lack of truly dynamic front-end calendar plugins out there.

See a demo: [kylestetz.github.io/CLNDR/](http://kylestetz.github.io/CLNDR/)

--------

#### Clndr.js version 2.0 is coming
If you are using clndr.js and have any feedback or ideas about a new version, please take a moment to contribute to [#151](https://github.com/kylestetz/CLNDR/issues/151). If you are interested in helping to develop the new version, give a shout in [#136](https://github.com/kylestetz/CLNDR/issues/136). Thanks!

--------

- [Download](https://github.com/kylestetz/CLNDR#download)
- [Dependencies](https://github.com/kylestetz/CLNDR#dependencies)
  - [Using Bower](https://github.com/kylestetz/CLNDR#using-bower)
  - [Clndr using Angular.js](https://github.com/kylestetz/CLNDR#clndr-using-angular)
  - [Clndr using Rails](https://github.com/kylestetz/CLNDR#clndr-using-rails)
- [Introduction: You Write The Markup](https://github.com/kylestetz/CLNDR#introduction-you-write-the-markup)
  - [The 'days' Array](https://github.com/kylestetz/CLNDR#the-days-array)
  - [Pass in your Events](https://github.com/kylestetz/CLNDR#pass-in-your-events)
- [Usage](https://github.com/kylestetz/CLNDR#usage)
  - [Multi-day Events](https://github.com/kylestetz/CLNDR#multi-day-events)
  - [Custom Classes](https://github.com/kylestetz/CLNDR#custom-classes)
  - [Constraints & Datepickers](https://github.com/kylestetz/CLNDR#constraints--datepickers)
  - [Returning the Instance / API](https://github.com/kylestetz/CLNDR#returning-the-instance--public-api)
  - [Template Requirements](https://github.com/kylestetz/CLNDR#template-requirements)
- [Configuration](https://github.com/kylestetz/CLNDR#some-configuration)
  - [Template Rendering Engine](https://github.com/kylestetz/CLNDR#template-rendering-engine)
  - [Internationalization](https://github.com/kylestetz/CLNDR#internationalization)
  - [Underscore Template Delimiters](https://github.com/kylestetz/CLNDR#underscore-template-delimiters)
  - [Internet Explorer Issues](https://github.com/kylestetz/CLNDR#internet-explorer-issues)
- [Changelog](https://github.com/kylestetz/CLNDR#changelog)

Download
--------

- development ~ [clndr.js](https://raw.github.com/kylestetz/CLNDR/master/src/clndr.js)
- production ~ [clndr.min.js](https://raw.github.com/kylestetz/CLNDR/master/clndr.min.js)

Returning to grab a new version? Have a look at the [changelog](https://github.com/kylestetz/CLNDR#changelog) to see what's new.

If you'd like to run some tests in a particular browser or environment, `example/test.html` contains a list of basic functionality tests. When contributing, please run these (and add to them when appropriate) before submitting a pull request!

Dependencies
------------

[jQuery](http://jquery.com/download/) and [Moment.js](http://momentjs.com/) are depended upon. By default CLNDR tries to use [Underscore.js](http://underscorejs.org/)'s `_.template()` function, however if you specify a custom rendering function (see documentation below) underscore will not be used at all.

Because their APIs are the same, [Lo-Dash](http://lodash.com/)'s `_.template()` function will work as well! Just include Lo-Dash instead of underscore.

### Using Bower

You can install CLNDR via [Bower](http://bower.io/):

```shell
bower install clndr
```

Underscore is not installed by default. This allows you to use whichever templating engine you want to. If you want to use the default `template` option with Underscore, just install it as a dependency of your project: `bower install underscore`.

### Clndr Using Angular

If you want to integrate clndr into an [angular.js](http://angularjs.org/) site, get started with this directive: [angular-clndr](https://github.com/10KB/angular-clndr).

### Clndr Using Rails

If you're building a rails application you may be interested in this gem by [@sedx](https://github.com/sedx): [clndr-rails](https://github.com/sedx/clndr-rails).


Introduction: You Write The Markup
==================================

There are wonderful and feature-rich calendar modules out there and they all suffer the same problem: they give you markup (and often a good heap of JS) that you have to work with and style. This leads to a lot of hacking, pushing, pulling, and annoying why-can't-it-do-what-I-want scenarios.

CLNDR doesn't generate markup (well, it has some reasonable defaults, but that's an aside). Instead, CLNDR asks you to create a template and in return it supplies your template with a great set of objects that will get you up and running in a few lines.

The 'Days' Array
----------------

Here's a typical CLNDR template. It's got a controller section and a grid section.

```html
<div class="clndr-controls">
  <div class="clndr-previous-button">&lsaquo;</div>
  <div class="month"><%= month %></div>
  <div class="clndr-next-button">&rsaquo;</div>
</div>
<div class="clndr-grid">
  <div class="days-of-the-week">
    <% _.each(daysOfTheWeek, function(day) { %>
      <div class="header-day"><%= day %></div>
    <% }); %>
    <div class="days">
      <% _.each(days, function(day) { %>
        <div class="<%= day.classes %>"><%= day.day %></div>
      <% }); %>
    </div>
  </div>
</div>
```

The `days` array contains most of the stuff we need to make a calendar. Its structure looks like this:
```javascript
{
  day: 5,
  classes: "day",
  events: [],
  date: moment("2013-05-29")
}
```

This makes quick work of generating a grid. `days.classes` contains extra classes depending on the circumstance: if a given day is today, 'today' will show up, as well as an 'event' class when an event lands on that day.

Pass In Your Events
-------------------

CLNDR accepts events as an array of objects:

```javascript
events = [
  { date: "YYYY-MM-DD or some other ISO Date format", and: "anything else" }
]
```

CLNDR looks through the objects in your events array for a `date` field unless you specify otherwise using the `dateParameter` option. In your template the `days` array will auto-magically contain these event objects in their entirety. See the examples for a demonstration of how events populate the `days` array.

Usage
=====

CLNDR leans on the awesome work done in underscore.js and moment.js- these are requirements (unless you are using a different rendering engine, in which case underscore is not a requirement). Do be sure to include them in your `<head>` before clndr.js. It is a jQuery plugin, so naturally you'll need that as well.

The bare minimum (CLNDR includes a default template):

```javascript
$('.parent-element').clndr();
```

With all of the available options:

```javascript
$('.parent-element').clndr({

  // the template: this could be stored in markup as a
  //   <script type="text/template"></script>
  // or pulled in as a string
  template: clndrTemplate,

  // determines which month to start with using either a date string or a
  // moment object.
  startWithMonth: "YYYY-MM-DD" or moment(),

  // start the week off on Sunday (0), Monday (1), etc. Sunday is the default.
  // WARNING: if you are dealing with i18n and multiple languages, you probably
  // don't want this! See the "Internationalization" section below for more.
  weekOffset: 0,

  // an array of day abbreviation labels. If you have moment.js set to a
  // different language, it will guess these for you! If for some reason that
  // doesn't work, use this...
  // WARNING: if you are dealing with i18n and multiple languages, you probably
  // don't want this! See the "Internationalization" section below for more.
  daysOfTheWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

  // the target classnames that CLNDR will look for to bind events.
  // these are the defaults.
  targets: {
    nextButton: 'clndr-next-button',
    previousButton: 'clndr-previous-button',
    nextYearButton: 'clndr-next-year-button',
    previousYearButton: 'clndr-previous-year-button',
    todayButton: 'clndr-today-button',
    day: 'day',
    empty: 'empty'
  },

  // custom classes to avoid styling issues. pass in only the
  // classnames that you wish to override.
  // these are the defaults.
  classes: {
    today: "today",
    event: "event",
    past: "past",
    lastMonth: "last-month",
    nextMonth: "next-month",
    adjacentMonth: "adjacent-month",
    inactive: "inactive",
    selected: "selected"
  }

  // click callbacks! the keyword 'this' is set to the clndr instance in all
  // callbacks.
  clickEvents: {
    // fired whenever a calendar box is clicked.
    // returns a 'target' object containing the DOM element, any events,
    // and the date as a moment.js object.
    click: function(target){ },
    // fired when a user goes forward a month.
    // returns a moment.js object set to the correct month.
    nextMonth: function(month){ },
    // fired when a user goes back a month.
    // returns a moment.js object set to the correct month.
    previousMonth: function(month){ },
    // fired when the next year button is clicked.
    // returns a moment.js object set to the correct month and year.
    nextYear: function(month) { },
    // fired when the previous year button is clicked.
    // returns a moment.js object set to the correct month and year.
    previousYear: function(month) { },
    // fires any time the month changes as a result of a click action.
    // returns a moment.js object set to the correct month.
    onMonthChange: function(month) { },
    // fires any time the year changes as a result of a click action.
    // if onMonthChange is also set, it is fired BEFORE onYearChange.
    // returns a moment.js object set to the correct month and year.
    onYearChange: function(month) { },
    // fired when a user goes to the current month & year.
    // returns a moment.js object set to the correct month.
    today: function(month){ }
  },

  // use the 'touchstart' event instead of 'click'
  useTouchEvents: false,

  // this is called only once after clndr has been initialized and rendered.
  // use this to bind custom event handlers that don't need to be re-attached
  // every time the month changes (most event handlers fall in this category).
  // hint: this.element refers to the parent element that holds the clndr,
  // and is a great place to attach handlers that don't get tossed out every
  // time the clndr is re-rendered.
  ready: function() { },
  // a callback when the calendar is done rendering.
  // This is a good place to bind custom event handlers
  // (also see the 'ready' option above).
  doneRendering: function(){ },

  // an array of event objects
  events: [],

  // if you're supplying an events array, dateParameter points to the
  // field in your event object containing a date string.
  // It's set to 'date' by default.
  dateParameter: 'date',

  // CLNDR can accept events lasting more than one day!
  // just pass in the multiDayEvents option and specify what the start and
  // end fields are called within your event objects. See the example file
  // for a working instance of this.
  multiDayEvents: {
    startDate: 'startDate',
    endDate: 'endDate',
    // if you also have single day events with a different date field,
    // use the singleDay property and point it to the date field.
    singleDay: 'date'
  },

  // show the dates of days in months adjacent to the current month.
  // defaults to true.
  showAdjacentMonths: true,
  // when days from adjacent months are clicked, switch the current month.
  // fires nextMonth/previousMonth/onMonthChange click callbacks. defaults to
  // false.
  adjacentDaysChangeMonth: false,
  // always make the calendar six rows tall (42 days) so that every month has a
  // consistent height. defaults to 'false'.
  forceSixRows: null,
  // set this to true, if you want the plugin to track the last clicked day.
  // if trackSelectedDate is true, "selected" class will always be applied only
  // to the most recently clicked date; otherwise - selectedDate will not change.
  trackSelectedDate: false,
  // set this, if you want a date to be "selected" (see classes.selected) after
  // plugin init.
  // defualts to null - no initially selected date
  selectedDate: null,

  // CLNDR can render in any time interval!
  // You can specify if you want to render one or more months, or one ore more
  // days in the calendar, as well as the paging interval whenever forward or
  // back is triggered. If both months and days are null, CLNDR will default to
  // the standard monthly view.
  lengthOfTime: {
    // Set to an integer if you want to render one or more months, otherwise
    // leave this null
    months: null,
    // Set to an integer if you want to render one or more days, otherwise
    // leave this null. Setting this to 14 would render a 2-week calendar.
    days: null,
    // This is the amount of months or days that will move forward/back when
    // paging the calendar. With days=17 and interval=7, you would have a 2-week
    // calendar that pages forward and backward 1 week at a time.
    interval: 1
  },

  // anything you want access to in your template
  extras: {},

  // if you want to use a different templating language, here's your ticket.
  // Precompile your template (before you call clndr),
  // pass the data from the render function into your template,
  // and return the result. The result must be a string containing valid markup.
  // The keyword 'this' is set to the clndr instance
  // in case you need access to any other properties.
  // More under 'Template Rendering Engine' below.
  render: function(data){
    return '<div class="html data as a string"></div>';
  },

  // if you want to prevent the user from navigating the calendar outside
  // of a certain date range (e.g. if you are making a datepicker), specify
  // either the startDate, endDate, or both in the constraints option. You
  // can change these while the calendar is on the page... See documentation
  // below for more on this!
  constraints: {
    startDate: '2017-12-22',
    endDate: '2018-01-09'
  }
});
```

All of the things you have access to in your template:

```javascript
// an array of day-of-the-week abbreviations,
// shifted as requested using the weekOffset parameter.
daysOfTheWeek: ['S', 'M', 'T', etc...]
// the number of 7-block calendar rows,
// in the event that you want to do some looping with it
numberOfRows: 5
// the days object, documented in more detail above
days: [ { day, classes, id, events, date } ]
// the month name- don't forget that you can do things like
// month.substring(0, 1) and month.toLowerCase() in your template
previousMonth: "April"
month: "May"
nextMonth: "June"
// the year that the calendar is currently focused on
year: "2013"
// all of the events happening this month
eventsThisMonth: [ ],
// all of the events happening last month
eventsLastMonth: [ ],
// all of the events happening next month
eventsNextMonth: [ ],
// anything you passed into the 'extras' property when creating the clndr
extras: { }
```

Multi-day Events
----------------

Clndr accepts events lasting more than one day. You just need to tell it how to access the start and end dates of your events:

```javascript
var lotsOfEvents = [
  { start: '2013-11-04', end: '2013-11-08', title: 'Monday to Friday Event' },
  { start: '2013-11-15', end: '2013-11-20', title: 'Another Long Event' }
];

$('#calendar').clndr({
  events: lotsOfEvents,
  multiDayEvents: {
    startDate: 'start',
    endDate: 'end'
  }
});
```

When looping through days in my template, 'Monday to Friday Event' will be passed to *every single day* between the start and end date. See index.html in the example folder for a demo of this feature.

#### Mixing Multi- and Single-day Events

If you _also_ have single-day events mixed in with different date fields, as of clndr `v1.2.7` you can specify a third property of `multiDayEvents` called `singleDay` that refers to the date field for a single-day event.

```
var lotsOfMixedEvents = [
  { start: '2015-11-04', end: '2015-11-08', title: 'Monday to Friday Event' },
  { start: '2015-11-15', end: '2015-11-20', title: 'Another Long Event' },
  { date: '2015-07-16', title: 'Birthday' }
];

$('#calendar').clndr({
  events: lotsOfEvents,
  multiDayEvents: {
    startDate: 'start',
    endDate: 'end',
    singleDay: 'date'
  }
});
```

Custom Classes
--------------

The classes that get added to a `day` object automatically can be customized to avoid styling conflicts. The `classes` option accepts `today`, `event`, `past`, `lastMonth`, `nextMonth`, `adjacentMonth`, and `inactive`. Pass in only the classnames you wish to override and the rest will be set to their defaults.

In this example we create a `my-` namespace for all of the classes:

```javascript
clndr.customClasses = $('#custom-classes').clndr({
  classes: {
    today: "my-today",
    event: "my-event",
    past: "my-past",
    lastMonth: "my-last-month",
    nextMonth: "my-next-month",
    adjacentMonth: "my-adjacent-month",
    inactive: "my-inactive"
  }
});
```

To configure the `day`, `empty`, and next/previous/today/etc. button classes, use the `targets` option documented in the [usage](https://github.com/kylestetz/CLNDR#usage) section.

Constraints & Datepickers
-------------------------

If you are making a datepicker or you'd just like to prevent users from `next`ing all the way to 2034 in your calendar, you can pass a `constraints` option with `startDate`, `endDate`, or both specified:

```javascript
$('#calendar').clndr({
  constraints: {
    startDate: '2015-05-06',
    endDate: '2015-07-16'
  }
})
```

Now your calendar's next and previous buttons will only work within this date range. When they become disabled they will have the class 'inactive', which you can use to gray them out or add gif flames or whatever.

The days in your grid that are outside of the range will also have the `inactive` class. This means that you will want to add a click callback and check for whether or not a day has the class `inactive`. It will look like this:

```javascript
$('#calendar').clndr({
  constraints: {
    startDate: '2015-05-06',
    endDate: '2015-07-16'
  },
  clickEvents: {
    click: function(target) {
      if( !$(target.element).hasClass('inactive') ) {
        console.log('You picked a valid date!');
      } else {
        console.log('That date is outside of the range.');
      }
    }
  }
})
```

The constraints can be updated at any time via `clndr.options.constraints`. If you make a change, call `render()` afterwards so that clndr can update your interface with the appropriate classes.

```javascript
myCalendar.options.constraints.startDate = '1999-12-31';
myCalendar.render();
```

Make sure the `startDate` comes before the `endDate`!


Returning the Instance / Public API
-----------------------------------

It's possible to save the clndr object in order to call it from JS later. There are functions to increment or set the month or year. You can also provide a new events array.

```javascript
// Create a Clndr and save the instance as myCalendar
var myCalendar = $('#myCalendar').clndr();

// Go to the next month
myCalendar.forward();

// Go to the previous month
myCalendar.back();

// Set the month using a number from 0-11 or a month name
myCalendar.setMonth(0);
myCalendar.setMonth('February');

// Go to the next year
myCalendar.nextYear();

// Go to the previous year
myCalendar.previousYear();

// Set the year
myCalendar.setYear(1997);

// Change the events. Note that this triggers a re-render of the calendar.
myCalendar.setEvents(newEventsArray);

// Add events. Note that this triggers a re-render of the calendar.
myCalendar.addEvents(additionalEventsArray);

// Remove events.  All events for which the passed in function returns true will
// be removed from the calendar.
// Note that this triggers a re-render of the calendar.
myCalendar.removeEvents(function(event){
  return event.id == idToRemove;
});
```

If you are taking advantage of the `onMonthChange` and `onYearChange` callbacks, you might want them to fire whenver you call `setMonth`, `setYear`, `forward`, `back`, etc. Just pass in an object as an argument with `withCallbacks: true` like this:

```javascript
// month will be set to February and then onMonthChange will be fired.
myCalendar.setMonth("February", { withCallbacks: true });

// month will increment and onMonthChange, and possibly onYearChange, will be
// fired.
myCalendar.next({ withCallbacks: true });
```

Template Requirements
---------------------

CLNDR is structured so that you don't really _need_ anything in your template.

```javascript
<% _.each(days, function(day){ %>
  <div class='<%= day.classes %>'><%= day.day %></div>
<% }); %>
```

Currently CLNDR sets the class on a day to `'calendar-day-2013-05-30'` and uses it to determine the date when a user clicks on it. Thus, click events will only work if `days.classes` is included in your day element's `class` attribute as seen above.


Some Configuration
==================

Template Rendering Engine
----------------------------------------

You can pass in a `render` function as an option, for example:

```javascript
var precompiledTemplate = myRenderingEngine.template( $('#my-template').html() );

$('#my-calendar').clndr({
  render: function(data) {
    return precompiledTemplate(data);
  }
});
```

where the function must return the HTML result of the rendering operation. In this case you would precompile your template elsewhere in your code, since CLNDR only cares about your template if it's going to use underscore.

If you are using your own render method, underscore.js is NOT a dependency of this plugin.

CLNDR has been tested successfully with [doT.js](http://olado.github.io/doT/), [Hogan.js](http://twitter.github.io/hogan.js/), and [Handlebars.js](http://handlebarsjs.com/). Please get in touch if you have success with other languages and they will be documented here.

Here's an example using [doT.js](http://olado.github.io/doT/)...

The markup:
```html
<script id="dot-template" type="text/template">
  <div class="clndr-controls">
    <div class="clndr-previous-button">&lsaquo;</div>
    <div class="month">{{= it.month }}</div>
    <div class="clndr-next-button">&rsaquo;</div>
  </div>
  <div class="clndr-grid">
    <div class="days-of-the-week">
      {{~it.daysOfTheWeek :day:index}}
        <div class="header-day">{{= day }}</div>
      {{~}}
      <div class="days">
        {{~it.days :day:index}}
          <div class="{{= day.classes }}">{{= day.day }}</div>
        {{~}}
      </div>
    </div>
  </div>
</script>
```

The Javascript:
```javascript
var clndrTemplate = doT.template( $('#dot-template').html() );

$('#calendar').clndr({
  render: function(data) {
    return clndrTemplate(data);
  }
});
```

Internationalization
--------------------

Clndr has support for internationalization insofar as Moment.js supports it. By configuring your Moment.js instance to a different language, which you can read more about here: [i18n in Moment.js](http://momentjs.com/docs/#/i18n/), you are configuring Clndr as well.

If you are using a moment.js language configuration in which weeks begin on a Monday (e.g. French), Clndr will detect this automatically and there is no need to provide a `weekOffset` or a `daysOfTheWeek` array. If you want to reverse this behavior, there is a field in each moment.js language config file called `dow` which you can set to your liking.

The day of the week abbreviations are created automatically using moment.js's current language setting, however if this does not suit your needs you should override them using the `daysOfTheWeek` option. Make sure the array you provide begins on the same day of the week as your current language setting. **Warning**: using `daysOfTheWeek` and `weekOffset` in conjunction with different language settings is _not_ recommended and may cause you headaches.


Underscore Template Delimiters
------------------------------

If you're not a fan of `<% %>` and `<%= %>` style delimiters you can provide Underscore.js with alternatives in the form of regular expressions. There are three delimiters...

**interpolate**, which outputs a string (this is `<%= %>` by default)

**escape**, for escaping HTML (this is `<%- %>` by default)

**evaluate**, for evaluating javascript (this is `<% %>` by default)


If you're more comfortable with Jinja2/Twig/Nunjucks style delimiters, simply call this before you instantiate your clndr:

```javascript
// switch to Jinja2/Twig/Nunjucks-style delimiters
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  escape: /\{\{\-(.+?)\}\}/g,
  evaluate: /\{\%(.+?)\%\}/g
};
```

Internet Explorer Issues
========================

If you're planning on supporting IE8 and below, you'll have to be careful about version dependencies. You'll need the jQuery 1.10.x branch for IE support, and if you're taking advantage of the `constraints` feature you'll need to use a version of moment.js `<=2.1.0` or `>=2.5.1`.

Todo
====

- [Write clndr.js v2.0](https://github.com/kylestetz/CLNDR/issues/151)

Changelog
=========

`v1.2.12 ~ 2015-06-26`: Bugfix patch for broken behavior in the selected day PR.

`v1.2.11 ~ 2015-06-25`: Added in support for day/month intervals instead of only one month. Added in support for tracking the selected day, optionally using touch events, added a namcespace to click/touch events, and added a properties array to each day object for accessing common attributes about the day.

`v1.2.10 ~ 2015-03-11`: Added a performance optimization that should make rendering multiday events slightly faster in the case that some are <= one day long. This update is backwards-compatible.

`v1.2.9 ~ 2015-02-20`: Fixed a bug where the `daysArray` was accidently introduced into the global namespace. This shouldn't have affected your world. This update is backwards-compatible.

`v1.2.8 ~ 2015-02-16`: Added `previousMonth` and `nextMonth` variables into the template, which match `month` in format, so that now in "April" you also have access to the strings "March" and "May". This update is backwards-compatible.

`v1.2.7 ~ 2015-01-21`: Added the ability to mix multi-day and single-day events using the new `multiDayEvents.singleDay` property. Also introduced lazy setting of `startDate` and `endDate` in multi-day events so that if one of them is missing they will both be set to the value that is present. This update is backwards-compatible.

`v1.2.6 ~ 2015-01-07`: Added the ability to specify custom classnames for `event`, `next-month`, `previous-month`, etc. using `options.classes`. This update is backwards-compatible.

`v1.2.5 ~ 2014-12-01`: Reverting the previous DST code change, which introduced a bug for a large number of users.

`v1.2.4 ~ 2014-11-25`: Fixed a bug related to DST in specific timezones that would cause duplicate dates to appear. Added `removeEvents` filtering function. `warning`! This version is buggy. Please upgrade to `v1.2.5` if you are currently on this version.

`v1.2.3 ~ 2014-10-15`: Fixed a bug that introduced a global variable. It's possible (but very unlikely) that this might have caused some weirdness when using multiple instances of CLNDR on the same page.

`v1.2.2 ~ 2014-10-01`: Updated internal usage of deprecated moment.js functions.

`v1.2.1 ~ 2014-07-10`: Fixed a bug in `eventsLastMonth`, `eventsThisMonth`, and `eventsNextMonth`. Added CommonJS/AMD wrapper to the plugin.

`v1.2.0 ~ 2014-01-22`: BC break for Bower users! Underscore is no longer listed as a dependency in the Bower plugin, allowing you the flexibility of choosing the templating language you prefer. Also added a day of the week class to all clndr days in the format `calendar-dow-<0 - 6>`, allowing you to style weekends/specific days of the week differently.

`v1.1.3 ~ 2014-01-17`: fixed a bug where multiday events longer than two months would not show up. Fixed a bug that prevented clndr from loading in IE8.

`v1.1.2 ~ 2013-12-15`: using the `forceSixRows` option, you can now force your calendar to render six rows at all times, giving each month the same height. All classes and events come through this extra set of days just as you would expect. The usage jQuery's `$.data` has been corrected such that calling `$(#calendar-parent-element).data('plugin_clndr')` returns the clndr instance.

`v1.1.1 ~ 2013-12-02`: You can now only call clndr on one element at a time. If you attempt to call it on more than one element, an error is thrown. This should have no effect on previous code as long as your selectors were only returning one element. There is now a bower.json file.

`v1.1.0 ~ 2013-11-04`: New features! In list form:

- Multiday Events: using the `multiDayEvents` option, you can now pass in events that last more than one day. They will show up in all the days that they span across.
- Constraints: you want to make a datepicker? Ok. Pass in a `constraints` option with either a `startDate`, `endDate`, or both, and clndr will add the `inactive` class to all days that aren't within your range. When you are at the edge of the range, next and previous controls will not respond to click events & will also get the class `inactive`.
- The use of `days.id` in templates has been deprecated all the way. It will cause errors, so stop using it now please!
- Public API functions (forward, back, setMonth, setYear) now accept an object with options. The only option at the moment is `withCallbacks`, which if set to `true` will fire the `onMonthChange` and `onYearChange` callbacks.
- There are tests! example/test.html contains a list of human-powered tests that cover all of the basic functionality.

The only backward-compatibility break is the removal of the `days.id` field used within templates. Upgrading clndr should have no negative repercussions for you- please open an issue if it does and it will get fixed!


`v1.0.13 ~ 2013-10-24`: changed the way `clndr.eventsLastMonth` and `clndr.eventsNextMonth` propagate... previously they were only available if "showAdjacentMonths" was turned on, whereas now they are always available. They are also available in the template now as `eventsLastMonth` and `eventsNextMonth`. Fixed a bug where `eventsLastMonth` and `eventsNextMonth` were jQuery arrays instead of regular ol' Arrays. This bug was introduced in `v1.0.7`. cleaned up example folder.

`v1.0.12 ~ 2013-10-22`: you can now make next and previous year buttons using the classes `clndr-next-year-button` and `clndr-previous-year-button`, or by specifying the options `targets.nextYearButton` and `targets.previousYearButton`. `doneRendering`'s `this` keyword is now set to the clndr instance. Added the `ready` callback, which is a good place to attach event handlers. Added `clickEvents.onYearChange`, which is fired whenever the year changed as a result of a click action (even if you just went to the next month and it happened to be December to January!).

`v1.0.11 ~ 2013-10-19`: set the context in all click events so that `this` now refers to your clndr instance! `this` is also bound to the clndr instance in the `render` function. Added the class `past` to all days before today.

`v1.0.10 ~ 2013-10-16`: fixed a nasty bug where events weren't getting passed into click handlers. this bug was introduced with `v1.0.8`! Please update.

`v1.0.9 ~ 2013-10-16`: Fixed an i18n bug where the days of the week would start on a Monday correctly, but the calendar grid would still start as if the first day of the week was Sunday. This fix correctly uses moment.js's current settings to determine the first day of the week. If you are planning to use CLNDR in multiple languages, update to this version!

`v1.0.8 ~ 2013-10-14`: Deprecated the use of `days[].id`, adding it instead to the list of classes. You no longer have to set an `id` for each day element, and if you do it will be completely ignored. Just keep using `days[].classes`! Fixed a bug where an adjacent month's day would show up as `last-month` or `next-month` incorrectly if the year was different. Added some validation to address a bug where ids would show up as `calendar-day-Invalid Date`.

`v1.0.7 ~ 2013-09-30`: settled on jQuery's $.filter method, opening the door to IE 7 + 8 support. If you plan on supporting IE 8 or below, don't forget to use jQuery's 1.x branch, as 2.x has dropped IE 6 - 8 support.

`v1.0.6 ~ 2013-09-24`: fixed a bug where `daysOfTheWeek` option wouldn't work.

`v1.0.5 ~ 2013-09-24`: added support for showing days in months adjacent to the current month, controlled using the `showAdjacentMonths` option. Added the ability for those adjacent days to move to their month when clicked using the `adjacentDaysChangeMonth` option. Added `daysOfTheWeek` option, which you should avoid by allowing moment.js to make the abbreviations for you. Fixed a bug where providing some `targets: {}` options would remove the rest of them.

`v1.0.4 ~ 2013-09-14`: fixed a bug in `setEvents` and event population where events would show up null.

`v1.0.3 ~ 2013-09-14`: Underscore.js is now only relied upon for its `_.template()` function, which means if you are using your own rendering engine you do NOT need underscore to use CLNDR.js

`v1.0.0 ~ 2013-09-14`: Officially v1.0.0! Added `extras` option, which exposes the `extras` variable in your template, allowing you to pass in arbitrary objects & synchronous functions for use inside of your template.

<a href="http://punkave.com/"><img src="https://raw.github.com/punkave/jquery-selective/master/logos/logo-box-builtby.png" /></a>
