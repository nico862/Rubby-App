"use strict";
const moment = require("moment");
const calendar = require("node-calendar");
function getDates(start, end, bookings) {
    // create a date map of bookings
    const bookingsMap = {};
    bookings.forEach(booking => { bookingsMap[booking.timeStarts.format("YYYY-MM-DD")] = true; });
    const month = start.clone().subtract(start.date() - 1, "days");
    const dates = [];
    while (month.month() <= end.month()) {
        const monthCalendar = new calendar.Calendar().monthdatescalendar(month.year(), month.month() + 1);
        const weeks = monthCalendar.filter(week => {
            const contains = week.filter(date => {
                const day = moment(date);
                return (day.isAfter(start) && day.isBefore(end));
            });
            return contains.length > 0;
        })
            .map(week => {
            return week.map(dateString => {
                const date = moment(dateString);
                const day = {
                    day: date.date(),
                    date: date.format("YYYY-MM-DD"),
                };
                if (date.month() !== month.month())
                    day.notInMonth = true;
                if (date.isBefore(start) || date.isAfter(end))
                    day.isDisabled = true;
                if (bookingsMap[date.format("YYYY-MM-DD")])
                    day.hasBookings = true;
                return day;
            });
        });
        dates.push({
            name: month.format("MMMM"),
            weeks: weeks
        });
        month.add(1, "months");
    }
    return dates;
}
exports.getDates = getDates;
function getDayAvailability(day, bookings) {
}
exports.getDayAvailability = getDayAvailability;

//# sourceMappingURL=calendar.js.map
