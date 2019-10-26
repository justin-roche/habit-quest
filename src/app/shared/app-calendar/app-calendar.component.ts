import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
    selector: 'app-calendar',
    templateUrl: './app-calendar.component.html',
    styleUrls: ['./app-calendar.component.scss'],
})
export class AppCalendarComponent implements OnInit {
    @Input() viewTitle;
    @Output() swipe;

    constructor() { }

    ngOnInit() { }

    dateSwipe(dir) {
        var s = document.querySelector('.swiper-container')['swiper'];
        dir == 1 ? s.slideNext() : s.slidePrev();
    }
}
