/*
 *                   ~ CLNDR ~
 * ==============================================
 *       https://github.com/kylestetz/CLNDR
 * ==============================================
 *  created by kyle stetz (github.com/kylestetz)
 *        &available under the MIT license
 * http://opensource.org/licenses/mit-license.php
 * ==============================================
 *
 * This is the fully-commented development version of CLNDR.
 * For dev and production versions, check out clndr.js and clndr.min.js
 * at https://github.com/kylestetz/CLNDR
 *
 * This work is based on the
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

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
    events: [],
    extras: null,
    dateParameter: 'date',
    doneRendering: null,
    render: null,
    daysOfTheWeek: null,
    showAdjacentMonths: true,
    adjacentDaysChangeMonth: false,
    ready: null
  };

  // The actual plugin constructor
  function Clndr( element, options ) {
    this.element = element;

    // merge the default options with user-provided options
    this.options = $.extend(true, {}, defaults, options);

    // if there are events, we should run them through our addMomentObjectToEvents function
    // which will add a date object that we can use to make life easier. This is only necessary
    // when events are provided on instantiation, since our setEvents function uses addMomentObjectToEvents.
    if(this.options.events.length) {
      this.options.events = this.addMomentObjectToEvents(this.options.events);
    }

    // this object will store a reference to the current month.
    // it's a moment object, which allows us to poke at it a little if we need to.
    // this will serve as the basis for switching between months & is the go-to
    // internally if we want to know which month we're currently at.
    if(this.options.startWithMonth) {
      this.month = moment(this.options.startWithMonth);
    } else {
      this.month = moment();
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

  // This is where the magic happens. Given a moment object representing the current month,
  // an array of calendarDay objects is constructed that contains appropriate events and
  // classes depending on the circumstance.
  Clndr.prototype.createDaysObject = function(currentMonth) {
    // this array will hold numbers for the entire grid (even the blank spaces)
    daysArray = [];
    var date = currentMonth.startOf('month');

    // filter the events list (if it exists) to events that are happening last month, this month and next month (within the current grid view)
    this.eventsLastMonth = [];
    this.eventsThisMonth = [];
    this.eventsNextMonth = [];

    if(this.options.events.length) {

      this.eventsThisMonth = $(this.options.events).filter( function() {
        return this._clndrDateObject.format("YYYY-MM") == currentMonth.format("YYYY-MM");
      }).toArray();

      var lastMonth = currentMonth.clone().subtract('months', 1);
      var nextMonth = currentMonth.clone().add('months', 1);
      this.eventsLastMonth = $(this.options.events).filter( function() {
        return this._clndrDateObject.format("YYYY-MM") == lastMonth.format("YYYY-MM");
      }).toArray();

      this.eventsNextMonth = $(this.options.events).filter( function() {
        return this._clndrDateObject.format("YYYY-MM") == nextMonth.format("YYYY-MM");
      }).toArray();
    }

    // if diff is greater than 0, we'll have to fill in last days of the previous month
    // to account for the empty boxes in the grid.
    // we also need to take into account the weekOffset parameter
    var diff = date.weekday() - this.options.weekOffset;
    if(diff < 0) diff += 7;

    if(this.options.showAdjacentMonths) {
      for(var i = 0; i < diff; i++) {
        var day = moment([currentMonth.year(), currentMonth.month(), i - diff + 1]);
        daysArray.push( this.createDayObject(day, this.eventsLastMonth) );
      }
    } else {
      for(var i = 0; i < diff; i++) {
        daysArray.push( this.calendarDay({ classes: this.options.targets.empty + " last-month" }) );
      }
    }

    // now we push all of the days in a month
    var numOfDays = date.daysInMonth();
    for(var i = 1; i <= numOfDays; i++) {
      var day = moment([currentMonth.year(), currentMonth.month(), i]);
      daysArray.push(this.createDayObject(day, this.eventsThisMonth) )
    }

    // ...and if there are any trailing blank boxes, fill those in
    // with the next month first days
    if(this.options.showAdjacentMonths) {
      i = 1;
      while(daysArray.length % 7 !== 0) {
        var day = moment([currentMonth.year(), currentMonth.month(), numOfDays + i]);
        daysArray.push( this.createDayObject(day, this.eventsNextMonth) );
        i++;
      }
    } else {
      i = 1;
      while(daysArray.length % 7 !== 0) {
        daysArray.push( this.calendarDay({ classes: this.options.targets.empty + " next-month" }) );
        i++;
      }
    }

    return daysArray;
  };

  Clndr.prototype.createDayObject = function(day, monthEvents) {
    var eventsToday = [];
    var now = moment();

    var j = 0, l = monthEvents.length;
    for(j; j < l; j++) {
      // keep in mind that the events here already passed the month/year test.
      // now all we have to compare is the moment.date(), which returns the day of the month.
      if( monthEvents[j]._clndrDateObject.date() == day.date() ) {
        eventsToday.push( monthEvents[j] );
      }
    }

    var extraClasses = "";

    if(now.format("YYYY-MM-DD") == day.format("YYYY-MM-DD")) {
       extraClasses += " today";
    }
    if(day.isBefore(now, 'day')) {
      extraClasses += " past";
    }
    if(eventsToday.length) {
       extraClasses += " event";
    }
    if(this.month.month() > day.month()) {
       extraClasses += " adjacent-month";

       this.month.year() === day.year()
           ? extraClasses += " last-month"
           : extraClasses += " next-month";

    } else if(this.month.month() < day.month()) {
       extraClasses += " adjacent-month";

       this.month.year() === day.year()
           ? extraClasses += " next-month"
           : extraClasses += " last-month";

    }

    // validate moment date
    if (!day.isValid() && day.hasOwnProperty('_d') && day._d != undefined) {
        day = moment(day._d);
    }

    // we're moving away from using IDs in favor of classes, since when
    // using multiple calendars on a page we are technically violating the
    // uniqueness of IDs.
    extraClasses += " calendar-day-" + day.format("YYYY-MM-DD");

    return this.calendarDay({
      day: day.date(),
      classes: this.options.targets.day + extraClasses,
      id: "calendar-day-" + day.format("YYYY-MM-DD"),
      events: eventsToday,
      date: day
    });
  };

  Clndr.prototype.render = function() {
    // get rid of the previous set of calendar parts.
    // TODO: figure out if this is the right way to ensure proper garbage collection?
    this.calendarContainer.children().remove();
    // get an array of days and blank spaces
    var days = this.createDaysObject(this.month);
    // this is to prevent a scope/naming issue between this.month and data.month
    var currentMonth = this.month;

    var data = {
      daysOfTheWeek: this.daysOfTheWeek,
      numberOfRows: Math.ceil(days.length / 7),
      days: days,
      month: this.month.format('MMMM'),
      year: this.month.year(),
      eventsThisMonth: this.eventsThisMonth,
      eventsLastMonth: this.eventsLastMonth,
      eventsNextMonth: this.eventsNextMonth,
      extras: this.options.extras
    };

    // render the calendar with the data above & bind events to its elements
    if(!this.options.render) {
      this.calendarContainer.html(this.compiledClndrTemplate(data));
    } else {
      this.calendarContainer.html(this.options.render.apply(this, [data]));
    }
    if(this.options.doneRendering) {
      this.options.doneRendering.apply(this, []);
    }
  };

  Clndr.prototype.bindEvents = function() {
    var $container = $(this.element);
    var self = this;

    // target the day elements and give them click events
    $container.on('click', '.'+this.options.targets.day, function(event) {
      if(self.options.clickEvents.click) {
        var target = self.buildTargetObject(event.currentTarget, true);
        self.options.clickEvents.click.apply(self, [target]);
      }
      // if adjacentDaysChangeMonth is on, we need to change the month here.
      if(self.options.adjacentDaysChangeMonth) {
        if($(event.currentTarget).is(".last-month")) {
          self.backActionWithContext(self);
        } else if($(event.currentTarget).is(".next-month")) {
          self.forwardActionWithContext(self);
        }
      }
    });
    // target the empty calendar boxes as well
    $container.on('click', '.'+this.options.targets.empty, function(event) {
      if(self.options.clickEvents.click) {
        var target = self.buildTargetObject(event.currentTarget, false);
        self.options.clickEvents.click.apply(self, [target]);
      }
      if(self.options.adjacentDaysChangeMonth) {
        if($(event.currentTarget).is(".last-month")) {
          self.backActionWithContext(self);
        } else if($(event.currentTarget).is(".next-month")) {
          self.forwardActionWithContext(self);
        }
      }
    });

    // bind the previous, next and today buttons
    $container
      .on('click', '.'+this.options.targets.previousButton, { context: this }, this.backAction)
      .on('click', '.'+this.options.targets.nextButton, { context: this }, this.forwardAction)
      .on('click', '.'+this.options.targets.todayButton, { context: this }, this.todayAction)
      .on('click', '.'+this.options.targets.nextYearButton, { context: this }, this.nextYearAction)
      .on('click', '.'+this.options.targets.previousYearButton, { context: this }, this.previousYearAction);
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
      var dateString;

      // We're shifting away from using IDs, so our identifier is in the list of classNames now.
      var classNameIndex = currentTarget.className.indexOf('calendar-day-');
      if(classNameIndex !== 0) {
        // our unique identifier is always 23 characters long.
        // If this feels a little wonky, that's probably because it is.
        // Open to suggestions on how to improve this guy.
        dateString = currentTarget.className.substring(classNameIndex + 13, classNameIndex + 23);
      } else {
        // we shouldn't ever get here, but it's going to stay for now.
        dateString = currentTarget.id.replace('calendar-day-', '');
      }
      target.date = moment(dateString);
      // do we have events?
      if(this.options.events) {
        // are any of the events happening today?
        target.events = $.makeArray( $(this.options.events).filter( function() {
          // filter the dates down to the ones that match.
          return this._clndrDateObject.format('YYYY-MM-DD') == dateString;
        }) );
      }
    }

    return target;
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
    var yearChanged = !self.month.isSame(moment(), 'year');
    self.month.subtract('months', 1);
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
    self.render();
  };

  Clndr.prototype.forwardActionWithContext = function(self) {
    var yearChanged = !self.month.isSame(moment(), 'year');
    self.month.add('months', 1);
    if(self.options.clickEvents.nextMonth) {
      self.options.clickEvents.nextMonth.apply(self, [self.month]);
    }
    if(self.options.clickEvents.onMonthChange) {
      self.options.clickEvents.onMonthChange.apply(self, [self.month]);
    }
    if(yearChanged) {
      if(self.options.clickEvents.onYearChange) {
        self.options.clickEvents.onYearChange.apply( self, [moment(self.month)] );
      }
    }
    self.render();
  };

  Clndr.prototype.todayAction = function(event) {
    var self = event.data.context;

    // did we switch months when the today button was hit?
    var monthChanged = !self.month.isSame(moment(), 'month');
    var yearChanged = !self.month.isSame(moment(), 'year');

    // fire the today event handler regardless of whether the month changed.
    if(self.options.clickEvents.today) {
      self.options.clickEvents.today.apply( self, [moment(self.month)] );
    }

    if(monthChanged) {
      self.month = moment();
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
      // no need to re-render if we didn't change months.
      self.render();
    }
  };

  Clndr.prototype.nextYearAction = function(event) {
    var self = event.data.context;
    self.month.add('years', 1);
    if(self.options.clickEvents.nextYear) {
      self.options.clickEvents.nextYear.apply( self, [moment(self.month)] );
    }
    if(self.options.clickEvents.onMonthChange) {
      self.options.clickEvents.onMonthChange.apply( self, [moment(self.month)] );
    }
    if(self.options.clickEvents.onYearChange) {
      self.options.clickEvents.onYearChange.apply( self, [moment(self.month)] );
    }
    self.render();
  };

  Clndr.prototype.previousYearAction = function(event) {
    var self = event.data.context;
    self.month.subtract('years', 1);
    if(self.options.clickEvents.previousYear) {
      self.options.clickEvents.previousYear.apply( self, [moment(self.month)] );
    }
    if(self.options.clickEvents.onMonthChange) {
      self.options.clickEvents.onMonthChange.apply( self, [moment(self.month)] );
    }
    if(self.options.clickEvents.onYearChange) {
      self.options.clickEvents.onYearChange.apply( self, [moment(self.month)] );
    }
    self.render();
  };

  Clndr.prototype.forward = function() {
    this.month.add('months', 1);
    this.render();
    return this;
  }

  Clndr.prototype.back = function() {
    this.month.subtract('months', 1);
    this.render();
    return this;
  }

  // alternate names for convenience
  Clndr.prototype.next = function() {
    this.forward();
    return this;
  }

  Clndr.prototype.previous = function() {
    this.back();
    return this;
  }

  Clndr.prototype.setMonth = function(newMonth) {
    // accepts 0 - 11 or a full/partial month name e.g. "Jan", "February", "Mar"
    this.month.month(newMonth);
    this.render();
    return this;
  }

  Clndr.prototype.setYear = function(newYear) {
    this.month.year(newYear);
    this.render();
    return this;
  }

  Clndr.prototype.nextYear = function() {
    this.month.add('year', 1);
    this.render();
    return this;
  }

  Clndr.prototype.previousYear = function() {
    this.month.subtract('year', 1);
    this.render();
    return this;
  }

  Clndr.prototype.setYear = function(newYear) {
    this.month.year(newYear);
    this.render();
    return this;
  }

  Clndr.prototype.setEvents = function(events) {
    // go through each event and add a moment object
    this.options.events = this.addMomentObjectToEvents(events);

    this.render();
    return this;
  };

  Clndr.prototype.addEvents = function(events) {
    // go through each event and add a moment object
    this.options.events = $.merge(this.options.events, this.addMomentObjectToEvents(events));

    this.render();
    return this;
  };

  Clndr.prototype.addMomentObjectToEvents = function(events) {
    var self = this;
    var i = 0, l = events.length;
    for(i; i < l; i++) {
      // stuff a _clndrDateObject in each event, which really, REALLY should not be
      // overriding any existing object... Man that would be weird.
      events[i]._clndrDateObject = moment( events[i][self.options.dateParameter] );
    }
    return events;
  }

  Clndr.prototype.calendarDay = function(options) {
    var defaults = { day: "", classes: this.options.targets.empty, events: [], id: "", date: null };
    return $.extend({}, defaults, options);
  }

  $.fn.clndr = function(options) {
    if( !$.data( this, 'plugin_clndr') ) {
      var clndr_instance = new Clndr(this, options);
      $.data(this, 'plugin_clndr', clndr_instance);
      return clndr_instance;
    }
  }

})( jQuery, window, document );
