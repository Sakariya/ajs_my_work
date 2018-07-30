import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from '../../service';
import { PlanningSummary } from '../../client-models';
import {
    AppState,
    getIsPlanningSummaryLoaded,
    getPlanningSummaryPayload
} from '../../../shared/app.reducer';
import {
    SetPlanningSummary
} from '../../../shared/app.actions';

@Component({
    selector: 'app-planning-summary',
    templateUrl: './planning-summary.component.html',
    styleUrls: [
        '../../profile/summary/summary.component.css',
        './planning-summary.component.css',
    ]
})

export class PlanningSummaryComponent implements OnInit {
    public clientId;
    public planningSummary: PlanningSummary;

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private planningService: PlanningService
    ) {
        this.route.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.store.select(getIsPlanningSummaryLoaded).subscribe(data => {
            if (data) {
                this.store
                    .select(getPlanningSummaryPayload)
                    .subscribe(clientProgress => (this.planningSummary = clientProgress));
            } else {
                this.planningService.getPlanningSummary(this.clientId).subscribe(summaryData => {
                    this.planningSummary = summaryData;
                    this.store.dispatch(new SetPlanningSummary(summaryData));
                });
            }
        });
    }

    ngOnInit() {
    }

}
