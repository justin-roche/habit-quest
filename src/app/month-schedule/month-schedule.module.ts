import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MonthSchedulePage } from './month-schedule.page';
import { NgCalendarModule } from 'ionic2-calendar';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeUS from '@angular/common/locales/en';
registerLocaleData(localeUS);

const routes: Routes = [
    {
        path: 'schedule',
        component: MonthSchedulePage
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
    declarations: [MonthSchedulePage]
})
export class MonthSchedulePageModule { }
