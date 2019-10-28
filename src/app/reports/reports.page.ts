import { ToastController } from '@ionic/angular';
import { HabitsService } from '../services/habits.service';
import * as moment from 'moment';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { Chart } from "chart.js";

@Component({
    selector: 'app-reports',
    templateUrl: 'reports.page.html',
    styleUrls: ['reports.page.scss']
})

export class ReportsPage {

    private currentDate = new Date
    private habits = [];

    // the selected habit, primary variable
    private h = null;

    private habitNames = [];
    private mode = 'single';

    private toast;

    constructor(private change: ChangeDetectorRef, private toastController: ToastController, private hs: HabitsService) {

    }

    ngOnInit() {
        this.hs.habits.asObservable().subscribe((habits) => {
            if (habits) this.handleHabits(habits);
            // the first subscription result is null
            // if (!habits) this.presentToast();
        });
    }

    handleHabits(hs) {
        // set up habit selection dropdown
        if (this.toast) this.toast.dismiss();
        if (hs.length == 0) {
            // this.presentToast();
        } else {
            // get all habits and names
            this.habits = hs
            this.habitNames = hs.map((h) => h.name);

            // set initial value for selected habit
            if (!this.h) {
                this.selectHabit(this.habits[0].name)
            } else {
                // calendar is outside angular binding context, must triggere reference equality change for input listener to update
                this.selectHabit(this.h.name)
            }
        }
    }

    selectHabit(name) {
        this.h = this.habits.filter((h) => h.name == name)[0];
    }

    async presentToast() {
        // present message when no tasks exist
        this.toast = await this.toastController.create({
            message: 'You have no habits to review.',
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

