import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'incident-form',
    templateUrl: './incident-form.component.html',
    styleUrls: ['./incident-form.component.scss'],
})
export class IncidentFormComponent implements OnInit {
    @Input() form;
    @Input() formOptions;

    constructor() { }

    ngOnInit() { }

}
