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
        h.id = this.guidGenerator();
        this.createTasks(h);
        this.createStatistics(h);
        console.log(JSON.stringify(h))
        this.h.push(h);
        this.habits.next(this.h);
    }

    createTasks(h) {
        // each task is a repetition of a habit, the task list is a property of the habit object
        h.created_on = moment().format();
        h.tasks = [];
        h.status = 'AWAITING';
        let next = this.getStartDate(h);
        const end = this.getEndDate(h, next);

        if (h.frequency_units == 'day') {
            this.addDailyTasks(h, next, end);
        }
        else if (h.frequency_units == 'week') {
            this.addWeeklyTasks(h, next, end);
        }
    }

    maxTimes(h) {
        return h.end_units == 'times' && (h.tasks.length >= h.end_quantity)
    }

    maxDate(h, next, end) {
        return h.end_units != 'times' && (next > end)
    }

    addWeeklyTasks(h, next, end) {
        // for the range of moments between start and end, create tasks and iterate the next moment
        let next = next.startOf('week');

        while (!this.maxDate(h, next, end) && !this.maxTimes(h)) {
            // repeat for the frequency quantity, eg. three times / day
            for (let i = 0; i < h.frequency_days.length; i++) {
                // let time = h.frequency_hours[i];
                let task = {
                    date: next.clone().add(h.frequency_days[i], 'day').format(),
                    status: 'AWAITING',
                    id: this.guidGenerator()
                }
                console.log('created task', task);

                h.tasks.push(task);
            }
            next = next.clone().add(1, 'week');
        }
    }

    addDailyTasks(h, next, end) {
        // for the range of moments between start and end, create tasks and iterate the next moment
        while (!this.maxDate(h, next, end) && !this.maxTimes(h)) {
            // repeat for the frequency quantity, eg. three times / day
            for (let i = 0; i < h.frequency_quantity; i++) {
                // determine hour of day if hour is set
                if (h.frequency_hours[i]) {
                    let time = h.frequency_hours[i];
                } else {
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

    getStartDate(h) {
        if (h.start_date) {
            return moment(h.start_date).startOf('day');
        }
        return moment().startOf('day');
    }

    getEndDate(h, start) {
        if (h.end_date) {
            return moment(h.end_date).startOf('day');
        }
        return start.clone().add(h.end_quantity, h.end_units);
    }

    removeSelectedHabits(hs) {
        this.h = this.h.filter((h) => {
            return this.h.every((_h) => {
                return _h.name != h.name;
            })
        })
        this.habits.next(this.h);
    }

    completeTask(h_id, t_id, date) {
        // debugger;
        // retrieve the reference version of the task
        let habit = this.h.filter((h) => {
            return h.id == h_id;
        })[0];

        let task = habit.tasks.filter((t) => {
            return t.id == t_id;
        })[0];

        task.status = 'COMPLETE'
        task.completed_time = moment(date).startOf('day').format();

        // this.updateStatistics(h);
        // debugger;
        if (this.allTasksComplete(habit)) {
            habit.status = 'COMPLETE'
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

    guidGenerator() {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}

