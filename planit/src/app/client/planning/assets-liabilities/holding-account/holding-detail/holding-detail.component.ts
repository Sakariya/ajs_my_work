import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { PlanningService } from '../../../../service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SetUtilityAssetLiabilityDetails } from '../../../../../shared/app.actions';
import {
    AppState,
    getIsUtilityAssetLiabilityDetailsLoaded,
    getUtilityAssetLiabilityDetailsPayload
} from '../../../../../shared/app.reducer';

@Component({
    selector: 'app-holding-detail',
    templateUrl: './holding-detail.component.html',
    styleUrls: ['./holding-detail.component.css']
})

export class HoldingDetailComponent implements OnInit {
    @Input() assetLiabilityDetail;
    @Input() linkedClientAccount;
    @Output() Change = new EventEmitter();
    loantype;
    frequency;
    paymenttype;
    currency;
    productType;
    isExpand;
    expandId;
    totalBreakDown = 0;
    loading = false;
    regexString = /\D/g;
    public numberMask = {
        prefix: '$',
        thousands: ',',
        decimal: '.'
    };

    public percentMask = {
        align: 'left',
        prefix: '',
        suffix: '%',
        decimal: '.'
    };

    constructor(
        private planningService: PlanningService,
        private store: Store<AppState>,
        public translate: TranslateService
    ) { }

    ngOnInit() {
        this.totalAllocation();
        this.assetLiabilityDetail.asOfDate = !this.assetLiabilityDetail.asOfDate ? new Date(this.assetLiabilityDetail.asOfDate) : new Date();
        this.assetLiabilityDetail.liability.inceptionDate = this.assetLiabilityDetail.liability.inceptionDate ? new Date(this.assetLiabilityDetail.liability.inceptionDate) : new Date();
        this.assetLiabilityDetail.liability.renewalDate = this.assetLiabilityDetail.liability.renewalDate ? new Date(this.assetLiabilityDetail.liability.renewalDate) : new Date();
        this.store.select(getIsUtilityAssetLiabilityDetailsLoaded).subscribe(loaded => {
            if (!loaded) {
                this.planningService.getUtilityAssetLiabilityDetails().subscribe(result => {
                    this.store.dispatch(new SetUtilityAssetLiabilityDetails(result));
                    this.loantype = result[0];
                    this.frequency = result[1];
                    this.paymenttype = result[2];
                    this.currency = result[3];
                    this.productType = result[4];
                    this.setDefault();
                });
            } else {
                this.store.select(getUtilityAssetLiabilityDetailsPayload).subscribe(result => {
                    this.loantype = result[0];
                    this.frequency = result[1];
                    this.paymenttype = result[2];
                    this.currency = result[3];
                    this.productType = result[4];
                    this.setDefault();
                });
            }
        });
    }
    setDefault() {
        if (this.assetLiabilityDetail.IsCustom) {
            this.assetLiabilityDetail.liability.compoundFrequency = this.frequency.filter(x => x.frequencyId === 1)[0];
            this.assetLiabilityDetail.liability.loantype = this.loantype.filter(x => x.loanTypeId === 0)[0];
            this.assetLiabilityDetail.liability.paymentType = this.paymenttype.filter(x => x.paymentTypeId === 0)[0];
            this.assetLiabilityDetail.liability.paymentFrequency = this.frequency.filter(x => x.frequencyId === 1)[0];
        } else {
            this.assetLiabilityDetail.liability.compoundFrequency = this.frequency.filter(x => x.frequencyId === this.assetLiabilityDetail.liability.compoundFrequency)[0];
            this.assetLiabilityDetail.liability.loantype = this.loantype.filter(x => x.loanTypeId === this.assetLiabilityDetail.liability.loanType)[0];
            this.assetLiabilityDetail.liability.paymentType = this.paymenttype.filter(x => x.paymentTypeId === this.assetLiabilityDetail.liability.paymentType)[0];
            this.assetLiabilityDetail.liability.paymentFrequency = this.frequency.filter(x => x.frequencyId === this.assetLiabilityDetail.liability.paymentFrequency)[0];
        }
    }
    collapseLiability(isDetailExpand, id) {
        $('#liability_' + id).toggle();
        this.assetLiabilityDetail.isDetailExpand = !isDetailExpand;
    }
    saveAssetAndLiabilityDetail() {
        if (this.assetLiabilityDetail.IsCustom) {
            this.totalAllocation();
            if (this.totalBreakDown !== 100) {
                this.translate.get(['ALERT_MESSAGE.ERROR_TITLE', 'ASSET_LIABILITY.HOLDING_ACCOUNT.ALLOCATION_BREAKDOWN_ERROR'])
                    .subscribe((res: string) => {
                        Swal(res['ALERT_MESSAGE.ERROR_TITLE'], res['ASSET_LIABILITY.HOLDING_ACCOUNT.ALLOCATION_BREAKDOWN_ERROR'], 'error');
                    });
                return;
            }
        }
        this.planningService.saveAssetAndLiabilityDetail(this.assetLiabilityDetail, this.assetLiabilityDetail.backOfficeId)
            .subscribe(result => {
                if (result) {
                    this.Change.emit();
                    this.translate.get(['ALERT_MESSAGE.SUCCESS_TITLE', 'ASSET_LIABILITY.HOLDING_ACCOUNT.SAVE_CHANGES_MESSAGE'])
                        .subscribe((res: string) => {
                            Swal(res['ALERT_MESSAGE.SUCCESS_TITLE'], res['ASSET_LIABILITY.HOLDING_ACCOUNT.SAVE_CHANGES_MESSAGE'],
                                'success');
                        });
                }
            });
    }
    totalAllocation() {
        this.totalBreakDown = 0;
        this.assetLiabilityDetail.assetsBreakdown.forEach(item => {
            this.totalBreakDown += parseFloat(item.allocationPercent);
        });
    }
}
