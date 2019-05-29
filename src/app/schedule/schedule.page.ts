import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.page.html',
    styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
    private calendar = {
        currentDate: new Date,
    }
    constructor() { }

    ngOnInit() {
    }

    onTimeSelected = (ev: { selectedTime: Date, events: any[] }) => {
        console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0));
    };
}
