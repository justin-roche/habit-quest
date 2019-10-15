import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'habits',
                children: [
                    {
                        path: '',
                        loadChildren: '../habits/habits.module#HabitsPageModule'
                    }
                ]
            },

            {
                path: 'day-schedule',
                children: [
                    {
                        path: '',
                        loadChildren: '../day-schedule/day-schedule.module#DaySchedulePageModule'
                    }
                ]
            },
            {
                path: 'schedule',
                children: [
                    {
                        path: '',
                        loadChildren: '../schedule/schedule.module#SchedulePageModule'
                    }
                ]
            },
            {
                path: 'tab3',
                children: [
                    {
                        path: '',
                        loadChildren: '../tab3/tab3.module#Tab3PageModule'
                    }
                ]
            },
            {
                path: 'battle',
                children: [
                    {
                        path: '',
                        loadChildren: '../battle/battle.module#BattlePageModule'
                    }
                ]
            },
            {
                path: 'settings',
                children: [
                    {
                        path: '',
                        loadChildren: '../settings-tab/settings.module#SettingsPageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/tabs/habits',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/habits',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class TabsPageRoutingModule { }
