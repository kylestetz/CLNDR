CLNDR.js
========

CLNDR is a jQuery calendar plugin. It was created -- you've heard this before --
out of frustration with the lack of truly dynamic front-end calendar plugins out
there.

See a demo: [kylestetz.github.io/CLNDR/](http://kylestetz.github.io/CLNDR/)

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

Download
--------

- Development: [clndr.js](https://raw.github.com/kylestetz/CLNDR/master/src/clndr.js)
- Production: [clndr.min.js](https://raw.github.com/kylestetz/CLNDR/master/clndr.min.js)

Returning to grab a new version? Have a look at the `CHANGELOG.md` file.

If you'd like to run some tests in a particular browser or environment,
`tests/test.html` contains a list of basic functionality tests. When
contributing, please run these (and add to them when appropriate) before
submitting a pull request or issue!

Dependencies
------------

[jQuery](http://jquery.com/download/) and [Moment.js](http://momentjs.com/) are
depended upon. By default CLNDR tries to use
[Underscore.js](http://underscorejs.org/)'s `_.template()` function, however if
you specify a custom rendering function (see documentation below) Underscore
will not be used at all.

Because their APIs are the same, [Lo-Dash](http://lodash.com/)'s `_.template()`
function will work as well! Just include Lo-Dash instead of Underscore.

### Using Bower

You can install CLNDR via [Bower](http://bower.io/):

```shell
bower install clndr
```

Underscore is not installed by default. This allows you to use whichever
templating engine you want to. If you want to use the default `template` option
with Underscore, just install it as a dependency of your project:
`bower install underscore`.

### Clndr Using Angular

If you want to integrate clndr into an [angular.js](http://angularjs.org/) site,
get started with this directive:
[angular-clndr](https://github.com/10KB/angular-clndr).

### Clndr Using Rails

If you're building a rails application you may be interested in this gem by
[@sedx](https://github.com/sedx):
[clndr-rails](https://github.com/sedx/clndr-rails).

Introduction: You Write The Markup
==================================

There are wonderful and feature-rich calendar modules out there and they all
suffer the same problem: they give you markup (and often a good heap of JS)
that you have to work with and style. This leads to a lot of hacking, pushing,
pulling, and annoying why-can't-it-do-what-I-want scenarios.

CLNDR doesn't generate markup (well, it has some reasonable defaults, but
that's an aside). Instead, CLNDR asks you to create a template and in return it
supplies your template with a great set of objects that will get you up and
running in a few lines.

The 'Days' Array
----------------

Here's a typical CLNDR template. It's got a controller section and a grid
section.

```html
<div class="clndr-controls">
    <div class="clndr-previous-button">&lsaquo;</div>
    <div class="month"><%= month %></div>
    <div class="clndr-next-button">&rsaquo;</div>
</div>
<div class="clndr-grid">
    <div class="days-of-the-week">
    <% _.each(daysOfTheWeek, function (day) { %>
        <div class="header-day"><%= day %></div>
    <% }); %>
        <div class="days">
        <% _.each(days, function (day) { %>
            <div class="<%= day.classes %>"><%= day.day %></div>
        <% }); %>
        </div>
    </div>
</div>
```

The `days` array contains most of the stuff we need to make a calendar. Its
structure looks like this:

```javascript
{
    day: 5,
    events: [],
    classes: "day",
    date: moment("2015-12-31")
}
```

This makes quick work of generating a grid. `days.classes` contains extra
classes depending on the circumstance: if a given day is today, 'today' will
show up, as well as an 'event' class when an event lands on that day.

Pass In Your Events
-------------------

CLNDR accepts events as an array of objects:

```javascript
events = [
    {
        date: "YYYY-MM-DD or some other ISO Date format",
        and: "anything else"
    }
]
```

CLNDR looks through the objects in your events array for a `date` field unless
you specify otherwise using the `dateParameter` option. In your template the
`days` array will auto-magically contain these event objects in their entirety.
See the examples for a demonstration of how events populate the `days` array.

Usage
=====

CLNDR leans on the awesome work done in Underscore and moment. These are
requirements unless you are using a different rendering engine, in which case
Underscore is not a requirement). Do be sure to include them in your `<head>`
before clndr.js. It is a jQuery plugin, so naturally you'll need that as well.

The bare minimum (CLNDR includes a default template):

```javascript
$('.parent-element').clndr();
```

With all of the available options:

```javascript
$('.parent-element').clndr({

    // The template: this could be stored in markup as a
    //   <script type="text/template"></script>
    // or pulled in as a string
    template: clndrTemplate,

    // Determines which month to start with using either a date string or a
    // moment object.
    startWithMonth: "YYYY-MM-DD" or moment(),

    // Start the week off on Sunday (0), Monday (1), etc. Sunday is the default.
    // WARNING: if you are dealing with i18n and multiple languages, you
    // probably don't want this! See the "Internationalization" section below
    // for more.
    weekOffset: 0,

    // An array of day abbreviation labels. If you have moment.js set to a
    // different language, it will guess these for you! If for some reason that
    // doesn't work, use this...
    // WARNING: if you are dealing with i18n and multiple languages, you
    // probably don't want this! See the "Internationalization" section below
    // for more.
    daysOfTheWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

    // The target classnames that CLNDR will look for to bind events.
    // these are the defaults.
    targets: {
        day: 'day',
        empty: 'empty',
        nextButton: 'clndr-next-button',
        todayButton: 'clndr-today-button',
        previousButton: 'clndr-previous-button',
        nextYearButton: 'clndr-next-year-button',
        previousYearButton: 'clndr-previous-year-button',
    },

    // Custom classes to avoid styling issues. pass in only the classnames that
    // you wish to override. These are the defaults.
    classes: {
        past: "past",
        today: "today",
        event: "event",
        selected: "selected",
        inactive: "inactive",
        lastMonth: "last-month",
        nextMonth: "next-month",
        adjacentMonth: "adjacent-month",
    },

    // Click callbacks! The keyword 'this' is set to the clndr instance in all
    // callbacks.
    clickEvents: {
        // Fired whenever a calendar box is clicked. Returns a 'target' object
        // containing the DOM element, any events, and the date as a moment.js
        // object.
        click: function (target) {...},

        // Fired when a user goes to the current month and year. Returns a
        // moment.js object set to the correct month.
        today: function (month) {...},

        // Fired when a user goes forward a month. Returns a moment.js object
        // set to the correct month.
        nextMonth: function (month) {...},

        // Fired when a user goes back a month. Returns a moment.js object set
        // to the correct month.
        previousMonth: function (month) {...},

        // Fires any time the month changes as a result of a click action.
        // Returns a moment.js object set to the correct month.
        onMonthChange: function (month) {...},

        // Fired when the next year button is clicked. Returns a moment.js
        // object set to the correct month and year.
        nextYear: function (month) {...},

        // Fired when the previous year button is clicked. Returns a moment.js
        // object set to the correct month and year.
        previousYear: function (month) {...},

        // Fires any time the year changes as a result of a click action. If
        // onMonthChange is also set, it is fired BEFORE onYearChange. Returns
        // a moment.js object set to the correct month and year.
        onYearChange: function (month) {...},

        // Fired when a user goes forward a period. Returns moment.js objects
        // for the updated start and end date.
        nextInterval: function (start, end) {...},

        // Fired when a user goes back an interval. Returns moment.js objects for
        // the updated start and end date.
        previousInterval: function (start, end) {...},

        // Fired whenever the time period changes as configured in lengthOfTime.
        // Returns moment.js objects for the updated start and end date.
        onIntervalChange: function (start, end) {...}
    },

    // Use the 'touchstart' event instead of 'click'
    useTouchEvents: false,

    // This is called only once after clndr has been initialized and rendered.
    // use this to bind custom event handlers that don't need to be re-attached
    // every time the month changes (most event handlers fall in this category).
    // Hint: this.element refers to the parent element that holds the clndr,
    // and is a great place to attach handlers that don't get tossed out every
    // time the clndr is re-rendered.
    ready: function () { },

    // A callback when the calendar is done rendering. This is a good place
    // to bind custom event handlers (also see the 'ready' option above).
    doneRendering: function () {...},

    // An array of event objects
    events: [],

    // If you're supplying an events array, dateParameter points to the field
    // in your event object containing a date string. It's set to 'date' by
    // default.
    dateParameter: 'date',

    // CLNDR can accept events lasting more than one day! just pass in the
    // multiDayEvents option and specify what the start and end fields are
    // called within your event objects. See the example file for a working
    // instance of this.
    multiDayEvents: {
        endDate: 'endDate',
        startDate: 'startDate',
        // If you also have single day events with a different date field,
        // use the singleDay property and point it to the date field.
        singleDay: 'date'
    },

    // Show the dates of days in months adjacent to the current month. Defaults
    // to true.
    showAdjacentMonths: true,

    // When days from adjacent months are clicked, switch the current month.
    // fires nextMonth/previousMonth/onMonthChange click callbacks. defaults to
    // false.
    adjacentDaysChangeMonth: false,

    // Always make the calendar six rows tall (42 days) so that every month has
    // a consistent height. defaults to 'false'.
    forceSixRows: null,

    // Set this to true, if you want the plugin to track the last clicked day.
    // If trackSelectedDate is true, "selected" class will always be applied
    // only to the most recently clicked date; otherwise - selectedDate will
    // not change.
    trackSelectedDate: false,

    // Set this, if you want a date to be "selected" (see classes.selected)
    // after plugin init. Defualts to null, no initially selected date.
    selectedDate: null,

    // Set this to true if you don't want `inactive` dates to be selectable.
    // This will only matter if you are using the `constraints` option.
    ignoreInactiveDaysInSelection: null,

    // CLNDR can render in any time interval!
    // You can specify if you want to render one or more months, or one ore more
    // days in the calendar, as well as the paging interval whenever forward or
    // back is triggered. If both months and days are null, CLNDR will default
    // to the standard monthly view.
    lengthOfTime: {
        // Set to an integer if you want to render one or more months, otherwise
        // leave this null
        months: null,

        // Set to an integer if you want to render one or more days, otherwise
        // leave this null. Setting this to 14 would render a 2-week calendar.
        days: null,

        // This is the amount of months or days that will move forward/back when
        // paging the calendar. With days=17 and interval=7, you would have a
        // 2-week calendar that pages forward and backward 1 week at a time.
        interval: 1
    },

    // Any other data variables you want access to in your template. This gets
    // passed into the template function.
    extras: {},

    // If you want to use a different templating language, here's your ticket.
    // Precompile your template (before you call clndr), pass the data from the
    // render function into your template, and return the result. The result
    // must be a string containing valid markup. The keyword 'this' is set to
    // the clndr instance in case you need access to any other properties.
    // More under 'Template Rendering Engine' below.
    render: function (data) {
        return '<div class="html data as a string"></div>';
    },

    // If you want to prevent the user from navigating the calendar outside
    // of a certain date range (e.g. if you are making a datepicker), specify
    // either the startDate, endDate, or both in the constraints option. You
    // can change these while the calendar is on the page... See documentation
    // below for more on this!
    constraints: {
        startDate: '2017-12-22',
        endDate: '2018-01-09'
    },

    // Optionally, you can pass a Moment instance to use instead of the global
    moment: null
});
```

All of the things you have access to in your template:

```javascript
// An array of day-of-the-week abbreviations, shifted as requested using the
// weekOffset parameter.
daysOfTheWeek: ['S', 'M', 'T', etc...]

// The number of 7-block calendar rows, in the event that you want to do some
// looping with it
numberOfRows: 5

// The days array, documented in more detail above
days: [{ day, classes, id, events, date }]

// The month name- don't forget that you can do things like
// month.substring(0, 1) and month.toLowerCase() in your template
month: "May"

// The year that the calendar is currently focused on
year: "2013"

// All of the events happening this month. This will be empty of the
// lengthOfTime config option is set.
eventsThisMonth: []
// All of the events happening last month. This is only set if
// showAdjacementMonths is true.
eventsLastMonth: []
// All of the events happening next month. This is only set if
// showAdjacementMonths is true.
eventsNextMonth: []

// If you specified a custom lengthOfTime, you will have these instead.
intervalEnd: (moment object)
intervalStart: (moment object)
eventsThisInterval: []

// Anything you passed into the 'extras' property when creating the clndr
extras: {}
```

Multi-day Events
----------------

Clndr accepts events lasting more than one day. You just need to tell it how to
access the start and end dates of your events:

```javascript
var lotsOfEvents = [
    {
        end: '2013-11-08',
        start: '2013-11-04',
        title: 'Monday to Friday Event'
    }, {
        end: '2013-11-20',
        start: '2013-11-15',
        title: 'Another Long Event'
    }
];

$('#calendar').clndr({
    events: lotsOfEvents,
    multiDayEvents: {
        endDate: 'end',
        startDate: 'start'
    }
});
```

When looping through days in my template, 'Monday to Friday Event' will be
passed to *every single day* between the start and end date. See index.html in
the example folder for a demo of this feature.

#### Mixing Multi- and Single-day Events

If you _also_ have single-day events mixed in with different date fields, as of
clndr `v1.2.7` you can specify a third property of `multiDayEvents` called
`singleDay` that refers to the date field for a single-day event.

```
var lotsOfMixedEvents = [
    {
        end: '2015-11-08',
        start: '2015-11-04',
        title: 'Monday to Friday Event'
    }, {
        end: '2015-11-20',
        start: '2015-11-15',
        title: 'Another Long Event'
    }, {
        title: 'Birthday',
        date: '2015-07-16'
    }
];

$('#calendar').clndr({
    events: lotsOfEvents,
    multiDayEvents: {
        endDate: 'end',
        singleDay: 'date',
        startDate: 'start'
    }
});
```

Custom Classes
--------------

The classes that get added to a `day` object automatically can be customized to
avoid styling conflicts. The `classes` option accepts `today`, `event`, `past`,
`lastMonth`, `nextMonth`, `adjacentMonth`, and `inactive`. Pass in only the
classnames you wish to override and the rest will be set to their defaults.

In this example we create a `my-` namespace for all of the classes:

```javascript
clndr.customClasses = $('#custom-classes').clndr({
    classes: {
        past: "my-past",
        today: "my-today",
        event: "my-event",
        inactive: "my-inactive",
        lastMonth: "my-last-month",
        nextMonth: "my-next-month",
        adjacentMonth: "my-adjacent-month"
    }
});
```

To configure the `day`, `empty`, and next/previous/today/etc. button classes,
use the `targets` option documented in the
[usage](https://github.com/kylestetz/CLNDR#usage) section.

Constraints & Datepickers
-------------------------

If you are making a datepicker or you'd just like to prevent users from
`next`ing all the way to 2034 in your calendar, you can pass a `constraints`
option with `startDate`, `endDate`, or both specified:

```javascript
$('#calendar').clndr({
    constraints: {
        endDate: '2015-07-16',
        startDate: '2015-05-06'
    }
});
```

Now your calendar's next and previous buttons will only work within this date
range. When they become disabled they will have the class 'inactive', which you
can use to gray them out or add gif flames or whatever.

The days in your grid that are outside of the range will also have the
`inactive` class. This means that you will want to add a click callback and
check for whether or not a day has the class `inactive`. It will look like this:

```javascript
$('#calendar').clndr({
    constraints: {
        endDate: '2015-07-16',
        startDate: '2015-05-06'
    },
    clickEvents: {
        click: function (target) {
            if (!$(target.element).hasClass('inactive')) {
                console.log('You picked a valid date!');
            } else {
                console.log('That date is outside of the range.');
            }
        }
    }
});
```

The constraints can be updated at any time via `clndr.options.constraints`. If
you make a change, call `render()` afterwards so that clndr can update your
interface with the appropriate classes.

```javascript
myCalendar.options.constraints.startDate = '1999-12-31';
myCalendar.render();
```

Make sure the `startDate` comes before the `endDate`!

Returning the Instance / Public API
-----------------------------------

It's possible to save the clndr object in order to call it from JS later. There
are functions to increment or set the month or year. You can also provide a new
events array.

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

// Go to today:
myCalendar.today();

// Change the events. Note that this triggers a re-render of the calendar.
myCalendar.setEvents(newEventsArray);

// Add events. Note that this triggers a re-render of the calendar.
myCalendar.addEvents(additionalEventsArray);

// Remove events.  All events for which the passed in function returns true will
// be removed from the calendar. Note that this triggers a re-render of the
// calendar.
myCalendar.removeEvents(function (event) {
    return event.id == idToRemove;
});

// Detroy the clndr instance. This will empty the DOM node containing the
// calendar.
myCalendar.destroy();
```

If you are taking advantage of the `onMonthChange` and `onYearChange` callbacks,
you might want them to fire whenver you call `setMonth`, `setYear`, `forward`,
`back`, etc. Just pass in an object as an argument with `withCallbacks: true`
like this:

```javascript
// Month will be set to February and then onMonthChange will be fired.
myCalendar.setMonth("February", { withCallbacks: true });

// Month will increment and onMonthChange, and possibly onYearChange, will be
// fired.
myCalendar.next({ withCallbacks: true });
```

Template Requirements
---------------------

CLNDR is structured so that you don't really _need_ anything in your template.

```javascript
<% _.each(days, function (day){ %>
<div class='<%= day.classes %>'><%= day.day %></div>
<% }); %>
```

Currently CLNDR sets the class on a day to `'calendar-day-2013-05-30'` and uses
it to determine the date when a user clicks on it. Thus, click events will only
work if `days.classes` is included in your day element's `class` attribute as
seen above.

Some Configuration
==================

Template Rendering Engine
-------------------------

You can pass in a `render` function as an option, for example:

```javascript
var precompiledTemplate = myRenderingEngine.template($('#my-template').html());

$('#my-calendar').clndr({
    render: function (data) {
        return precompiledTemplate(data);
    }
});
```

Where the function must return the HTML result of the rendering operation. In
this case you would precompile your template elsewhere in your code, since CLNDR
only cares about your template if it's going to use Underscore.

If you are using your own render method, Underscore is NOT a dependency of
this plugin.

CLNDR has been tested successfully with [doT.js](http://olado.github.io/doT/),
[Hogan.js](http://twitter.github.io/hogan.js/), and
[Handlebars.js](http://handlebarsjs.com/). Please get in touch if you have
success with other languages and they will be documented here.

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
var clndrTemplate = doT.template($('#dot-template').html());

$('#calendar').clndr({
    render: function (data) {
        return clndrTemplate(data);
    }
});
```

Internationalization
--------------------

Clndr has support for internationalization insofar as Moment.js supports it. By
configuring your Moment.js instance to a different language, which you can read
more about here: [i18n in Moment.js](http://momentjs.com/docs/#/i18n/), you are
configuring Clndr as well.

If you would prefer to pass in a pre-configured instance of moment, you can do
this by passing it in as the `moment` config option when initializing CLNDR.

If you are using a moment.js language configuration in which weeks begin on a
Monday (e.g. French), Clndr will detect this automatically and there is no need
to provide a `weekOffset` or a `daysOfTheWeek` array. If you want to reverse
this behavior, there is a field in each moment.js language config file called
`dow` which you can set to your liking.

The day of the week abbreviations are created automatically using moment.js's
current language setting, however if this does not suit your needs you should
override them using the `daysOfTheWeek` option. Make sure the array you provide
begins on the same day of the week as your current language setting.
**Warning**: using `daysOfTheWeek` and `weekOffset` in conjunction with
different language settings is _not_ recommended and may cause you headaches.


Underscore Template Delimiters
------------------------------

If you're not a fan of `<% %>` and `<%= %>` style delimiters you can provide
Underscore.js with alternatives in the form of regular expressions. There are
three delimiters...

**interpolate**, which outputs a string (this is `<%= %>` by default)

**escape**, for escaping HTML (this is `<%- %>` by default)

**evaluate**, for evaluating javascript (this is `<% %>` by default)

If you're more comfortable with Jinja2/Twig/Nunjucks style delimiters, simply
call this before you instantiate your clndr:

```javascript
// Switch to Jinja2/Twig/Nunjucks-style delimiters
_.templateSettings = {
    escape: /\{\{\-(.+?)\}\}/g,
    evaluate: /\{\%(.+?)\%\}/g,
    interpolate: /\{\{(.+?)\}\}/g,
};
```

Internet Explorer Issues
========================

If you're planning on supporting IE8 and below, you'll have to be careful about
version dependencies. You'll need the jQuery 1.10.x branch for IE support, and
if you're taking advantage of the `constraints` feature you'll need to use a
version of moment.js `<=2.1.0` or `>=2.5.1`.
