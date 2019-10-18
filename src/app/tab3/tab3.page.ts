import { Component, ViewChild } from '@angular/core';
import { HabitsService } from '../services/habits.service';
// import { CalendarComponent } from 'ionic2-calendar';
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
            if (d && d.length) {
                this.habits = d
                this.setHabit(this.habits[0])
                console.log('habits received', this.habits);
            }
        })
    }

    setHabit(h) {
        let colorMap = {
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
                // the color used by calendar template, provides classes as referenced in global.scss
                color: colorMap[t.status],
            })
        })

        // this.source = s;
        let defaultSource = {
            title: h.name,
            startTime: new Date(),
            endTime: new Date(moment().add(1, 'hour').format()),
            allDay: false,
            // the color used by calendar template, provides classes as referenced in global.scss
            color: 'completed',
        }
        this.source = [defaultSource];
        console.log('source', this.source);
    }
}
