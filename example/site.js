$(document).ready( function() {

  var eventArray = [
    { date: "2013-07-24 07:52", title: "175 down, 190 to go", url: "http://google.com", time: "7:15PM" },
    { date: "2013-08-28", title: "August 28th Part 1", url: "http://www.google.com" },
    { date: "2013-08-28", title: "August 28th Part 2", arbitraryObject: 42 },
    { date: "2013-09-16", title: "Somebody's Birthday." }
  ];

  var clndr1 = $('.cal1').clndr({
    events: eventArray,
    clickEvents: {
      click: function(target) {
        console.log(target);
      }
    }
  });

  var clndr2 = $('.cal2').clndr({
    template: $('#template-calendar').html(),
    events: eventArray,
    startWithMonth: moment().add('month', 1)
  });

  // bind both clndrs to the left and right arrow keys
  $(document).keydown( function(e) {
    if(e.keyCode == 37) {
      // left arrow
      clndr1.back();
      clndr2.back();
    }
    if(e.keyCode == 39) {
      // right arrow
      clndr1.forward();
      clndr2.forward();
    }
  });

});