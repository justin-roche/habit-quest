declare var require: any;
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
let m = require('./mock.json')

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(private s: Storage) {
        s.set('habits', []);
        // if (m.length) {
        s.set('habits', m);
        // }
    }
    load() {
        let p = this.s.get('habits')

        return from(p)
    }
}
