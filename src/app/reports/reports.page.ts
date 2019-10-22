// import { Component, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HabitsService } from '../services/habits.service';
// import { CalendarComponent } from 'ionic2-calendar';
import * as moment from 'moment';
import { Chart } from 'chart.js';

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
    private selectedHabit = null;
    private habitNames = [];
    private source = [];
    private mode = 'single';

    private calendar = {
        currentDate: new Date,
    }
    private toast;
    // private selectedDate;
    // private barChart: Chart;

    constructor(private change: ChangeDetectorRef, private toastController: ToastController, private hs: HabitsService) {

    }

    ngOnInit() {
        this.hs.habits.asObservable().subscribe((habits) => {
            if (habits) this.handleHabits(habits)
        })
    }

    handleHabits(hs) {
        // set up habit selection dropdown
        if (hs.length == 0) {
            this.presentToast();
        } else {
            this.habits = hs
            this.habitNames = hs.map((h) => h.name);
            this.selectHabit(this.habits[0])
        }
    }

    selectHabit(h) {
        // console.log('eq?', h === this.selectedHabit);
        this.selectedHabit = h;
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
}

