var clndr = {};

if (!window.console) {
    window.console = {
        log: function (whatever) {
          // sad face.
        }
    };
}

$( function() {
    // Set up the events array
    var eventsArray = [
        {
            title: 'This is an Event',
            date: moment().format('YYYY-MM-') + '07'
        }, {
            title: 'Another Event',
            date: moment().format('YYYY-MM-') + '23'
        }
    ];

    // Declare all vars at the top
    var multidayArray, multidayMixedArray, multidayMixedPerfArray, daysInMonth,
        start, multidayLongArray, performanceSeconds;

    // Default
    // =========================================================================
    clndr.defaultSetup = $('#default').clndr();

    // Test showAdjacentMonths and adjacentDaysChangeMonth.
    // Edges of other months should be visible and clicking them should switch
    // the month.
    // =========================================================================
    clndr.adjacent = $('#adjacent').clndr({
        showAdjacentMonths: true,
        adjacentDaysChangeMonth: true
    });

    // Pass in a template
    // =========================================================================
    clndr.passInATemplate = $('#pass-in-a-template').clndr({
        template: $('#clndr-template').html()
    });

    // Pass in events
    // =========================================================================
    clndr.passInEvents = $('#pass-in-events').clndr({
        events: eventsArray
    });

    // Test the clickEvent callbacks
    // =========================================================================
    clndr.callbacks = $('#callbacks').clndr({
        ready: function () {
            console.log('The callbacks calendar just called ready()');
        },
        clickEvents: {
            click: function (target) {
                console.log('click');
            },
            today: function (month) {
                console.log('today');
            },
            nextYear: function (month) {
                console.log('next year');
            },
            nextMonth: function (month) {
                console.log('next month');
            },
            previousYear: function (month) {
                console.log('previous year');
            },
            onYearChange: function (month) {
                console.log('on year change');
            },
            previousMonth: function (month) {
                console.log('previous month');
            },
            onMonthChange: function (month) {
                console.log('on month change');
            }
        },
        doneRendering: function () {
            console.log('The callbacks calendar just called doneRendering()');
        }
    });

    // Test multi-day events
    // =========================================================================
    multidayArray = [
        {
            title: 'Multi1',
            endDate: moment().format('YYYY-MM-') + '17',
            startDate: moment().format('YYYY-MM-') + '12'
        }, {
            title: 'Multi2',
            endDate: moment().format('YYYY-MM-') + '27',
            startDate: moment().format('YYYY-MM-') + '24'
        }
    ];

    clndr.multiday = $('#multiday').clndr({
        events: multidayArray,
        multiDayEvents: {
            endDate: 'endDate',
            startDate: 'startDate'
        },
        clickEvents: {
            click: function (target) {
                console.log(target);
            }
        }
    });

    // Test multi-day events
    // =========================================================================
    multidayMixedArray = [
        {
            title: 'Multi1',
            endDate: moment().format('YYYY-MM-') + '17',
            startDate: moment().format('YYYY-MM-') + '12'
        }, {
            title: 'Multi2',
            endDate: moment().format('YYYY-MM-') + '27',
            startDate: moment().format('YYYY-MM-') + '24'
        }, {
            title: 'Single',
            date: moment().format('YYYY-MM-') + '19'
        }
    ];

    clndr.multidayMixed = $('#multiday-mixed').clndr({
        events: multidayMixedArray,
        multiDayEvents: {
            singleDay: 'date',
            endDate: 'endDate',
            startDate: 'startDate'
        },
        clickEvents: {
            click: function (target) {
                console.log(target);
            }
        }
    });

    // Test multi-day event performance
    // =========================================================================
    // Start with two truly multiday events.
    multidayMixedPerfArray = [
        {
            title: 'Multi1',
            endDate: moment().format('YYYY-MM-') + '17',
            startDate: moment().format('YYYY-MM-') + '12'
        }, {
            title: 'Multi2',
            endDate: moment().format('YYYY-MM-') + '27',
            startDate: moment().format('YYYY-MM-') + '24'
        }
    ];

    // Add ten events every day this month that are only a day long,
    // which triggers clndr to use a performance optimization.
    daysInMonth = moment().daysInMonth();

    for (var i = 1; i <= daysInMonth; i++) {
        var padDay = (i < 10)
            ? '0' + i
            : i;
        for (var j = 0; j < 10; j++) {
            multidayMixedPerfArray.push({
                endDate: moment().format('YYYY-MM-') + padDay,
                startDate: moment().format('YYYY-MM-') + padDay
            });
        }
    }

    // Start timer
    start = moment();

    clndr.multidayMixedPerformance = $('#multiday-mixed-performance').clndr({
        events: multidayMixedPerfArray,
        multiDayEvents: {
            singleDay: 'date',
            endDate: 'endDate',
            startDate: 'startDate'
        },
        clickEvents: {
            click: function (target) {
                console.log(target);
            }
        }
    });

    // Capture the end time
    performanceSeconds = moment.duration(moment().diff(start)).asSeconds();

    $('#multiday-mixed-performance-val').text(performanceSeconds);

    // Test really long multi-day events
    // =========================================================================
    multidayLongArray = [
        {
            title: 'Multi1',
            endDate: moment().format('YYYY-MM-') + '17',
            startDate: moment().subtract(3, 'months').format('YYYY-MM-') + '12'
        }, {
            title: 'Multi2',
            startDate: moment().format('YYYY-MM-') + '24',
            endDate: moment().add(4, 'months').format('YYYY-MM-') + '27'
        }
    ];

    clndr.multidayLong = $('#multiday-long').clndr({
        events: multidayLongArray,
        multiDayEvents: {
            endDate: 'endDate',
            startDate: 'startDate'
        },
        clickEvents: {
            click: function (target) {
                console.log(target);
            }
        }
    });

    // Test constraints
    // The 4th of this month to the 12th of next month
    // =========================================================================
    clndr.constraints = $('#constraints').clndr({
        constraints: {
            startDate: moment().format('YYYY-MM-') + '04',
            endDate: moment().add(1, 'months').format('YYYY-MM-12')
        },
        clickEvents: {
            click: function (target) {
                if (!$(target.element).hasClass('inactive')) {
                    console.log('You picked a valid date.');
                } else {
                    console.log('You can\'t pick that date.');
                }
            }
        }
    });

    // Test constraints
    // The 22nd of previous month to the 5th of next month
    // =========================================================================
    clndr.prevNextMonthConstraints = $('#prev-next-month-constraints').clndr({
        constraints: {
            endDate: moment().add(1, 'months').format('YYYY-MM-05'),
            startDate: moment().subtract(1, 'months').format('YYYY-MM-') + '22'
        }
    });

    // Test constraints
    // The 2nd to the 5th of previous month
    // =========================================================================
    clndr.prevMonthConstraints = $('#prev-month-constraints').clndr({
        constraints: {
            endDate: moment().subtract(1, 'months').format('YYYY-MM-05'),
            startDate: moment().subtract(1, 'months').format('YYYY-MM-') + '02'
        }
    });

    // Test constraints
    // The 22nd to the 25th of next month
    // =========================================================================
    clndr.nextMonthConstraints = $('#next-month-constraints').clndr({
        constraints: {
            endDate: moment().add(1, 'months').format('YYYY-MM-25'),
            startDate: moment().add(1, 'months').format('YYYY-MM-') + '22'
        }
    });

    // Test the start constraint by itself (4th of this month)
    // =========================================================================
    clndr.startConstraint = $('#start-constraint').clndr({
        constraints: {
            startDate: moment().format('YYYY-MM-') + '04'
        }
    });

    // Test the end constraint by itself (12th of next month)
    // =========================================================================
    clndr.endConstraint = $('#end-constraint').clndr({
        constraints: {
            endDate: moment().add(1, 'months').format('YYYY-MM-') + '12'
        }
    });

    // Test API
    // You could do this with any instance but this makes for a nice reminder
    // =========================================================================
    clndr.api = $('#api').clndr({
        clickEvents: {
            onMonthChange: function (month) {
                console.log('onMonthChange was called.');
            },
            onYearChange: function (month) {
                console.log('onYearChange was called.');
            }
        }
    });

    // Test forceSixRows option
    // =========================================================================
    clndr.sixRows = $('#six-rows').clndr({
        forceSixRows: true
    });

    // Test options.classes
    // =========================================================================
    clndr.customClasses = $('#custom-classes').clndr({
        events: eventsArray,
        classes: {
            past: "my-past",
            today: "my-today",
            event: "my-event",
            inactive: "my-inactive",
            lastMonth: "my-last-month",
            nextMonth: "my-next-month",
            adjacentMonth: "my-adjacent-month"
        },
        clickEvents: {
            click: function (target) {
                console.log(target);
            }
        }
    });

    // Test lengthOfTime.months option (three month views in one)
    // =========================================================================
    clndr.threeMonths = $('#three-months').clndr({
        template: $('#clndr-multimonth-template').html(),
        lengthOfTime: {
            months: 3,
            interval: 1,
            startDate: moment().subtract(1, 'months').startOf('month')
        },
        clickEvents: {
            click: function (target) {
                console.log(target);
            },
            previousInterval: function (start, end) {
                console.log('previous interval:', start, end);
            },
            nextInterval: function (start, end) {
                console.log('next interval:', start, end);
            },
            onIntervalChange: function (start, end) {
                console.log('interval change:', start, end);
            }
        }
    });

    // Test lengthOfTime.months option (three month views in one)
    // =========================================================================
    clndr.threeMonthsWithEvents = $('#three-months-with-events').clndr({
        template: $('#clndr-multimonth-template').html(),
        events: multidayArray,
        lengthOfTime: {
            months: 3,
            interval: 1,
            startDate: moment().subtract(1, 'months').startOf('month')
        },
        multiDayEvents: {
            endDate: 'endDate',
            startDate: 'startDate'
        },
        clickEvents: {
            click: function (target) {
                console.log(target);
            },
            previousInterval: function (start, end) {
                console.log('previous interval:', start, end);
            },
            nextInterval: function (start, end) {
                console.log('next interval:', start, end);
            },
            onIntervalChange: function (start, end) {
                console.log('interval change:', start, end);
            }
        }
    });

    // Test lengthOfTime.months option (three month views in one)
    // =========================================================================
    clndr.threeMonthsWithContraints = $('#three-months-with-constraints').clndr({
        template: $('#clndr-multimonth-template').html(),
        events: multidayArray,
        lengthOfTime: {
            months: 3,
            interval: 1,
            startDate: moment().subtract(1, 'months').startOf('month')
        },
        multiDayEvents: {
            endDate: 'endDate',
            startDate: 'startDate'
        },
        clickEvents: {
            click: function (target) {
                console.log(target);
            },
            previousInterval: function (start, end) {
                console.log('previous interval:', start, end);
            },
            nextInterval: function (start, end) {
                console.log('next interval:', start, end);
            },
            onIntervalChange: function (start, end) {
                console.log('interval change:', start, end);
            }
        },
        constraints: {
            endDate: moment().add(1, 'months').format('YYYY-MM-12'),
            startDate: moment().subtract(2, 'months').format('YYYY-MM-DD')
        }
    });

    // Test lengthOfTime.days option (14 days incremented by 7)
    // =========================================================================
    clndr.twoWeeks = $('#one-week').clndr({
        template: $('#clndr-oneweek-template').html(),
        lengthOfTime: {
            days: 14,
            interval: 7,
            startDate: moment().weekday(0)
        }
    });

    // Test lengthOfTime.days option (14 days incremented by 7)
    // =========================================================================
    clndr.twoWeeksWithConstraints = $('#one-week-with-constraints').clndr({
        template: $('#clndr-oneweek-template').html(),
        events: multidayArray,
        multiDayEvents: {
            endDate: 'endDate',
            startDate: 'startDate'
        },
        lengthOfTime: {
            days: 14,
            interval: 7,
            startDate: moment().weekday(0)
        },
        constraints: {
            startDate: moment().format('YYYY-MM-04'),
            endDate: moment().add(1, 'months').format('YYYY-MM-12')
        }
    });

    // Test lengthOfTime.days option with constraints (14 days incremented by 7)
    // The 2nd to the 5th of previous month
    // =========================================================================
    clndr.twoWeeksWithPrevMonthConstraints = $('#one-week-with-prev-month-constraints').clndr({
        template: $('#clndr-oneweek-template').html(),
        lengthOfTime: {
            days: 14,
            interval: 7,
            startDate: moment().weekday(0)
        },
        constraints: {
            endDate: moment().subtract(1, 'months').format('YYYY-MM-05'),
            startDate: moment().subtract(1, 'months').format('YYYY-MM-02')
        }
    });

    // Test lengthOfTime.days option with constraints (14 days incremented by 7)
    // The 22nd to the 25th of next month
    // =========================================================================
    clndr.twoWeeksWithNextMonthConstraints = $('#one-week-with-next-month-constraints').clndr({
        template: $('#clndr-oneweek-template').html(),
        lengthOfTime: {
            days: 14,
            interval: 7,
            startDate: moment().weekday(0)
        },
        constraints: {
            endDate: moment().add(1, 'months').format('YYYY-MM-25'),
            startDate: moment().add(1, 'months').format('YYYY-MM-22')
        }
    });

    // Test selectedDate option
    // =========================================================================
    clndr.selectedDate = $('#selected-date').clndr({
        trackSelectedDate: true,
        template: $('#clndr-template').html()
    });

    // Test selectedDate option with ignoreInactiveDaysInSelection
    // =========================================================================
    clndr.selectedDateIgnoreInactive = $('#selected-date-ignore-inactive').clndr({
        template: $('#clndr-template').html(),
        trackSelectedDate: true,
        ignoreInactiveDaysInSelection: true,
        constraints: {
            endDate: moment().add(1, 'months').format('YYYY-MM-12'),
            startDate: moment().subtract(1, 'months').format('YYYY-MM-DD')
        }
    });
});