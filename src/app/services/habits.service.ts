declare var require: any;

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { SettingsService } from './settings.service';
import { StatisticsService } from './statistics.service';
// without subpathing it will look for coverage build? https://github.com/bunkat/later/issues/155
import * as moment from 'moment';
import * as _ from 'underscore';
require('later/later.js');
let later = (<any>window).later;
// let mockdate = require('mockdate');

@Injectable({
    providedIn: 'root'
})
export class HabitsService {
    // the primary variables, habits array and aggregate statistics
    private h = [];
    private i = [];
    private as = null;
    private settings;
    public habits: BehaviorSubject<Array<any>>;
    public incidents: BehaviorSubject<Array<any>>;
    public aggregate: BehaviorSubject<any>;

    constructor(private storage: StorageService,
        private ss: SettingsService,
        private sts: StatisticsService) {

        this.ss.getSettings().subscribe((val) => {
            this.settings = val;
        })

        // the initial set value, emitted as first value to all subscribers
        this.habits = new BehaviorSubject(null);
        this.incidents = new BehaviorSubject(null);
        this.aggregate = new BehaviorSubject(null);

        let self = this;
        (<any>window).ph = function() {
            console.log('habits', JSON.stringify(self.h));
        };
        // storage saves state atomically, incorporating habits with expired habits
        this.storage.load().subscribe(this.handleLoad.bind(this));
        this.scheduleExpirationCheck();
    }

    scheduleExpirationCheck() {
        var schedule = later.parse.cron('0 0 * * *');
        // var schedule = later.parse.text('every 5 seconds');
        later.setInterval(this.markExpired.bind(this), schedule);
        later.setInterval(this.markMissed.bind(this), schedule);
    }

    handleLoad(state) {
        this.h = state;
        this.markMissed();
        this.sts.updateAllStatistics(this.h);
        this.broadcastHabits();
    }

    markExpired() {
        this.h.forEach((h) => {
            if (h.tasks.every((t) => moment().isAfter(t.date, 'd'))) h.expired = true;
        });
    }

    addIncident(i) {
        i.id = this.guidGenerator();
        this.i.push(i);
        this.broadcastHabits();
    }

    addHabit(h) {
        h.start_date = moment(h.start_date);
        h.id = this.guidGenerator();
        this.createTasks(h);
        this.sts.createStatisticsForHabit(h);
        this.h.push(h);
        this.markMissed();
        this.sts.updateAllStatistics(this.h);
        this.broadcastHabits();
        // this.habits.next(this.h);
    }

    createTasks(h) {
        // each task is a repetition of a habit, the task list is a property of the habit object
        h.created_on = moment().format();
        h.tasks = [];
        h.status = 'AWAITING';
        this.setStartDate(h);
        let next = h.start_date;
        const end = this.getEndDate(h, next);
        h.end_date = end;

        if (h.frequency_units == 'day') {
            this.addDailyTasks(h, next, end);
        }
        else if (h.frequency_units == 'week') {
            this.addWeeklyTasks(h, next, end);
        }
    }

    markMissed() {
        this.h.forEach((h) => {
            h.tasks.forEach((t) => {
                if (this.isMissed(t)) t.status = 'MISSED'
            })
        })
    }

    isMissed(t) {
        return (moment(t.date).isBefore(moment(), 'day') && t.status == 'AWAITING');
    }

    getTasksForDate(d) {
        // a moment date
        let t = [];
        this.h.forEach((h) => {
            let tasks = h.tasks.filter((t) => {
                return d.isSame(t.date, 'd')
            });
            t = t.concat(tasks);
        });
        return t;
    }

    maxTimes(h) {
        return h.end_units == 'times' && (h.tasks.length >= h.end_quantity)
    }

    maxDate(h, next, end) {
        return h.end_units != 'times' && (next > end)
    }

