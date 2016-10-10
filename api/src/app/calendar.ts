import * as moment from "moment";
import * as calendar from "node-calendar";

const AHEAD_DAYS = 14;

const start = moment().startOf("day");
const end = start.clone().add(AHEAD_DAYS, "days");

const month = start.clone().subtract(start.date() - 1, "days");

interface Day {
  date: number;
  notInMonth?: boolean;
  disabled?: boolean;
}

interface Month {
  name: string;
  weeks: Day[][];
}

const dates: Month[] = [];

while (month.month() <= end.month()) {
  // dates.push(month.format());
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
      const day: Day = {date: date.date()};

      if (date.month() !== month.month()) day.notInMonth = true;
      if (date.isBefore(start) || date.isAfter(end)) day.disabled = true;
      return day;
    });
  });

  dates.push({
    name: month.format("MMMM"),
    weeks
  });

  month.add(1, "months");
}

console.log(
  // start.date()
  JSON.stringify(dates, null, 2)
);
