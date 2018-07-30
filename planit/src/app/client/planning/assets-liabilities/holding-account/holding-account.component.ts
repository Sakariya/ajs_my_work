import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { PlanningService } from '../../../service';
import { Store } from '@ngrx/store';
import { AppState, getholdingAssetLiabilityPayload, getIsholdingAssetLiabilityLoaded } from '../../../../shared/app.reducer';
import { SetHoldingAssetLiability } from '../../../../shared/app.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetLiabilityDetail } from '../../../client-models/asset-liability-detail';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'app-holding-account',
    templateUrl: './holding-account.component.html',
    styleUrls: ['./holding-account.component.css']
})
export class HoldingAccountComponent implements OnInit {
    clientId;
    accountId;
    linkedClientAccount;
    expandId;
    itemList = [
        { id: 'DESCRIPTION', name: 'Description' },
        { id: 'ASSETTYPE', name: 'Asset type' },
        { id: 'MARKETVALUE', name: 'Market value' },
        { id: 'UNITS', name: 'Units' }
    ];
    defaultSelected = this.itemList[0];
    assetsDetail;
    holdingAssetLiability = [];
    total = 0;
    totalLiability = 0;
    currentLangulge;
    constructor(private planningService: PlanningService,
        private store: Store<AppState>,
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService
    ) {
    }

    ngOnInit() {
        // user service get product detail from product search panel
        this.planningService.getAddOrRelinkAsset().subscribe(param => {
            if (param) {
                if (param.id === 'CUSTOM') {
                    this.addCustom();
                }
                if (param.id === 'RELINK') {
                    if (param.value && param.value !== '') {
                        this.toggleAssetsList(param.value);
                        this.relinkProduct(param);
                    } else {
                        this.addCustomWithProduct(param.productDetail);
                    }
                }
            }
        });

        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.accountId = this.route.snapshot.params['accountId'];
        this.defaultSelected = { id: 'DESCRIPTION', name: 'Description' };
        this.total = 0;
        this.getHoldingsAsset();
        // this.store
        //     .select(getIsholdingAssetLiabilityLoaded)
        //     .subscribe(loaded => {
        //         if (!loaded) {
        //             this.getHoldingsAsset();
        //         } else {

        //             if (this.defaultSelected.id === 'DESCRIPTION') {
        //                 this.store.select(getholdingAssetLiabilityPayload).subscribe(data => {
        //                     if (data) {
        //                         this.linkedClientAccount = data.description;
        //                         this.holdingAssetLiability = data.assetList;
        //                         this.calculateTotal();
        //                     } else {
        //                         this.holdingAssetLiability = [];
        //                     }
        //                 });
        //             } else {
        //                 this.getHoldingsAsset();
        //             }
        //         }
        //     });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    calculateTotal() {
        this.total = 0;
        this.totalLiability = 0;
        this.holdingAssetLiability.forEach(item => {
            this.total = this.total + parseFloat(item.fmv);
            this.totalLiability = this.totalLiability + parseFloat(item.liability.currentBalance);
        });
    }
    async addCustom() {
        // temparory until api got
        const random = Math.floor(Math.random() * (0 - 1000));
        const AssetLiability = {
            ...AssetLiabilityDetail,
            // 'isExpand': true,
            'IsCustom': true,
            'backOfficeId': 'asset' + random,
            'liability': { 'backOfficeId': 'LIAB' + random },
        };
        this.holdingAssetLiability.push(AssetLiability);
        this.expand('asset' + random);
    }
    async addCustomWithProduct(productDetail) {
        const random = Math.floor(Math.random() * (0 - 1000));
        productDetail.assetDetilas.backOfficeId = 'asset' + random;
        productDetail.assetDetilas.liability.backOfficeId = 'LIAB' + random;
        this.holdingAssetLiability.push(productDetail.assetDetilas);
        this.expand('asset' + random);
    }
    relinkProduct(param) {
        const index = this.holdingAssetLiability.findIndex(e => e.backOfficeId === param.value);
        this.holdingAssetLiability[index] = param.productDetail.assetDetilas;
        this.expand(param.value);
    }
    getHoldingsAsset() {
        this.total = 0;
        this.totalLiability = 0;
        this.planningService.getHoldingsAsset(this.accountId, this.defaultSelected.name.toLowerCase()).subscribe(result => {
            this.store.dispatch(new SetHoldingAssetLiability(result));
            if (result) {
                this.holdingAssetLiability = result.assetList;
                this.linkedClientAccount = result.description;
                this.calculateTotal();
            } else {
                this.holdingAssetLiability = [];
            }
        });
    }
    public changeAssetAction(index: number) {
        if ($('#dropdownAssetsAction' + index).is(':visible')) {
            $('.dropdown-portfolio-action').hide();
        } else {
            $('.dropdown-portfolio-action').hide();
            $('#dropdownAssetsAction' + index).toggle();
        }
    }
    async expand(accountId) {
        setTimeout(() => {
            $('#expand_' + accountId).click();
            $(window).scrollTop($('#expand_' + accountId).offset().top);
        }, 300);
    }
    async toggleAssetsList(accountId) {
        await $('#assetList_' + accountId).toggle();
    }
    changeAccount(accountId) {
        this.accountId = accountId;
        // this.getHoldingsAsset();
        this.router.navigate(['/client/' + this.clientId + '/planning/assets-liabilities/' + accountId + '/holding-account']);
        this.getHoldingsAsset();
    }
    sortHolding(event) {
        this.defaultSelected = event;
        this.getHoldingsAsset();
    }
    deleteHolding(id: number, assetId) {
        this.translate.get(['ALERT_MESSAGE.WARNING_MESSAGE', 'ASSET_LIABILITY.HOLDING_ACCOUNT.HOLDING_DELETE_WARNING'])
            .subscribe((ressult: string) => {
                Swal({
                    title: ressult['ASSET_LIABILITY.HOLDING_ACCOUNT.HOLDING_DELETE_WARNING'],
                    text: ressult['ALERT_MESSAGE.WARNING_MESSAGE'],
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                }).then(result => {
                    if (result.value) {
                        this.planningService.deleteAccountHolding(assetId)
                            .subscribe(data => {
                                this.holdingAssetLiability.splice(id, 1);
                                this.translate.get(['ALERT_MESSAGE.SUCCESS_DELETED_TITLE', 'ASSET_LIABILITY.HOLDING_ACCOUNT.HOLDING_DELETED_MESSAGE'])
                                    .subscribe((res: string) => {
                                        Swal(res['ALERT_MESSAGE.SUCCESS_DELETED_TITLE'], res['ASSET_LIABILITY.HOLDING_ACCOUNT.HOLDING_DELETED_MESSAGE'],
                                            'success');
                                    });
                            });
                    }
                });
            });
    }
    SavedDetail(event) {
        this.calculateTotal();
    }
}
