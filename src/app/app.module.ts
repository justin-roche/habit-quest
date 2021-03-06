import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsService } from './services/settings.service';
import { NgCalendarModule } from 'ionic2-calendar';
import { HabitsService } from './services/habits.service';
import { StorageService } from './services/storage.service';
import { ScheduleService } from './services/schedule.service';
import { SharedModule } from './shared/shared.module';
import { CypressAdapterService } from './services/cypress-adapter.service';
import { StatisticsService } from './services/statistics.service';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        SharedModule,
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot(),
    ],
    providers: [
        StatusBar,
        SettingsService,
        HabitsService,
        StatisticsService,
        CypressAdapterService,
        StorageService,
        ScheduleService,
        SplashScreen,
        NgCalendarModule,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
