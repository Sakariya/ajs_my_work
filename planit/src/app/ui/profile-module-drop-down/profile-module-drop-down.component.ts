import { Component, OnInit, Input } from '@angular/core';
import { ProfileProgress } from '../../client/client-models';
import { ClientProfileService } from '../../client/service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { getClientProgressPayload, AppState, getIsClientProgressLoaded } from '../../shared/app.reducer';
import { Store } from '@ngrx/store';
import { SetClientProgress } from '../../shared/app.actions';

@Component({
    selector: 'app-profile-module-drop-down',
    templateUrl: './profile-module-drop-down.component.html',
    styleUrls: ['./profile-module-drop-down.component.css']
})
export class ProfileModuleDropDownComponent implements OnInit {
    public progressSummary: ProfileProgress;
    @Input() public clientId: string;

    constructor(
        private route: ActivatedRoute,
        private profileService: ClientProfileService,
        private store: Store<AppState>
    ) {}

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
