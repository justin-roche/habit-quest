import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DaySchedulePage } from './day-schedule.page';
import { NgCalendarModule } from 'ionic2-calendar';

const routes: Routes = [
    {
        path: 'day',
        component: DaySchedulePage
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
    declarations: [DaySchedulePage]
})

export class DaySchedulePageModule { }
