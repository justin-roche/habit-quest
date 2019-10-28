import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { ModalController } from '@ionic/angular';
import { HabitsService } from '../services/habits.service';
import { SettingsService } from '../services/settings.service';
import { ScheduleService } from '../services/schedule.service';
import * as moment from 'moment';

@Component({
    selector: 'app-month-schedule',
    templateUrl: './month-schedule.page.html',
    styleUrls: ['./month-schedule.page.scss'],
})
export class MonthSchedulePage implements OnInit {
    @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
    private viewTitle;
    // private displayDate = moment();
    private source = [];
    private schedule = [];
    private mode = 'loading';
    private settings;

    constructor(private mc: ModalController, private ss: SettingsService, private hs: HabitsService, private sc: ScheduleService) {

        this.ss.getSettings().subscribe((val) => {
            this.settings = val;
        });
    }

    ngOnInit() {
        this.mode = 'ready';
    }

    getMonthEvents(m) {
        // if the first of current month is sunday, it is the beginnnig of display range, otherwise find previous sunday. Display adds 35 days to the first displayed date
        // const d = moment().month(m).startOf('month');
        // console.log('month day', d);
        // const last = d.day() != 0 ? d.subtract(d.day(), 'day') : d;
        const range = [];
        for (let i = 0; i < 42; i++) {
            // range.push(this.createEventForDate(last));
            // last = last.clone().add(1, 'day').startOf('day');
        }

        return range;
    }

    dateSwipe(dir) {
        let s = document.querySelector('.swiper-container')['swiper'];
        dir === 1 ? s.slideNext() : s.slidePrev();
        // this.source = this.getMonthEvents();
        // console.log('new source', this.source);
    }

    selectDate(d) {
        // respond to clicks
        const e = d.events[0];
        // console.log('e', e);
        if (e.startInterval === false) {
            if (!e.selected) {
                // untoggle all other selections if they are selected
                this.source = this.source.map((e) => {
                    if (e.selected) {
                        e.selected = false;
                        e.style = '';
                    }
                    return e;
                });
                this.myCalendar.loadEvents();
                e.selected = true;
                e.style = 'awaiting';
            } else {
                e.selected = false;
                e.style = '';
            }
        }
        console.log('changed e', e);
    }

    setColors() {
        this.schedule = this.schedule.map((d) => {
            let s = [];
            if (d.tasks.length > 0) {
                if (d.tasks.some((t) => t.status == 'COMPLETE')) s.push('complete')
                if (d.tasks.some((t) => t.status == 'MISSED')) s.push('failure')
                if (d.startInterval) s.push('blocked');
            }
            if (d.today) s.push('current');
            d.style = s.join(' ');
            return d;
        });
        console.log('shedule', this.schedule);

        // disable past creation

    }

    onViewTitleChanged(title: string) {
        // date component does not render changed title; render outside
        if (this.viewTitle != title) {
            this.viewTitle = title;
            // console.log('title', this.viewTitle, title);
            this.schedule = this.sc.getMonthSchedule(title);
            this.setColors();
            this.source = this.schedule;
        }

    }

    dismiss() {
        let selected = this.source.filter((d) => {
            return d.selected;
        })[0];
        if (selected) {
            selected = selected.date.format();
        }
        // returns undefined if nothing selected
        this.mc.dismiss(selected);
    }

    canSubmit() {
        return this.source.some((d) => {
            return d.selected;
        });
    }
}
