import { Component, OnInit } from '@angular/core';
import { HabitsService } from 'src/app/services/habits.service';

@Component({
    selector: 'summary-stats',
    templateUrl: './summary-stats.component.html',
    styleUrls: ['./summary-stats.component.scss'],
})
export class SummaryStatsComponent {
    private stats;

    constructor(private hs: HabitsService) {
        this.hs.aggregate.asObservable().subscribe((as) => {
            if (as) this.handleStats(as)
        })
    }

    handleStats(stats) {
        console.log('received in summary page', stats, 'eq?', stats === this.stats);
        this.stats = stats;
    }

}
