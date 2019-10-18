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
    // private source;
    private source = []
    private mode = 'loading';

    constructor(private mc: ModalController) { }

    ngOnInit() {
        this.source = this.createDefaultSource();
        this.mode = 'ready';
    }

    createDefaultSource() {
        let defaultSource = [{
            title: 'now',
            startTime: new Date(),
            endTime: new Date(moment().add(1, 'hour').format()),
            allDay: false,
            // the color used by calendar template, provides classes as referenced in global.scss
            color: 'current',
        }];
        return defaultSource;
    }

    dateBack() {
        var mySwiper = document.querySelector('.swiper-container')['swiper'];
        // console.log('swiper', mySwiper);
        mySwiper.slidePrev();

        this.displayDate = moment(this.displayDate).subtract(1, 'month');
        console.log('cal date', this.calendar.currentDate);
    }

    dateNext() {
        var mySwiper = document.querySelector('.swiper-container')['swiper'];
        mySwiper.slideNext();
        this.displayDate = moment(this.displayDate).add(1, 'month');
    }

    dismiss() {
        this.mc.dismiss(this.source[1])
    }

    addDate(d) {

        console.log('adding date', d);

        this.source = this.createDefaultSource();
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
    }

    onTimeSelected(ev: { selectedTime: Date, events: any[] }) {
        let d = moment(ev.selectedTime)
        // if (d.date() == moment(this.source[0].startTime).date()) {

        // }
        // else {
        this.addDate(d)
        // }
    };
}
