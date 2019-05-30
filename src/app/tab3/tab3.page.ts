import { Component, ViewChild } from '@angular/core';
import { HabitsService } from '../services/habits.service';

import { CalendarComponent } from 'ionic2-calendar';
import * as moment from 'moment';

let mockSource = [{
    "title": "b",
    // allDay: false,
    "startTime": new Date("2019-05-07T17:00:00.000Z"),
    "endTime": new Date("2019-05-07T19:00:00.000Z")
}
]

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
    // @ViewChild('calendar') calendar: CalendarComponent;
    currentDate = new Date

    private habits = [];
    private source = mockSource

    constructor(private hs: HabitsService) {
        this.hs.habits.asObservable().subscribe((d) => {
            this.habits = d
        })


    }

    setHabit(h) {
        console.log('h', h);
        let s = []
        h.scheduled_tasks.forEach((t) => {
            s.push({
                title: h.name,
                startTime: new Date(t),
                endTime: new Date(moment(t).add(1, 'hour').format()),
                allDay: false
            })
        })
        this.source = s;
        console.log(this.source);
        // this.calendar.loadEvents();

    }

}
