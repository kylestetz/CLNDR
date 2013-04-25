function clndr(element, options) {
  // name of the plugin
  this._name = 'clndr';
  // the parent element that is about to get a calendar.
  this.element = element;
  // this is a momentjs object that we will use to keep track of the current month.
  this.month = moment();

  // this is our default controller div. It can be overridden.
  var clndrControllerTemplate = "<div class='clndr-controls'>" + 
    "<div class='clndr-control-button'><span class='clndr-back-button'>back</span></div><div class='month'><%= month %></div><div class='clndr-control-button rightalign'><span class='clndr-forward-button'>forward</span></div>" + 
    "</div>";

  // this is our default calendar layout. it can also be overridden.
  var clndrTemplate = "<table class='clndr-table' border='0' cellspacing='0' cellpadding='0'>" +
      "<thead>" +
        "<tr class='header-days'>" +
          "<td class='header-day'><%= daysOfTheWeek[0] %></td>" +
          "<td class='header-day'><%= daysOfTheWeek[1] %></td>" +
          "<td class='header-day'><%= daysOfTheWeek[2] %></td>" +
          "<td class='header-day'><%= daysOfTheWeek[3] %></td>" +
          "<td class='header-day'><%= daysOfTheWeek[4] %></td>" +
          "<td class='header-day'><%= daysOfTheWeek[5] %></td>" +
          "<td class='header-day'><%= daysOfTheWeek[6] %></td>" +
        "</tr>" +
      "</thead>" +
      "<tbody>" +
        "<% for(var i = 0; i < numberOfRows; i++){ %>" +
          "<tr>" +
          "<% for(var j = 0; j < 7; j++){ %>" +
            "<% var d = j + i * 7; %>" +
            "<td class='day'><div class='day-contents'><%= days[d] %></div></td>" +
          "<% } %>" +
          "</tr>" +
        "<% } %>" +
      "</tbody>" +
    "</table>";

  // let's create default options for everything and merge them with what comes in.
  var defaults = {
    template: clndrTemplate,
    controllerTemplate: clndrControllerTemplate,
    weekOffset: 0,
    ajaxUrl: null,
    ajaxUrlGeneratorFunction: null,
    callAjaxEveryMonth: false,
    showSingleEvent: true,
    clickEvents: {
      click: null,
      nextMonth: null,
      previousMonth: null,
      today: null
    }
  }

  this.options = $.extend( {}, defaults, options);

  this.init();
};

// one time business
clndr.prototype.init = function() {
  // shuffle the week if there's an offset
  if(this.options.weekOffset) {
    console.log('offset: ' + this.options.weekOffset);
    this.daysOfTheWeek = this.shiftWeekdayLabels(this.options.weekOffset);
  } else {
    this.daysOfTheWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  }

  // we can compile these both to save time rendering, since we know they'll never change.
  this.compiledClndrTemplate = _.template(this.options.template);
  this.compiledClndrControllerTemplate = _.template(this.options.controllerTemplate);

  // we render the controller in the init function because we know it will never get re-rendered.
  // we throw in the 'clndr' div as well, which will serve as the container for the template we made above.
  $(this.element).html(this.compiledClndrControllerTemplate({month: this.month.format('MMMM')}) + "<div class='clndr'></div>");
  // save the container for reference later
  this.calendarContainer = $('.clndr');
  // save the month container as well, since we'll be putting different content in it each month
  this.monthContainer = $('.clndr-controls .month');
  // do a normal render of the calendar template
  this.render();
  // set up our event handlers
  var context = this;
  $('.clndr-back-button').on("click", { context: this }, this.backAction);
  $('.clndr-forward-button').on("click", { context: this }, this.forwardAction);
}

clndr.prototype.shiftWeekdayLabels = function(offset) {
  var days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  for(var i = 0; i < offset; i++) {
    days.push( days.shift() );
  }
  return days;
}

clndr.prototype.calculateDaysInMonth = function(currentMonth) {
  // this array will hold numbers for the entire grid (even the blank spaces)
  daysArray = [];
  var date = moment().month(currentMonth);
  date.startOf('month');

  // if diff is greater than 0, we'll have to fill in some blank spaces
  // to account for the empty boxes in the grid.
  // we also need to take into account the weekOffset parameter
  var diff = date.day() - this.options.weekOffset;
  if(diff < 0) diff += 7;
  for(var i = 0; i < diff; i++) {
    // { day: "", events: [], classes: "empty" }
    daysArray.push("");
  }
  
  // now we push all of the numbers in a month
  var numOfDays = date.daysInMonth();
  for(var i = 1; i <= numOfDays; i++) {
    daysArray.push(i);
  }

  // ...and if there are any trailing blank boxes, fill those in
  // with blank strings as well
  while(daysArray.length % 7 !== 0) {
    daysArray.push("");
  }

  return daysArray;
}

clndr.prototype.render = function() {
  // get an array of days and blank spaces
  var days = this.calculateDaysInMonth(this.month.month());
  var data = {
    daysOfTheWeek: this.daysOfTheWeek,
    numberOfRows: Math.ceil(days.length / 7),
    days: days,
    month: this.month.format('MMMM')
  };
  // render the calendar with the data above
  $(this.calendarContainer).html(this.compiledClndrTemplate(data));
  // get the month element and change its contents
  $(this.monthContainer).html(this.month.format('MMMM'));
}

// tell the calendar to go back a month!
clndr.prototype.backAction = function(event) {
  event.data.context.month.subtract('months', 1);
  if(event.data.context.options.clickEvents.previousMonth) {
    event.data.context.options.clickEvents.previousMonth(event.data.context.month);
  }
  event.data.context.render();
}

// tell the calendar to go forward a month!
clndr.prototype.forwardAction = function(event) {
  event.data.context.month.add('months', 1);
  if(event.data.context.options.clickEvents.nextMonth) {
    event.data.context.options.clickEvents.nextMonth(event.data.context.month);
  }
  event.data.context.render();
}

$.fn['clndr'] = function ( options ) {
    return this.each(function () {
        if (!$.data(this, 'plugin_clndr')) {
            $.data(this, 'plugin_clndr',
            new clndr( this, options ));
        }
    });
}