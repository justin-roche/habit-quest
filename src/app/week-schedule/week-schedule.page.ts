import { Component, OnInit, NgZone, ViewChild, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
// import { CalendarComponent } from "ionic2-calendar/calendar";

@Component({
    selector: 'app-week-schedule',
    templateUrl: './week-schedule.page.html',
    styleUrls: ['./week-schedule.page.scss'],
})
export class WeekSchedulePage implements OnInit {
    @Input() events;

    private ready = false
    private dateMap = []
    private calendar = {
        currentDate: new Date,
        selectedDates: null,
    }

    constructor(private mc: ModalController, private z: NgZone) { }

    dismiss() {
        this.mc.dismiss(this.calendar.selectedDates.map((d) => {
            delete d.startTime
            delete d.endTime
            delete d.title
            return d
        })
        )
    }
    newEvent(hour = null) {
        let today = moment().startOf('day')
        let base = {
            title: this.title || 'new habit',
            allDay: hour ? false : true,
            weekday: null,
            hour: hour,
            id: moment().valueOf()
        }
        if (hour) {
            base = Object.assign(base, {
                startTime: new Date(today.clone().add(hour, 'hour').format()),
                endTime: new Date(today.clone().add(hour + 1, 'hour').format()),

            })
        } else {
            base = Object.assign(base, {
                startTime: new Date(today.clone().utc().format()),
                endTime: new Date(today.add(1, 'day').clone().utc().format())
            })
        }

        return base;
    }

    ngOnInit() {
        this.calendar.selectedDates = []
    }

    createDateMap() {
        let map = []
        let d = moment().startOf('day')
        while (d.weekday() != 0) {
            d = d.subtract(1, 'day')
        }
        for (let c = 0; c < 7; c++) {
            map.push(d.clone().add(c, 'day'))
        }
        this.dateMap = map;
    }

    ngAfterViewInit() {
        this.createDateMap()

        if (this.events) {
            this.events = this.events.map((e, i) => {
                let start = this.dateMap[e.weekday].clone().add(e.hour, 'hour');
                let end = start.clone().add(1, 'hour')

                e.startTime = new Date(start.format())
                e.endTime = new Date(end.format())
                e.title = start.format();
                return e
            })

        }
        this.calendar.selectedDates = this.events || []

        console.log('afterinit', this.calendar.selectedDates);
        this.ready = true
    }


    onTimeSelected(ev) {
        let d = moment(ev.selectedTime);
        let event = {
            startTime: new Date(d.format()),
            endTime: new Date(d.clone().add(1, 'hour').format()),
            title: d.format(),
            allday: false,
            weekday: d.weekday(),
            hour: d.hour()
        }
        let newDates = this.calendar.selectedDates.slice()
        if (newDates.some((e) => {
            return e.title == event.title;
        })) {
            newDates = newDates.filter((e) => {
                return e.title != event.title;
            })
        } else {
            newDates.push(event)
        }
        this.calendar.selectedDates = newDates;
        console.log('selected', this.calendar.selectedDates);


    }

}
