import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from "ionic2-calendar/calendar";
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { HabitsService } from '../services/habits.service';

@Component({
    selector: 'app-month-schedule',
    templateUrl: './month-schedule.page.html',
    styleUrls: ['./month-schedule.page.scss'],
})
export class MonthSchedulePage implements OnInit {
    @ViewChild(CalendarComponent) myCalendar: CalendarComponent;

    private calendar = {
        currentDate: new Date,
    }
    private selectedDate;
    private displayDate = moment();


    private source = []
    private mode = 'loading';

    constructor(private mc: ModalController, private hs: HabitsService) { }

    ngOnInit() {
        this.source = this.getMonthEvents();
        this.mode = 'ready';
    }

    getMonthEvents() {
        // if the first of current month is sunday, it is the beginnnig of display range, otherwise find previous sunday. Display adds 35 days to the first displayed date
        let d = this.displayDate.clone().startOf('month');
        let last = d.day() != 0 ? d.subtract(d.day(), 'day') : d;
        let range = [];
        for (let i = 0; i < 42; i++) {
            range.push(this.createEventForDate(last));
            last = last.clone().add(1, 'day').startOf('day');
        }

        return range;
    }

    createEventForDate(d) {
        // create source for calendar including color and status
        let base = {
            title: d.format(),
            startTime: d.toDate(),
            endTime: d.add(1, 'hour').toDate(),
            allDay: false,
        };


        if (moment().isAfter(d, 'd')) {
            base.color = 'disabled';
            base.selectable = false;
        } else {
            if (this.hs.isBlockedDay(d)) {
                // console.log('is blocked', d);
                base.color = 'blocked';
                base.selectable = false;
            }
        }

        if (this.hs.isStartDate(d)) {
            console.log('start', d);

            base.color = 'other';
            base.selectable = false;
        }

        if (moment().isSame(d, 'd')) {
            base.color = 'current';
        }

        return base;
    }


    dateSwipe(dir) {
        var s = document.querySelector('.swiper-container')['swiper'];
        dir == 1 ? s.slideNext() : s.slidePrev();
        this.displayDate = dir == 1 ? moment(this.displayDate).add(1, 'month') : this.displayDate = moment(this.displayDate).subtract(1, 'month');
        this.source = this.getMonthEvents();
        // console.log('new source', this.source);
    }

    selectDate(d) {
        // respond to clicks
        let e = d.events[0];
        if (e.selectable != false) {
            if (!e.selected) {
                // untoggle all other selections if they are selected
                this.source = this.source.map((e) => {
                    if (e.selected) {
                        e.selected = false;
                        e.color = null;
                    }
                    return e;
                });
                this.myCalendar.loadEvents();
                console.log('set source', this.source);
                e.selected = true;
                e.color = 'awaiting';
            } else {
                e.selected = false;
                e.color = null;
            }
        }
    }


    onTimeSelected(ev: { selectedTime: Date, events: any[] }) {
        let d = moment(ev.selectedTime)
        // if (d.date() == moment(this.source[0].startTime).date()) {

        // }
        // else {
        this.selectDate(ev)
        // }
    };

    dismiss() {
        this.mc.dismiss(this.source.filter((d) => {
            return d.selected;
        })[0]);
    }

    canSubmit() {
        return this.source.some((d) => {
            return d.selected;
        });
    }




}
