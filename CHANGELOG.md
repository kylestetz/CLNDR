Changelog
---------

`v1.4.1 ~ 2015-12-15`
> Fixed intervals ref in docs, added onIntervalChange to defaults.clickEvents.

`v1.4.0 ~ 2015-11-25`
> Updated codebase according to a style convention, re-factored event handling,
and fixed some small inconsistencies in event firing.

`v1.3.4 ~ 2015-11-05`
> Fixed a bug where calling `destroy` and re-instantiating a clndr on the same
element would not bind new click handlers.

`v1.3.3 ~ 2015-10-22`
> Adds `ignoreInactiveDaysInSelection` option for disabling selection of
inactive dates when using both `trackSelectedDates` and `constraints`.

`v1.3.2 ~ 2015-10-21`
> Adding moment instance as a config option to use instead of global moment
object.

`v1.3.1 ~ 2015-10-21`
> Trailing comma removed to work in IE11.

`v1.3.0 ~ 2015-10-13`
> Adds destroy and get-instance methods.

`v1.2.16 ~ 2015-08-18`
> Resolves issue #200; nextMonth click event was firing previousMonth's event
erroneously.

`v1.2.15 ~ 2015-07-21`
> Resolves issue #185; next and previous month not working correctly with today
under certain configurations.

`v1.2.14 ~ 2015-07-08`
> Small typo fixed.

`v1.2.13 ~ 2015-07-08`
> Bugfix patch for misnamed variable.

`v1.2.12 ~ 2015-06-26`
> Bugfix patch for broken behavior in the selected day PR.

`v1.2.11 ~ 2015-06-25`
> Added in support for day/month intervals instead of only one month. Added in
support for tracking the selected day, optionally using touch events, added a
namespace to click/touch events, and added a properties array to each day
object for accessing common attributes about the day.

`v1.2.10 ~ 2015-03-11`
> Added a performance optimization that should make rendering multiday events
slightly faster in the case that some are <= one day long. This update is
backwards-compatible.

`v1.2.9 ~ 2015-02-20`
> Fixed a bug where the `daysArray` was accidently introduced into the global
namespace. This shouldn't have affected your world. This update is backwards-
compatible.

`v1.2.8 ~ 2015-02-16`
> Added `previousMonth` and `nextMonth` variables into the template, which
match `month` in format, so that now in "April" you also have access to the
strings "March" and "May". This update is backwards-compatible.

`v1.2.7 ~ 2015-01-21`
> Added the ability to mix multi-day and single-day events using the new
`multiDayEvents.singleDay` property. Also introduced lazy setting of `startDate`
and `endDate` in multi-day events so that if one of them is missing they will
both be set to the value that is present. This update is backwards-compatible.

`v1.2.6 ~ 2015-01-07`
> Added the ability to specify custom classnames for `event`, `next-month`,
`previous-month`, etc. using `options.classes`. This update is backwards-
compatible.

`v1.2.5 ~ 2014-12-01`
> Reverting the previous DST code change, which introduced a bug for a large
number of users.

`v1.2.4 ~ 2014-11-25`
> Fixed a bug related to DST in specific timezones that would cause duplicate
dates to appear. Added `removeEvents` filtering function. `warning`! This
version is buggy. Please upgrade to `v1.2.5` if you are currently on this
version.

`v1.2.3 ~ 2014-10-15`
> Fixed a bug that introduced a global variable. It's possible (but very
unlikely) that this might have caused some weirdness when using multiple
instances of CLNDR on the same page.

`v1.2.2 ~ 2014-10-01`
> Updated internal usage of deprecated moment.js functions.

`v1.2.1 ~ 2014-07-10`
> Fixed a bug in `eventsLastMonth`, `eventsThisMonth`, and `eventsNextMonth`.
Added CommonJS/AMD wrapper to the plugin.

`v1.2.0 ~ 2014-01-22`
> BC break for Bower users! Underscore is no longer listed as a dependency in
the Bower plugin, allowing you the flexibility of choosing the templating
language you prefer. Also added a day of the week class to all clndr days in
the format `calendar-dow-<0-6>`, allowing you to style weekends/specific days
of the week differently.

`v1.1.3 ~ 2014-01-17`
> Fixed a bug where multiday events longer than two months
would not show up. Fixed a bug that prevented clndr from loading in IE8.

`v1.1.2 ~ 2013-12-15`
> Using the `forceSixRows` option, you can now force your calendar to render
six rows at all times, giving each month the same height. All classes and
events come through this extra set of days just as you would expect. The usage
of jQuery's `$.data` has been corrected such that calling
`$(#calendar-parent-element).data('plugin_clndr')` returns the clndr instance.

