import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsPage } from './reports.page';

import { NgCalendarModule } from 'ionic2-calendar';
import { HabitStatsComponent } from './habit-stats/habit-stats.component';
import { SummaryStatsComponent } from './summary-stats/summary-stats.component';
import { StatRowComponent } from './stat-row/stat-row.component';
import { SuccessChartComponent } from './success-chart/success-chart.component';
import { ReportCalendarComponent } from './report-calendar/report-calendar.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({

    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        SharedModule,
        NgCalendarModule,
        RouterModule.forChild([{ path: '', component: ReportsPage }])
    ],
    declarations: [ReportsPage
        , HabitStatsComponent
        , SummaryStatsComponent
        , StatRowComponent
        , SuccessChartComponent
        , ReportCalendarComponent
        // , AppCalendarComponent
    ]
})
export class ReportsPageModule { }
