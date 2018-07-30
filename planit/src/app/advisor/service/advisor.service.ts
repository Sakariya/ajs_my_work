import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable, DebugElement } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import {
    SetAdvisorWorkflow,
    SetBehaviouralRiskTolerance,
    SetAdvisorNetworthInvesment,
    SetAdvisorTaskNotification,
    SetAdvisorDemographic,
    SetAdvisorSuitability
} from '../../shared/app.actions';

import {
    AppState,
    getBehaviouralRiskTolerancePayLoad,
    getIsAdvisorNetworthInvestmentLoaded,
    getIsAdvisorDemographicLoaded
} from '../../shared/app.reducer';

@Injectable()
export class AdvisorService {

    constructor(
        private http: HttpClient,
        private store: Store<AppState>
    ) { }

    getWorkFlowPayload(period: number): Observable<any> {
        return this.http.get('/goal/summary?period=' + period)
            .map(response => <any>response);
    }

    getClientList(searchString: string, viewBy: string, pageSize: number, pageNum: number): Observable<any> {
        return this.http.get('/client?searchString=' + searchString + '&viewBy=' + viewBy + '&pageSize=' + pageSize + '&pageNum=' + pageNum)
            .map(response => <any>response);
    }

    getBehaviouralRiskTolerance(ristGroup: string, period: number): Observable<any> {
        return this.http.get('/risk/summary?riskType=' + ristGroup + '&period=' + period)
            .map(response => <any>response);
    }

    getAdvisorTaskNotification(familyId: string, type: string, pageSize: number, pageNum: number): Observable<any> {
        return this.http
            .get('/messages?familyId=' + familyId + '&type=' + type + '&pageSize=' + pageSize + '&pageNum=' + pageNum, {})
            .map(response => {
                this.store.dispatch(new SetAdvisorTaskNotification(response));
                return <any>response;
            });
    }

    // collaboration?familyId=FAMILYID&type=DOC&type=RISKKYC&type=RISK&viewBy=MOSTRECENT&pageSize=10&pageNum=2
    getAdvisorCollaboration(familyId: string, type: string, viewBy: string, pageSize: number, pageNum: number): Observable<any>  {
        return this.http
            // tslint:disable-next-line:max-line-length
            .get('/collaboration?familyId=' + familyId + '&type=' + type + '&type=RISKKYC&type=RISK&viewBy=' + viewBy + '&pageSize=' + pageSize + '&pageNum=' + pageNum, {})
            .map(response => {
                return <any>response;
            });
    }

    getAdvisorSuitabilitySummaryPayload(currency: string): Observable<any> {
        return this.http
            .get('/suitability/summary?currencyCode=' + currency, {})
            .map(response => {
                this.store.dispatch(new SetAdvisorSuitability(response));
                return <any>response;
            });
    }

    getAdvisorNetworthInvestmentPayload(currency: string): Observable<any> {
        return this.http
            .get('/accounts/summary?currency=' + currency, {})
            .map(response => {
                this.storeAdvisorNetworthInvestmentReducer(response);
                return <any>response;
            });
    }

    // Advisor networth investment reducer
    private storeAdvisorNetworthInvestmentReducer(data) {
        this.store
            .select(getIsAdvisorNetworthInvestmentLoaded)
            .pipe(take(1))
            .subscribe(loaded => {
                data['accountTypeTotal'] = this.totalInvestment(data);
                data['assetCategoryTotal'] = this.assetCategoryTotal(data)['assetCategorySum'];
                data['categoryRollup'] = this.assetCategoryTotal(data)['categoryRollup'];
                data['totalManageNonManage'] = data.totalManaged + data.totalNonManaged;
                data['totalPlanUnplan'] = data.totalPlanned + data.totalUnPlanned;
                this.store.dispatch(new SetAdvisorNetworthInvesment(data));
            });
    }

    private totalInvestment(investment): number {
        return investment.accountTypeRollup.reduce((sum, item) => sum + item.amount, 0);
    }

    private assetCategoryTotal(data): any {
        const categoryRollup = [];
        let assetCategorySum = 0;
        for (const key in data.assetCategoryRollup) {
            if (data.assetCategoryRollup.hasOwnProperty(key)) {
                assetCategorySum += data.assetCategoryRollup[key];
                categoryRollup.push(
                    {
                        item: key,
                        value: data.assetCategoryRollup[key],
                        colour: this.getColorByColumnKey(key),
                        itemLabel: this.getItemLabelByColumnKey(key)
                    }
                );
            }
        }
        return { categoryRollup: categoryRollup, assetCategorySum: assetCategorySum };
    }

    private getColorByColumnKey(key: string): string {
        switch (key) {
            case 'CASH':
                return 'mauve';
            case 'FIXED_INCOME':
                return 'green';
            case 'EQUITY':
                return 'cyan';
        }
    }

    private getItemLabelByColumnKey(key: string): string {
        switch (key) {
            case 'CASH':
                return 'Cash';
            case 'FIXED_INCOME':
                return 'Fixed income';
            case 'EQUITY':
                return 'Equity';
        }
    }

    getAdvisorDemographics(): Observable<any> {
        return this.http
            .get('/client/demographics')
            .map(response => {
                this.store.dispatch(new SetAdvisorDemographic(response));
                return <any>response;
            });
    }

    getAdvisorDocument(viewBy: string, pageSize: number, pageNum: number): Observable<any> {
        return this.http.get('/document?&viewBy=' + viewBy + '&pageSize=' + pageSize + '&pageNum=' + pageNum)
            .map(response => <any>response);
    }
}
