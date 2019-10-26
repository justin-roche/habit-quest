import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'success-chart',
    templateUrl: './success-chart.component.html',
    styleUrls: ['./success-chart.component.scss'],
})
export class SuccessChartComponent implements OnInit {

    @ViewChild("barCanvas") barCanvas: ElementRef;
    private d;
    private barChart;
    @Input() period;
    @Input() options;
    // @Data() period;

    @Input() set data(value) {
        // bind to input change to run listener
        this.d = value;
        this.createChart();
    }
    constructor() { }

    ngOnInit() { }

    createChart() {
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
                lineTension: 0,
            }]
        }

        const scales = {
            xAxes: [{
                type: 'time',
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
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

        this.barChart = new Chart(this.barCanvas.nativeElement, options);
    }
}
