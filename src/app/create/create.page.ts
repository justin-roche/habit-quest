import { Component, OnInit } from '@angular/core';
import { PurposePage } from '../purpose/purpose.page';
import { SchedulePage } from '../schedule/schedule.page';
import { ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Scheduler } from 'rxjs';
import { options } from './form-options';
import { HabitsService } from '../services/habits.service';
// import moment = require('moment');

import * as moment from 'moment';

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
    customAlertOptions: any = {
        header: '',
        subHeader: 'Select your toppings',
        message: '$1.00 per topping',
        translucent: true
    };

    customPopoverOptions: any = {
    };

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
    private onInit() {
        this.presentPurposeModal()
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

    ngOnInit() {
        this.form = this.fb.group({
            description: [null, Validators.required],
            name: [null, Validators.required],

            frequency_units: ['day'],
            frequency_quantity: [1, Validators.required],

            end_units: ['day'],
            end_quantity: [90],
            end_date: [null],

            start_type: ['today'],
            start_date: [null],

            duration: [''],
            clock_time: [''],
            difficulty: [1],
            abstinence: [false],
            group: ['health'],
            priority: [1],
        })


        this.form.controls['start_type'].valueChanges.subscribe((f) => {
            if (this.form.controls['start_type'].value == 'date') {
                this.presentScheduleModal()
            }
        })

        this.form.controls['end_units'].valueChanges.subscribe((f) => {

            if (this.form.controls['end_units'].value == 'date') {
                this.presentScheduleModal("end_date");
            }
        })


    }


}
