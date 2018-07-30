import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SetSavingsDetails } from '../../../../shared/app.actions';
import { PlanningService, ClientProfileService } from '../../../service';
import {
    AppState,
    getSavingsDetailsPayload
} from '../../../../shared/app.reducer';

@Component({
    selector: 'app-savings',
    templateUrl: './savings.component.html',
    styleUrls: ['./savings.component.css']
})

export class SavingsComponent implements OnInit {
    public clientId;
    public allSavings = [];
    public sortBy = [
        { id: 1, name: 'Account type', sortByText: 'ACCOUNT TYPE', sortByType: 'account type' },
        { id: 2, name: 'Portfolio', sortByText: 'PORTFOLIO', sortByType: 'portfolio' },
        { id: 3, name: 'Goals', sortByText: 'GOAL', sortByType: 'goals' }
    ];
    public selectedSortBy = this.sortBy[0];
    public viewBy = [
        { id: 1, name: 'Year' },
        { id: 2, name: 'Age' },
    ];
    public selectedViewBy = this.viewBy[0];

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private planningServices: PlanningService,
        private profileService: ClientProfileService
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {
        this.store
            .select(getSavingsDetailsPayload)
            .subscribe(async data => {
                if (data) {
                    this.allSavings = <any>await this.planningServices.processSavingsData(data, this.clientId);
                } else {
                    this.getSavingsData(this.selectedSortBy, true);
                }
            });
    }

    getSavingsData(sortBy, isStore) {
        this.allSavings = [];
        this.planningServices.getSavingsDetails(this.clientId, sortBy.sortByText).subscribe(async response => {
            this.allSavings = <any>await this.planningServices.processSavingsData(response, this.clientId);
            if (isStore) {
                this.store.dispatch(new SetSavingsDetails(response));
            }
        });
    }

    displayViewBy(event) {
        this.selectedViewBy = event;
    }

    sorting(event) {
        this.selectedSortBy = event;
        this.getSavingsData(event, false);
    }


}
