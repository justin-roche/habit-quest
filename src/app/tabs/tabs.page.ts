import { Component } from '@angular/core';
import { StateService } from '../services/state.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    constructor(private ss: StateService) { }

}
