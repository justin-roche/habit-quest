import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import * as moment from 'moment';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.page.html',
    styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
    private calendar = {
        currentDate: new Date,
    }
    private selectedDate;

    constructor(private mc: ModalController) { }

    ngOnInit() {
    }

    dismiss() {
        this.mc.dismiss(this.selectedDate)
    }

    onTimeSelected = (ev: { selectedTime: Date, events: any[] }) => {
        let d = moment(ev.selectedTime).format()
        console.log('selected', d);
        this.selectedDate = d;
    };
}
