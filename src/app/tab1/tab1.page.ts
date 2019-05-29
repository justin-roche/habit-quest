import { Component } from '@angular/core';
import { HabitsService } from '../services/habits.service';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    private habits = [];
    private toast;

    constructor(private hs: HabitsService, private toastController: ToastController) {
        this.hs.habits.asObservable().subscribe((d) => {
            this.habits = d;

            this.habits = this.habits.filter((h) => {
                return h.scheduled_tasks.length > 0;
            })
            if (this.habits.length == 0) {
                this.presentToast();
            }
            console.log('habits received', this.habits);
        })
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        this.toast.dismiss()
    }
    ionViewWillLeave() {
        this.toast.dismiss()
    }

    ionViewWillEnter() {
        // this.hs.loadHabits()
    }

    completeTask(h) {
        this.hs.completeTask(h)
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


}
