import { Component } from '@angular/core';
import { SettingsService } from '../services/settings.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    constructor(private ss: SettingsService) { }

}
