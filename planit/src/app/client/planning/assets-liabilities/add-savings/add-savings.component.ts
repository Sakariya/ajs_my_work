import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { PlanningService } from '../../../service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { slideInOutAnimation } from '../../../../shared/animations';
@Component({
    selector: 'app-add-savings',
    templateUrl: './add-savings.component.html',
    styleUrls: ['./add-savings.component.css'],
    animations: [slideInOutAnimation],
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class AddSavingsComponent implements OnInit {

    public clientId;
    public accountId;
    public accountsData;
    public currentAccount;
    public savings: any = {};
    public today = new Date();
    public portfoliosData = {};
    public accountsDropdown = [];
    public numberMask = {
        prefix: '$',
        thousands: ',',
        decimal: '.'
    };
    public goalsList = [{ id: null, description: 'Unallocated' }];
    public selectedGoalsList = [{ key: null, description: 'Unallocated' }];
    @ViewChild('f') public form: NgForm;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private _location: Location,
        private assetsServices: PlanningService
    ) {
        this.route.parent.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.accountId = this.route.snapshot.params['accountId'];
        if (!this.accountId) {
            this.accountId = this.route.parent.snapshot.params['accountId'];
        }
    }

    ngOnInit() {
        this.assetsServices.getAccountSummaryByAccountType(this.clientId).subscribe(data => {
            this.accountsData = data;
            if (this.accountId) {
                this.currentAccount = this.accountsData[this.accountsData.findIndex(a => a.id === this.accountId)];
            } else {
                this.getAccountsDropdown();
            }
        });
        this.assetsServices.getListOfPortfolios(this.clientId).subscribe(response => {
            response['portfolios'].forEach(portfolio => {
                this.portfoliosData[portfolio.id] = { description: portfolio.description };
            });
        });
        this.getGoalsDropdown();
    }
    getAccountsDropdown() {
        this.accountsData.forEach(account => {
            this.accountsDropdown.push(
                {
                    id: account.id,
                    value: account.description,
                    regType: account.regulatoryTypeDTO.description,
                    portfolio: account.portfolio
                }
            );
        });
    }

    getGoalsDropdown() {
        this.assetsServices.getAllGoalsList(this.clientId).subscribe(result => {
            result.forEach(goal => {
                this.goalsList.push(goal);
                if (goal.goalType === '3') {
                    this.selectedGoalsList.push(goal);
                }
            });
        });
    }

    back() {
        this._location.back();
    }

    addSavings(opt) {
        this.savings.key = 1;
        let linkedAccount;
        if (this.accountId) {
            this.savings.linkedAccountKey = this.accountId;
        } else {
            linkedAccount = this.savings.linkedAccountKey;
            this.savings.linkedAccountKey = linkedAccount.id;
        }

        this.savings.tier1StartYear = this.today.getFullYear();
        if (this.savings.linkedGoal.description !== 'Unallocated') {
            this.savings.tier1EndYear = this.savings.linkedGoal.goalStartYear - 1;
            this.savings.linkedGoal = this.savings.linkedGoal.key;
        } else {
            this.savings.linkedGoal = null;
            this.savings.tier1EndYear = this.today.getFullYear() + 1;
        }
        const reqObj = Object.assign({}, this.savings);
        this.assetsServices.addSavings(reqObj).subscribe(res => {
            if (opt === 1) {
                this.back();
            } else if (opt === 2) {
                this.router.navigate(['/client', this.clientId, 'planning', 'assets-liabilities-savings' , this.savings.key, 'edit-savings']);
            } else if (opt === 3) {
                this.form.resetForm();
                this.savings = {};
            }
        });
    }

}
