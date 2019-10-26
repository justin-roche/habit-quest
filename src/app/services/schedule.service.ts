import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { HabitsService } from 'src/app/services/habits.service';
import { SettingsService } from './settings.service';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    private settings;
    private habits;

    constructor(private hs: HabitsService, private ss: SettingsService) {

        this.hs.habits.asObservable().subscribe((d) => {
            this.habits = d;
        })

        this.ss.getSettings().subscribe((val) => {
            this.settings = val;
        })

    }

    getMonthSchedule(n) {
        let range = this.collectDates(n);
        let schedule = this.getDayData(range);
        return schedule;
    }

    collectDates(n) {
        // if the first of current month is sunday, it is the beginnnig of display range, otherwise find previous sunday. Display adds 35 days to the first displayed date
        let d = moment().month(n).startOf('month');
        let last = d.day() != 0 ? d.subtract(d.day(), 'day') : d;
        let range = [];
        for (let i = 0; i < 42; i++) {
            range.push({ date: last });
            last = last.clone().add(1, 'day').startOf('day');
        }
        return range;
    }

    getDayData(days) {
        days = days.map((d) => {
            return {
                // required by calendar to act as source
                startTime: d.date.toDate(),
                endTime: d.date.add(1, 'hour').toDate(),
                title: d.date.format(),
                // related to task model
                date: d.date,
                tasks: [],
                allDay: false,
                hasTasks: false,
                future: moment().isAfter(d, 'd'),
                // blocking
                creatable: false,
                startInterval: false,
                blocked: false,
                today: moment().isSame(moment(d.date), 'd'),
                // related to ui
                selected: false,
                style: '',
                color: null,
            };
        });
        // console.log('days', days);

        this.habits.forEach((h) => {
            console.log('tasks', h.tasks);

            h.tasks.forEach((t) => {
                let lastStarted = null;
                days.forEach((d) => {
                    if (d.date.isSame(moment(h.start_date), 'd')) {
                        d.startTask = true;
                        lastStarted = d.date.format();
                    } else {
                        if (!d.lastStarted) {
                            d.lastStarted = lastStarted;
                        } else {
                            // determine whether the tasks existing last started property is newer than this habit
                            if (moment(lastStarted).isAfter(moment(d.lastStarted))) {
                                d.lastStarted = lastStarted.format();
                            }
                        }
                    }
                    if (d.date.isSame(moment(t.date), 'd')) {
                        // console.log('has tasks', d);

                        d.tasks.push(t);
                        d.hasTasks = true;

                    }

                })
            });
        });

        days = days.map((d) => {
            if (d.lastStarted) {
                let daysSinceLastStart = moment(d.date).diff(d.lastStarted, 'd');
                // console.log('dsl', daysSinceLastStart, d);

                if (daysSinceLastStart <= this.settings.autoScheduleInterval) {
                    d.startInterval = true;
                }
            }
            return d;
        })

        return days;
    }

    isBlockedDay(d) {
        // determine if date is within auto schedule block interval; checking if any prior day is a start date
        // d = d.clone();

        // return (this.h.some((h) => {
        // let startInterval = moment(h.start_date).isAfter(d.clone().subtract(this.settings.autoScheduleInterval, 'day'))
        // return startInterval && hasTask;
        // }));

    }
}
