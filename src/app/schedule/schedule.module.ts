import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SchedulePage } from './schedule.page';

import { NgCalendarModule } from 'ionic2-calendar';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeUS from '@angular/common/locales/en';
registerLocaleData(localeUS);

const routes: Routes = [
    {
        path: 'schedule',
        component: SchedulePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NgCalendarModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'en' },

    ],
    declarations: [SchedulePage]
})
export class SchedulePageModule { }
