import { Component } from '@angular/core';
import { HabitsService } from '../services/habits.service';
import { ToastController } from '@ionic/angular';

import * as moment from 'moment';
@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    private habits = [];
    private allHabits = [];
    private selectedHabits = [];
    private currentDate = moment();
    private mode = 'normal';
    private toast;

    constructor(private hs: HabitsService, private toastController: ToastController) {
        this.hs.habits.asObservable().subscribe((d) => {
            if (d.length == 0) {
                this.presentToast();
            }
            this.allHabits = d;
            this.handleData()
        })
    }

    handleData() {
        this.habits = this.allHabits.filter((h) => {
            return h.scheduled_tasks.length > 0;
        }).filter((h) => {
            let x = this.currentDate.isSame(h.currently_scheduled_task, 'd') || h.scheduled_tasks.some((t) => {
                return this.currentDate.isSame(t, 'd')
            })
            return x
        })

        console.log('habits received', this.habits);
    }

    removeSelectedHabits() {
        this.hs.removeSelectedHabits(this.selectedHabits);
        this.mode = 'normal'
    }




    ngAfterViewInit() {
    }

    ionViewWillLeave() {

        if (this.toast) {
            this.toast.dismiss()
            this.toast = null
        }
    }

    ionViewWillEnter() {
        // this.hs.loadHabits()
    }

    completeTask(h) {
        console.log('completing');

        this.hs.completeTask(h)
    }

    selectHabit(e, h) {
        console.log(e);
        if (!e.target.checked) {
            this.selectedHabits.push(h)

        } else {
            this.selectedHabits = this.selectedHabits.filter((_h) => {
                return _h != h;
            })
        }
        console.log(this.selectedHabits);

    }




    // async presentToast() {
    //     const toast = await this.toastController.create({
    //         message: 'You have no incomplete habits. Create one by clicking the plus icon at the top right',
    //         duration: 2000
    //     });
    //     toast.present();
    // }

    async presentToast() {
        this.toast = await this.toastController.create({
            // header: '',
            message: 'You have no incomplete habits. Create one by clicking the plus icon at the top right',
            position: 'middle',
            buttons: [
                // {
                //     side: 'start',
                //     icon: 'star',
                //     text: 'Favorite',
                //     handler: () => {
                //         console.log('Favorite clicked');
                //     }
                // }, {
                //     text: 'Done',
                //     role: 'cancel',
                //     handler: () => {
                //         console.log('Cancel clicked');
                //     }
                // }
            ]
        });
        this.toast.present();
    }

    private toggleDeleteMode() {
        if (this.mode == 'normal') {
            this.mode = 'delete';
        } else {
            this.mode = 'normal';
        }
    }

    private decrementDate() {
        this.currentDate = this.currentDate.subtract(1, 'day');
        this.handleData()
    }
    private incrementDate() {
        this.currentDate = this.currentDate.add(1, 'day');
        this.handleData()
    }
}
