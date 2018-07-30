import * as $ from 'jquery';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from '../../../service';
import { fadeInAnimation } from '../../../../shared/animations';
import { SetAccountSummaryList } from '../../../../shared/app.actions';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';

import {
    AppState,
    getIsAccountSummaryListLoaded,
    getAccountSummaryListPayload
} from '../../../../shared/app.reducer';

@Component({
    selector: 'app-assets-summary',
    templateUrl: './assets-summary.component.html',
    styleUrls: ['./assets-summary.component.css'],
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@fadeInAnimation]': '' },
    providers: [CurrencyPipe]
})
export class AssetsSummaryComponent implements OnInit {
    public clientId;

    public numberMask = {
        prefix: '$',
        thousands: ',',
        decimal: '.'
    };
    sortBy = [
        { id: 1, name: 'Account type', sortByText: 'account type', sortByType: 'managed' },
        { id: 2, name: 'Portfolio', sortByText: 'portfolio', sortByType: 'portfolio' },
        { id: 3, name: 'Owner', sortByText: 'account type', sortByType: 'managed' }
    ];
    selectedSortBy = this.sortBy[0];
    assetsData;
    isExpanded = false;
    isExpand = false;
    accountTypes = [];
    accountList = {};

    totalAssetsSum = 0;
    totalLiabilitySum = 0;
    totalSavings = 0;
    netTotal;
    portfolios = [];
    formattedAmount: string;
    value: any;
    allAssetsDeleted = false;
    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private assetsServices: PlanningService,
        private currencyPipe: CurrencyPipe
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {
        this.assetsServices.getListOfPortfolios(this.clientId)
            .subscribe(response => {
                response['portfolios'].forEach(portfolio => {
                    this.portfolios[portfolio.id] = { description: portfolio.description };
                });
            });
        this.getAccountSummaryByAccount(this.selectedSortBy);
    }

    private getAccountSummaryByAccount(sortBy) {
        this.accountList = {};
        this.accountTypes = [];
        this.totalAssetsSum = 0;
        this.totalLiabilitySum = 0;
        this.totalSavings = 0;
        this.assetsServices.getAccountSummaryByAccountType(this.clientId, sortBy.sortByText)
            .subscribe(data => {
                this.assetsData = data;
                this.assetsData.forEach(element => {
                    if (localStorage.getItem('accountId') && localStorage.getItem('accountId') === element.id) {
                        localStorage.removeItem('accountId');
                        Swal('Deleted!', 'Account has been deleted successfully.', 'success');
                    } else {
                        const sortType = element[sortBy.sortByType];
                        if (!this.accountList.hasOwnProperty(sortType)) {
                            this.accountList[sortType] = {
                                accounts: [],
                                totalAssetsSum: 0,
                                totalLiabilitiesSum: 0,
                                totalSavingSum: 0,
                            };
                            this.accountTypes.push(sortType);
                        }
                        this.accountList[sortType].accounts.push(element);
                        this.accountList[sortType]['totalAssetsSum'] = this.accountList[sortType]['totalAssetsSum'] + element.totalAssets;
                        this.accountList[sortType]['totalLiabilitiesSum'] = this.accountList[sortType]['totalLiabilitiesSum'] + element.liabilityAmount;
                        // tslint:disable-next-line:radix
                        this.accountList[sortType]['totalSavingSum'] = parseFloat(this.accountList[sortType]['totalSavingSum']) + element.currentYearSavings;
                        this.totalAssetsSum = this.totalAssetsSum + element.totalAssets;
                        this.totalLiabilitySum = this.totalLiabilitySum + element.liabilityAmount;
                        this.totalSavings = this.totalSavings + element.currentYearSavings;
                    }
                });
                this.netTotal = this.totalAssetsSum - this.totalLiabilitySum;
                // const accountSummary = {
                //     assetsData: this.assetsData,
                //     accountList: this.accountList,
                //     totalAssetsSum: this.totalAssetsSum,
                //     totalLiabilitySum: this.totalLiabilitySum,
                //     totalSavings: this.totalSavings,
                //     netTotal: this.netTotal
                // };
                // this.store.dispatch(new SetAccountSummaryList(accountSummary));
            });
    }
    updateAccount() {
        let saveData = [];
        this.accountTypes.forEach(accountType => {
            saveData = saveData.concat(this.accountList[accountType].accounts);
        });
        this.assetsServices.updateSummaryAccountDetail(this.clientId, saveData).subscribe();
    }

    public toggleActionMenu(id, index) {
        if ($('#' + id + '_' + index).is(':visible')) {
            $('.dropdown-portfolio-action').hide();
        } else {
            $('.dropdown-portfolio-action').hide();
            $('#' + id + '_' + index).toggle();
        }

    }

    toggleAssetsList(accountId) {
        $('#assetList_' + accountId).toggle('slow');
        if (this.isExpand === false) {
            $('.dropdown-portfolio-action').hide();
        }
    }

    toggleAllAssets(types) {
        this.accountList[types].accounts.forEach(element => {
            if (element.assetList) {
                if (!this.isExpanded) {
                    element.isExpand = true;
                    $('.asset-list').show();
                } else {
                    element.isExpand = false;
                    $('.asset-list').hide();
                    $('.dropdown-portfolio-action').hide();
                }
            }
        });
    }

