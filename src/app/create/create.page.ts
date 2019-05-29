import { Component, OnInit } from '@angular/core';
import { PurposePage } from '../purpose/purpose.page';
import { SchedulePage } from '../schedule/schedule.page';
import { ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Scheduler } from 'rxjs';
import { HabitsService } from '../services/habits.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.page.html',
    styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

    private calendar = {
        currentDate: new Date,
    }
    private formOptions = {
        start_types: [
            { display: 'today', value: 'today' },
            { display: 'first available', value: 'first' },
            { display: 'set date', value: 'date' },
        ],
        frequency_units: [
            { display: 'daily', value: 'day' },
            { display: 'weekly', value: 'week' },
            { display: 'monthly', value: 'month' },
        ],
        groups: [
            { display: 'health', value: 'health' },
            { display: 'work', value: 'work' },
            { display: 'social', value: 'social' },
            { display: 'other', value: 'other' },
        ],
        difficulties: [
            { display: '1', value: 1 },
            { display: '2', value: 2 },
            { display: '3', value: 3 },
        ],
        priorities: [
            { display: '1', value: 1 },
            { display: '2', value: 2 },
            { display: '3', value: 3 },
        ],
        end_units: [
            { display: 'days', value: 'day' },
            { display: 'weeks', value: 'week' },
            { display: 'months', value: 'month' },
            { display: 'times', value: 'times' },
            { display: 'set date', value: 'date' },
        ],
    }
    private form: FormGroup;
    customAlertOptions: any = {
        header: 'Pizza Toppings',
        subHeader: 'Select your toppings',
        message: '$1.00 per topping',
        translucent: true
    };

    customPopoverOptions: any = {
        // header: 'Hair Color',
        // subHeader: 'Select your hair color',
        // message: 'Only select your dominant hair color'
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
        // this.presentPurposeModal()
        console.log('calling');
    }
    private onInit() {
        console.log('calling');
        // this.presentPurposeModal()
    }
    private trySave() {
        let habit = this.form.value
        console.log('habit', habit);
        this.hs.addHabit(habit)
        this.nc.navigateBack('')
        // this.presentPurposeModal()
    }

    private async presentPurposeModal() {
        // const modal = await modalController.create({...}); const { data } = await modal.onDidDismiss(); console.log(data);

        const modal = await this.modalController.create({
            component: PurposePage,
            componentProps: { showBackdrop: true }
        });
        return await modal.present();
    }


    private async presentScheduleModal() {
        // const modal = await modalController.create({...}); const { data } = await modal.onDidDismiss(); console.log(data);

        const modal = await this.modalController.create({
            component: SchedulePage,
            componentProps: { showBackdrop: true }
        });
        return await modal.present();
    }

    ngOnInit() {
        this.form = this.fb.group({
            description: [null, Validators.required],
            name: [null, Validators.required],
            frequency_quantity: [1, Validators.required],
            frequency_units: ['day'],
            end_quantity: [90],
            end_units: ['day'],
            start_type: ['today'],
            duration: [''],
            clock_time: [''],
            difficulty: [1],
            abstinence: [false],
            group: ['health'],
            priority: [1],
        })
        this.form.statusChanges.subscribe((f) => {
            console.log(f);
            console.log(this.form.invalid);
            console.log(this.form.controls);
            if (this.form.controls['start_type'].value == 'date') {
                this.presentScheduleModal()
            }

        })

    }
}