`v1.1.1 ~ 2013-12-02`
> You can now only call clndr on one element at a time. If you attempt to call
it on more than one element, an error is thrown. This should have no effect on
previous code as long as your selectors were only returning one element. There
is now a `bower.json` file.

`v1.1.0 ~ 2013-11-04`
> New features! In list form:
>  - Multiday Events: using the `multiDayEvents` option, you can now pass in
events that last more than one day. They will show up in all the days that they
span across.
>  - Constraints: you want to make a datepicker? Ok. Pass in a `constraints`
option with either a `startDate`, `endDate`, or both, and clndr will add the
`inactive` class to all days that aren't within your range. When you are at the
edge of the range, next and previous controls will not respond to click events
and will also get the class `inactive`.
>  - The use of `days.id` in templates has been deprecated all the way. It will
cause errors, so stop using it now please!
>  - Public API functions (forward, back, setMonth, setYear) now accept an
object with options. The only option at the moment is `withCallbacks`, which if
set to `true` will fire the `onMonthChange` and `onYearChange` callbacks.
>  - There are tests! example/test.html contains a list of human-powered tests
that cover all of the basic functionality.
>
> The only backward-compatibility break is the removal of the `days.id` field
used within templates. Upgrading clndr should have no negative repercussions
for you. Please open an issue if it does and it will get fixed!

`v1.0.13 ~ 2013-10-24`
> Changed the way `clndr.eventsLastMonth` and `clndr.eventsNextMonth`
propagate... previously they were only available if "showAdjacentMonths" was
turned on, whereas now they are always available. They are also available in
the template now as `eventsLastMonth` and `eventsNextMonth`. Fixed a bug where
`eventsLastMonth` and `eventsNextMonth` were jQuery arrays instead of regular
ol' Arrays. This bug was introduced in `v1.0.7`. Cleaned up example folder.

`v1.0.12 ~ 2013-10-22`
> You can now make next and previous year buttons using the classes
`clndr-next-year-button` and `clndr-previous-year-button`, or by specifying the
options `targets.nextYearButton` and `targets.previousYearButton`.
`doneRendering`'s `this` keyword is now set to the clndr instance. Added the
`ready` callback, which is a good place to attach event handlers. Added
`clickEvents.onYearChange`, which is fired whenever the year changed as a
result of a click action (even if you just went to the next month and it
happened to be December to January!).

`v1.0.11 ~ 2013-10-19`
> Set the context in all click events so that `this` now refers to your clndr
instance! `this` is also bound to the clndr instance in the `render` function.
Added the class `past` to all days before today.

`v1.0.10 ~ 2013-10-16`
> Fixed a nasty bug where events weren't getting passed into click handlers.
This bug was introduced with `v1.0.8`! Please update.

`v1.0.9 ~ 2013-10-16`
> Fixed an i18n bug where the days of the week would start on a Monday
correctly, but the calendar grid would still start as if the first day of the
week was Sunday. This fix correctly uses moment.js's current settings to
determine the first day of the week. If you are planning to use CLNDR in
multiple languages, update to this version!

`v1.0.8 ~ 2013-10-14`
> Deprecated the use of `days[].id`, adding it instead to the list of classes.
You no longer have to set an `id` for each day element, and if you do it will
be completely ignored. Just keep using `days[].classes`!
>
> Fixed a bug where an adjacent month's day would show up as `last-month` or
`next-month` incorrectly if the year was different. Added some validation to
address a bug where IDs would show up as `calendar-day-Invalid Date`.

`v1.0.7 ~ 2013-09-30`
> Settled on jQuery's $.filter method, opening the door to IE 7 + 8 support.
If you plan on supporting IE 8 or below, don't forget to use jQuery's 1.x
branch, as 2.x has dropped IE 6 - 8 support.

`v1.0.6 ~ 2013-09-24`
> Fixed a bug where `daysOfTheWeek` option wouldn't work.

`v1.0.5 ~ 2013-09-24`
> Added support for showing days in months adjacent to the current month,
controlled using the `showAdjacentMonths` option. Added the ability for those
adjacent days to move to their month when clicked using the
`adjacentDaysChangeMonth` option. Added `daysOfTheWeek` option, which you
should avoid by allowing moment.js to make the abbreviations for you. Fixed a
bug where providing some `targets: {}` options would remove the rest of them.

`v1.0.4 ~ 2013-09-14`
> Fixed a bug in `setEvents` and event population where events would show up
null.

`v1.0.3 ~ 2013-09-14`
> Underscore.js is now only relied upon for its `_.template()` function, which
means if you are using your own rendering engine you do NOT need underscore to
use clndr.js

`v1.0.0 ~ 2013-09-14`
> Officially v1.0.0! Added `extras` option, which exposesthe `extras` variable
in your template, allowing you to pass in arbitrary objects & synchronous
functions for use inside of your template.