    sorting(event) {
        this.selectedSortBy = event;
        this.getAccountSummaryByAccount(event);
    }

    deleteAccount(accountType, accountId) {
        Swal({
            title: 'Are you sure want to delete an account?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(result => {
            if (result.value) {
                this.assetsServices.deleteAccountDetail(accountId)
                    .subscribe(data => {
                        const accIndex = this.accountList[accountType]['accounts'].findIndex(acc => acc.id === accountId);
                        // tslint:disable-next-line:max-line-length
                        this.accountList[accountType]['totalAssetsSum'] = this.accountList[accountType]['totalAssetsSum'] - this.accountList[accountType]['accounts'][accIndex]['totalAssets'];
                        // tslint:disable-next-line:max-line-length
                        this.accountList[accountType]['totalLiabilitiesSum'] = this.accountList[accountType]['totalLiabilitiesSum'] - this.accountList[accountType]['accounts'][accIndex]['liabilityAmount'];
                        // tslint:disable-next-line:max-line-length
                        this.accountList[accountType]['totalSavingSum'] = this.accountList[accountType]['totalSavingSum'] - this.accountList[accountType]['accounts'][accIndex]['currentYearSavings'];

                        this.totalAssetsSum = this.totalAssetsSum - this.accountList[accountType]['accounts'][accIndex]['totalAssets'];
                        // tslint:disable-next-line:max-line-length
                        this.totalLiabilitySum = this.totalLiabilitySum - this.accountList[accountType]['accounts'][accIndex]['liabilityAmount'];
                        this.totalSavings = this.totalSavings - this.accountList[accountType]['accounts'][accIndex]['currentYearSavings'];
                        this.netTotal = this.totalAssetsSum - this.totalLiabilitySum;
                        this.accountList[accountType]['accounts'].splice(accIndex, 1);
                        Swal('Deleted!', 'Account has been deleted successfully.', 'success');
                    });
            }
        });
    }

    deleteHolding(accountType, assetId, accountId) {
        Swal({
            title: 'Are you sure want to delete holiding?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(result => {
            if (result.value) {
                this.assetsServices.deleteAccountHolding(assetId)
                    .subscribe(data => {
                        // tslint:disable-next-line:max-line-length
                        this.accountList[accountType]['accounts'][accountId]['totalAssets'] = this.accountList[accountType]['accounts'][accountId]['totalAssets'] - this.accountList[accountType]['accounts'][accountId]['assetList'][assetId]['fmv'];
                        this.totalAssetsSum = this.totalAssetsSum - this.accountList[accountType]['accounts'][accountId]['assetList'][assetId]['fmv'];
                        // tslint:disable-next-line:max-line-length
                        this.accountList[accountType]['totalAssetsSum'] = this.accountList[accountType]['totalAssetsSum'] - this.accountList[accountType]['accounts'][accountId]['assetList'][assetId]['fmv'];
                        this.netTotal = this.totalAssetsSum - this.totalLiabilitySum;
                        this.accountList[accountType]['accounts'][accountId]['assetList'].splice(assetId, 1);
                        Swal('Deleted!', 'Holding has been deleted successfully.', 'success');
                        if (this.accountList[accountType]['accounts'][accountId]['assetList'].length === 0) {
                            this.allAssetsDeleted = true;
                        }
                    });
            }
        });
    }

    totalAccountsAssets(value: number, accountType, index) {
        const oldTotalAssetsSum = this.accountList[accountType]['totalAssetsSum'];
        this.accountList[accountType]['accounts'][index]['totalAssets'] = value;
        // tslint:disable-next-line:radix
        this.accountList[accountType]['totalAssetsSum'] = this.accountList[accountType]['accounts'].reduce((sum, account) => sum + parseFloat(account.totalAssets), 0);
        this.totalAssetsSum = (this.totalAssetsSum - oldTotalAssetsSum) + this.accountList[accountType]['totalAssetsSum'];
        this.netTotal = this.totalAssetsSum - this.totalLiabilitySum;
    }

    totalLiabilities(value: number, accountType, index) {
        const oldTotalLiabilitiesSum = this.accountList[accountType]['totalLiabilitiesSum'];
        this.accountList[accountType]['accounts'][index]['liabilityAmount'] = value;
        // tslint:disable-next-line:radix
        this.accountList[accountType]['totalLiabilitiesSum'] = this.accountList[accountType]['accounts'].reduce((sum, account) => sum + parseFloat(account.liabilityAmount), 0);
        this.totalLiabilitySum = (this.totalLiabilitySum - oldTotalLiabilitiesSum) + this.accountList[accountType]['totalLiabilitiesSum'];
        this.netTotal = this.totalAssetsSum - this.totalLiabilitySum;
    }

    transformAmount(element, accType, index) {
        if (typeof (element.target.value) !== 'number') {
            this.formattedAmount = this.currencyPipe.transform(this.accountList[accType]['accounts'][index]['totalAssets'], 'CAD', 'symbol-narrow', '1.2-2');
            element.target.value = this.formattedAmount;
        }
    }

    removeCurrencyPipeFormat(element) {
        if (element.target.value.indexOf('$') !== -1) {
            element.target.value = element.target.value.replace(/[$,]/g, '');
        }
    }
}
