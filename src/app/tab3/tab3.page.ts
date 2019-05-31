import { Component, ViewChild } from '@angular/core';
import { HabitsService } from '../services/habits.service';
import { CalendarComponent } from 'ionic2-calendar';

import * as moment from 'moment';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    currentDate = new Date

    private habits = [];
    private source = [];

    constructor(private hs: HabitsService) {
        this.hs.habits.asObservable().subscribe((d) => {
            if (d.length) {
                this.habits = d
                this.setHabit(this.habits[0])
            }
        })
    }

    setHabit(h) {

        let map = {
            'COMPLETE': 'completed',
            'MISSED': 'failure',
            'AWAITING': 'awaiting',
        }
        let s = []
        h.tasks.forEach((t) => {
            s.push({
                title: h.name,
                startTime: new Date(t.date),
                endTime: new Date(moment(t.date).add(1, 'hour').format()),
                allDay: false,
                color: map[t.status],
            })
        })
        this.source = s;
        // console.log(this.source);

    }

}
