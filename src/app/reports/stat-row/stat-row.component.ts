import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'stat-row',
    templateUrl: './stat-row.component.html',
    styleUrls: ['./stat-row.component.scss'],
})
export class StatRowComponent implements OnInit {
    @Input() data;
    constructor() { }

    ngOnInit() { }

}
