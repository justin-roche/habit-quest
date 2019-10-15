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
    private items = [];
    private allHabits = [];
    private selectedHabits = [];
    private currentDate = moment();
    private mode = 'list';
    private toast;

    constructor(private hs: HabitsService, private toastController: ToastController) {
        this.hs.habits.asObservable().subscribe((d) => {
            if (d) {
                if (d.length == 0) {
                    this.presentToast();
                }
                this.allHabits = d;
                console.log('habits', d);
                this.createItems()
            }
        })
    }

    createItems() {
        this.items = this.allHabits.map((h) => {
            let dayTask = h.tasks.filter((t) => {
                return this.currentDate.isSame(t.date, 'd')
            })[0]
            if (dayTask) {
                return {
                    task: dayTask,
                    habit: h
                }
            }
            return null
        }).filter((h) => h != null);
        console.log('filtered items', this.items);
    }

    private decrementDate() {
        this.currentDate = this.currentDate.subtract(1, 'day');
        this.createItems()
    }
    private incrementDate() {
        this.currentDate = this.currentDate.add(1, 'day');
        this.createItems()
    }

    completeTask(i) {
        this.hs.completeTask(i.habit, this.currentDate)
    }

    private toggleDeleteMode() {
        if (this.mode == 'list') {
            this.mode = 'delete';
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
