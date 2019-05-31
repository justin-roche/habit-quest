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
        this.createTasks(h);
        this.createStatistics(h);
        console.log(JSON.stringify(h))
        this.h.push(h);
        this.habits.next(this.h);
    }

    createTasks(h) {
        h.created_on = moment().format();
        h.tasks = [];
        h.status = 'AWAITING';

        let next = this.getStartDate(h);
        // let next = start.clone()
        const end = next.clone().add(h.end_quantity, h.end_units);

        while (next <= end) {
            let task = {
                date: next.format(),
                status: 'AWAITING'
            }
            h.tasks.push(task);
            next = next.clone().add(1, h.frequency_units);
        }

    }

    getStartDate(h) {
        if (h.start_date) {
            return moment(h.start_date).startOf('day');
        }
        return moment().startOf('day');
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

