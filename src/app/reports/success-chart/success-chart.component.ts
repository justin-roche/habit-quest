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
        let data = this.d.map((t, i) => {
            return t[this.options.dataSelector];
        });
        // console.log('chart data', data, this.d, this.options);

        let bgcolors = data.map((d) => {
            return "rgba(54, 162, 235, 0.2)";
        });

        let bordercolors = data.map((d) => {
            return "rgba(255,99,132,1)";
        });

        let labels = this.d.map((d) => {
            return d.time;
        });

        // console.log('data', data, 'labels', labels);
        const data = {
            labels: labels,
            datasets: [{
                fill: false,
                // label: 'Page Views',
                data: data,
                borderColor: '#fe8b36',
                backgroundColor: '#fe8b36',
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
