import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

// let mockData = [{ "description": "a", "name": "b", "frequency_quantity": 1, "frequency_units": "daily", "abstinence": false, "end_quantity": 90, "end_units": "day", "start_type": "today", "time": "", "difficulty": 1, "group": "health", "priority": 1 }]
const mockData =
    [{ description: 'a', name: 'b', frequency_quantity: 1, frequency_units: 'day', abstinence: false, end_quantity: 3, end_units: 'day', start_type: 'today', time: '', difficulty: 1, group: 'health', priority: 1 }];

@Injectable({
    providedIn: 'root'
})
export class HabitsService {

    private h = [];
    public habits: BehaviorSubject<String>;

    constructor(private s: Storage) {
        s.set('habits', []);
        this.habits = new BehaviorSubject([]);
        // this.addHabit(mockData[0]);
    }

    private assignDates(h) {
        const start = moment().startOf('day');
        let next = start.clone().add(1, h.frequency_units);
        h.created_on = start.format();

        h.scheduled_tasks = [];
        h.completed_tasks = [];
        const x = start.clone().add(1, h.frequency_units);
        console.log('x', x);
        const end = start.add(h.end_quantity, h.end_units);
        while (next <= end) {
            h.scheduled_tasks.push(next);
            next = next.clone().add(1, h.frequency_units);
        }
        h.current_scheduled_task = h.scheduled_tasks[0];

    }

    private assignStatistics(h) {
        h.statistics = {
            total_scheduled_tasks: h.scheduled_tasks.length,
            completed_percentage: 0,
            longest_streak: 0,
            points: 0,
            finished_runs: [],
        };
    }

    private updateStatistics(h) {
        h.statistics.completed_percentage = Math.floor((h.completed_tasks.length / h.statistics.total_scheduled_tasks) * 100);

    }

    public loadHabits() {
        this.s.get('habits').then((val) => {
            this.h = val;
            this.habits.next(this.h);
        });
    }

    public completeTask(h) {
        const completed_time = moment();
        h.completed_tasks.push(completed_time);

        if (h.scheduled_tasks.length == 0) {
            h.finished_runs.push(h.completed_tasks);
        } else {
            h.scheduled_tasks = h.scheduled_tasks.slice(1);
            h.current_scheduled_task = h.scheduled_tasks[0];

        }
        this.updateStatistics(h);
        console.log('removed', h);

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
