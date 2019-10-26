declare var require: any;
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
let m = [];
// let m = require('./mock.json')
// let m = require('./past.json')
// let m = require('./2week.json')
// let m = require('./2day.json')
// let m = require('./1weektask.json')
// let m = require('./2habits.json')
// m = require('./single.json')
// m = require('./single2.json')
m = require('./parallel.json')

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(private s: Storage) {
        // s.set('habits', []);
        s.set('habits', m);
    }

    set(h) {
        console.log('setting storage', h);
        this.s.set('habits', h);
    }

    load() {
        return from(this.s.get('habits'))
    }
}
