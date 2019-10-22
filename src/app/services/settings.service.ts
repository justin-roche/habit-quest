import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    public settings: BehaviorSubject<any>;

    constructor() {
        let s = {
            autoScheduleInterval: 4,
            conserveWillpower: true,
            darkMode: false,
            pastCreation: true
        } as any;
        this.settings = new BehaviorSubject(s);
    }

    toggleDark() {
        let temp = Object.assign(this.settings, { darkMode: !(<any>this.settings).darkMode });
        console.log('setting dark', temp);
        this.settings.next(temp);
    }

    setProperty(obj) {
        let temp = Object.assign(this.settings,
            obj);
        console.log('setting settings', temp);
        this.settings.next(temp);
    }


    getSettings() {
        return this.settings.asObservable();
    }
}
