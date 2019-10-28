import { Component } from '@angular/core';
import { PurposePage } from '../purpose/purpose.page';
import { ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HabitsService } from '../services/habits.service';
// import moment = require('moment');

import { SettingsService } from '../services/settings.service';
import { CypressAdapterService } from '../services/cypress-adapter.service';
import * as moment from 'moment';

import { options } from './form-options';

@Component({
    selector: 'app-create',
    templateUrl: './create.page.html',
    styleUrls: ['./create.page.scss'],
})
export class CreatePage {

    private settings;
    private mode = 'loading';
    private form: FormGroup;
    private formOptions = options;

    constructor(
        public mc: ModalController,
        private nc: NavController,
        private ss: SettingsService,
        private fb: FormBuilder,
        private hs: HabitsService,
        private ca: CypressAdapterService
    ) {
        this.ss.getSettings().subscribe((val) => {
            this.settings = val;
        });
    }

    ionViewDidEnter() {
        this.ca.register('create', this);
        this.createForm();
        this.hs.habits.asObservable().subscribe((_) => {
            this.mode = 'ready';
        });

    }

    createForm() {
        this.form = this.fb.group({
            name: ['test', Validators.required],
            type: ['habit', Validators.required],
            description: ['test', Validators.required],

            frequency_units: ['day'],
            frequency_quantity: [1, Validators.required],
            frequency_hours: [[]],
            frequency_days: [[null]],

            end_units: ['week'],
            end_quantity: [2],
            end_date: [null],

            start_type: ['auto'],
            start_date: [null],

            duration_hours: [1],
            duration_hours_text: ['01'],
            duration_minutes: [0],
            duration_minutes_text: ['00'],

            difficulty: [1],
            abstinence: [false],
            group: ['health'],
            priority: [1],
        });
    }

    preValidateFormOptions() {
        if (this.settings.conserveWillpower) {
            // disable today from options if any in the past range are true
            // if (this.hs.isBlockedDay(moment().startOf('day'))) {
            // this.formOptions.start_types.forEach((t) => {
            // if (t.value == 'today') (<any>t).disabled = true;
            // })
            // }
        }
    }

    private trySave() {
        const habit = this.form.value;
        this.hs.addHabit(habit);
        this.nc.navigateBack('');
    }

    private async presentPurposeModal() {
        const modal = await this.mc.create({
            component: PurposePage,
            componentProps: { showBackdrop: true }
        });
        return await modal.present();
    }
}
