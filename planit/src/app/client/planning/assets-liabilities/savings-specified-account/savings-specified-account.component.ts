import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SetSavingsDetails } from '../../../../shared/app.actions';
import { PlanningService } from '../../../service/planning.service';
import {
    AppState,
    getSavingsDetailsPayload
} from '../../../../shared/app.reducer';

@Component({
    selector: 'app-savings-specified-account',
    templateUrl: './savings-specified-account.component.html',
    styleUrls: ['./savings-specified-account.component.css']
})
export class SavingsSpecifiedAccountComponent implements OnInit {

    public clientId;
    public accountId;
    public allSavings = [];
    public sortBy = [
        { id: 1, name: 'Goals', sortByText: 'GOAL', sortByType: 'goals' }
    ];
    public selectedSortBy = this.sortBy[0];
    public viewBy = [
        { id: 1, name: 'Year' },
        { id: 2, name: 'Age' },
    ];
    public selectedViewBy = this.viewBy[0];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private planningServices: PlanningService,
        private store: Store<AppState>,
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.accountId = this.route.snapshot.params['accountId'];
    }

    ngOnInit() {
        this.store
            .select(getSavingsDetailsPayload)
            .subscribe(async data => {
                if (data) {
                    this.allSavings = <any>await this.planningServices.processSavingsData(data, this.clientId);
                } else {
                    this.getSavingsData();
                }
            });
    }

    async getSavingsData() {
        this.allSavings = [];
        this.planningServices.getSavingsDetails(this.clientId, this.selectedSortBy.sortByText).subscribe(async response => {
                this.allSavings = <any>await this.planningServices.processSavingsData(response, this.clientId);
                this.store.dispatch(new SetSavingsDetails(response));
            });
    }

    changeAccount(accountId) {
        this.accountId = accountId;
        this.router.navigate(['/client/' + this.clientId + '/planning/assets-liabilities/' + accountId + '/savings']);
        this.getSavingsData();
    }

    public displayViewBy(event) {
        this.selectedViewBy = event;
    }

}
