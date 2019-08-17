import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class HabitsService {

    private h = null;
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
        if (h.end_type == 'day') {
            return start.clone().add(h.end_quantity, 'day');
        }
        if (h.end_type == 'week') {
            return start.clone().add(h.end_quantity, 'week');
        }
        if (h.end_type == 'times') {
            return start.clone().add(h.end_quantity, h.frequency_units);
        }
    }

    createTasks(h) {
        h.tasks = [];
        this.iterateRange(h, (testDay) => {
            let taskTemplates = h.frequency_units == 'day' ? h.daily_schedule : h.weekly_schedule;
            taskTemplates.forEach((taskTemplate) => {
                let task = this.createTask(taskTemplate, testDay)
                if (h.frequency_units == 'day') {
                    h.tasks.push(task);
                }
                if (h.frequency_units == 'week') {
                    if (taskTemplate.allWeek && testDay.weekday() == 0) {
                        h.tasks.push(task);
                    }
                    if (!taskTemplate.allWeek && (taskTemplate.weekday == testDay.weekday())) {
                        h.tasks.push(task);
                    }
                }
            })
        })
    }

    iterateRange(h, fn) {
        for (let c = 0; c < h.range.diff; c++) {
            let testDay = moment(h.range.start).clone().add(c, 'day')
            if (h.frequency_units == 'day' && ((c % h.frequency) == 0)) {
                fn(testDay)
            }
            if (h.frequency_units == 'week' && ((Math.floor(c / 7)) % h.frequency) == 0) {
                fn(testDay)
            }
        }
    }

    createTask(t, testDay) {
        let task = {

            allDay: t.allDay,
            weekday: testDay.weekday(),
            hour: t.hour,

            startTime: testDay.clone().add(t.hour, 'hours').format(),
            endTime: testDay.clone().add(t.hour + 1, 'hours').format(),
            date: testDay.format(),
            status: 'AWAITING',
        }
        return task
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

