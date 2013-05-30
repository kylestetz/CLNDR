$(document).ready( function() {

var eventArray = [
  { date: "2013-06-24 07:52", title: "175 down, 190 to go", url: "http://google.com", time: "7:15PM" },
  { date: "2013-06-28", title: "June 28th Part 1", url: "http://www.google.com" },
  { date: "2013-06-28", title: "June 28th Part 2", arbitraryObject: 42 },
  { date: "2013-07-16", title: "Somebody's Birthday." }
];

$('.cal1').clndr({
  events: eventArray,
  clickEvents: {
    click: function(target) {
      console.log(target);
    }
  }
});

$('.cal2').clndr({
  template: $('#template-calendar').html(),
  events: eventArray,
  startWithMonth: moment().add('month', 1)
});

// $('.hey').clndr({
//   template: $('#template-calendar').html(),
//   controllerTemplate: $('#template-calendar-controller').html()
// });

});