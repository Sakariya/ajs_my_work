import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { PlanningService } from '../../../service';

@Component({
    selector: 'app-savings-list-html',
    templateUrl: './savings-list-html.component.html',
    styleUrls: ['./savings-list-html.component.css']
})
export class SavingsListHtmlComponent implements OnInit {

    @Input() public clientId;
    @Input() public accountId;
    @Input() public selectedSortBy;
    @Input() public selectedViewBy;
    @Input() public sortBy;
    @Input() public allSavings;

    public goals = {};
    public savingsData = {};
    public accountIds = [];
    public linkedAccountDetails = {};
    public noSavings = true;
    constructor(
        private planningServices: PlanningService
    ) { }

    ngOnInit() {
        this.planningServices.getAllGoalsList(this.clientId).subscribe(response => {
            response.forEach(goal => {
                this.goals[goal.key] = { description: goal.description };
            });
        });
        this.makeSavingsData();
    }

    makeSavingsData() {
        this.savingsData = {};
        this.linkedAccountDetails = {};
        this.accountIds = [];
        this.allSavings.forEach(savings => {
            if ((this.accountId && savings.linkedAccountKey === this.accountId) || !this.accountId) {
                if (!this.savingsData.hasOwnProperty(savings.linkedAccountKey)) {
                    this.savingsData[savings.linkedAccountKey] = [];
                }
                if (!this.linkedAccountDetails.hasOwnProperty(savings.linkedAccountKey)) {
                    this.linkedAccountDetails[savings.linkedAccountKey] = {};
                }
                const tierDetail = {};
                const tierKeys = ['tier1', 'tier2', 'tier3'];
                savings['tierKeys'] = [];
                tierKeys.forEach(tierKey => {
                    const tierData = this.getTierDetail(tierKey, savings);
                    if (tierData.AmountPerYear > 0) {
                        savings['tierKeys'].push(tierKey);
                        tierDetail[tierKey] = tierData;
                    }
                });

                const owners = savings['linkedAccountDetails']['ownership'];
                owners.forEach(owner => {
                    for (const tier in tierDetail) {
                        if (tierDetail.hasOwnProperty(tier)) {
                            tierDetail[tier]['startAge'].push(tierDetail[tier]['StartYear'] - owner.birthYear);
                            tierDetail[tier]['endAge'].push(tierDetail[tier]['EndYear'] - owner.birthYear);
                        }
                    }
                });

                savings['tierDetail'] = tierDetail;
                this.savingsData[savings.linkedAccountKey].push(savings);
                this.linkedAccountDetails[savings.linkedAccountKey] = savings['linkedAccountDetails'];
            }
        });
        this.accountIds = Object.keys(this.savingsData);
        if (this.accountIds.length > 0) {
            this.noSavings = false;
        }
    }

    getTierDetail(tier, savings) {
        return {
            AmountPerYear: savings[tier + 'AmountPerYear'],
            EmployerContribAmt: savings[tier + 'EmployerContribAmt'],
            EndYear: savings[tier + 'EndYear'],
            EndYearLinkType: savings[tier + 'EndYearLinkType'],
            MatchingAmountPerYear: savings[tier + 'MatchingAmountPerYear'],
            StartYear: savings[tier + 'StartYear'],
            StartYearLinkType: savings[tier + 'StartYearLinkType'],
            startAge: [],
            endAge: []
        };
    }

    toggleActionMenu(id, index) {
        if ($('#' + id + '_' + index).is(':visible')) {
            $('.dropdown-portfolio-action').hide();
        } else {
            $('.dropdown-portfolio-action').hide();
            $('#' + id + '_' + index).toggle();
        }
    }

    delete(savingId, accountId, savingIndex) {
        Swal({
            title: 'Are you sure want to delete this saving?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(result => {
            if (result.value) {
                this.planningServices.deleteSavings(savingId).subscribe(response => {
                    this.savingsData[accountId].splice(savingIndex, 1);

                    if (this.savingsData[accountId].length === 0) {
                        const index = this.accountIds.indexOf(accountId);
                        this.accountIds.splice(index, 1);
                    }
                    if (this.accountIds.length === 0) {
                        this.noSavings = true;
                    }
                    Swal('Deleted!', 'Saving has been deleted successfully.', 'success');
                });
            }
        });
    }

}
