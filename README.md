CLNDR.js
========

CLNDR is a jQuery calendar plugin. It was created- you've heard this before- out of frustration at the lack of truly dynamic front-end calendar plugins out there.

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
