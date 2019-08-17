import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor() { }


    newEvent() {
        let base = {
            title: this.title || 'new habit',
            weekday: null,
            id: moment().valueOf()
        }
        return base;
    }

    newAllDayEvent() {
        let today = moment().startOf('day')
        let event = this.newEvent()

        event.allDay = true;
        event.startTime = new Date(today.clone().utc().format())
        event.endTime = new Date(today.add(1, 'day').clone().utc().format())
        return event;
    }

    newTimedEvent(hour, minute = 0) {
        let today = moment().startOf('day')
        let event = this.newEvent()

        event.allDay = false;
        event.hour = hour;
        event.startTime = new Date(today.clone().add(hour, 'hour').add(minute, 'minute').format())
        event.endTime = new Date(today.clone().add(hour, 'hour').add(minute, 'minute').add(this.duration, 'minute').format())

        return event;
    }


    adjustEventsForCurrentCalendar() {
        let d = moment().startOf('day')

        if (this.events) {
            this.events = this.events.map((e, i) => {
                if (e.allDay) return this.newAllDayEvent()
                if (!e.allDay) return this.newTimedEvent(e.hour, e.minute)
            })
            this.calendar.events = this.events
        }

        // let s = JSON.stringify(this.calendar.events, null, 2)
        // console.log('afterinit', this.calendar.events, s);
    }

    onClickAllDay() {
        if (this.calendar.events.some(d => d.allDay)) {
            this.calendar.events = []
        } else {
            let event = this.newAllDayEvent()
            this.calendar.events = [event]
        }
    }

    onEventSelected(e) {
        // console.log('ev click', e);
    }

    onTimeSelected({ selectedTime, events }) {
        let d = moment(selectedTime);
        // debugger
        let event = this.newTimedEvent(d.hour(), d.minute())
        let newDates = this.calendar.events.slice()

        newDates = newDates.filter(e => !e.allDay);

        if (events.length == 0) {
            newDates.push(event)
        } else {
            newDates = newDates.filter(e => e.hour != event.hour)
        }

        this.calendar.events = newDates;
        let obj = this.calendar.events
        let s = JSON.stringify(obj, null, 2)
        console.log('selected time', selectedTime, s);
    }


}





