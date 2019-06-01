import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'purpose', loadChildren: './purpose/purpose.module#PurposePageModule' },
  { path: 'battle', loadChildren: './battle/battle.module#BattlePageModule' },
  { path: 'schedule', loadChildren: './schedule/schedule.module#SchedulePageModule' },
  { path: 'day-schedule', loadChildren: './day-schedule/day-schedule.module#DaySchedulePageModule' },
  { path: 'week-schedule', loadChildren: './week-schedule/week-schedule.module#WeekSchedulePageModule' }
    // { path: 'create', loadChildren: './create/create.module#CreatePageModule' }
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
