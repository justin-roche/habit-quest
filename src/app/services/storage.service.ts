declare var require: any;
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
// let m = require('./mock.json')
// let m = require('./past.json')
let m = require('./2week.json')
// let m = require('./2day.json')
// let m = require('./1weektask.json')
// let m = require('./mock2.json')
// let m = [];

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(private s: Storage) {
        // s.set('habits', []);
        s.set('habits', m);
        // let self = this;
        // window.printHabits = function() {
        // debugger;
        // let p = self.s.get('habits')
        // console.log('h', JSON.stringify(p));
        // console.log('h', p);
        // }
    }

    load() {
        let p = this.s.get('habits')
        return from(p)
    }
}
