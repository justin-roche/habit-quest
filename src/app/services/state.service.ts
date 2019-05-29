import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StateService {

    public theme: BehaviorSubject<String>;

    constructor() {
        this.theme = new BehaviorSubject('dark-theme');
    }

    setActiveTheme(val) {
        this.theme.next(val);
        console.log('val', val);
    }

    getActiveTheme() {
        return this.theme.asObservable();
    }
}
