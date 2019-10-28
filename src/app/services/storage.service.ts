declare var require: any;

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
let m = [];
m = require('./mock.json');

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(private s: Storage) {
        // s.set('habits', []);
        s.set('habits', m);
    }

    set(state) {
        this.s.set('habits', state);
    }

    load() {
        return from(this.s.get('habits'))
    }
}
