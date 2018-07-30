import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { SetPlanningSummary } from '../../shared/app.actions';
import { PlanningService } from '../../client/service/planning.service';
import {
    AppState,
    getIsPlanningSummaryLoaded,
    getPlanningSummaryPayload
} from '../../shared/app.reducer';
import { PlanningSummary } from '../../client/client-models';

@Component({
    selector: 'app-planning-module-drop-down',
    templateUrl: './planning-module-drop-down.component.html',
    styleUrls: ['./planning-module-drop-down.component.css']
})
export class PlanningModuleDropDownComponent implements OnInit {
    @Input() public clientId: string;
    public planningSummary: PlanningSummary;

    constructor(
        private store: Store<AppState>,
        private planningService: PlanningService
    ) { }

    ngOnInit() {
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

}
