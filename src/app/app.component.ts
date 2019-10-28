declare var require: any;
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as moment from 'moment';
let mockdate = require('mockdate');

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
    ) {
        this.initializeApp();

        let self = this;

        (<any>window).mdSet = function(d) {
            mockdate.set(moment(d));
            console.log('set mock date', moment().format());
        };
        (<any>window).mdIncrement = function(d) {
            mockdate.set(moment().add(1, 'd'));
            console.log('new date', moment().format());
        };
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
}
