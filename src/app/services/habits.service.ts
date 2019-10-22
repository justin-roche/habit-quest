import * as _ from 'underscore';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { StorageService } from './storage.service';
import { SettingsService } from './settings.service';
let m = require('./form.json');

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
        // this.storage.load().subscribe(this.onLoad.bind(this));
        this.addHabit(m);

    }

    onLoad() {
        this.h = v;
        this.markMissedTasks();
        this.updateAllStatistics();
        this.habits.next(this.h);
    }

    markMissedTasks() {
        this.h.forEach((h) => {
            h.tasks.forEach((t) => {
                if (this.isMissed(t)) t.status = 'MISSED'
            })
        })
    }

    isMissed(t) {
        return (moment(t.date).isBefore(this.currentDate, 'day') && t.status == 'AWAITING');
    }

    addHabit(h) {
        h.start_date = moment(h.start_date);
        h.id = this.guidGenerator();
        this.createTasks(h);
        this.createStatistics(h);
        this.h.push(h);
        this.markMissedTasks();
        this.updateAllStatistics();
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
        h.end_date = end;

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

    isBlockedDay(d) {
        // determine if date is within auto schedule block interval; checking if any prior day is a start date
        d = d.clone();

        return (this.h.some((h) => {
            let startInterval = moment(h.start_date).isAfter(d.clone().subtract(this.settings.autoScheduleInterval, 'day'))
            let hasTask = h.tasks.some((t) => d.isSame(moment(t.date), 'day'));
            // debugger;
            // console.log('interval//task', startInterval, hasTask, d);

            return startInterval && hasTask;
        }));

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
            // let sorted Habits = this.h.sort((a, b) => {
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

    removeSelectedHabits(hs) {
        this.h = this.h.filter((h) => {
            return this.h.every((_h) => {
                return _h.name != h.name;
            })
        })
        this.habits.next(this.h);
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
            task.completed_time = moment(date).startOf('day').format();
        }

        this.updateStatistics(habit);
        if (this.allTasksComplete(habit)) habit.status = 'COMPLETE'
        console.log('updating with status', status);

        // debugger;
        this.broadcastHabits();
    }

    broadcastHabits() {
        // change data references to trigger change detection for @input where the binding is outside the angular binding context
        this.h = this.h.map((h) => {
            h.statistics = Object.assign({}, h.statistics);
            return Object.assign({}, h);
        });
        this.habits.next(this.h);
    }

    createStatistics(h) {
        let points = this.createPointValue(h);

        let statistics =
        {
            completion: {
                // completion objects for historical days
                totals: [],
                months: [],
                weeks: [],
                // completion objects for present day
                total: {
                    total: 0,
                    completed: 0,
                    percent: 0
                },
                month: {
                    total: 0,
                    completed: 0,
                    percent: 0
                },
                week: {
                    total: 0,
                    completed: 0,
                    percent: 0
                },
                tasks_completed: 0,
                tasks_remaining: h.tasks.length,
                hours_remaining: h.tasks.length,
                hours_used: h.tasks.length,
            },
            strength: {
                streak: {
                    current: 0,
                    longest: 0
                },
                streaks: [],

                habit_strength: 0,
                tasks_missed: 0,
                trends: {
                },
                trend_week: 0,
                trend_month: 0,
            },
            points: {
                point_total: 0,
                total_point_value: points * h.tasks.length,
                points_per_task: points,
            }

            // finished_runs: [],
        };
        h.statistics = statistics
    }

    createPointValue(h) {
        // adjust points according to selected profile here (in relation to schedule)
        return h.difficulty + h.priority + (h.abstinence ? 0 : 1);
    }

    // non emitting actions
    updateAllStatistics() {
        this.h.forEach((h) => {
            this.updateStatistics(h);
        })
    }

    updateStatistics(h) {
        // derive completed percentage from number of tasks that have been completed, non emitting
        this.updateCompletion(h);
        this.updateStrength(h);
        this.updatePoints(h);
    }

    getSuccessRatesByPeriod(h, period, referenceTime) {
        // given a reference time, calculate the success rates for a period preceeding it
        let n = moment(referenceTime) || moment();

        let range = h.tasks.filter((t) => {
            // if period provided, calculate on all tasks in same period and prior
            if (period) {
                return n.isSame(t.date, period) && n.isSameOrAfter(t.date);
            }
            // if no period (all prior) test if task is not in the future 
            return n.isSameOrAfter(t.date)

        });

        let complete = range.filter((t) =>
            t.status == 'COMPLETE');

        let rate = ((complete.length / range.length) * 100).toFixed(1);

        return {
            total: range.length,
            complete: complete.length,
            rate: rate,
            time: n.format(),
            id: h.id
        };
    }

    updateCompletion(h) {
        let comp = h.statistics.completion;

        comp.total = this.getSuccessRatesByPeriod(h);
        comp.month = this.getSuccessRatesByPeriod(h, 'month');
        comp.week = this.getSuccessRatesByPeriod(h, 'week');

        // historical values for completion data; operates on tasks (which all have unique dates 
        let ts = h.tasks.filter((t) => {
            return moment(t.date).isBefore(moment());
        })
        // debugger;

        comp.totals = [];
        comp.weeks = [];
        comp.months = [];

        ts.forEach((t) => {
            let historical = {};
            let historicalTime = t.date;
            // calculate the rates for historical reference times, can be more efficient by only calculating historical data for times in the future of the triggering change, instead of recalculating all historical values for every change.

            let total = this.getSuccessRatesByPeriod(h, null, historicalTime);
            let month = this.getSuccessRatesByPeriod(h, 'month', historicalTime);
            let week = this.getSuccessRatesByPeriod(h, 'week', historicalTime);

            comp.totals.push(total);
            comp.months.push(month);
            comp.weeks.push(week);
        })
        // console.log('updated historical', comp, h);

        comp.hours_used = this.getDurationMinutes(h);
    }

    updateStrength(h) {
        this.getHistoricalStreaks(h);

        // calculate missed metrics 
        h.statistics.strength.tasks_missed = h.tasks.filter((t) => {
            return t.status == 'MISSED';
        }).length
    }

    getHistoricalStreaks(h) {
        let strength = h.statistics.strength;
        strength.streaks = [];

        h.tasks.forEach((t) => {
            let historicalTime = t.date;
            // calculate the streaks for historical reference times, can be more efficient by only calculating historical data for times in the future of the triggering change, instead of recalculating all historical values for every change.

            let streakData = this.getHistoricalStreak(h, historicalTime);
            strength.streaks.push(streakData);
        })
        // console.log('streaks', strength.streaks);
        strength.streak = _.last(strength.streaks);
    }

    getHistoricalStreak(h, refTime) {
        let longest = 0;
        let current = 0;

        h.tasks.filter((t) => (moment(t.date).isSameOrBefore(moment(refTime))))
            // reduce the longest streak up to the provided time
            .forEach((t) => {
                current = t.status == "COMPLETE" ? current += 1 : 0;
                if (current > longest) longest = current;
            });

        return { current, longest }
    }

    updatePoints(h) {
        h.statistics.points.point_total = h.statistics.completion.tasks_completed * h.statistics.points.points_per_task;
    }

    getDurationMinutes(h) {
        let tm = h.statistics.completion.tasks_completed * ((h.duration_hours * 60) + h.duration_minutes) / 60;
        return tm;
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