    addWeeklyTasks(h, n, end) {
        // for the range of moments between start and end, create tasks and iterate the next moment
        let next = n.startOf('week');

        while (!this.maxDate(h, next, end) && !this.maxTimes(h)) {
            // repeat for the frequency quantity, eg. three times / day
            for (let i = 0; i < h.frequency_days.length; i++) {
                // let time = h.frequency_hours[i];
                let task = {
                    date: moment(next).clone().add(h.frequency_days[i], 'day').format(),
                    status: 'AWAITING',
                    id: this.guidGenerator()
                }
                // console.log('created task', task);

                h.tasks.push(task);
            }
            next = next.clone().add(1, 'week');
        }
    }

    addDailyTasks(h, next, end) {
        // for the range of moments between start and end, create tasks and iterate the next moment
        while (!this.maxDate(h, next, end) && !this.maxTimes(h)) {
            // repeat for the frequency quantity, eg. three times / day
            let time = null;
            for (let i = 0; i < h.frequency_quantity; i++) {
                // determine hour of day if hour is set
                if (h.frequency_hours[i]) {
                    time = h.frequency_hours[i];
                } else {
                    // the default daytime for actions is midnight
                    time = 0;
                }
                let task = {
                    date: next.clone().add(time.hour, 'hour').format(),
                    status: 'AWAITING',
                    id: this.guidGenerator()
                }

                h.tasks.push(task);
            }
            next = next.clone().add(1, h.frequency_units);
        }
    }

    isNotStartDay(d) {
        // tests that no habit has a start date on d
        return (this.h.every((h) => {
            return !moment(h.start_date).isSame(d, 'day');
        }))
    }

    setStartDate(h) {
        if (h.start_type == 'auto') {
            // add habits at 14 day intervals by default

            let d = moment().startOf('day');
            let available = false;
            while (available == false) {
                if (this.isNotStartDay(d)) {
                    available = true;
                } else {
                    d = d.add(this.settings.autoScheduleInterval, 'day');
                }
            }
            // console.log('auto date', d);

            h.start_date = d;
            return d;

        }
        if (h.start_type == 'first') {
            // the first day with no habits
            let available = false;
            let d = moment().startOf('day');
            while (available == false) {
                available = this.getTasksForDate(d).length == 0;
                d = d.add(1, 'day');
            }
            h.start_date = d;
        }

        if (h.start_type == 'today') {
            let d = moment().startOf('day');
            h.start_date = d;
        }
    }

    getEndDate(h, start) {
        if (h.end_date) {
            return moment(h.end_date).startOf('day');
        }
        return moment(start).clone().add(h.end_quantity, h.end_units);
    }

    deleteHabit(id) {
        // debugger;
        this.h = this.h.filter((h) => h.id != id);

        // duplicated elsewhwere
        this.sts.updateAggregateStatistics(this.h);
        this.broadcastHabits();
    }

    setTaskStatus(h_id, t_id, date, status) {
        let habit = this.h.filter((h) => {
            return h.id == h_id;
        })[0];

        let task = habit.tasks.filter((t) => {
            return t.id == t_id;
        })[0];

        task.status = status;
        if (status == 'COMPLETE') {
            task.completed_time = date;
        }

        this.sts.updateStatistics(habit);
        if (this.allTasksComplete(habit)) habit.status = 'COMPLETE'
        this.as = this.sts.updateAggregateStatistics(this.h);
        this.broadcastHabits();
    }

    broadcastHabits() {
        // change data references to trigger change detection for @input where the binding is outside the angular binding context
        this.h = this.h.map((h) => {
            h.statistics = Object.assign({}, h.statistics);
            return Object.assign({}, h);
        });
        this.habits.next(this.h);

        // as above, to trigger update on charts of summary page 
        this.as = Object.assign({}, this.as);
        this.aggregate.next(this.as);
        this.incidents.next(this.i);
        this.storage.set(this.h);
        console.log('broadcast', this.h);

    }

    allTasksComplete(h) {
        return h.tasks.every((t) => {
            return t.status == 'COMPLETE'
        })
    }

    guidGenerator() {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}

