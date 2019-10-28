import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'info-form',
    templateUrl: './info-form.component.html',
    styleUrls: ['./info-form.component.scss'],
})
export class InfoFormComponent implements OnInit {
    @Input() form;
    @Input() formOptions;

    constructor() { }

    ngOnInit() { }

}
