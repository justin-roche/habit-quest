import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
    @Input() tasks = [];
    @Input() options;
    @Input() mode;
    @Output() action = new EventEmitter<any>();
    @Output() deleteAction = new EventEmitter<any>();

    // {
    //     color: 'light',
    // };

    // private t = [];

    constructor() { }

    ngOnInit() {
        console.log('options', this.options);

    }

    emitAction(d) {
        this.action.emit(d)
    }

    emitDelete(d) {
        this.deleteAction.emit(d)
    }
}
