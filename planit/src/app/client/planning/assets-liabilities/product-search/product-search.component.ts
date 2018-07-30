import { Component, OnInit, ViewChild } from '@angular/core';
import { slideInOutAnimation } from '../../../../shared/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanningService } from '../../../service';
import { Store } from '@ngrx/store';
import { AppState, getIsUtilityProductSearchLoaded, getUtilityProductSearchPayload, getIsFavouriteListLoaded, getFavouriteListPayload } from '../../../../shared/app.reducer';
import { SetUtilityProductSearch, SetFavouriteList } from '../../../../shared/app.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/components/common/api';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
@Component({
    selector: 'app-product-search',
    templateUrl: './product-search.component.html',
    styleUrls: ['./product-search.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class ProductSearchComponent implements OnInit {
    clientId;
    accountId;
    loading = false;
    assetId;
    isAdvancedSearch = false;
    currency;
    productType;
    country;
    accountDetail;
    favourites;
    assetClass;
    favouritesByProduct;
    favouritModel: any = {};
    productId;
    msgs = [];
    // @ViewChild('f') addFavouritForm: FormGroup;
    searchModel: any =
        {
            searchString: '',
            productType: {},
            currency: {},
            country: {},
            favourites: {},
            assetClass: {}
        };
    productsSearch;
    productList;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private planningService: PlanningService,
        private store: Store<AppState>,
        private modalService: NgbModal,
        public translate: TranslateService,
        private _location: Location) { }

    ngOnInit() {
        this.route.parent.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        if (!this.clientId) {
            this.route.parent.parent.parent.parent.params.subscribe(params => {
                this.clientId = params['clientId'];
            });
        }
        this.route.parent.params.subscribe(params => {
            this.accountId = params['accountId'];
        });
        if (!this.accountId) {
            this.accountId = this.route.snapshot.params['accountId'];
        }
        this.assetId = this.route.snapshot.params['assetId'];
        this.getAccountSummaryByAccount();
        this.store.select(getIsFavouriteListLoaded).subscribe(loaded => {
            if (!loaded) {
                this.getFavouriteList();
            } else {
                this.store.select(getFavouriteListPayload).subscribe(result => {
                    if (result) {
                        this.favourites = result;
                    }
                });
            }
        });
    }
    private getAccountSummaryByAccount() {
        this.planningService.getAccountSummaryByAccountType(this.clientId)
            .subscribe(data => {
                this.accountDetail = data.filter(x => x.id === this.accountId)[0];
            });
    }
    back() {
        this._location.back();
    }
    addCustom() {
        this.planningService.addCustomAsset({ id: 'CUSTOM', value: '' });
        this.router.navigate(['/client/' + this.clientId + '/planning/assets-liabilities/' + this.accountId + '/holding-account']);
    }
    addCustomByProduct(productDetail) {
        if (productDetail.prdSubDetails.length > 1) {

            if (!productDetail.selectedProductCode) {
                this.translate.get(['ALERT_MESSAGE.ERROR_TITLE', 'ASSET_LIABILITY.PRODUCT_SEARCH.SELECT_PRODUCT_CODE_WARNING'])
                    .subscribe((res: string) => {
                        Swal(res['ALERT_MESSAGE.ERROR_TITLE'], res['ASSET_LIABILITY.PRODUCT_SEARCH.SELECT_PRODUCT_CODE_WARNING'], 'error');
                    });
                return;
            }
            productDetail.assetDetilas.productCode = productDetail.selectedProductCode.prod_code;
        } else {
            productDetail.assetDetilas.productCode = productDetail.prdSubDetails[0].prod_code;
        }
        if (this.assetId) {
            this.planningService.addCustomAsset({ id: 'RELINK', value: this.assetId, productDetail: productDetail });
        } else {
            this.planningService.addCustomAsset({ id: 'RELINK', value: '', productDetail: productDetail });
        }
        this.router.navigate(['/client/' + this.clientId + '/planning/assets-liabilities/' + this.accountId + '/holding-account']);
    }
    getProductSearch() {
        // const  productSearchParam = null;
        const productSearchParam = {
            description: this.searchModel.searchString ? this.searchModel.searchString : null,
            prod_type: this.searchModel.productType.id ? this.searchModel.productType.id : null,
            assetDesc_e: this.searchModel.assetClass.desc_e ? this.searchModel.assetClass.desc_e : null,
            favdescr: this.searchModel.favourites.descr ? this.searchModel.favourites.descr : null,
            curcode: this.searchModel.currency.isoCode ? this.searchModel.currency.isoCode : null,
            country: this.searchModel.country.countryCode ? this.searchModel.country.countryCode : null
        };
        this.planningService.getProductSearch(productSearchParam).subscribe(result => {
            this.productList = result;
        });
    }
    // for get all drop down list data
    getProductSearchUtility() {
        this.store.select(getIsUtilityProductSearchLoaded).subscribe(loaded => {
            if (!loaded) {
                this.planningService.getProductSearchUtility().subscribe(result => {
                    this.store.dispatch(new SetUtilityProductSearch(result));
                    this.productType = result[0];
                    this.currency = result[1];
                    this.country = result[2];
                    this.assetClass = result[3];
                    this.searchModel.productType = this.productType[0];
                    this.searchModel.currency = this.currency[0];
                    this.searchModel.country = this.country[0];
                    this.searchModel.assetClass = this.assetClass[0];
                });
            } else {
                this.store.select(getUtilityProductSearchPayload).subscribe(result => {
                    if (result) {
                        this.productType = result[0];
                        this.currency = result[1];
                        this.country = result[2];
                        this.assetClass = result[3];
                        this.searchModel.productType = this.productType[0];
                        this.searchModel.currency = this.currency[0];
                        this.searchModel.country = this.country[0];
                        this.searchModel.assetClass = this.assetClass[0];
                    }
                });
            }
        });
    }
    getFavouriteList() {
        this.planningService.getFavouriteList().subscribe(result => {
            this.store.dispatch(new SetFavouriteList(result));
            this.favourites = result;
        });
    }
    AddFavourites(content, product) {
        this.msgs = [];
        this.favouritesByProduct = null;
        this.favouritModel = null;
        if (product.selectedProductCode) {
            this.productId = product.selectedProductCode;
            this.favouritesByProduct = product.selectedProductCode.favlistDetails;
        } else {
            this.productId = product.prdSubDetails[0];
            this.favouritesByProduct = product.prdSubDetails[0].favlistDetails;
        }

        this.modalService.open(content).result.then(
            (closeResult) => {
                // modal close
            },
        );
    }
    removeProductFavrouit(productId, favouriteId) {
        this.msgs = [];
        this.translate.get(['ALERT_MESSAGE.CONFIRM_BUTTON_TEXT', 'ALERT_MESSAGE.WARNING_MESSAGE', 'ASSET_LIABILITY.PRODUCT_SEARCH.DELETED_FROM_FAVOURITE_WARNING'])
            .subscribe((ressult: string) => {
                Swal({
                    title: ressult['ASSET_LIABILITY.PRODUCT_SEARCH.DELETED_FROM_FAVOURITE_WARNING'],
                    // text: ressult['ALERT_MESSAGE.WARNING_MESSAGE'],
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: ressult['ALERT_MESSAGE.CONFIRM_BUTTON_TEXT'],
                }).then(result => {
                    if (result.value) {
                        this.planningService.deleteProductFavourite(productId.prodnum, favouriteId)
                            .subscribe(data => {
                                this.favouritesByProduct.splice(this.favouritesByProduct.findIndex(e => e.favlistkey === favouriteId), 1);
                                if (this.productId.favlistDetails.length <= 0) {
                                    this.productId.favlistDetails = null;
                                }
                                this.translate.get(['ALERT_MESSAGE.SUCCESS_DELETED_TITLE', 'ASSET_LIABILITY.PRODUCT_SEARCH.DELETED_FROM_FAVOURITE_MESSAGE'])
                                    .subscribe((res: string) => {
                                        this.msgs.push({
                                            severity: 'success', summary: res['ALERT_MESSAGE.SUCCESS_DELETED_TITLE'],
                                            detail: res['ASSET_LIABILITY.PRODUCT_SEARCH.DELETED_FROM_FAVOURITE_MESSAGE']
                                        });
                                    });
                            });
                    }
                });
            });
    }
    addProductFavourite(addFavouritForm: NgForm) {
        this.msgs = [];
        if (this.favouritesByProduct) {
            const existFavourit = this.favouritesByProduct.filter(
                fav => fav.favlistkey === this.favouritModel.favlistkey);
            if (existFavourit.length > 0) {
                this.translate.get(['ALERT_MESSAGE.SUCCESS_TITLE', 'ASSET_LIABILITY.PRODUCT_SEARCH.EXIST_FAVOURITE_MESSAGE'])
                    .subscribe((res: string) => {
                        this.msgs.push({ severity: 'error', summary: res['ALERT_MESSAGE.ERROR_TITLE'], detail: res['ASSET_LIABILITY.PRODUCT_SEARCH.EXIST_FAVOURITE_MESSAGE'] });
                    });
                return;
            }
        }
        const productId = this.productId;
        this.planningService.addProductFavourite(productId.prodnum, this.favouritModel.favlistkey)
            .subscribe(data => {
                // get favourit after add
                if (this.favouritesByProduct) {
                    this.favouritesByProduct.push(this.favouritModel);
                } else {
                    this.favouritesByProduct = [];
                    this.favouritesByProduct.push(this.favouritModel);
                }
                if (this.productId.favlistDetails) {
                    const existProduct = this.productId.favlistDetails.filter(x => x.favlistkey === this.favouritModel.favlistkey);
                    if (existProduct <= 0) {
                        this.productId.favlistDetails.push(this.favouritModel);
                    }
                } else {
                    this.productId.favlistDetails = [];
                    this.productId.favlistDetails.push(this.favouritModel);
                }

                // this.productId.favlistDetails
                this.favouritModel = {};
                addFavouritForm.resetForm();
                this.translate.get(['ALERT_MESSAGE.SUCCESS_TITLE', 'ASSET_LIABILITY.PRODUCT_SEARCH.ADD_FAVOURITE_MESSAGE'])
                    .subscribe((res: string) => {
                        this.msgs.push({ severity: 'success', summary: res['ALERT_MESSAGE.SUCCESS_TITLE'], detail: res['ASSET_LIABILITY.PRODUCT_SEARCH.ADD_FAVOURITE_MESSAGE'] });
                    });
            });
    }
    productCodeSelect(event, productDetail) {
        productDetail.selectedProductCode = event;
    }
}
