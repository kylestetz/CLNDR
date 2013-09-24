CLNDR.js
========

CLNDR is a jQuery calendar plugin. It was created- you've heard this before- out of frustration with the lack of truly dynamic front-end calendar plugins out there.

Dependencies
------------

[jQuery](http://jquery.com/download/) and [Moment.js](http://momentjs.com/) are depended upon. By default CLNDR tries to use [Underscore.js](http://underscorejs.org/)'s `_.template()` function, however if you specify a custom rendering function (see documentation below) underscore will not be used at all.

Because their APIs are the same, [Lo-Dash](http://lodash.com/)'s `_.template()` function will work ask well! Just include Lo-Dash instead of underscore.

Recent Changes
--------------

Thanks to everyone for their interest! Things just got shuffled around a bit to accommodate a grunt workflow. The fully-commented source version is `src/clndr.js`, while `clndr.js` and `clndr.min.js` are meant for development & production, respectively. In addition, CLNDR is now registered as a jQuery plugin, so you can now track versions through the tags in this repo.

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
        <div class="<%= day.classes %>" id="<%= day.id %>"><%= day.day %></div>
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
  id: "calendar-day-2013-05-29",
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
  // the template: this could be stored in markup as a <script type="text/template"></script>
  // or pulled in as a string
  template: clndrTemplate,
  // start the week off on Sunday (0), Monday (1), etc. Sunday is the default.
  weekOffset: 0,
  // determines which month to start with using either a date string or a moment object.
  startWithMonth: "YYYY-MM-DD" or moment(),
  // an array of day abbreviations. If you have moment.js set to a different language,
  // it will guess these for you! If for some reason that doesn't work, use this...
  // the array MUST start with Sunday (use in conjunction with weekOffset to change the starting day to Monday)
  daysOfTheWeek: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  // callbacks!
  clickEvents: {
    // fired whenever a calendar box is clicked.
    // returns a 'target' object containing the DOM element, any events, and the date as a moment.js object.
    click: function(target){ },
    // fired when a user goes forward a month. returns a moment.js object set to the correct month.
    nextMonth: function(month){ },
    // fired when a user goes back a month. returns a moment.js object set to the correct month.
    previousMonth: function(month){ },
    // fired when a user goes back OR forward a month. returns a moment.js object set to the correct month.
    onMonthChange: function(month){ }
    // fired when a user goes to the current month/year. returns a moment.js object set to the correct month.
    today: function(month){ },
  },
  // the target classnames that CLNDR will look for to bind events. these are the defaults.
  targets: {
    nextButton: 'clndr-next-button',
    previousButton: 'clndr-previous-button',
    todayButton: 'clndr-today-button',
    day: 'day',
    empty: 'empty'
  },
  // an array of event objects
  events: [],
  // if you're supplying an events array, dateParameter points to the field in your event object containing a date string. It's set to 'date' by default.
  dateParameter: 'date',
  // show the numbers of days in months adjacent to the current month (and populate them with their events). defaults to true.
  showAdjacentMonths: true,
  // when days from adjacent months are clicked, switch the current month.
  // fires nextMonth/previousMonth/onMonthChange click callbacks. defaults to false.
  adjacentDaysChangeMonth: false,
  // a callback when the calendar is done rendering. This is a good place to bind custom event handlers.
  doneRendering: function(){ },
  // anything you want access to in your template
  extras: { }
});
```

All of the things you have access to in your template:

```javascript
// an array of day-of-the-week abbreviations, shifted as requested using the weekOffset parameter.
daysOfTheWeek: ['S', 'M', 'T', etc...]
// the number of 7-block calendar rows, in the event that you want to do some looping with it
numberOfRows: 5
// the days object, documented in more detail above
days: [ { day, classes, id, events, date } ]
// the month name- don't forget that you can do things like month.substring(0, 1) and month.toLowerCase() in your template
month: "May"
// the year that the calendar is currently focused on
year: "2013"
// all of the events happening this month
eventsThisMonth: [ ],
// anything you passed into the 'extras' property when creating the clndr
extras: { }
```

Returning the Instance
----------------------

It's possible to save the clndr object in order to call it from JS later. There are functions to increment or set the month or year. You can also provide a new events array.

```javascript
// Create a Clndr and save the instance as theCalendarInstance
var theCalendarInstance = $('#myCalendar').clndr();

// Go to the next month
theCalendarInstance.forward();

// Go to the previous month
theCalendarInstance.back();

// Set the month using a number from 0-11 or a month name
theCalendarInstance.setMonth(0);
theCalendarInstance.setMonth('February');

// Go to the next year
theCalendarInstance.nextYear();

// Go to the previous year
theCalendarInstance.previousYear();

// Set the year
theCalendarInstance.setYear(1997);

// Change the events. Note that this triggers a re-render of the calendar.
theCalendarInstance.setEvents(newEventsArray);

// Add events. Note that this triggers a re-render of the calendar.
theCalendarInstance.addEvents(additionalEventsArray);
```

Template Requirements
---------------------

CLNDR is structured so that you don't really _need_ anything in your template... If you don't include any markup it just won't do anything cool. If you want to take advantage of click callbacks you'll need to give your grid boxes the `targets.day` class (it's `'day'` by default) and you'll need to set the id to the `days[index].id` provided in the template. To illustrate:

```javascript
<% _.each(days, function(day){ %>
  <div class='<%= day.classes %>' id='<%= day.id %>'><%= day.day %></div>
<% }); %>
```

Currently CLNDR sets the id to `'calendar-day-2013-05-30'` and uses it to determine the date when a user clicks on it.


Some Configuration
==================

Template Rendering Engine (experimental)
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

CLNDR has been tested successfully with [doT.js](http://olado.github.io/doT/) and [Hogan.js](http://twitter.github.io/hogan.js/). Please get in touch if you have success with other languages and they will be documented here.

Internationalization
--------------------

Clndr has support for internationalization insofar as Moment.js supports it. By configuring your Moment.js instance to a different language, which you can read more about [here](http://momentjs.com/docs/#/i18n/), you are configuring Clndr as well.

The day of the week abbreviations are created automatically using moment.js's current language setting, however if this does not suit your needs you should override them using the `daysOfTheWeek` option. Make sure the array you provide begins on Sunday (use `weekOffset` to change the starting day of the week to another day).

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

Todo
====

- Tests!
- Improve mobile experience
- Node.js module for server-side rendering of the initial calendar.

Changelog
=========
`v1.0.6 ~ 2013-09-24`: fixed a bug where `daysOfTheWeek` option wouldn't work.

`v1.0.5 ~ 2013-09-24`: added support for showing days in months adjacent to the current month, controlled using the `showAdjacentMonths` option. Added the ability for those adjacent days to move to their month when clicked using the `adjacentDaysChangeMonth` option. Added `daysOfTheWeek` option, which you should avoid by allowing moment.js to make the abbreviations for you. Fixed a bug where providing some `targets: {}` options would remove the rest of them.

`v1.0.4 ~ 2013-09-14`: fixed a bug in `setEvents` and event population where events would show up null.

`v1.0.3 ~ 2013-09-14`: Underscore.js is now only relied upon for its `_.template()` function, which means if you are using your own rendering engine you do NOT need underscore to use CLNDR.js

`v1.0.0 ~ 2013-09-14`: Officially v1.0.0! Added `extras` option, which exposes the `extras` variable in your template, allowing you to pass in arbitrary objects & synchronous functions for use inside of your template.

<a href="http://punkave.com/"><img src="https://raw.github.com/punkave/jquery-selective/master/logos/logo-box-builtby.png" /></a>
