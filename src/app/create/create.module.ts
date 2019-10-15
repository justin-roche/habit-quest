import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CreatePage } from './create.page';
import { PurposePageModule } from '../purpose/purpose.module';
import { NgCalendarModule } from 'ionic2-calendar';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeUS from '@angular/common/locales/en';
import { SchedulePageModule } from '../schedule/schedule.module';
import { DaySchedulePageModule } from '../day-schedule/day-schedule.module';

registerLocaleData(localeUS);

const routes: Routes = [
    {
        path: '',
        component: CreatePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PurposePageModule,
        DaySchedulePageModule,
        SchedulePageModule,
        ReactiveFormsModule,
        NgCalendarModule,
        // Forms
        RouterModule.forChild(routes)
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'en' },

    ],
    declarations: [CreatePage]
})
export class CreatePageModule { }
