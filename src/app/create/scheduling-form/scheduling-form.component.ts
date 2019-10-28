import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MonthSchedulePage } from 'src/app/month-schedule/month-schedule.page';
import { DaySchedulePage } from 'src/app/day-schedule/day-schedule.page';
import * as moment from 'moment';

@Component({
    selector: 'scheduling-form',
    templateUrl: './scheduling-form.component.html',
    styleUrls: ['./scheduling-form.component.scss'],
})
export class SchedulingFormComponent implements OnInit {
    @Input() form;
    @Input() formOptions;
    private hidden;

    constructor(private mc: ModalController) { }

    ngOnInit() {
        this.addFormListeners();
    }

    private addFormListeners() {
        this.form.controls.start_type.valueChanges.subscribe((f) => {
            if (this.form.controls.start_type.value == 'date') {
                this.presentMonthScheduleModal();
            }
        });
        this.form.controls.end_units.valueChanges.subscribe((f) => {
            if (this.form.controls.end_units.value == 'date') {
                this.presentMonthScheduleModal('end_date');
            }
        });
    }

    private async presentDayScheduleModal(formControl = 'frequency_hours') {
        const modal = await this.mc.create({
            component: DaySchedulePage,
            componentProps: {
                showBackdrop: true,
                events: this.form.controls[formControl].value,
                title: this.form.controls.name.value,
                duration: this.form.controls.duration_minutes.value + (60 * this.form.controls.duration_hours.value),
            }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        this.form.controls[formControl].setValue(data);
    }

    private async presentMonthScheduleModal(formControl = 'start_date') {
        const modal = await this.mc.create({
            component: MonthSchedulePage,
            componentProps: { showBackdrop: true, }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        this.form.controls[formControl].setValue(data);
        console.log('selected from modal', this.form.value);
    }

    onDurationPicked(d) {
        this.form.controls.duration_minutes.setValue(d.minute.value);
        this.form.controls.duration_hours.setValue(d.hour.value);
        this.form.controls.duration_hours_text.setValue(d.hour.text);
        this.form.controls.duration_minutes_text.setValue(d.minute.text);
    }

    getDurationDisplay() {
        return this.form.controls.duration_hours_text.value + ':' +
            this.form.controls.duration_minutes_text.value;
    }

    formatDate(d) {
        return moment(d).format('dddd MMMM Do');
    }

    _weekdayColor(d) {
        return this.form.controls.frequency_days.value.indexOf(d.value) != -1 ? 'dark' : 'light';
    }

    toggleWeekday(d) {
        let cv = this.form.controls.frequency_days.value;
        if (cv.indexOf(d.value) != -1) {
            cv = cv.filter((v) => v != d.value);
        } else {
            if (d.value == null) {
                cv = [];
            } else {
                cv = cv.filter((v) => v != null);
            }
            cv.push(d.value);
        }
        this.form.controls.frequency_days.setValue(cv);
    }
}
