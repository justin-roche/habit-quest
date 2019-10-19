import { Component } from '@angular/core';
import { SettingsService } from '../services/settings.service';

import { flatMap, map, catchError, delay, throttleTime, concatMap, bufferTime, take, switchMap, toArray } from 'rxjs/operators'
import { Observable, Subject, pipe, of, from, interval, concat, timer, merge, fromEvent, SubscriptionLike, PartialObserver } from 'rxjs';

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.page.html',
    styleUrls: ['settings.page.scss']
})
export class SettingsPage {
    private settings = null;
    // private darkMode = null;
    // private theme = null;

    constructor(private ss: SettingsService) {
        this.ss.getSettings().pipe(take(1)).subscribe((r) => {
            this.settings = r;
        })
    }

    onIntervalChange(e) {
        console.log('changed interval', e);
        this.ss.setProperty({ autoScheduleInterval: e.target.value });
    }

    toggleDark() {
        this.ss.toggleDark();
        // this.darkMode = !this.settingdarkMode
    }

}
