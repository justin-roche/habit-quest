import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class HabitsService {

    private h = [];
    private currentDate = moment();

    public habits: BehaviorSubject<Array<any>>;
    public habitsForDate: BehaviorSubject<Array<any>>;

    constructor(private ss: StorageService) {
        this.habits = new BehaviorSubject(null);
        this.loadHabits()
    }

    loadHabits() {
        this.ss.load().subscribe((v) => {
            console.log('loaded storage', v)
            this.h = v;
            this.checkForMissedTasks();
            console.log('loaded', this.h)
            this.habits.next(this.h);
        })
    }

    checkForMissedTasks() {
        this.h.forEach((h) => {
            h.tasks.forEach((t) => {
                if (this.isMissed(t)) t.status = 'MISSED'
            })
        })
    }

    isMissed(t) {
        // debugger;
        return moment(t.date).isBefore(this.currentDate, 'day');
    }

    addHabit(h) {

        h.created_on = moment().format();
        h.status = 'AWAITING';

        this.createRange(h)
        this.createTasks(h)
        this.createStatistics(h);
        console.log(JSON.stringify(h))
        console.log('new habit', h)
        this.h.push(h);
        this.habits.next(this.h);
    }

    createRange(h) {
        let start = this.getStartDate(h)
        let end = this.getEndDate(h, start)
        let diff = end.diff(start, 'day')

        h.range = {
            start: start.format(),
            end: end.format(),
            diff: diff
        };

    }

    getStartDate(h) {
        if (h.start_date) {
            return moment(h.start_date).startOf('day');
        }
        return moment().startOf('day');
    }

    getEndDate(h, start) {
        if (h.end_units == 'day') {
            return start.clone().add(h.end_quantity, 'day');
        }
        if (h.end_units == 'week') {
            return start.clone().add(h.end_quantity, 'week');
        }

        if (h.end_units == 'times') {
            return start.clone().add(h.end_quantity, h.frequency_units);
        }
    }

    createTasks(h, c) {
        h.tasks = [];

        for (let c = 0; c < h.range.diff; c++) {
            let currentDay = moment(h.range.start).clone().add(c, 'day')

            h.times.forEach((_t) => {
                if (_t.weekday == currentDay.weekday()) {

                    let task = {

                        allDay: _t.allDay,
                        weekday: _t.weekday,
                        hour: _t.hour,

                        startTime: currentDay.clone().add(_t.hour, 'hours').format(),
                        endTime: currentDay.clone().add(_t.hour + 1, 'hours').format(),
                        date: currentDay.format(),
                        status: 'AWAITING',
                    }

                    h.tasks.push(task);
                }
            })

        }
    }






    removeSelectedHabits(hs) {
        this.h = this.h.filter((h) => {
            return this.h.every((_h) => {
                return _h.name != h.name;
            })
        })
        this.habits.next(this.h);
    }

    completeTask(h, time) {
        let task = h.tasks.filter((t) => {
            return time.isSame(t.date, 'd')
        })[0];
        task.status = 'COMPLETE'
        task.completed_time = moment(time).startOf('day').format();

        this.updateStatistics(h);

        if (this.allTasksComplete(h)) {
            h.status = 'COMPLETE'
        }
        debugger;
        this.habits.next(this.h);
    }

    createStatistics(h) {
        let statistics =
        {
            completed_percentage: 0,
            longest_streak: 0,
            points: 0,
            finished_runs: [],
        };
        h.statistics = statistics
    }

    updateStatistics(h) {
        h.statistics.completed = h.tasks.filter((t) => {
            return t.status == 'COMPLETE';
        }).length
        h.statistics.missed = h.tasks.filter((t) => {
            return t.status == 'MISSED';
        }).length

        h.statistics.completed_percentage = Math.floor((h.statistics.completed / h.tasks.length) * 100);
    }

    allTasksComplete(h) {
        return h.tasks.every((t) => {
            return t.status == 'COMPLETE'
        })
    }
}

