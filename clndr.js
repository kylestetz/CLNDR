/*!              ~ CLNDR v1.0.5 ~ 
 * ============================================== 
 *       https://github.com/kylestetz/CLNDR 
 * ============================================== 
 *  created by kyle stetz (github.com/kylestetz) 
 *        &available under the MIT license 
 * http://opensource.org/licenses/mit-license.php 
 * ============================================== 
 */
!function($) {
    function Clndr(element, options) {
        this.element = element, this.options = $.extend({}, defaults, options), this.options.events.length && (this.options.events = this.addMomentObjectToEvents(this.options.events)), 
        this.month = this.options.startWithMonth ? moment(this.options.startWithMonth) : moment(), 
        this._defaults = defaults, this._name = pluginName, this.init();
    }
    var clndrTemplate = "<div class='clndr-controls'><div class='clndr-control-button'><span class='clndr-previous-button'>previous</span></div><div class='month'><%= month %></div><div class='clndr-control-button rightalign'><span class='clndr-next-button'>next</span></div></div><table class='clndr-table' border='0' cellspacing='0' cellpadding='0'><thead><tr class='header-days'><% for(var i = 0; i < daysOfTheWeek.length; i++) { %><td class='header-day'><%= daysOfTheWeek[i] %></td><% } %></tr></thead><tbody><% for(var i = 0; i < numberOfRows; i++){ %><tr><% for(var j = 0; j < 7; j++){ %><% var d = j + i * 7; %><td class='<%= days[d].classes %>' id='<%= days[d].id %>'><div class='day-contents'><%= days[d].day %></div></td><% } %></tr><% } %></tbody></table>", pluginName = "clndr", defaults = {
        template: clndrTemplate,
        weekOffset: 0,
        startWithMonth: null,
        clickEvents: {
            click: null,
            nextMonth: null,
            previousMonth: null,
            today: null,
            onMonthChange: null
        },
        targets: {
            nextButton: "clndr-next-button",
            previousButton: "clndr-previous-button",
            todayButton: "clndr-today-button",
            day: "day",
            empty: "empty"
        },
        events: [],
        extras: null,
        dateParameter: "date",
        doneRendering: null,
        render: null,
        daysOfTheWeek: [ "S", "M", "T", "W", "T", "F", "S" ]
    };
    Clndr.prototype.init = function() {
        if (this.daysOfTheWeek = this.options.weekOffset ? this.shiftWeekdayLabels(this.options.weekOffset) : this.options.daysOfTheWeek, 
        !$.isFunction(this.options.render)) {
            if (this.options.render = null, "undefined" == typeof _) throw new Error("Underscore was not found. Please include underscore.js OR provide a custom render function.");
            this.compiledClndrTemplate = _.template(this.options.template);
        }
        $(this.element).html("<div class='clndr'></div>"), this.calendarContainer = $(".clndr", this.element), 
        this.bindEvents(), this.render();
    }, Clndr.prototype.shiftWeekdayLabels = function(offset) {
        for (var days = this.options.daysOfTheWeek, i = 0; offset > i; i++) days.push(days.shift());
        return days;
    }, Clndr.prototype.createDaysObject = function(currentMonth) {
        daysArray = [];
        var date = currentMonth.startOf("month"), now = moment(), diff = date.day() - this.options.weekOffset;
        0 > diff && (diff += 7);
        for (var i = 0; diff > i; i++) daysArray.push(this.calendarDay({
            day: i
        }));
        this.eventsThisMonth = [], this.options.events.length && (this.eventsThisMonth = this.options.events.filter(function(event) {
            return event._clndrDateObject.format("YYYY-MM") == currentMonth.format("YYYY-MM");
        }));
        for (var numOfDays = date.daysInMonth(), i = 1; numOfDays >= i; i++) {
            var eventsToday = [], j = 0, l = this.eventsThisMonth.length;
            for (j; l > j; j++) this.eventsThisMonth[j]._clndrDateObject.date() == i && eventsToday.push(this.eventsThisMonth[j]);
            var currentDay = moment([ currentMonth.year(), currentMonth.month(), i ]), extraClasses = "";
            now.format("YYYY-MM-DD") == currentDay.format("YYYY-MM-DD") && (extraClasses += " today"), 
            eventsToday.length && (extraClasses += " event"), daysArray.push(this.calendarDay({
                day: i,
                classes: this.options.targets.day + extraClasses,
                id: "calendar-day-" + currentDay.format("YYYY-MM-DD"),
                events: eventsToday,
                date: currentDay
            }));
        }
        for (;0 !== daysArray.length % 7; ) daysArray.push(this.calendarDay({
            day: "x"
        }));
        return daysArray;
    }, Clndr.prototype.render = function() {
        this.calendarContainer.children().remove();
        var days = this.createDaysObject(this.month);
        this.month;
        var data = {
            daysOfTheWeek: this.daysOfTheWeek,
            numberOfRows: Math.ceil(days.length / 7),
            days: days,
            month: this.month.format("MMMM"),
            year: this.month.year(),
            eventsThisMonth: this.eventsThisMonth,
            extras: this.options.extras
        };
        this.options.render ? this.calendarContainer.html(this.options.render(data)) : this.calendarContainer.html(this.compiledClndrTemplate(data)), 
        this.options.doneRendering && this.options.doneRendering();
    }, Clndr.prototype.bindEvents = function() {
        var $container = $(this.element);
        $container.on("click", "." + this.options.targets.day, {
            context: this
        }, function(event) {
            if (event.data.context.options.clickEvents.click) {
                var target = event.data.context.buildTargetObject(event.currentTarget, !0);
                event.data.context.options.clickEvents.click(target);
            }
        }), $container.on("click", "." + this.options.targets.empty, {
            context: this
        }, function(event) {
            if (event.data.context.options.clickEvents.click) {
                var target = event.data.context.buildTargetObject(event.currentTarget, !1);
                event.data.context.options.clickEvents.click(target);
            }
        }), $container.on("click", "." + this.options.targets.previousButton, {
            context: this
        }, this.backAction).on("click", "." + this.options.targets.nextButton, {
            context: this
        }, this.forwardAction).on("click", "." + this.options.targets.todayButton, {
            context: this
        }, this.todayAction);
    }, Clndr.prototype.buildTargetObject = function(currentTarget, targetWasDay) {
        var target = {
            element: currentTarget,
            events: null,
            date: null
        };
        if (targetWasDay) {
            var dateString = currentTarget.id.replace("calendar-day-", "");
            target.date = moment(dateString), this.options.events && (target.events = this.options.events.filter(function(event) {
                return event._clndrDateObject.format("YYYY-MM-DD") == dateString;
            }));
        }
        return target;
    }, Clndr.prototype.forwardAction = function(event) {
        event.data.context.month.add("months", 1), event.data.context.options.clickEvents.nextMonth && event.data.context.options.clickEvents.nextMonth(event.data.context.month), 
        event.data.context.options.clickEvents.onMonthChange && event.data.context.options.clickEvents.onMonthChange(event.data.context.month), 
        event.data.context.render();
    }, Clndr.prototype.backAction = function(event) {
        event.data.context.month.subtract("months", 1), event.data.context.options.clickEvents.previousMonth && event.data.context.options.clickEvents.previousMonth(event.data.context.month), 
        event.data.context.options.clickEvents.onMonthChange && event.data.context.options.clickEvents.onMonthChange(event.data.context.month), 
        event.data.context.render();
    }, Clndr.prototype.todayAction = function(event) {
        event.data.context.month = moment(), event.data.context.options.clickEvents.today && event.data.context.options.clickEvents.today(event.data.context.month), 
        event.data.context.render();
    }, Clndr.prototype.forward = function() {
        return this.month.add("months", 1), this.render(), this;
    }, Clndr.prototype.back = function() {
        return this.month.subtract("months", 1), this.render(), this;
    }, Clndr.prototype.next = function() {
        return this.forward(), this;
    }, Clndr.prototype.previous = function() {
        return this.back(), this;
    }, Clndr.prototype.setMonth = function(newMonth) {
        return this.month.month(newMonth), this.render(), this;
    }, Clndr.prototype.setYear = function(newYear) {
        return this.month.year(newYear), this.render(), this;
    }, Clndr.prototype.nextYear = function() {
        return this.month.add("year", 1), this.render(), this;
    }, Clndr.prototype.previousYear = function() {
        return this.month.subtract("year", 1), this.render(), this;
    }, Clndr.prototype.setYear = function(newYear) {
        return this.month.year(newYear), this.render(), this;
    }, Clndr.prototype.setEvents = function(events) {
        return this.options.events = this.addMomentObjectToEvents(events), this.render(), 
        this;
    }, Clndr.prototype.addEvents = function(events) {
        return this.options.events = $.merge(this.options.events, this.addMomentObjectToEvents(events)), 
        this.render(), this;
    }, Clndr.prototype.addMomentObjectToEvents = function(events) {
        var self = this, i = 0, l = events.length;
        for (i; l > i; i++) events[i]._clndrDateObject = moment(events[i][self.options.dateParameter]);
        return events;
    }, Clndr.prototype.calendarDay = function(options) {
        var defaults = {
            day: "",
            classes: this.options.targets.empty,
            events: [],
            id: "",
            date: null
        };
        return $.extend({}, defaults, options);
    }, $.fn.clndr = function(options) {
        if (!$.data(this, "plugin_clndr")) {
            var clndr_instance = new Clndr(this, options);
            return $.data(this, "plugin_clndr", clndr_instance), clndr_instance;
        }
    };
}(jQuery, window, document);