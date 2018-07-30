import { Component, OnInit } from '@angular/core';
import { ClientProfileService } from '../../service';
import { ProfileProgress } from '../../client-models';
import { ActivatedRoute } from '@angular/router';
import { getIsClientProgressLoaded, getClientProgressPayload, AppState } from '../../../shared/app.reducer';
import { SetClientProgress } from '../../../shared/app.actions';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
    public clientId;
    public progressSummary: ProfileProgress;

    constructor(
        private route: ActivatedRoute,
        private profileService: ClientProfileService,
        private store: Store<AppState>
    ) {
        this.route.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {

        this.store.select(getIsClientProgressLoaded).subscribe(data => {
            if (data) {
                this.store
                    .select(getClientProgressPayload)
                    .subscribe(clientProgress => (this.progressSummary = clientProgress));
            } else {
                this.profileService.getProfileSummary(this.clientId).subscribe(summaryData => {
                    this.progressSummary = summaryData;
                    this.store.dispatch(new SetClientProgress(summaryData));
                });
            }
        });
    }

}
