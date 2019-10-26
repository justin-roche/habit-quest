import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
    selector: 'habits-toolbar',
    templateUrl: './habits-toolbar.component.html',
    styleUrls: ['./habits-toolbar.component.scss'],
})
export class HabitsToolbarComponent implements OnInit {
    @Output() action = new EventEmitter<any>();
    @Input() mode;

    constructor() { }

    ngOnInit() { }

    emitAction(d) {
        this.action.emit(d)
    }
}
