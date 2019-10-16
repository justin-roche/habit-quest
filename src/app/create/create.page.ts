import { Component, OnInit } from '@angular/core';
import { PurposePage } from '../purpose/purpose.page';
import { ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Scheduler } from 'rxjs';
import { options } from './form-options';
import { HabitsService } from '../services/habits.service';
// import moment = require('moment');
import { SchedulePage } from '../schedule/schedule.page';
import { DaySchedulePage } from '../day-schedule/day-schedule.page';

import * as moment from 'moment';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
// import { WheelSelector } from '@ionic-native/wheel-selector/ngx';

@Component({
    selector: 'app-create',
    templateUrl: './create.page.html',
    styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

    private hours = Array.apply(0, Array(24)).map(function(_, i) { return i - 1; });
    private minutes = Array.apply(0, Array(60)).map(function(_, i) { return i - 1; });

    private formOptions = options;
    private calendar = {
        currentDate: new Date,
    }
    private form: FormGroup;
    private customAlertOptions: any = {
        header: '',
        subHeader: 'Select your toppings',
        message: '$1.00 per topping',
        translucent: true
    };
    private pickerOptions = null;

    customActionSheetOptions: any = {
        header: 'Colors',
        subHeader: 'Select your favorite color'
    };
    constructor(

        public modalController: ModalController,
        private nc: NavController,
        private fb: FormBuilder,
        private hs: HabitsService
    ) { }

    ngAfterViewInit() {
    }

    ngOnInit() {
        this.pickerOptions =
            {
                buttons: [{
                    text: 'Save',
                    handler: this.onDurationPicked.bind(this)
                },
                {
                    text: 'Cancel',
                    handler: () => {
                        return false;
                    }
                }]
            }
        console.log('options', this.pickerOptions);


        this.form = this.fb.group({
            description: ['test', Validators.required],
            name: ['test', Validators.required],

            frequency_units: ['week'],
            frequency_quantity: [1, Validators.required],
            frequency_times: [[]],
            frequency_days: [[null]],

            end_units: ['day'],
            end_quantity: [90],
            end_date: [null],

            start_type: ['today'],
            start_date: [null],


            duration_hours: [1],
            duration_hours_text: ['01'],
            duration_minutes: [0],
            duration_minutes_text: ['00'],

            difficulty: [1],
            abstinence: [false],
            group: ['health'],
            priority: [1],
        })
        this.addFormListeners();

    }

    private addFormListeners() {

        this.form.controls['end_units'].valueChanges.subscribe((f) => {
            debugger;
            if (this.form.controls['end_units'].value == 'date') {
                this.presentScheduleModal("end_date");
            }
        })

        this.form.controls['start_type'].valueChanges.subscribe((f) => {
            if (this.form.controls['start_type'].value == 'date') {
                this.presentScheduleModal()
            }

        })
    }

    private trySave() {
        let habit = this.form.value
        console.log('habit', habit);
        this.hs.addHabit(habit)
        this.nc.navigateBack('')
    }

    private async presentPurposeModal() {
        const modal = await this.modalController.create({
            component: PurposePage,
            componentProps: { showBackdrop: true }
        });
        return await modal.present();
    }


    private async presentDayScheduleModal(formControl = 'frequency_times') {
        let p =
        {
            showBackdrop: true,
            events: this.form.controls[formControl].value,
            title: this.form.controls.name.value,
            duration: this.form.controls.duration_minutes.value + (60 * this.form.controls.duration_hours.value),
        }
        console.log('props', p);

        const modal = await this.modalController.create({
            component: DaySchedulePage,
            componentProps: p
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        this.form.controls[formControl].setValue(data)
        console.log('return', data, this.form.value);
    }

    private async presentScheduleModal(formControl = 'start_date') {
        const modal = await this.modalController.create({
            component: SchedulePage,
            componentProps: { showBackdrop: true }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        this.form.controls[formControl].setValue(data)
        console.log('return', data, this.form.value);
    }

    formatDate(d) {
        return moment(d).format('dddd MMMM Do');
    }

    onDurationPicked(d) {


        this.form.controls.duration_minutes.setValue(d.minute.value);
        this.form.controls.duration_hours.setValue(d.hour.value);
        this.form.controls.duration_hours_text.setValue(d.hour.text);
        this.form.controls.duration_minutes_text.setValue(d.minute.text);
        // debugger;
        console.log('picked duration', this.form.value);
    }

    getDurationDisplay() {
        return this.form.controls.duration_hours_text.value + ":" +
            this.form.controls.duration_minutes_text.value

    }

    showScheduling() {
        return true;
        // return this.form.controls.name.valid && this.form.controls.description.valid;
    }
    showCategories() {
        return true;
        // return this.form.controls.name.valid && this.form.controls.description.valid;
    }

    toggleWeekday(d) {
        let cv = this.form.controls.frequency_days.value;
        if (cv.indexOf(d.value) != -1) {
            cv = cv.filter((v) => {
                return v != d.value;
            })
        } else {
            if (d.value == null) {
                cv = [];
            } else {
                cv = cv.filter((v) => {
                    return v != null;
                })
            }
            cv.push(d.value);
        }
        this.form.controls.frequency_days.setValue(cv);
    }

    _weekdayColor(d) {
        return this.form.controls.frequency_days.value.indexOf(d.value) != -1 ? "dark" : "light";
    }


}
