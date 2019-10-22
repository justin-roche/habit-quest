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

    private incomplete_tasks = [];
    private complete_tasks = [];
    private missed_tasks = [];
    private allHabits = [];
    private selectedHabits = [];
    private currentDate = moment();
    private mode = 'list';
    private toast;

    constructor(private hs: HabitsService, private toastController: ToastController) {
    }

    ngOnInit() {
        this.hs.habits.asObservable().subscribe((d) => {
            if (d) {
                if (d.length == 0) {
                    this.presentToast();
                    this.mode = 'empty';
                } else {
                    this.mode = 'list';
                }
                this.allHabits = d;
                this.createTasks()
            }
        })
    }

    createTasks() {
        this.incomplete_tasks = [];
        this.complete_tasks = [];
        this.missed_tasks = [];
        this.allHabits.forEach((h) => {
            // filter all habits for tasks occuring on visible date, set incomplete_tasks to applicable tasks
            let tasks = h.tasks.filter((t) => {
                return this.currentDate.isSame(t.date, 'd')
            }).map((t) => {
                return {
                    task: t,
                    habit: h,
                    status: t.status,
                    // the following are used for sorts and time display
                    hour: moment(t.date).hour(),
                    _hour: moment(t.date).format('hh:mm')
                }
            })
            // debugger;
            let completed = tasks.filter((t) => {
                return t.status == "COMPLETE";
            })
            let awaiting = tasks.filter((t) => {
                return t.status == "AWAITING";
            })
            let missed = tasks.filter((t) => {
                return t.status == "MISSED";
            })
            this.incomplete_tasks = this.incomplete_tasks.concat(awaiting);
            this.missed_tasks = this.missed_tasks.concat(missed);
            this.complete_tasks = this.complete_tasks.concat(completed);
        });

        this.complete_tasks = this.complete_tasks.sort((a, b) => {
            return a.hour - b.hour;
        })

        this.incomplete_tasks = this.incomplete_tasks.sort((a, b) => {
            return a.hour - b.hour;
        })

        console.log('filtered incomplete_tasks', this.incomplete_tasks);
    }

    private decrementDate() {
        this.currentDate = this.currentDate.subtract(1, 'day');
        this.createTasks()
    }
    private incrementDate() {
        this.currentDate = this.currentDate.add(1, 'day');
        this.createTasks()
    }

    completeTask(i) {
        this.hs.setTaskStatus(i.habit.id, i.task.id, this.currentDate, 'COMPLETE');
    }

    private toggleDeleteMode() {
        if (this.mode == 'list') {
            this.mode = 'delete'
        } else {
            this.mode = 'list';
        }
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

    removeSelectedHabits() {
        this.hs.removeSelectedHabits(this.selectedHabits);
        this.mode = 'list'
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
