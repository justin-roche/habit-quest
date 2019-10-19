import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { StorageService } from './storage.service';
import { SettingsService } from './settings.service';

@Injectable({
    providedIn: 'root'
})
export class HabitsService {

    private h = [];
    private currentDate = moment();
    private settings;
    public habits: BehaviorSubject<Array<any>>;
    public habitsForDate: BehaviorSubject<Array<any>>;

    constructor(private storage: StorageService, private ss: SettingsService) {

        this.ss.getSettings().subscribe((val) => {
            this.settings = val;
        })

        this.habits = new BehaviorSubject(null);
        this.storage.load().subscribe((v) => {
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
        this.setStartDate(h);
        let next = h.start_date;
        const end = this.getEndDate(h, next);

        if (h.frequency_units == 'day') {
            this.addDailyTasks(h, next, end);
        }
        else if (h.frequency_units == 'week') {
            this.addWeeklyTasks(h, next, end);
        }
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


    isBlockedDay(d) {
        // determine if date is within auto schedule block interval; checking if any prior day is a start date
        d = d.clone();

        return (this.h.some((h) => {
            let startInterval = moment(h.start_date).isAfter(d.clone().subtract(this.settings.autoScheduleInterval, 'day'))
            let hasTask = h.tasks.some((t) => d.isSame(moment(t.date), 'day'));
            // debugger;
            console.log('interval//task', startInterval, hasTask, d);

            return startInterval && hasTask;
        }));

    }

    isStartDate(d) {
        d = d.clone();
        // tests that no habit has a start date on d

        // return moment(h.start_date).isSame(d, 'day');
        // }))
    }

    isNotStartDay(d) {
        // tests that no habit has a start date on d
        return (this.h.every((h) => {
            return !moment(h.start_date).isSame(d, 'day');
        }))
    }

    isNotStartRange(d) {
        // kj
    }

    setStartDate(h) {
        if (h.start_type == 'auto') {
            // add habits at 14 day intervals by default
            // let sortedHabits = this.h.sort((a, b) => {
            //     return a.start_date.isAfter(b.start_date) ? -1 : 1;
            // })

            let d = moment().startOf('day');
            let available = false;
            while (available == false) {
                if (this.isNotStartDay(d)) {
                    available = true;
                } else {
                    d = d.add(this.settings.autoScheduleInterval, 'day');
                }
            }
            console.log('auto date', d);

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

