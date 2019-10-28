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
import { MonthSchedulePageModule } from '../month-schedule/month-schedule.module';
import { DaySchedulePageModule } from '../day-schedule/day-schedule.module';
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import { InfoFormComponent } from './info-form/info-form.component';
import { SchedulingFormComponent } from './scheduling-form/scheduling-form.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { IncidentFormComponent } from './incident-form/incident-form.component';
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
        MonthSchedulePageModule,
        ReactiveFormsModule,
        NgCalendarModule,
        // Forms
        RouterModule.forChild(routes)
    ],
    providers: [
        WheelSelector,
        { provide: LOCALE_ID, useValue: 'en' },
    ],
    declarations: [CreatePage, InfoFormComponent, SchedulingFormComponent, CategoryFormComponent,IncidentFormComponent]
})
export class CreatePageModule { }
