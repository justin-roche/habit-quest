import { Component, OnInit } from '@angular/core';
import { PurposePage } from '../purpose/purpose.page';
import { SchedulePage } from '../schedule/schedule.page';
import { ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Scheduler } from 'rxjs';
import { options } from './form-options';
import { HabitsService } from '../services/habits.service';
import { WeekSchedulePage } from '../week-schedule/week-schedule.page';
import { DaySchedulePage } from '../day-schedule/day-schedule.page';

@Component({
    selector: 'app-create',
    templateUrl: './create.page.html',
    styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

    private formOptions = options;
    private calendar = {
        currentDate: new Date,
    }
    private form: FormGroup;

    constructor(

        public modalController: ModalController,
        private nc: NavController,
        private fb: FormBuilder,
        private hs: HabitsService
    ) {
    }

    private trySave() {
        let habit = this.form.value
        // console.log('habit', habit);
        this.hs.addHabit(habit)
        this.nc.navigateBack('')
        // this.presentPurposeModal()

    }

    private async presentPurposeModal() {
        const modal = await this.modalController.create({
            component: PurposePage,
            componentProps: { showBackdrop: true }
        });
        return await modal.present();
    }

    private async presentScheduleModal(formControl = 'start_date') {
        const modal = await this.modalController.create({
            component: SchedulePage,
            componentProps: { showBackdrop: true }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        this.form.controls[formControl].setValue(data)
        // console.log('return', data, this.form.value);
    }

    private async presentEndDateModal() {
        const modal = await this.modalController.create({
            component: SchedulePage,
            componentProps: { showBackdrop: true }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        this.form.controls['end_date'].setValue(data)
        // console.log('return', data, this.form.value);
    }

    private async presentWeekSchedule() {
        const modal = await this.modalController.create({
            component: WeekSchedulePage,
            componentProps: { showBackdrop: true, events: this.form.controls['weekly_schedule'].value }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        this.form.controls['weekly_schedule'].setValue(data)
        // console.log('return', data, this.form.value, JSON.stringify(data));
    }
    private async presentDaySchedule() {
        const modal = await this.modalController.create({
            component: DaySchedulePage,
            componentProps: {
                showBackdrop: true,
                title: this.form.controls['name'].value,
                events: this.form.controls['daily_schedule'].value
            }

        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        this.form.controls['daily_schedule'].setValue(data)
        // console.log('return', data, this.form.value, JSON.stringify(data));
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: [null, Validators.required],
            description: [null],

            duration_hours: [1],
            duration_minutes: [0],

            start_type: ['today'],
            start_date: [null],

            frequency_units: ['day'],
            frequency: [1],

            weekly_schedule: [[{ allWeek: true }]],
            daily_schedule: [[{ allDay: true }]],

            end_type: ['times'],
            end_quantity: [90],
            end_date: [null],

            difficulty: [1],
            abstinence: [false],
            group: ['health'],
            priority: [1],
        })

        this.form.controls['end_type'].valueChanges.subscribe((f) => {
            if (this.form.controls['end_type'].value == 'date') {
                this.presentEndDateModal()
            }
        })

        this.form.controls['start_type'].valueChanges.subscribe((f) => {
            if (this.form.controls['start_type'].value == 'date') {
                this.presentScheduleModal()
            }
        })

        this.presentDaySchedule()
        // this.presentWeekSchedule()

    }


    controlValue(name) {
        return this.form.controls[name].value;
    }
}
