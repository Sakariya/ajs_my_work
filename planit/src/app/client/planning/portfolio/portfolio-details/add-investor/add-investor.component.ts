import { Component, OnInit, Input } from '@angular/core';
import { slideInOutAnimation } from '../../../../../shared/animations/index';
import { ActivatedRoute } from '@angular/router';
import { ClientProfileService } from '../../../../service/index';
import { PlanningService } from '../../../../service/index';
import { Store } from '@ngrx/store';
import { AppState, getPortfolioPayload, getFamilyMemberRiskPayload } from '../../../../../shared/app.reducer';
import { Location } from '@angular/common';
import { RiskGroups } from '../../../../../client/client-models/index';

@Component({
    selector: 'app-add-investor',
    templateUrl: './add-investor.component.html',
    styleUrls: ['./add-investor.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})
export class AddInvestorComponent implements OnInit {

    public familyMembersRisk: any;
    public clientId;
    public riskGroup = RiskGroups;
    public portfolioId;
    public portfolioName;
    public portfolioList;
    public selectedInvestors = [];

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private _location: Location,
        private profileService: ClientProfileService,
        private planningService: PlanningService,
    ) {
        this.clientId = this.route.parent.parent.parent.snapshot.params['clientId'];
        this.portfolioId = this.route.parent.snapshot.params['portfolioId'];
    }

    ngOnInit() {
        this.store
            .select(getFamilyMemberRiskPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembersRisk = data['familyMembers'];
                } else {
                    this.getFamilyMembersRisk();
                }
            });

        this.planningService.getListOfPortfolios(this.clientId).subscribe(results => {
            this.portfolioList = results['portfolios'];
            this.portfolioName = this.portfolioList[this.portfolioList.findIndex(p => p.id === this.portfolioId)]['description'];
        });
    }

    getFamilyMembersRisk() {
        if (this.clientId != null) {
            this.profileService.
                getFamilyMembersWithRisk(this.clientId).
                subscribe(result => {
                    this.familyMembersRisk = this.profileService.processFamilyMembersRiskData(result[0], result[1]);
                });
        }
    }

    back() {
        this._location.back();
    }

    addInvestor() {
        this.familyMembersRisk.forEach(member => {
            if (member.investor == true) {
                this.selectedInvestors.push(member)
            }
        })
        // api call will be here
        this.back();
    }
}
