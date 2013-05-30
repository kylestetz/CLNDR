CLNDR.js
========

CLNDR is a jQuery calendar plugin. It was created- you've heard this before- out of frustration with the lack of truly dynamic front-end calendar plugins out there.

You Write The Markup
--------------------

There are wonderful and feature-rich calendar modules out there and they all suffer the same problem: they give you markup (and often a good heap of JS) that you have to work with and style. This leads to a lot of hacking, pushing, pulling, and annoying why-can't-it-do-what-I-want scenarios.

CLNDR doesn't generate markup (well, it has some reasonable defaults, but that's an aside). Instead, CLNDR asks you to create a template and in return it supplies your template with a great set of objects that will get you up and running in a few lines.

The 'Days' Object
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

The `days` array contains most of the stuff we need to make a calendar. It's structure looks like this:
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

CLNDR accepts event objects in the form

```javascript
events = [
  { date: "YYYY-MM-DD or some other moment.js-recognizable format", and: "anything else" }
]
```

CLNDR looks through the objects in your events array for a `date` field. In your template the `days` array will auto-magically contain these event objects in their entirety.

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
  // the template: this could be stored in markup as a <script type="text/template">
  // or pulled in as a string
  template: clndrTemplate,
  // start the week off on Sunday (0), Monday (1), etc. Sunday is the default.
  weekOffset: 0,
  // callbacks!
  clickEvents: {
    // fired whenever a calendar box is clicked.
    // returns a 'target' object containing the DOM element, any events, and the date as a moment.js object.
    click: function(target){ },
    // fired when a user goes forward a month. returns a moment.js object set to the correct month.
    nextMonth: function(month){ },
    // fired when a user goes back a month. returns a moment.js object set to the correct month.
    previousMonth: function(month){ },
    // fired when a user goes back or forward a month. returns a moment.js object set to the correct month.
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

Todo
====

CLNDR is brand new and it needs a lot of work. For example, it doesn't yet return the instance of `clndr`, so you can't pass it events after it has been instantiated or trigger it to change the month using javascript.

Some concerns: the entire template must be re-rendered and events bound each time the user changes the month. This isn't terrible, but I'm not 100% on whether or not this is well structured for JS garbage collection to do its thing; right now it uses `$('.clndr').children().remove()` to clear all DOM elements and event handlers.

- Add passthrough option to change underscore's template settings if the user isn't into ERB delimiters.
- Add passthrough option to change moment.js's language settings
- Add option to change daysOfTheWeek array to custom set of 7 characters

And of course, wouldn't it be cool if this were also a node module that sent down the first month pre-rendered? 'Working on it.'
