import { Component, OnInit } from '@angular/core';
import { PurposePage } from '../purpose/purpose.page';
import { SchedulePage } from '../schedule/schedule.page';
import { ModalController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Scheduler } from 'rxjs';
import { options } from './form-options';
import { HabitsService } from '../services/habits.service';

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

        // this.presentScheduleModal()
    }
    private onInit() {
        // console.log('calling');
        this.presentPurposeModal()
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


    private async presentScheduleModal(formControl = 'start_date') {
        // const modal = await modalController.create({...}); const { data } = await modal.onDidDismiss(); console.log(data);

        const modal = await this.modalController.create({
            component: SchedulePage,
            componentProps: { showBackdrop: true }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        this.form.controls[formControl].setValue(data)
        console.log('return', data, this.form.value);


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
            start_date: [null],

            duration: [''],
            clock_time: [''],
            difficulty: [1],
            abstinence: [false],
            group: ['health'],
            priority: [1],
        })

        this.form.statusChanges.subscribe((f) => {
        })
        this.form.controls['start_type'].valueChanges.subscribe((f) => {
            console.log('control changed right , fail', f);

            if (this.form.controls['start_type'].value == 'date') {
                this.presentScheduleModal()
            }
        })


    }
}
