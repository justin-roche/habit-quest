import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'success-chart',
    templateUrl: './success-chart.component.html',
    styleUrls: ['./success-chart.component.scss'],
})
export class SuccessChartComponent implements OnInit {

    @ViewChild("barCanvas") barCanvas: ElementRef;
    @Input() period;
    @Input() options;
    private d;
    private barChart;

    @Input() set data(value) {
        // bind to input change to run listener
        this.d = value;
        // console.log('style', this.style);

        if (this.options.style == 'streak') {
            // console.log('streak data', this.d);
            this.getStreakChart();
        } else {
            this.getSuccessChart();
        }
    }

    constructor() { }

    ngOnInit() { }

    getSuccessChart() {
        let o = this.getChartBase();
        this.barChart = new Chart(this.barCanvas.nativeElement, o);
    }

    getStreakChart() {
        let o = this.getChartBase();
        console.log('options', JSON.parse(JSON.stringify(o)));
        delete o.options.scales.yAxes[0].ticks.suggestedMax;
        o.options.scales.yAxes[0].ticks.stepSize = 1;

        this.barChart = new Chart(this.barCanvas.nativeElement, o);
    }

    getChartBase() {
        let inputData = this.d.map((t, i) => {
            return t[this.options.dataSelector];
        });

        let bgcolors = inputData.map((d) => {
            // return "rgba(54, 162, 235, 0.2)";
            return "green";
        });

        let bordercolors = inputData.map((d) => {
            // return "rgba(255,99,132,1)";
            return "green";
        });

        let labels = this.d.map((d) => {
            return d.time;
        });

        const data = {
            labels: labels,
            datasets: [{
                fill: false,
                // label: 'Page Views',
                data: inputData,
                borderColor: '#3880ff',
                backgroundColor: '#3880ff',
                lineTension: 0.5,
            }]
        }

        const scales = {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day',
                    bounds: 'ticks'
                }

            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 100,
                },
            }]
        }

        const options = {
            type: 'line',
            data: data,
            options: {
                legend: { display: false },
                tooltips: { enabled: false },
                fill: false,
                responsive: true,
                scales: scales
            }
        }

        return options;
    }
}
