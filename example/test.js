var clndr = {};

if(!window.console) {
  window.console = {
    log: function(whatever) {
      // sad face.
    }
  }
}

$( function() {

  var eventsArray = [
    { date: moment().format('YYYY-MM-') + '07', title: 'This is an Event' },
    { date: moment().format('YYYY-MM-') + '23', title: 'Another Event' }
  ];

  // default
  // ================================================================================
  clndr.defaultSetup = $('#default').clndr();


  // test showAdjacentMonths and adjacentDaysChangeMonth.
  // edges of other months should be visible & clicking them should switch the month.
  // ================================================================================
  clndr.adjacent = $('#adjacent').clndr({
    showAdjacentMonths: true,
    adjacentDaysChangeMonth: true
  });


  // pass in a template
  // ================================================================================
  clndr.passInATemplate = $('#pass-in-a-template').clndr({
    template: $('#clndr-template').html()
  });


  // pass in events
  // ================================================================================
  clndr.passInEvents = $('#pass-in-events').clndr({
    events: eventsArray
  });


  // test the clickEvent callbacks
  // ================================================================================
  clndr.callbacks = $('#callbacks').clndr({
    ready: function() {
      console.log('the callbacks calendar just called ready().');
    },
    clickEvents: {
      click:         function(target) { console.log('click'); },
      nextMonth:     function(month)  { console.log('next month'); },
      previousMonth: function(month)  { console.log('previous month'); },
      nextYear:      function(month)  { console.log('next year'); },
      previousYear:  function(month)  { console.log('previous year'); },
      today:         function(month)  { console.log('today'); },
      onMonthChange: function(month)  { console.log('on month change'); },
      onYearChange:  function(month)  { console.log('on year change'); }
    },
    doneRendering: function() {
      console.log('the callbacks calendar just called doneRendering().');
    }
  });


  // test multi-day events
  // ================================================================================
  var multidayArray = [
    { startDate: moment().format('YYYY-MM-') + '12', endDate: moment().format('YYYY-MM-') + '17', title: 'Multi1' },
    { startDate: moment().format('YYYY-MM-') + '24', endDate: moment().format('YYYY-MM-') + '27', title: 'Multi2' }
  ];

  clndr.multiday = $('#multiday').clndr({
    events: multidayArray,
    multiDayEvents: {
      startDate: 'startDate',
      endDate: 'endDate'
    },
    clickEvents: {
      click: function(target) {
        console.log(target);
      }
    }
  });


  // test constraints
  // (the 4th of this month to the 12th of next month)
  // ================================================================================
  clndr.constraints = $('#constraints').clndr({
    constraints: {
      startDate: moment().format('YYYY-MM-') + '04',
      endDate: moment().add('months', 1).format('YYYY-MM-12')
    },
    clickEvents: {
      click: function(target) {
        if( !$(target.element).hasClass('inactive') ) {
          console.log('You picked a valid date.');
        } else {
          console.log('You can\'t pick that date.');
        }
      }
    }
  });


  // test the start constraint by itself (4th of this month)
  // ================================================================================
  clndr.startConstriant = $('#start-constraint').clndr({
    constraints: {
      startDate: moment().format('YYYY-MM-') + '04'
    }
  });


  // test the end constraint by itself (12th of next month)
  // ================================================================================
  clndr.endConstriant = $('#end-constraint').clndr({
    constraints: {
      endDate: moment().add('months', 1).format('YYYY-MM-') + '12'
    }
  });


  // test api
  // (you could do this with any instance but this makes for a nice reminder)
  // ================================================================================
  clndr.api = $('#api').clndr({
    clickEvents: {
      onMonthChange: function(month) {
        console.log('onMonthChange was called.');
      },
      onYearChange: function(month) {
        console.log('onYearChange was called.');
      }
    }
  });


  // test forceSixRows option
  // ================================================================================
  clndr.api = $('#six-rows').clndr({
    forceSixRows: true
  });


});