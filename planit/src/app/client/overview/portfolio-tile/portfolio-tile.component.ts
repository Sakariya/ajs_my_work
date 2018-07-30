import { AppState, getPortfolioPayload, getGoalPayload } from '../../../shared/app.reducer';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { APIService } from '../../../api.service';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';

@Component({
    selector: 'app-portfolio-tile',
    templateUrl: './portfolio-tile.component.html',
    styleUrls: ['./portfolio-tile.component.css']
})
export class PortfolioTileComponent implements OnInit {
    @Input() public clientId;
    public data: any;
    public data2;
    public lang: string;

    constructor(
        private apiService: APIService,
        private store: Store<AppState>,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.store
            .select(getPortfolioPayload)
            .subscribe(data => (this.data = data));
        this.store.select(getGoalPayload).subscribe(data => (this.data2 = data));
    }

    getCategoryText(category: number) {
        switch (category) {
            case 1:
                return 'Very Low';
            case 2:
                return 'Low';
            case 3:
                return 'Average';
            case 4:
                return 'High';
            case 5:
                return 'Very High';
        }
    }

    getGoalName(Goals: String[]) {
        if (Goals.length > 1) {
            return 'Multiple';
        } else {
            for (const goal of this.data2) {
                if (goal.key === Goals[0]) {
                    return goal.description;
                }
            }
        }
    }

    getInvestmentStrategy(portSelected: number) {
        switch (portSelected) {
            case 1:
                return 'All Income';
            case 2:
                return 'Income';
            case 3:
                return 'Income & Growth';
            case 4:
                return 'Balanced';
            case 5:
                return 'Growth & Income';
            case 6:
                return 'Growth';
            case 7:
                return 'All Equity';
        }
    }

    public changePortfolioAction(index: number) {
        if ($('#dropdownPortfolioAction' + index).is(':visible')) {
            $('.dropdown-portfolio-action').hide();
        } else {
            $('.dropdown-portfolio-action').hide();
            $('#dropdownPortfolioAction' + index).toggle();
        }
    }

    public changePortfolioOwnedAction(index: number) {
        if ($('#dropdownPortfolioOwnedAction' + index).is(':visible')) {
            $('.dropdown-portfolio-owned-action').hide();
        } else {
            $('.dropdown-portfolio-owned-action').hide();
            $('#dropdownPortfolioOwnedAction' + index).toggle();
        }
    }

}
