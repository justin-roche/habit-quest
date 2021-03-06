import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { HabitsService } from 'src/app/services/habits.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { CypressAdapterService } from 'src/app/services/cypress-adapter.service';

@Component({
    selector: 'report-calendar',
    templateUrl: './report-calendar.component.html',
    styleUrls: ['./report-calendar.component.scss'],
})
export class ReportCalendarComponent {
    private h = [];
    private source = null;
    private settings;
    private viewTitle;

    private colorMap = {
        'COMPLETE': 'completed',
        'MISSED': 'failure',
        'AWAITING': 'awaiting',
    }

    @Input() set habit(value) {
        // bind to input change to run listener
        if (value) {
            // console.log('calendar update', value);
            this.h = value;
            this.handleHabit();
        }
    }

    constructor(private cas: CypressAdapterService,
        private scs: ScheduleService,
        private ss: SettingsService,
        private hs: HabitsService) {
        this.cas.register('report-calendar', this);
        this.ss.getSettings().subscribe((val) => {
            this.settings = val;
        })
    }

    handleHabit() {
        // only need to get events one time to bind them to the calendar. The current date only changes the days displayed
        this.source = this.getEventsForHabit();
    }

    getEventsForHabit() {
        return (<any>this.h).tasks.map((t) => {
            return {
                // primary task association, used to determine handling for click event
                task: t,
                title: (<any>this.h).name,
                startTime: new Date(t.date),
                endTime: new Date(moment(t.date).add(1, 'hour').format()),
                allDay: false,
                // the color used by calendar template, provides classes as referenced in global.scss
                style: this.colorMap[t.status],
            };
        })
    }

    onClick(d) {
        let e = d.events[0];
        if (e && e.task) this.toggleTaskStatus(e.task)
    }

    toggleTaskStatus(task) {
        console.log('toggling task status', task);
        if (moment(task.date).isSameOrBefore(moment())) {
            if (task.status != 'COMPLETE') {
                this.hs.setTaskStatus((<any>this.h).id, task.id, task.date, 'COMPLETE');
            } else if (task.status == 'COMPLETE') {
                this.hs.setTaskStatus((<any>this.h).id, task.id, task.date, 'MISSED');
            }
        }
    }

    onViewTitleChanged(title: string) {
        // date component does not render changed title; render outside
        this.viewTitle = title;
    }
}
