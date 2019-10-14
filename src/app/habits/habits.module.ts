import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitsPage } from './habits.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            { path: '', component: HabitsPage },
            {
                path: 'create',
                children: [
                    {
                        path: '',
                        loadChildren: '../create/create.module#CreatePageModule'
                    }
                ]
            }
        ])
    ],
    declarations: [HabitsPage]
})
export class HabitsPageModule { }
