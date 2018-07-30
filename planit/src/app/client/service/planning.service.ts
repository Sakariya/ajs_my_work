import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AppState, getFamilyMemberPayload } from '../../shared/app.reducer';
import { DomSanitizer } from '@angular/platform-browser';
import { ClientProfileService } from './profile.service';
import { PlanningSummary } from '../client-models';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class PlanningService {
    private addOrRelinkAsset = new Subject<any>();
    httpOptions = {
        headers: new HttpHeaders({
            'isLive': 'true'
        })
    };

    constructor(
        private http: HttpClient,
        private store: Store<AppState>,
        private sanitizer: DomSanitizer,
        private profileService: ClientProfileService
    ) { }

    addCustomAsset(param: any) {
        this.addOrRelinkAsset.next(param);
    }

    relinkAsset(param: any) {
        this.addOrRelinkAsset.next(param);
    }

    getAddOrRelinkAsset(): Observable<any> {
        return this.addOrRelinkAsset.asObservable();
    }

    getAllPortfoliosData(familyId: string): Observable<any> {
        return this.http.get('/client/' + familyId + '/portfolio').map(response => {
            response['portfolios'].forEach(portfolio => {
                this.getPortfoliosDetails(familyId, portfolio.id).
                    subscribe(result => {
                        portfolio['portfolioDetails'] = result[0];
                        portfolio['portfolioGoalSimulation'] = result[1];
                    });
                this.getPortfolioBadge(portfolio.id).subscribe(image => {
                    portfolio['badge'] = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(image));
                });
            });
            return response['portfolios'];
        });
    }

    getPortfoliosDetails(familyId: string, portfolioId: string): Observable<any> {
        return Observable.forkJoin(
            this.http.get('/client/' + familyId + '/portfolio/' + portfolioId + '?currency=CAD').map(response => <any>(<any>response)),
            this.http.get('/client/' + familyId + '/portfolio/' + portfolioId + '/goalSimulation').map(response => <any>(<any>response))
        );
    }

    getPortfolioBadge(portfolioId: string): Observable<Blob> {
        return this.http
            .get('/portfolio/badge?portfolio=' + portfolioId + '&type=CURRENT&image=true', { responseType: 'blob' });
    }

    getAllocationDetails(familyId: string, portfolioId: string, rollups?: any): Observable<any> {
        const rollupValue = (rollups && rollups !== '') ? '&rollup=' + rollups : '';
        return this.http
            .get('/client/' + familyId + '/portfolio/' + portfolioId + '/allocation?currency=CAD' + rollupValue)
            .map(response => <any>(<any>response));
    }

    getInvestmentProducts(clientId: string, portfolio: string, curcode: string): Observable<any> {
        return this.http.get('/accounts/' + clientId + '/potfolio?portfolio=' + portfolio + '&curcode=' + curcode);
    }

    getListOfPortfolios(clientId: string): Observable<any> {
        return this.http.get('/client/' + clientId + '/portfolio');
    }

    getLiveListOfPortfolios(clientId: string): Observable<any> {
        return this.http.get('/v30/client/' + clientId + '/portfolio', this.httpOptions);
    }

    getLinkedAccounts(clientId: string, portfolio: string): Observable<any> {
        return this.http.get('/accounts/' + clientId + '/potfolio?portfolio=' + portfolio);
    }

    getPortfolioById(clientId: string, portfolioId: string): Observable<any> {
        return this.http.get('/client/' + clientId + '/portfolio/' + portfolioId);
    }

    updatePortfolioByID(clientId: string, portfolioId: string, portfolioDetail): Observable<any> {
        return this.http.put('/client/' + clientId + '/portfolio/' + portfolioId, portfolioDetail)
            .map(response => <any>(<any>response));
    }

    getCurrencies(): Observable<any> {
        return this.http.get('/accounts/currency').map(response => <any>(<any>response));
    }

    getPlanningSummary(familyId: string): Observable<PlanningSummary> {
        return this.http.get('/plan/' + familyId + '/summary')
            .map(response => <any>(<PlanningSummary>response));
    }

    getAccountSummaryByAccountType(clientId: string, sortBy?: string): Observable<any> {
        const sortValue = (sortBy && sortBy !== '') ? '&sortBy=' + sortBy : '';
        return this.http.get('/accounts/' + clientId + '/summary?isExpanded=TRUE' + sortValue)
            .map(response => <any>(<any>response));
    }

    getAllAccountType(): Observable<any> {
        return this.http.get('/accounts/acctype')
            .map(response => <any>(<any>response));
    }

    getAccountTypeByID(accTypeID): Observable<any> {
        return this.http.get('/accounts/acctype/' + accTypeID).map(response => <any>(<any>response));
    }

    updateSummaryAccountDetail(clientId: string, accountData): Observable<any> {
        return this.http.put('/accounts/' + clientId + '/summaryaccountdetails', accountData)
            .map(response => <any>(<any>response));
    }

    updateAccountDetail(accountId, accountData): Observable<any> {
        return this.http.put('/accounts/' + accountId + '/updateaccount', accountData)
            .map(response => <any>(<any>response));
    }

    addAccountOnAssetsAndLiability(clientId: string, addAccountData): Observable<any> {
        return this.http.post('/accounts/' + clientId + '/add', addAccountData)
            .map(response => <any>(<any>response));
    }

    deleteAccountDetail(accountId): Observable<any> {
        return this.http.delete('/accounts/' + accountId)
            .map(response => <any>(<any>response));
    }

    addSavings(savingsData): Observable<any> {
        return this.http.post('/accounts/savings', savingsData).map(response => <any>(<any>response));
    }

    getGoalsLinkedToPortfolio(portfolioId: string): Observable<any> {
        return this.http.get('/goal?portfolio=' + portfolioId)
            .map(response => <any>(<any>response));
    }

    getHoldingsAsset(accountId: string, sortBy: string): Observable<any> {
        return this.http.get('/accounts/' + accountId + '/holdings?sortBy=' + sortBy)
            .map(response => <any>(<any>response));
    }

    getUtilityAssetLiabilityDetails(): Observable<any> {
        return Observable.forkJoin(
            this.http.get('/accounts/loantype').map(response => <any>(<any>response)),
            this.http.get('/accounts/frequency').map(response => <any>(<any>response)),
            this.http.get('/accounts/paymenttype').map(response => <any>(<any>response)),
            this.http.get('/accounts/currency').map(response => <any>(<any>response)),
            this.http.get('/accounts/producttype').map(response => <any>(<any>response))
        );
    }

    saveAssetAndLiabilityDetail(assetLiabilityDetail, clientId: string): Observable<String> {
        return this.http.post('/accounts/' + 'ACCOUNTID1' + '/holding', assetLiabilityDetail)
            .map((response: Response) => {
                return response;
            })
            .catch(error => Observable.throw(error));
    }

    getAllGoalsList(familyID: string): Observable<any> {
        return this.http.get('/goal/' + familyID + '/list').map(response => <any>(<any>response));
    }

    // Remove account api line with original
    deleteAccountHolding(holdingId): Observable<any> {
        return this.http.delete('/accounts/' + holdingId + '/holdings')
            .map(response => <any>(<any>response));
    }

    getProductSearchUtility(): Observable<any> {
        return Observable.forkJoin(
            this.http.get('/accounts/producttype').map(response => <any>(<any>response)),
            this.http.get('/accounts/currency').map(response => <any>(<any>response)),
            this.http.get('/accounts/countries').map(response => <any>(<any>response)),
            this.http.get('/accounts/assetclass').map(response => <any>(<any>response))
        );
    }

    getProductSearch(searchString): Observable<any> {
        return this.http.post('/accounts/products', searchString).map(response => <any>(<any>response));
    }

    getFavouriteList(): Observable<any> {
        return this.http.get('/accounts/favlist/USER').map(response => <any>(<any>response));
    }

    getSavingsDetails(familyId: string, sortBy?: string): Observable<any> {
        const sortValue = (sortBy && sortBy !== '') ? 'sortBy=' + sortBy + '&' : '';
        return this.http.get('/accounts/' + familyId + '/savings?' + sortValue + 'isExpanded=TRUE').map(response => <any>(<any>response));
    }

    getFavouriteListByProduct(productId): Observable<any> {
        return this.http.get('/accounts/prodfavlist/' + productId).map(response => <any>(<any>response));
    }

    addProductFavourite(productId, favouriteId): Observable<any> {
        // accounts/prodfavlist/PRODNUM1/FAV1
        return this.http.post('/accounts/prodfavlist/' + productId + '/' + favouriteId, null).map(response => <any>(<any>response));
    }

    deleteProductFavourite(productId, favouriteId): Observable<any> {
        return this.http.delete('/accounts/prodfavlist/' + productId + '/' + favouriteId)
            .map(response => <any>(<any>response));
    }

    getSavingsBySavingsId(savingsId): Observable<any> {
        return this.http.get('/accounts/' + savingsId + '/savingsdetail?isExpanded=TRUE').map(response => <any>(<any>response));

    }

    deleteSavings(savingId): Observable<any> {
        return this.http.delete('/accounts/' + savingId + '/savings').map(response => <any>(<any>response));
    }

    async processSavingsData(savingsData, clientId) {
        const familyMembers = <any>await this.profileService.getFamilyMembers(clientId).toPromise();
        const ownerList = [];
        familyMembers.forEach(member => {
            ownerList[member.id] = { initials: member.firstName[0] + member.lastName[0], birthYear: member.birthDate.split('-')[0], relation: member.relation };
        });

        await savingsData.forEach(element => {
            let array;
            element['linkedAccountDetails'].ownership.forEach(owner => {
                array = owner.externalKey.split('/');
                owner['birthYear'] = parseInt(ownerList[array[array.length - 1]]['birthYear'], 10);
                owner['initials'] = ownerList[array[array.length - 1]]['initials'];
                owner['relation'] = ownerList[array[array.length - 1]]['relation'];
            });
        });
        return savingsData;
    }

    getListOfFrequency(): Observable<any> {
        return this.http.get('/accounts/frequency').map(response => <any>(<any>response));
    }

    updateSavings(savingsId, savingsData): Observable<any> {
        return this.http.put('/accounts/' + savingsId + '/savings', savingsData).map(response => <any>(<any>response));
    }

    deleteTier(savingId): Observable<any> {
        return this.http.delete('/accounts/' + savingId + '/savings/tier').map(response => <any>(<any>response));
    }
    saveEditPolicy(familyId: string, portfolioId: string, allocationDetail: any): Observable<String> {
        return this.http.post('/client/' + familyId + '/portfolio/' + portfolioId + '/allocation', allocationDetail)
            .map((response: Response) => {
                return response;
            })
            .catch(error => Observable.throw(error));
    }
}
