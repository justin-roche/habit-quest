declare var require: any;
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'underscore';
require('later/later.js');

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {

    constructor() { }

    getStatisticsTemplate() {
        return {
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
                // tasks_remaining: h.tasks.length,
                // hours_remaining: h.tasks.length,
                // hours_used: h.tasks.length,
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
                total_point_value: 0,
                points_per_task: 0,
            }
        }
    }

    createStatisticsForHabit(h) {
        let points = this.createPointValue(h);
        let statistics = this.getStatisticsTemplate();
        statistics.points.total_point_value = points = h.tasks.length;
        statistics.points.points_per_task = points;
        h.statistics = statistics
        console.log('stats', h.statistics);
    }

    createPointValue(h) {
        // adjust points according to selected profile here (in relation to schedule)
        return h.difficulty + h.priority + (h.abstinence ? 0 : 1);
    }

    // UPDATE STATISTICS
    updateAllStatistics(habits) {
        habits.forEach((h) => {
            this.updateStatistics(h);
        });
        this.updateAggregateStatistics(habits);
    }

    updateStatistics(h) {
        // derive completed percentage from number of tasks that have been completed, non emitting
        this.updateCompletion(h);
        this.updateStrength(h);
        this.updatePoints(h);
        // console.log('updated stats', h.statistics);
    }

    updateAggregateStatistics(habits) {
        let as = {
            completion: {
                totals: null,
                total: null,
                weeks: null,
                week: null,
                months: null,
                month: null
            }

        };
        as = this.getStatisticsTemplate();

        // reduce h.statistics.completion.totals by date to aggregate

        as.completion.totals = this.getAggregateSuccessRatesByPeriod(habits, 'totals');
        as.completion.total = _.last(as.completion.totals);
        // the last item of a historical series is the current value

        as.completion.months = this.getAggregateSuccessRatesByPeriod(habits, 'months');
        as.completion.month = _.last(as.completion.months);

        as.completion.weeks = this.getAggregateSuccessRatesByPeriod(habits, 'weeks');
        as.completion.week = _.last(as.completion.weeks);

        console.log('aggregate stats', as);
        return as;
    }

    getAggregateSuccessRatesByPeriod(habits, period) {

        let aggregateSeries = [];
        // the aggregateSeries for the period contains the results for all habits, eg. totals, months, weeks
        habits.forEach((h) => {
            // iterate all habits
            h.statistics.completion[period].forEach((taskStat) => {
                // iterate the period value series for a single habit, test to see if an aggregate for this date exists
                let aggregate = _.find(aggregateSeries, (testAggregate) => {
                    return moment(testAggregate.time).isSame(taskStat.time);
                });
                if (!aggregate) {
                    // if no aggregate for the date, create one
                    // set the time for the aggregate to the first located task on that day
                    aggregateSeries.push({
                        values: [taskStat],
                        time: taskStat.time
                    });
                } else {
                    aggregate.values.push(taskStat);
                }
            });
        });

        aggregateSeries.forEach((dayAggregate) => {
            // for each day in the aggregate series, derive an average rate for all active habits
            dayAggregate.averageRate = dayAggregate.values.reduce((acc, v) => {
                return Number(v.rate) + acc;
            }, 0) / dayAggregate.values.length;
        })

        aggregateSeries = aggregateSeries.sort((dt1, dt2) => {
            return moment(dt1.time).isBefore(dt2.time) ? -1 : 1;
        })

        return aggregateSeries;
    }

    getSuccessRatesByPeriod(h, period, referenceTime) {
        // given a reference time, calculate the success rates for a period preceeding it
        let n;
        if (referenceTime) {
            n = moment(referenceTime)
        } else {
            n = moment()
        }

        let range = h.tasks.filter((t) => {
            // if period provided, calculate on all tasks in same period and prior
            if (period) {
                return n.isSame(t.date, period) && n.isSameOrAfter(t.date);
            }
            // if no period (all prior) test if task is not in the future 
            return n.isSameOrAfter(t.date)

        });
        // console.log('range', range.length, range);

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

        comp.total = this.getSuccessRatesByPeriod(h, null, null);
        // debugger;
        comp.month = this.getSuccessRatesByPeriod(h, 'month', null);
        comp.week = this.getSuccessRatesByPeriod(h, 'week', null);

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

        h.tasks.filter((t) => {
            // only use data from past tasks
            return moment().isSameOrAfter(t.date);
        }).forEach((t) => {
            let historicalTime = t.date;
            // calculate the streaks for historical reference times, can be more efficient by only calculating historical data for times in the future of the triggering change, instead of recalculating all historical values for every change.

            let streakData = this.getHistoricalStreak(h, historicalTime);
            strength.streaks.push(streakData);
        })
        // console.log('streaks', strength.streaks);
        strength.streak = _.last(strength.streaks);
    }

    getHistoricalStreak(h, time) {
        let longest = 0;
        let current = 0;

        h.tasks.filter((t) => (moment(t.date).isSameOrBefore(moment(time))))
            // reduce the longest streak up to the provided time
            .forEach((t) => {
                current = t.status == "COMPLETE" ? current += 1 : 0;
                if (current > longest) longest = current;
            });

        // time must be included to add labels in charts
        return { current, longest, time }
    }

    updatePoints(h) {
        h.statistics.points.point_total = h.statistics.completion.tasks_completed * h.statistics.points.points_per_task;
    }

    getDurationMinutes(h) {
        let tm = h.statistics.completion.tasks_completed * ((h.duration_hours * 60) + h.duration_minutes) / 60;
        return tm;
    }
}
