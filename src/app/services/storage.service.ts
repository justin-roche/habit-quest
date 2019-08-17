import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
let m = require('./mock.json')
@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(private s: Storage) {
        // if (m.length) {
        // s.set('habits', m);
        // }
    }

    load() {
        let p = this.s.get('habits')
            .then((d) => {
                if (!d) {
                    console.log('no habits in storage');

                    return this.s.set('habits', [])
                        .then((d) => {
                            console.log('6 initial storage ');

                            return this.s.get('habits')
                        })
                }
                return d
            })


        return from(p)
    }






}
