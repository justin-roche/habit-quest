import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'purpose', loadChildren: './purpose/purpose.module#PurposePageModule' },
  { path: 'battle', loadChildren: './battle/battle.module#BattlePageModule' },
  { path: 'schedule', loadChildren: './month-schedule/month-schedule.module#MonthSchedulePageModule' }
    // { path: 'create', loadChildren: './create/create.module#CreatePageModule' }
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
