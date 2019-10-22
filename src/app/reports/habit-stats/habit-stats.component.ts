import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
// import { Chart } from 'chart.js';

@Component({
    selector: 'habit-stats',
    templateUrl: './habit-stats.component.html',
    styleUrls: ['./habit-stats.component.scss'],
})
export class HabitStatsComponent implements OnInit {
    private h;
    @Input() set habit(value) {
        // bind to input change to run listener
        this.h = value;
        this.handleHabit();
    }

    // @ViewChild("barCanvas") barCanvas: ElementRef;

    private stats = null;

    constructor(private change: ChangeDetectorRef) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    handleHabit() {
        // console.log('received h', this.h);
        this.stats = this.h.statistics;
        // this.createCompletionCharts();
    }

}
