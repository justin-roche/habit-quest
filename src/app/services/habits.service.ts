import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { StorageService } from './storage.service';

// let mockData = [{ "description": "a", "name": "b", "frequency_quantity": 1, "frequency_units": "daily", "abstinence": false, "end_quantity": 90, "end_units": "day", "start_type": "today", "time": "", "difficulty": 1, "group": "health", "priority": 1 }]

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

    private assignDates(h) {
        h.created_on = moment().format();
        let start = null;

        if (h.start_date) {
            start = moment(h.start_date).startOf('day');
        } else {
            start = moment().startOf('day');
            // console.log('st', start);

        }
        // .add(1, h.frequency_units);


        let tasks = {
            scheduled: [],
            completed: [],
            awaiting: [],
            missed: [],
        };

        let next = start.clone()
        const end = start.add(h.end_quantity, h.end_units);
        while (next <= end) {
            tasks.scheduled.push(next.format());
            next = next.clone().add(1, h.frequency_units);
        }
        h.current_scheduled_task = tasks.scheduled[0];
        tasks.awaiting = tasks.scheduled.slice() // 

        h.tasks = tasks;

    }

    private assignStatistics(h) {
        h.statistics = {
            // total_scheduled: h.scheduled.length,
            completed_percentage: 0,
            longest_streak: 0,
            points: 0,
            finished_runs: [],
        };
    }

    private updateStatistics(h) {
        h.statistics.completed_percentage = Math.floor((h.tasks.completed.length / h.tasks.scheduled.length) * 100);

    }

    public loadHabits() {
        // this.addHabit(mockData[0]);

        this.ss.load().subscribe((v) => {
            // console.log('loaded', v);
            this.h = v;
            this.updateLoadData();
            this.habits.next(this.h);
        })

    }

    updateLoadData() {
        this.h.forEach((h) => {
            // console.log('loaded data', JSON.parse(JSON.stringify(h)));

            h.tasks.awaiting = h.tasks.awaiting.map((t) => {
                let x = moment(t).isBefore(this.currentDate, 'day');
                // console.log('missed', x);

                if (x) {
                    h.tasks.missed.push(t)
                    return null;
                }
                return t
            }).filter(x => x != null)

        })

    }

    public removeSelectedHabits(hs) {
        this.h = this.h.filter((h) => {
            return this.h.every((_h) => {
                return _h.name != h.name;
            })
        })
        this.habits.next(this.h);
    }

    public completeTask(h, t: Moment) {
        const completed_time = moment(t).startOf('day').format();
        h.tasks.completed.push(completed_time);

        if (h.tasks.scheduled.length == 0) {
            h.finished_runs.push(h.tasks.completed);
        } else {
            h.tasks.awaiting = h.tasks.awaiting.filter((t) => {
                return t != completed_time;
            })
            h.tasks.missed = h.tasks.missed.filter((t) => {
                return t != completed_time;
            })

            // h.current_scheduled_task = h.tasks.scheduled[0];
        }
        this.updateStatistics(h);
        this.habits.next(this.h);
    }

    public addHabit(h) {
        this.assignDates(h);
        this.assignStatistics(h);
        this.h.push(h);
        this.habits.next(this.h);
        // this.s.set('habits', this.h)
    }




}
