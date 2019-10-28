import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
    @Input() form;
    @Input() formOptions;
    constructor() { }

    ngOnInit() {
        this.form.controls.type.valueChanges.subscribe((f) => {
    
        });
    }

}
