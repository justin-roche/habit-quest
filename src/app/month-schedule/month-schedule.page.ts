import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import * as moment from 'moment';

@Component({
    selector: 'app-month-schedule',
    templateUrl: './month-schedule.page.html',
    styleUrls: ['./month-schedule.page.scss'],
})
export class MonthSchedulePage implements OnInit {
    private calendar = {
        currentDate: new Date,
    }
    private selectedDate;

    private displayDate = moment();
    // source for calender
    private source;
    private mode = 'loading';

    constructor(private mc: ModalController) { }

    ngOnInit() {

        let defaultSource = {
            title: 'now',
            startTime: new Date(),
            endTime: new Date(moment().add(1, 'hour').format()),
            allDay: false,
            // the color used by calendar template, provides classes as referenced in global.scss
            color: 'current',
        }
        this.source = [defaultSource];
        this.mode = 'ready';
    }

    dismiss() {
        this.mc.dismiss(this.selectedDate)
    }

    onTimeSelected(ev: { selectedTime: Date, events: any[] }) {
        let d = moment(ev.selectedTime)
        // debugger;
        if (d.date() == moment(this.source[0].startTime).date()) {
            // debugger;
        }
        else {
            // debugger;
            this.source = this.source.concat(
                [{
                    title: 'selected',
                    startTime: new Date(d.format()),
                    endTime: new Date(d.add(1, 'hour').format()),
                    allDay: false,
                    // the color used by calendar template, provides classes as referenced in global.scss
                    color: 'awaiting',
                }]
            );
            this.selectedDate = d;
        }
    };
}
