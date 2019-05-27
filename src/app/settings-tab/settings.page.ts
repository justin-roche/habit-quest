import { Component } from '@angular/core';
import { StateService } from '../services/state.service';

import { flatMap, map, catchError, delay, throttleTime, concatMap, bufferTime, take, switchMap, toArray } from 'rxjs/operators'
import { Observable, Subject, pipe, of, from, interval, concat, timer, merge, fromEvent, SubscriptionLike, PartialObserver } from 'rxjs';

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.page.html',
    styleUrls: ['settings.page.scss']
})
export class SettingsPage {
    private darkMode = null;
    private theme = null;

    constructor(private ss: StateService) {
        // this.ss.theme.asObservable().pipe(take(1)).subscribe((r) => {
        //     this.darkMode = (r == 'dark-theme');
        //     console.log('dark', this.darkMode);
        // })

    }

    toggleDark() {
        this.ss.setActiveTheme(this.darkMode ? 'light-theme' : 'dark-theme')
        this.darkMode = !this.darkMode
    }

}
