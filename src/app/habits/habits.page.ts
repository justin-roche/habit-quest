import { Component } from '@angular/core';
import { HabitsService } from '../services/habits.service';
import { ToastController } from '@ionic/angular';

import * as moment from 'moment';
@Component({
    selector: 'app-habits',
    templateUrl: 'habits.page.html',
    styleUrls: ['habits.page.scss']
})
export class HabitsPage {
    private habits = [];

    private incompleteTasks = [];
    private completeTasks = [];
    private missedTasks = [];
    private allHabits = [];
    private selectedHabits = [];
    private currentDate = moment();
    private mode = 'list';
    private toast;

    constructor(private hs: HabitsService, private toastController: ToastController) {
    }

    ngOnInit() {
        this.hs.habits.asObservable().subscribe((habits) => {
            if (habits) {
                // if just deleted last habit, set to list view
                if (habits.length == 0) this.mode = 'list';
                this.allHabits = habits;
                console.log('got new habs', this.allHabits);

                this.createTasks()
            }
            // if (!habits) this.presentToast();
        })
    }

    createTasks() {
        this.incompleteTasks = [];
        this.completeTasks = [];
        this.missedTasks = [];
        this.allHabits.forEach((h) => {
            // filter all habits for tasks occuring on visible date, set incompleteTasks to applicable tasks
            let tasks = h.tasks.filter((t) => {
                return this.currentDate.isSame(t.date, 'd')
            }).map((t) => {
                return {
                    task: t,
                    habit: h,
                    status: t.status,
                    // the following are used for sorts and time display
                    // hour: moment(t.date).hour(),
                    _hour: moment(t.date).format('hh:mm')
                }
            })

            let completed = tasks.filter((t) => t.status == "COMPLETE")
            let awaiting = tasks.filter((t) => t.status == "AWAITING")
            let missed = tasks.filter((t) => t.status == "MISSED")

            this.incompleteTasks = this.incompleteTasks.concat(awaiting);
            this.missedTasks = this.missedTasks.concat(missed);
            this.completeTasks = this.completeTasks.concat(completed);
        });

        // display and sort complete tasks by completed time
        this.completeTasks = this.completeTasks.map((t) => {
            console.log('ct', t);
            t._hour = t.task.completed_time;
            return t;
        }).sort((a, b) => {
            return a._hour - b._hour;
        })

        this.incompleteTasks = this.incompleteTasks.sort((a, b) => {
            return a.hour - b.hour;
        })

        console.log('filtered incompleteTasks', this.incompleteTasks);
    }

    private decrementDate() {
        this.currentDate = this.currentDate.subtract(1, 'day');
        this.createTasks()
    }
    private incrementDate() {
        this.currentDate = this.currentDate.add(1, 'day');
        this.createTasks()
    }

    toggleTaskStatus(t) {
        // determine the time to associated with completion, for present-day tasks the time is the time it is marked. For tasks that are retroactively marked, prompt...
        let markedTime = t.task.date;
        if (moment().isSame(t.task.date, 'd')) {
            markedTime = moment().format('hh:mm');
            console.log('mt', markedTime);

        }

        let newStatus = null;
        if (t.status == 'COMPLETE') {
            if (moment().isAfter(t.task.date, 'd')) {
                newStatus = 'MISSED';
            } else {
                newStatus = 'AWAITING';
            }
        } else {
            newStatus = 'COMPLETE';
        }
        // debugger;
        this.hs.setTaskStatus(t.habit.id, t.task.id, markedTime, newStatus);
    }

    private toggleDeleteMode() {
        if (this.mode == 'list') {
            this.mode = 'delete'
        } else {
            this.mode = 'list';
        }
    }

    setMode(m) {
        console.log('mode', m);
        this.mode = m;
    }

    selectHabit(e, h) {
        if (!e.target.checked) {
            this.selectedHabits.push(h)

        } else {
            this.selectedHabits = this.selectedHabits.filter((_h) => {
                return _h != h;
            })
        }
    }

    deleteTask(t) {
        this.hs.deleteHabit(t.habit.id);
        // this.mode = 'list'
    }

    async presentToast() {
        this.toast = await this.toastController.create({
            message: 'You have no incomplete habits. Create one by clicking the plus icon at the top right',
            position: 'middle',
            buttons: [
            ]
        });
        this.toast.present();
    }

    ionViewWillLeave() {
        if (this.toast) {
            this.toast.dismiss()
            this.toast = null
        }
    }

}
