import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

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
    private expanded = true;

    constructor() { }

    ngOnInit() {
        // console.log('options', this.options);
    }

    formatHour(h) {
        return moment(h, 'HH:mm').format('h:mm a');
    }

    emitAction(d) {
        this.action.emit(d)
    }

    emitDelete(d) {
        this.deleteAction.emit(d)
    }

    toggleExpand(){
this.expanded = !this.expanded
    }
}
