CLNDR.js
========

CLNDR is a jQuery calendar plugin. It was created- you've heard this before- out of frustration with the lack of truly dynamic front-end calendar plugins out there.

You Write The Markup
--------------------

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
  date: moment("2013-05-29"),
}
```

This makes quick work of generating a grid. `days.classes` contains extra classes depending on the circumstance: if a given day is today, 'today' will show up, as well as an 'event' class when an event lands on that day.


Pass In Your Events
-------------------

CLNDR accepts event objects in the form:

```javascript
events = [
  { date: "YYYY-MM-DD or some other ISO Date format", and: "anything else" }
]
```

CLNDR looks through the objects in your events array for a `date` field. In your template the `days` array will auto-magically contain these event objects in their entirety. See the examples for a demonstration of how events populate the `days` array.

Usage
=====

CLNDR leans on the awesome work done in underscore.js and moment.js- these are requirements. Do be sure to include them in your `<head>` before clndr.js. It is a jQuery plugin, so naturally you'll need that as well.

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
  },
  // the target classnames that CLNDR will look for to bind events. these are the defaults.
  targets: {
    nextButton: 'clndr-next-button',
    previousButton: 'clndr-previous-button',
    day: 'day',
    empty: 'empty'
  },
  // an array of event objects
  events: [],
  // if you're supplying an events array, dateParameter points to the field in your event object containing a date string. It's set to 'date' by default.
  dateParameter: 'date',
  // a callback when the calendar is done rendering. This is a good place to bind custom event handlers.
  doneRendering: function(){ }
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

Internationalization
--------------------

Clndr has support for internationalization insofar as Moment.js supports it. By configuring your Moment.js instance to a different language, which you can read more about [here](http://momentjs.com/docs/#/i18n/), you are configuring Clndr as well. One notable exception is the daysOfTheWeek array, which does not currently take language into account. This can be overcome by changing it in your clndr instance:

```javascript
// let's make our day abbreviations in french
clndrInstance.daysOfTheWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
```

And don't forget that there's no requirement to use `daysOfTheWeek`- if instead you call `days[index].date.format('dddd')` from within your template you will be taking advantage of the current language setting in your Moment.js instance.

Underscore Template Delimiters
------------------------------

If you're not a fan of `<% %>` and `<%= %>` style delimiters you can provide Underscore.js with alternatives in the form of regular expressions. There are three delimiters...

*interpolate*, which outputs a string (this is `<%= %>` by default)
*escape*, for escaping HTML (this is `<%- %>` by default)
*evaluate*, for evaluating javascript (this is `<% %>` by default)

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

- Figure out what could make for a better mobile experience... perhaps touch events?
- Node.js module for server-side rendering of the initial calendar.
