import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCalendarComponent } from './app-calendar/app-calendar.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [AppCalendarComponent],
    imports: [
        IonicModule,
        CommonModule
    ],
    exports: [
        AppCalendarComponent
    ]
})
export class SharedModule { }
