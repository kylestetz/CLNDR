/*
 *               ~ CLNDR v1.3.4 ~
 * ==============================================
 *       https://github.com/kylestetz/CLNDR
 * ==============================================
 *  created by kyle stetz (github.com/kylestetz)
 *        &available under the MIT license
 * http://opensource.org/licenses/mit-license.php
 * ==============================================
 *
 * This is the fully-commented development version of CLNDR.
 * For the production version, check out clndr.min.js
 * at https://github.com/kylestetz/CLNDR
 *
 * This work is based on the
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

(function (factory) {

  if (typeof define === 'function' && define.amd) {

    // AMD. Register as an anonymous module.
    define(['jquery', 'moment'], factory);
  } else if (typeof exports === 'object') {

    // Node/CommonJS
    factory(require('jquery'), require('moment'));
  } else {

    // Browser globals
    factory(jQuery, moment);
  }

}(function ($, moment) {

  // This is the default calendar template. This can be overridden.
  var clndrTemplate = "<div class='clndr-controls'>" +
    "<div class='clndr-control-button'><span class='clndr-previous-button'>previous</span></div><div class='month'><%= month %> <%= year %></div><div class='clndr-control-button rightalign'><span class='clndr-next-button'>next</span></div>" +
    "</div>" +
    "<table class='clndr-table' border='0' cellspacing='0' cellpadding='0'>" +
    "<thead>" +
    "<tr class='header-days'>" +
    "<% for(var i = 0; i < daysOfTheWeek.length; i++) { %>" +
      "<td class='header-day'><%= daysOfTheWeek[i] %></td>" +
    "<% } %>" +
    "</tr>" +
    "</thead>" +
    "<tbody>" +
    "<% for(var i = 0; i < numberOfRows; i++){ %>" +
      "<tr>" +
      "<% for(var j = 0; j < 7; j++){ %>" +
      "<% var d = j + i * 7; %>" +
      "<td class='<%= days[d].classes %>'><div class='day-contents'><%= days[d].day %>" +
      "</div></td>" +
      "<% } %>" +
      "</tr>" +
    "<% } %>" +
    "</tbody>" +
  "</table>";

  var pluginName = 'clndr';

  var defaults = {
    template: clndrTemplate,
    weekOffset: 0,
    startWithMonth: null,
    clickEvents: {
      click: null,
      nextMonth: null,
      previousMonth: null,
      nextYear: null,
      previousYear: null,
      today: null,
      onMonthChange: null,
      onYearChange: null
    },
    targets: {
      nextButton: 'clndr-next-button',
      previousButton: 'clndr-previous-button',
      nextYearButton: 'clndr-next-year-button',
      previousYearButton: 'clndr-previous-year-button',
      todayButton: 'clndr-today-button',
      day: 'day',
      empty: 'empty'
    },
    classes: {
      today: "today",
      event: "event",
      past: "past",
      lastMonth: "last-month",
      nextMonth: "next-month",
      adjacentMonth: "adjacent-month",
      inactive: "inactive",
      selected: "selected"
    },
    events: [],
    extras: null,
    dateParameter: 'date',
    multiDayEvents: null,
    doneRendering: null,
    render: null,
    daysOfTheWeek: null,
    showAdjacentMonths: true,
    adjacentDaysChangeMonth: false,
    ready: null,
    constraints: null,
    forceSixRows: null,
    trackSelectedDate: false,
    selectedDate: null,
    ignoreInactiveDaysInSelection: null,
    lengthOfTime: {
      months: null,
      days: null,
      interval: 1
    },
    moment: null
  };

  // The actual plugin constructor
  function Clndr( element, options ) {
    this.element = element;

    // merge the default options with user-provided options
    this.options = $.extend(true, {}, defaults, options);

    // check if moment was passed in as a dependency
    if(this.options.moment) {
      moment = this.options.moment;
    }

    // if there are events, we should run them through our addMomentObjectToEvents function
    // which will add a date object that we can use to make life easier. This is only necessary
    // when events are provided on instantiation, since our setEvents function uses addMomentObjectToEvents.
    if(this.options.events.length) {
      if(this.options.multiDayEvents) {
        this.options.events = this.addMultiDayMomentObjectsToEvents(this.options.events);
      } else {
        this.options.events = this.addMomentObjectToEvents(this.options.events);
      }
    }

    // this used to be a place where we'd figure out the current month, but since
    // we want to open up support for arbitrary lengths of time we're going to
    // store the current range in addition to the current month.
    if(this.options.lengthOfTime.months || this.options.lengthOfTime.days) {
      // we want to establish intervalStart and intervalEnd, which will keep track
      // of our boundaries. Let's look at the possibilities...
      if(this.options.lengthOfTime.months) {
        // gonna go right ahead and annihilate any chance for bugs here.
        this.options.lengthOfTime.days = null;
        // the length is specified in months. Is there a start date?
        if(this.options.lengthOfTime.startDate) {
          this.intervalStart = moment(this.options.lengthOfTime.startDate).startOf('month');
        } else if(this.options.startWithMonth) {
          this.intervalStart = moment(this.options.startWithMonth).startOf('month');
        } else {
          this.intervalStart = moment().startOf('month');
        }
        // subtract a day so that we are at the end of the interval. We always
        // want intervalEnd to be inclusive.
        this.intervalEnd = moment(this.intervalStart).add(this.options.lengthOfTime.months, 'months').subtract(1, 'days');
        this.month = this.intervalStart.clone();
      } else if(this.options.lengthOfTime.days) {
        // the length is specified in days. Start date?
        if(this.options.lengthOfTime.startDate) {
          this.intervalStart = moment(this.options.lengthOfTime.startDate).startOf('day');
        } else {
          this.intervalStart = moment().weekday(0).startOf('day');
        }
        this.intervalEnd = moment(this.intervalStart).add(this.options.lengthOfTime.days - 1, 'days').endOf('day');
        this.month = this.intervalStart.clone();
      }
    } else {
      this.month = moment().startOf('month');
      this.intervalStart = moment(this.month);
      this.intervalEnd = moment(this.month).endOf('month');
    }

    if(this.options.startWithMonth) {
      this.month = moment(this.options.startWithMonth).startOf('month');
      this.intervalStart = moment(this.month);
      this.intervalEnd = moment(this.month).endOf('month');
    }

    // if we've got constraints set, make sure the interval is within them.
    if(this.options.constraints) {
      // first check if the start date exists & is later than now.
      if(this.options.constraints.startDate) {
        var startMoment = moment(this.options.constraints.startDate);
        if(this.intervalStart.isBefore(startMoment, 'month')) {
          // try to preserve the date by moving only the month...
          this.intervalStart.set('month', startMoment.month()).set('year', startMoment.year());
          this.month.set('month', startMoment.month()).set('year', startMoment.year());
        }
      }
      // make sure the intervalEnd is before the endDate
      if(this.options.constraints.endDate) {
        var endMoment = moment(this.options.constraints.endDate);
        if(this.intervalEnd.isAfter(endMoment, 'month')) {
          this.intervalEnd.set('month', endMoment.month()).set('year', endMoment.year());
          this.month.set('month', endMoment.month()).set('year', endMoment.year());
        }
      }
    }

    this._defaults = defaults;
    this._name = pluginName;

    // Some first-time initialization -> day of the week offset,
    // template compiling, making and storing some elements we'll need later,
    // & event handling for the controller.
    this.init();
  }

  Clndr.prototype.init = function () {
    // create the days of the week using moment's current language setting
    this.daysOfTheWeek = this.options.daysOfTheWeek || [];
    if(!this.options.daysOfTheWeek) {
      this.daysOfTheWeek = [];
      for(var i = 0; i < 7; i++) {
        this.daysOfTheWeek.push( moment().weekday(i).format('dd').charAt(0) );
      }
    }
    // shuffle the week if there's an offset
    if(this.options.weekOffset) {
      this.daysOfTheWeek = this.shiftWeekdayLabels(this.options.weekOffset);
    }

    // quick & dirty test to make sure rendering is possible.
    if( !$.isFunction(this.options.render) ) {
      this.options.render = null;
      if (typeof _ === 'undefined') {
        throw new Error("Underscore was not found. Please include underscore.js OR provide a custom render function.");
      }
      else {
        // we're just going ahead and using underscore here if no render method has been supplied.
        this.compiledClndrTemplate = _.template(this.options.template);
      }
    }

    // create the parent element that will hold the plugin & save it for later
    $(this.element).html("<div class='clndr'></div>");
    this.calendarContainer = $('.clndr', this.element);

    // attach event handlers for clicks on buttons/cells
    this.bindEvents();

    // do a normal render of the calendar template
    this.render();

    // if a ready callback has been provided, call it.
    if(this.options.ready) {
      this.options.ready.apply(this, []);
    }
  };

  Clndr.prototype.shiftWeekdayLabels = function(offset) {
    var days = this.daysOfTheWeek;
    for(var i = 0; i < offset; i++) {
      days.push( days.shift() );
    }
    return days;
  };

  // This is where the magic happens. Given a starting date and ending date,
  // an array of calendarDay objects is constructed that contains appropriate
  // events and classes depending on the circumstance.
  Clndr.prototype.createDaysObject = function(startDate, endDate) {
    // this array will hold numbers for the entire grid (even the blank spaces)
    var daysArray = [];
    var date = startDate.clone();
    var lengthOfInterval = endDate.diff(startDate, 'days');

    // this is a helper object so that days can resolve their classes correctly.
    // Don't use it for anything please.
    this._currentIntervalStart = startDate.clone();

    // filter the events list (if it exists) to events that are happening last month, this month and next month (within the current grid view)
    this.eventsLastMonth = [];
    this.eventsThisInterval = [];
    this.eventsNextMonth = [];

    if(this.options.events.length) {

      // EVENT PARSING
      // here are the only two cases where we don't get an event in our interval:
      // startDate | endDate   | e.start   | e.end
      // e.start   | e.end     | startDate | endDate
      this.eventsThisInterval = $(this.options.events).filter( function() {
        if(
          this._clndrEndDateObject.isBefore(startDate) ||
          this._clndrStartDateObject.isAfter(endDate)
        ) {
          return false;
        } else {
          return true;
        }
      }).toArray();

      if(this.options.showAdjacentMonths) {
        var startOfLastMonth = startDate.clone().subtract(1, 'months').startOf('month');
        var endOfLastMonth = startOfLastMonth.clone().endOf('month');
        var startOfNextMonth = endDate.clone().add(1, 'months').startOf('month');
        var endOfNextMonth = startOfNextMonth.clone().endOf('month');

        this.eventsLastMonth = $(this.options.events).filter( function() {
          if(
            this._clndrEndDateObject.isBefore(startOfLastMonth) ||
            this._clndrStartDateObject.isAfter(endOfLastMonth)
          ) {
            return false;
          } else {
            return true;
          }
        }).toArray();

        this.eventsNextMonth = $(this.options.events).filter( function() {
          if(
            this._clndrEndDateObject.isBefore(startOfNextMonth) ||
            this._clndrStartDateObject.isAfter(endOfNextMonth)
          ) {
            return false;
          } else {
            return true;
          }
        }).toArray();
      }
    }

    // if diff is greater than 0, we'll have to fill in last days of the previous month
    // to account for the empty boxes in the grid.
    // we also need to take into account the weekOffset parameter.
    // None of this needs to happen if the interval is being specified in days rather than months.
    if(!this.options.lengthOfTime.days) {
      var diff = date.weekday() - this.options.weekOffset;
      if(diff < 0) diff += 7;

      if(this.options.showAdjacentMonths) {
        for(var i = 0; i < diff; i++) {
          var day = moment([startDate.year(), startDate.month(), i - diff + 1]);
          daysArray.push( this.createDayObject(day, this.eventsLastMonth) );
        }
      } else {
        for(var i = 0; i < diff; i++) {
          daysArray.push( this.calendarDay({
            classes: this.options.targets.empty + " " + this.options.classes.lastMonth
          }) );
        }
      }
    }

    // now we push all of the days in the interval
    var dateIterator = startDate.clone();
    while( dateIterator.isBefore(endDate) || dateIterator.isSame(endDate, 'day') ) {
      daysArray.push( this.createDayObject(dateIterator.clone(), this.eventsThisInterval) );
      dateIterator.add(1, 'days');
    }

    // ...and if there are any trailing blank boxes, fill those in
    // with the next month first days.
    // Again, we can ignore this if the interval is specified in days.
    if(!this.options.lengthOfTime.days) {
      while(daysArray.length % 7 !== 0) {
        if(this.options.showAdjacentMonths) {
          daysArray.push( this.createDayObject(dateIterator.clone(), this.eventsNextMonth) );
        } else {
          daysArray.push( this.calendarDay({
            classes: this.options.targets.empty + " " + this.options.classes.nextMonth
          }) );
        }
        dateIterator.add(1, 'days');
      }
    }

    // if we want to force six rows of calendar, now's our Last Chance to add another row.
    // if the 42 seems explicit it's because we're creating a 7-row grid and 6 rows of 7 is always 42!
    if(this.options.forceSixRows && daysArray.length !== 42 ) {
      while(daysArray.length < 42) {
        if(this.options.showAdjacentMonths) {
          daysArray.push( this.createDayObject(dateIterator.clone(), this.eventsNextMonth) );
          dateIterator.add(1, 'days');
        } else {
          daysArray.push( this.calendarDay({
            classes: this.options.targets.empty + " " + this.options.classes.nextMonth
          }) );
        }
      }
    }

    return daysArray;
  };

  Clndr.prototype.createDayObject = function(day, monthEvents) {
    var eventsToday = [];
    var now = moment();
    var self = this;

    // validate moment date
    if (!day.isValid() && day.hasOwnProperty('_d') && day._d != undefined) {
        day = moment(day._d);
    }

    var j = 0, l = monthEvents.length;
    for(j; j < l; j++) {
      // keep in mind that the events here already passed the month/year test.
      // now all we have to compare is the moment.date(), which returns the day of the month.
      var start = monthEvents[j]._clndrStartDateObject;
      var end = monthEvents[j]._clndrEndDateObject;
      // if today is the same day as start or is after the start, and
      // if today is the same day as the end or before the end ...
      // woohoo semantics!
      if( ( day.isSame(start, 'day') || day.isAfter(start, 'day') ) &&
        ( day.isSame(end, 'day') || day.isBefore(end, 'day') ) ) {
        eventsToday.push( monthEvents[j] );
      }
    }

    var properties = {
      isInactive: false,
      isAdjacentMonth: false,
      isToday: false
    };
    var extraClasses = "";

    if(now.format("YYYY-MM-DD") == day.format("YYYY-MM-DD")) {
      extraClasses += (" " + this.options.classes.today);
      properties.isToday = true;
    }
    if(day.isBefore(now, 'day')) {
      extraClasses += (" " + this.options.classes.past);
    }
    if(eventsToday.length) {
      extraClasses += (" " + this.options.classes.event);
    }
    if(!this.options.lengthOfTime.days) {
      if(this._currentIntervalStart.month() > day.month()) {
        extraClasses += (" " + this.options.classes.adjacentMonth);
        properties.isAdjacentMonth = true;

        this._currentIntervalStart.year() === day.year()
            ? extraClasses += (" " + this.options.classes.lastMonth)
            : extraClasses += (" " + this.options.classes.nextMonth);

      } else if(this._currentIntervalStart.month() < day.month()) {
        extraClasses += (" " + this.options.classes.adjacentMonth);
        properties.isAdjacentMonth = true;

        this._currentIntervalStart.year() === day.year()
            ? extraClasses += (" " + this.options.classes.nextMonth)
            : extraClasses += (" " + this.options.classes.lastMonth);
      }
    }

    // if there are constraints, we need to add the inactive class to the days outside of them
    if(this.options.constraints) {
      if(this.options.constraints.startDate && day.isBefore(moment( this.options.constraints.startDate ))) {
        extraClasses += (" " + this.options.classes.inactive);
        properties.isInactive = true;
      }
      if(this.options.constraints.endDate && day.isAfter(moment( this.options.constraints.endDate ))) {
        extraClasses += (" " + this.options.classes.inactive);
        properties.isInactive = true;
      }
    }

    // validate moment date
    if (!day.isValid() && day.hasOwnProperty('_d') && day._d != undefined) {
        day = moment(day._d);
    }

    // check whether the day is "selected"
    if (this.options.selectedDate && day.isSame(moment(this.options.selectedDate), 'day')) {
      extraClasses += (" " + this.options.classes.selected);
    }

    // we're moving away from using IDs in favor of classes, since when
    // using multiple calendars on a page we are technically violating the
    // uniqueness of IDs.
    extraClasses += " calendar-day-" + day.format("YYYY-MM-DD");

    // day of week
    extraClasses += " calendar-dow-" + day.weekday();

    return this.calendarDay({
      day: day.date(),
      classes: this.options.targets.day + extraClasses,
      events: eventsToday,
      date: day,
      properties: properties
    });
  };

  Clndr.prototype.render = function() {
    // get rid of the previous set of calendar parts.
    // this should handle garbage collection according to jQuery's docs:
    // http://api.jquery.com/empty/
    //  > To avoid memory leaks, jQuery removes other constructs such as
    //  > data and event handlers from the child elements before removing
    //  > the elements themselves.
    this.calendarContainer.empty();

    var data = {};

    if(this.options.lengthOfTime.days) {
      var days = this.createDaysObject(this.intervalStart.clone(), this.intervalEnd.clone());

      data = {
        daysOfTheWeek: this.daysOfTheWeek,
        numberOfRows: Math.ceil(days.length / 7),
        months: [],
        days: days,
        month: null,
        year: null,
        intervalStart: this.intervalStart.clone(),
        intervalEnd: this.intervalEnd.clone(),
        eventsThisInterval: this.eventsThisInterval,
        eventsLastMonth: [],
        eventsNextMonth: [],
        extras: this.options.extras
      };

    } else if(this.options.lengthOfTime.months) {

      var months = [];
      var eventsThisInterval = [];

      for(i = 0; i < this.options.lengthOfTime.months; i++) {
        var currentIntervalStart = this.intervalStart.clone().add(i, 'months');
        var currentIntervalEnd = currentIntervalStart.clone().endOf('month');
        var days = this.createDaysObject(currentIntervalStart, currentIntervalEnd);
        // save events processed for each month into a master array of events for
        // this interval
        eventsThisInterval.push(this.eventsThisInterval);
        months.push({
          month: currentIntervalStart,
          days: days
        });
      }

      data = {
        daysOfTheWeek: this.daysOfTheWeek,
        numberOfRows: _.reduce(months, function(memo, monthObj) {
          return memo + Math.ceil(monthObj.days.length / 7);
        }, 0),
        months: months,
        days: [],
        month: null,
        year: null,
        intervalStart: this.intervalStart,
        intervalEnd: this.intervalEnd,
        eventsThisInterval: eventsThisInterval,
        eventsLastMonth: this.eventsLastMonth,
        eventsNextMonth: this.eventsNextMonth,
        extras: this.options.extras
      };
    } else {
      // get an array of days and blank spaces
      var days = this.createDaysObject(this.month.clone().startOf('month'), this.month.clone().endOf('month'));
      // this is to prevent a scope/naming issue between this.month and data.month
      var currentMonth = this.month;

      var data = {
        daysOfTheWeek: this.daysOfTheWeek,
        numberOfRows: Math.ceil(days.length / 7),
        months: [],
        days: days,
        month: this.month.format('MMMM'),
        year: this.month.year(),
        eventsThisMonth: this.eventsThisInterval,
        eventsLastMonth: this.eventsLastMonth,
        eventsNextMonth: this.eventsNextMonth,
        extras: this.options.extras
      };
    }

    // render the calendar with the data above & bind events to its elements
    if(!this.options.render) {
      this.calendarContainer.html(this.compiledClndrTemplate(data));
    } else {
      this.calendarContainer.html(this.options.render.apply(this, [data]));
    }

    // if there are constraints, we need to add the 'inactive' class to the controls
    if(this.options.constraints) {
      // in the interest of clarity we're just going to remove all inactive classes and re-apply them each render.
      for(var target in this.options.targets) {
        if(target != this.options.targets.day) {
          this.element.find('.' + this.options.targets[target]).toggleClass(this.options.classes.inactive, false);
        }
      }

      var start = null;
      var end = null;

      if(this.options.constraints.startDate) {
        start = moment(this.options.constraints.startDate);
      }
      if(this.options.constraints.endDate) {
        end = moment(this.options.constraints.endDate);
      }
      // deal with the month controls first.
      // do we have room to go back?
      if(start && (start.isAfter(this.intervalStart) || start.isSame(this.intervalStart, 'day'))) {
        this.element.find('.' + this.options.targets.previousButton).toggleClass(this.options.classes.inactive, true);
      }
      // do we have room to go forward?
      if(end && (end.isBefore(this.intervalEnd) || end.isSame(this.intervalEnd, 'day'))) {
        this.element.find('.' + this.options.targets.nextButton).toggleClass(this.options.classes.inactive, true);
      }
      // what's last year looking like?
      if(start && start.isAfter(this.intervalStart.clone().subtract(1, 'years')) ) {
        this.element.find('.' + this.options.targets.previousYearButton).toggleClass(this.options.classes.inactive, true);
      }
      // how about next year?
      if(end && end.isBefore(this.intervalEnd.clone().add(1, 'years')) ) {
        this.element.find('.' + this.options.targets.nextYearButton).toggleClass(this.options.classes.inactive, true);
      }
      // today? we could put this in init(), but we want to support the user changing the constraints on a living instance.
      if(( start && start.isAfter( moment(), 'month' ) ) || ( end && end.isBefore( moment(), 'month' ) )) {
        this.element.find('.' + this.options.targets.today).toggleClass(this.options.classes.inactive, true);
      }
    }

    if(this.options.doneRendering) {
      this.options.doneRendering.apply(this, []);
    }
  };

  Clndr.prototype.bindEvents = function() {
    var $container = $(this.element);
    var self = this;
    var eventType = 'click';
    if (self.options.useTouchEvents === true) {
      eventType = 'touchstart';
    }

    // Make sure we don't already have events
    $container.off( eventType +'.clndr', '.'+this.options.targets.day )
      .off( eventType +'.clndr', '.'+this.options.targets.empty )
      .off( eventType +'.clndr', '.'+this.options.targets.previousButton )
      .off( eventType +'.clndr', '.'+this.options.targets.nextButton )
      .off( eventType +'.clndr', '.'+this.options.targets.todayButton )
      .off( eventType +'.clndr', '.'+this.options.targets.nextYearButton )
      .off( eventType +'.clndr', '.'+this.options.targets.previousYearButton );

    // target the day elements and give them click events
    $container.on(eventType +'.clndr', '.'+this.options.targets.day, function(event) {
      if(self.options.clickEvents.click) {
        var target = self.buildTargetObject(event.currentTarget, true);
        self.options.clickEvents.click.apply(self, [target]);
      }
      // if adjacentDaysChangeMonth is on, we need to change the month here.
      if(self.options.adjacentDaysChangeMonth) {
        if($(event.currentTarget).is( '.' + self.options.classes.lastMonth )) {
          self.backActionWithContext(self);
        } else if($(event.currentTarget).is( '.' + self.options.classes.nextMonth )) {
          self.forwardActionWithContext(self);
        }
      }
      // if trackSelectedDate is on, we need to handle click on a new day
      if (self.options.trackSelectedDate) {
        if(self.options.ignoreInactiveDaysInSelection && $(event.currentTarget).hasClass('inactive')) {
          return;
        }
        // remember new selected date
        self.options.selectedDate = self.getTargetDateString(event.currentTarget);

        // handle "selected" class
        $(event.currentTarget)
          .siblings().removeClass(self.options.classes.selected).end()
          .addClass(self.options.classes.selected);
      }
    });
    // target the empty calendar boxes as well
    $container.on(eventType +'.clndr', '.'+this.options.targets.empty, function(event) {
      if(self.options.clickEvents.click) {
        var target = self.buildTargetObject(event.currentTarget, false);
        self.options.clickEvents.click.apply(self, [target]);
      }
      if(self.options.adjacentDaysChangeMonth) {
        if($(event.currentTarget).is( '.' + self.options.classes.lastMonth )) {
          self.backActionWithContext(self);
        } else if($(event.currentTarget).is( '.' + self.options.classes.nextMonth )) {
          self.forwardActionWithContext(self);
        }
      }
    });

    // bind the previous, next and today buttons
    $container
      .on(eventType +'.clndr', '.'+this.options.targets.previousButton, { context: this }, this.backAction)
      .on(eventType +'.clndr', '.'+this.options.targets.nextButton, { context: this }, this.forwardAction)
      .on(eventType +'.clndr', '.'+this.options.targets.todayButton, { context: this }, this.todayAction)
      .on(eventType +'.clndr', '.'+this.options.targets.nextYearButton, { context: this }, this.nextYearAction)
      .on(eventType +'.clndr', '.'+this.options.targets.previousYearButton, { context: this }, this.previousYearAction);
  }

  // If the user provided a click callback we'd like to give them something nice to work with.
  // buildTargetObject takes the DOM element that was clicked and returns an object with
  // the DOM element, events, and the date (if the latter two exist). Currently it is based on the id,
  // however it'd be nice to use a data- attribute in the future.
  Clndr.prototype.buildTargetObject = function(currentTarget, targetWasDay) {
    // This is our default target object, assuming we hit an empty day with no events.
    var target = {
      element: currentTarget,
      events: [],
      date: null
    };
    // did we click on a day or just an empty box?
    if(targetWasDay) {
      var dateString = this.getTargetDateString(currentTarget);
      target.date = (dateString) ? moment(dateString) : null;

      // do we have events?
      if(this.options.events) {
        // are any of the events happening today?
        if(this.options.multiDayEvents) {
          target.events = $.makeArray( $(this.options.events).filter( function() {
            // filter the dates down to the ones that match.
            return ( ( target.date.isSame(this._clndrStartDateObject, 'day') || target.date.isAfter(this._clndrStartDateObject, 'day') ) &&
              ( target.date.isSame(this._clndrEndDateObject, 'day') || target.date.isBefore(this._clndrEndDateObject, 'day') ) );
          }) );
        } else {
          target.events = $.makeArray( $(this.options.events).filter( function() {
            // filter the dates down to the ones that match.
            return this._clndrStartDateObject.format('YYYY-MM-DD') == dateString;
          }) );
        }
      }
    }

    return target;
  }

  // get moment date object of the date associated with the given target.
  // this method is meant to be called on ".day" elements.
  Clndr.prototype.getTargetDateString = function(target) {
    // Our identifier is in the list of classNames. Find it!
    var classNameIndex = target.className.indexOf('calendar-day-');
    if(classNameIndex !== -1) {
      // our unique identifier is always 23 characters long.
      // If this feels a little wonky, that's probably because it is.
      // Open to suggestions on how to improve this guy.
      return target.className.substring(classNameIndex + 13, classNameIndex + 23);
    }

    return null;
  }

  // the click handlers in bindEvents need a context, so these are wrappers
  // to the actual functions. Todo: better way to handle this?
  Clndr.prototype.forwardAction = function(event) {
    var self = event.data.context;
    self.forwardActionWithContext(self);
  };

  Clndr.prototype.backAction = function(event) {
    var self = event.data.context;
    self.backActionWithContext(self);
  };

  // These are called directly, except for in the bindEvent click handlers,
  // where forwardAction and backAction proxy to these guys.
  Clndr.prototype.backActionWithContext = function(self) {
    // before we do anything, check if there is an inactive class on the month control.
    // if it does, we want to return and take no action.
    if(self.element.find('.' + self.options.targets.previousButton).hasClass('inactive')) {
      return;
    }

    var yearChanged = null;

    if(!self.options.lengthOfTime.days) {
      // shift the interval by a month (or several months)
      self.intervalStart.subtract(self.options.lengthOfTime.interval, 'months').startOf('month');
      self.intervalEnd = self.intervalStart.clone().add(self.options.lengthOfTime.months || self.options.lengthOfTime.interval, 'months').subtract(1, 'days').endOf('month');

      if(!self.options.lengthOfTime.months) {
        yearChanged = !self.month.isSame( moment(self.month).subtract(1, 'months'), 'year');
      }

      self.month = self.intervalStart.clone();
    } else {
      // shift the interval in days
      self.intervalStart.subtract(self.options.lengthOfTime.interval, 'days').startOf('day');
      self.intervalEnd = self.intervalStart.clone().add(self.options.lengthOfTime.days - 1, 'days').endOf('day');
      // this is useless, i think, but i'll keep it as a precaution for now
      self.month = self.intervalStart.clone();
    }

    self.render();

    if(!self.options.lengthOfTime.days && !self.options.lengthOfTime.months) {
      if(self.options.clickEvents.previousMonth) {
        self.options.clickEvents.previousMonth.apply( self, [moment(self.month)] );
      }
      if(self.options.clickEvents.onMonthChange) {
        self.options.clickEvents.onMonthChange.apply( self, [moment(self.month)] );
      }
      if(yearChanged) {
        if(self.options.clickEvents.onYearChange) {
          self.options.clickEvents.onYearChange.apply( self, [moment(self.month)] );
        }
      }
    } else {
      if(self.options.clickEvents.previousInterval) {
        self.options.clickEvents.previousInterval.apply( self, [moment(self.intervalStart), moment(self.intervalEnd)] );
      }
      if(self.options.clickEvents.onIntervalChange) {
        self.options.clickEvents.onIntervalChange.apply( self, [moment(self.intervalStart), moment(self.intervalEnd)] );
      }
    }
  };

  Clndr.prototype.forwardActionWithContext = function(self) {
    // before we do anything, check if there is an inactive class on the month control.
    // if it does, we want to return and take no action.
    if(self.element.find('.' + self.options.targets.nextButton).hasClass('inactive')) {
      return;
    }

    var yearChanged = null;

    if(!self.options.lengthOfTime.days) {
      // shift the interval by a month (or several months)
      self.intervalStart.add(self.options.lengthOfTime.interval, 'months').startOf('month');
      self.intervalEnd = self.intervalStart.clone().add(self.options.lengthOfTime.months || self.options.lengthOfTime.interval, 'months').subtract(1, 'days').endOf('month');

      if(!self.options.lengthOfTime.months) {
        yearChanged = !self.month.isSame( moment(self.month).add(1, 'months'), 'year');
      }

      self.month = self.intervalStart.clone();
    } else {
      // shift the interval in days
      self.intervalStart.add(self.options.lengthOfTime.interval, 'days').startOf('day');
      self.intervalEnd = self.intervalStart.clone().add(self.options.lengthOfTime.days - 1, 'days').endOf('day');
      // this is useless, i think, but i'll keep it as a precaution for now
      self.month = self.intervalStart.clone();
    }

    self.render();

    if(!self.options.lengthOfTime.days && !self.options.lengthOfTime.months) {
      if(self.options.clickEvents.nextMonth) {
        self.options.clickEvents.nextMonth.apply( self, [moment(self.month)] );
      }
      if(self.options.clickEvents.onMonthChange) {
        self.options.clickEvents.onMonthChange.apply( self, [moment(self.month)] );
      }
      if(yearChanged) {
        if(self.options.clickEvents.onYearChange) {
          self.options.clickEvents.onYearChange.apply( self, [moment(self.month)] );
        }
      }
    } else {
      if(self.options.clickEvents.nextInterval) {
        self.options.clickEvents.nextInterval.apply( self, [moment(self.intervalStart), moment(self.intervalEnd)] );
      }
      if(self.options.clickEvents.onIntervalChange) {
        self.options.clickEvents.onIntervalChange.apply( self, [moment(self.intervalStart), moment(self.intervalEnd)] );
      }
    }
  };

  Clndr.prototype.todayAction = function(event) {
    var self = event.data.context;

    // did we switch months when the today button was hit?
    var monthChanged = !self.month.isSame(moment(), 'month');
    var yearChanged = !self.month.isSame(moment(), 'year');

    self.month = moment().startOf('month');

    if(self.options.lengthOfTime.days) {
      // if there was a startDate specified, we should figure out what the weekday is and
      // use that as the starting point of our interval. If not, go to today.weekday(0)
      if(self.options.lengthOfTime.startDate) {
        self.intervalStart = moment().weekday(self.options.lengthOfTime.startDate.weekday()).startOf('day');
      } else {
        self.intervalStart = moment().weekday(0).startOf('day');
      }
      self.intervalEnd = self.intervalStart.clone().add(self.options.lengthOfTime.days - 1, 'days').endOf('day');

    } else if(self.options.lengthOfTime.months) {
      // set the intervalStart to this month.
      self.intervalStart = moment().startOf('month');
      self.intervalEnd = self.intervalStart.clone()
        .add(self.options.lengthOfTime.months || self.options.lengthOfTime.interval, 'months')
        .subtract(1, 'days')
        .endOf('month');
    } else if(monthChanged) {
      // reset the start interval for the current month
      self.intervalStart = moment().startOf('month');
      // no need to re-render if we didn't change months.
      self.render();

      // fire the today event handler regardless of whether the month changed.
      if(self.options.clickEvents.today) {
        self.options.clickEvents.today.apply( self, [moment(self.month)] );
      }

      // fire the onMonthChange callback
      if(self.options.clickEvents.onMonthChange) {
        self.options.clickEvents.onMonthChange.apply( self, [moment(self.month)] );
      }
      // maybe fire the onYearChange callback?
      if(yearChanged) {
        if(self.options.clickEvents.onYearChange) {
          self.options.clickEvents.onYearChange.apply( self, [moment(self.month)] );
        }
      }
    }

    if(self.options.lengthOfTime.days || self.options.lengthOfTime.months) {
      self.render();
      // fire the today event handler regardless of whether the month changed.
      if(self.options.clickEvents.today) {
        self.options.clickEvents.today.apply( self, [moment(self.month)] );
      }
      if(self.options.clickEvents.onIntervalChange) {
        self.options.clickEvents.onIntervalChange.apply( self, [moment(self.intervalStart), moment(self.intervalEnd)] );
      }
    }
  };

  Clndr.prototype.nextYearAction = function(event) {
    var self = event.data.context;
    // before we do anything, check if there is an inactive class on the month control.
    // if it does, we want to return and take no action.
    if(self.element.find('.' + self.options.targets.nextYearButton).hasClass('inactive')) {
      return;
    }

    self.month.add(1, 'years');
    self.intervalStart.add(1, 'years');
    self.intervalEnd.add(1, 'years');

    self.render();

    if(self.options.clickEvents.nextYear) {
      self.options.clickEvents.nextYear.apply( self, [moment(self.month)] );
    }
    if(self.options.lengthOfTime.days || self.options.lengthOfTime.months) {
      if(self.options.clickEvents.onIntervalChange) {
        self.options.clickEvents.onIntervalChange.apply( self, [moment(self.intervalStart), moment(self.intervalEnd)] );
      }
    } else {
      if(self.options.clickEvents.onMonthChange) {
        self.options.clickEvents.onMonthChange.apply( self, [moment(self.month)] );
      }
      if(self.options.clickEvents.onYearChange) {
        self.options.clickEvents.onYearChange.apply( self, [moment(self.month)] );
      }
    }
  };

  Clndr.prototype.previousYearAction = function(event) {
    var self = event.data.context;
    // before we do anything, check if there is an inactive class on the month control.
    // if it does, we want to return and take no action.
    if(self.element.find('.' + self.options.targets.previousYearButton).hasClass('inactive')) {
      return;
    }

    self.month.subtract(1, 'years');
    self.intervalStart.subtract(1, 'years');
    self.intervalEnd.subtract(1, 'years');

    self.render();

    if(self.options.clickEvents.previousYear) {
      self.options.clickEvents.previousYear.apply( self, [moment(self.month)] );
    }
    if(self.options.lengthOfTime.days || self.options.lengthOfTime.months) {
      if(self.options.clickEvents.onIntervalChange) {
        self.options.clickEvents.onIntervalChange.apply( self, [moment(self.intervalStart), moment(self.intervalEnd)] );
      }
    } else {
      if(self.options.clickEvents.onMonthChange) {
        self.options.clickEvents.onMonthChange.apply( self, [moment(self.month)] );
      }
      if(self.options.clickEvents.onYearChange) {
        self.options.clickEvents.onYearChange.apply( self, [moment(self.month)] );
      }
    }
  };

  Clndr.prototype.forward = function(options) {
    if(!this.options.lengthOfTime.days) {
      // shift the interval by a month (or several months)
      this.intervalStart.add(this.options.lengthOfTime.interval, 'months').startOf('month');
      this.intervalEnd = this.intervalStart.clone().add(this.options.lengthOfTime.months || this.options.lengthOfTime.interval, 'months').subtract(1, 'days').endOf('month');
      this.month = this.intervalStart.clone();
    } else {
      // shift the interval in days
      this.intervalStart.add(this.options.lengthOfTime.interval, 'days').startOf('day');
      this.intervalEnd = this.intervalStart.clone().add(this.options.lengthOfTime.days - 1, 'days').endOf('day');
      this.month = this.intervalStart.clone();
    }

    this.render();

    if(options && options.withCallbacks) {
      if(this.options.lengthOfTime.days || this.options.lengthOfTime.months) {
        if(this.options.clickEvents.onIntervalChange) {
          this.options.clickEvents.onIntervalChange.apply( this, [moment(this.intervalStart), moment(this.intervalEnd)] );
        }
      } else {
        if(this.options.clickEvents.onMonthChange) {
          this.options.clickEvents.onMonthChange.apply( this, [moment(this.month)] );
        }
        // We entered a new year
        if (this.month.month() === 0 && this.options.clickEvents.onYearChange) {
          this.options.clickEvents.onYearChange.apply( this, [moment(this.month)] );
        }
      }
    }

    return this;
  }

  Clndr.prototype.back = function(options) {
    if(!this.options.lengthOfTime.days) {
      // shift the interval by a month (or several months)
      this.intervalStart.subtract(this.options.lengthOfTime.interval, 'months').startOf('month');
      this.intervalEnd = this.intervalStart.clone().add(this.options.lengthOfTime.months || this.options.lengthOfTime.interval, 'months').subtract(1, 'days').endOf('month');
      this.month = this.intervalStart.clone();
    } else {
      // shift the interval in days
      this.intervalStart.subtract(this.options.lengthOfTime.interval, 'days').startOf('day');
      this.intervalEnd = this.intervalStart.clone().add(this.options.lengthOfTime.days - 1, 'days').endOf('day');
      this.month = this.intervalStart.clone();
    }

    this.render();

    if(options && options.withCallbacks) {
      if(this.options.lengthOfTime.days || this.options.lengthOfTime.months) {
        if(this.options.clickEvents.onIntervalChange) {
          this.options.clickEvents.onIntervalChange.apply( this, [moment(this.intervalStart), moment(this.intervalEnd)] );
        }
      } else {
        if(this.options.clickEvents.onMonthChange) {
          this.options.clickEvents.onMonthChange.apply( this, [moment(this.month)] );
        }
        // We went all the way back to previous year
        if (this.month.month() === 11 && this.options.clickEvents.onYearChange) {
          this.options.clickEvents.onYearChange.apply( this, [moment(this.month)] );
        }
      }
    }

    return this;
  }

  // alternate names for convenience
  Clndr.prototype.next = function(options) {
    this.forward(options);
    return this;
  }

  Clndr.prototype.previous = function(options) {
    this.back(options);
    return this;
  }

  Clndr.prototype.setMonth = function(newMonth, options) {
    // accepts 0 - 11 or a full/partial month name e.g. "Jan", "February", "Mar"
    if(!this.options.lengthOfTime.days && !this.options.lengthOfTime.months) {
      this.month.month(newMonth);
      this.intervalStart = this.month.clone().startOf('month');
      this.intervalEnd = this.intervalStart.clone().endOf('month');
      this.render();
      if(options && options.withCallbacks) {
        if(this.options.clickEvents.onMonthChange) {
          this.options.clickEvents.onMonthChange.apply( this, [moment(this.month)] );
        }
      }
    } else {
      console.log('You are using a custom date interval; use Clndr.setIntervalStart(startDate) instead.');
    }
    return this;
  }

  Clndr.prototype.setIntervalStart = function(newDate, options) {
    // accepts a date string or moment object
    if(this.options.lengthOfTime.days) {
      this.intervalStart = moment(newDate).startOf('day');
      this.intervalEnd = this.intervalStart.clone().add(this.options.lengthOfTime.days - 1, 'days').endOf('day');
    } else if(this.options.lengthOfTime.months) {
      this.intervalStart = moment(newDate).startOf('month');
      this.intervalEnd = this.intervalStart.clone().add(this.options.lengthOfTime.months || this.options.lengthOfTime.interval, 'months').subtract(1, 'days').endOf('month');
      this.month = this.intervalStart.clone();
    }

    if(this.options.lengthOfTime.days || this.options.lengthOfTime.months) {
      this.render();

      if(options && options.withCallbacks) {
        if(this.options.clickEvents.onIntervalChange) {
          this.options.clickEvents.onIntervalChange.apply( this, [moment(this.intervalStart), moment(this.intervalEnd)] );
        }
      }
    } else {
      console.log('You are using a custom date interval; use Clndr.setIntervalStart(startDate) instead.');
    }
    return this;
  }

  Clndr.prototype.nextYear = function(options) {
    this.month.add(1, 'year');
    this.intervalStart.add(1, 'year');
    this.intervalEnd.add(1, 'year');
    this.render();
    if(options && options.withCallbacks) {
      if(this.options.clickEvents.onYearChange) {
        this.options.clickEvents.onYearChange.apply( this, [moment(this.month)] );
      }
      if(this.options.clickEvents.onIntervalChange) {
        this.options.clickEvents.onIntervalChange.apply( this, [moment(this.intervalStart), moment(this.intervalEnd)] );
      }
    }
    return this;
  }

  Clndr.prototype.previousYear = function(options) {
    this.month.subtract(1, 'year');
    this.intervalStart.subtract(1, 'year');
    this.intervalEnd.subtract(1, 'year');
    this.render();
    if(options && options.withCallbacks) {
      if(this.options.clickEvents.onYearChange) {
        this.options.clickEvents.onYearChange.apply( this, [moment(this.month)] );
      }
      if(this.options.clickEvents.onIntervalChange) {
        this.options.clickEvents.onIntervalChange.apply( this, [moment(this.intervalStart), moment(this.intervalEnd)] );
      }
    }
    return this;
  }

  Clndr.prototype.setYear = function(newYear, options) {
    this.month.year(newYear);
    this.intervalStart.year(newYear);
    this.intervalEnd.year(newYear);
    this.render();
    if(options && options.withCallbacks) {
      if(this.options.clickEvents.onYearChange) {
        this.options.clickEvents.onYearChange.apply( this, [moment(this.month)] );
      }
      if(this.options.clickEvents.onIntervalChange) {
        this.options.clickEvents.onIntervalChange.apply( this, [moment(this.intervalStart), moment(this.intervalEnd)] );
      }
    }
    return this;
  }

  Clndr.prototype.setEvents = function(events) {
    // go through each event and add a moment object
    if(this.options.multiDayEvents) {
      this.options.events = this.addMultiDayMomentObjectsToEvents(events);
    } else {
      this.options.events = this.addMomentObjectToEvents(events);
    }

    this.render();
    return this;
  };

  Clndr.prototype.addEvents = function(events) {
    // go through each event and add a moment object
    if(this.options.multiDayEvents) {
      this.options.events = $.merge(this.options.events, this.addMultiDayMomentObjectsToEvents(events));
    } else {
      this.options.events = $.merge(this.options.events, this.addMomentObjectToEvents(events));
    }

    this.render();
    return this;
  };

  Clndr.prototype.removeEvents = function(matchingFunction) {
    for (var i = this.options.events.length-1; i >= 0; i--) {
      if(matchingFunction(this.options.events[i]) == true) {
        this.options.events.splice(i, 1);
      }
    }

    this.render();
    return this;
  };

  Clndr.prototype.addMomentObjectToEvents = function(events) {
    var self = this;
    var i = 0, l = events.length;
    for(i; i < l; i++) {
      // add the date as both start and end, since it's a single-day event by default
      events[i]._clndrStartDateObject = moment( events[i][self.options.dateParameter] );
      events[i]._clndrEndDateObject = moment( events[i][self.options.dateParameter] );
    }
    return events;
  }

  Clndr.prototype.addMultiDayMomentObjectsToEvents = function(events) {
    var self = this;
    var i = 0, l = events.length;
    for(i; i < l; i++) {
      // if we don't find the startDate OR endDate fields, look for singleDay
      if(!events[i][self.options.multiDayEvents.endDate] && !events[i][self.options.multiDayEvents.startDate]) {
        events[i]._clndrEndDateObject = moment( events[i][self.options.multiDayEvents.singleDay] );
        events[i]._clndrStartDateObject = moment( events[i][self.options.multiDayEvents.singleDay] );
      } else {
        // otherwise use startDate and endDate, or whichever one is present.
        events[i]._clndrEndDateObject = moment( events[i][self.options.multiDayEvents.endDate] || events[i][self.options.multiDayEvents.startDate] );
        events[i]._clndrStartDateObject = moment( events[i][self.options.multiDayEvents.startDate] || events[i][self.options.multiDayEvents.endDate] );
      }
    }
    return events;
  }

  Clndr.prototype.calendarDay = function(options) {
    var defaults = { day: "", classes: this.options.targets.empty, events: [], date: null };
    return $.extend({}, defaults, options);
  }

  Clndr.prototype.destroy = function() {
    var $container = $( this.calendarContainer );
    $container.parent().data( 'plugin_clndr', null );
    this.options = defaults;
    $container.empty().remove();
    this.element = null;
  };

  $.fn.clndr = function(options) {
    if(this.length === 1) {
      if(!this.data('plugin_clndr')) {
        var clndr_instance = new Clndr(this, options);
        this.data('plugin_clndr', clndr_instance);
        return clndr_instance;
      }
      return this.data('plugin_clndr');
    } else if(this.length > 1) {
      throw new Error("CLNDR does not support multiple elements yet. Make sure your clndr selector returns only one element.");
    }
  }

}));
