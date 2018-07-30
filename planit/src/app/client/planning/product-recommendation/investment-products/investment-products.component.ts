import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PlanningService } from '../../../service';
import { AppState } from '../../../../shared/app.reducer';
import * as $ from 'jquery';

@Component({
    selector: 'app-investment-products',
    templateUrl: './investment-products.component.html',
    styleUrls: ['./investment-products.component.css']
})
export class InvestmentProductsComponent implements OnInit {
    clientId;
    currencies;
    selectedCurrency;
    investmentStrategy;
    portfolioTypes = [{
        id: 'ALLPORTFOLIO',
        name: 'All Portfolios'
    }];
    selectedPortfolio = this.portfolioTypes[0];
    investmentProducts;
    totalCurrent;
    totalRecommended;

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private planningServices: PlanningService
    ) {
        this.route.parent.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {
        this.planningServices.getListOfPortfolios(this.clientId).subscribe(res => {
            res.portfolios.forEach(p => {
                this.portfolioTypes.push({ id: p.id, name: p.description });
            });
        });
        this.planningServices.getCurrencies().subscribe(response => {
            const cadIndex = response.findIndex(r => r.isoCode === 'CAD');
            this.selectedCurrency = response[cadIndex];
            this.currencies = response;
            this.getInvestmentProducts();
        });
    }

    getInvestmentProducts() {
        this.planningServices.getInvestmentProducts(this.clientId, this.selectedPortfolio.id, this.selectedCurrency.isoCode)
            .subscribe(products => {
                this.investmentProducts = products;
                this.getTotalCurrent();
                this.getTotalRecommended();
            });
    }

    getSelectedPortfolio(portfolio) {
        this.selectedPortfolio = portfolio;
        this.getInvestmentProducts();
        if (portfolio.id !== 'ALLPORTFOLIO') {
            this.planningServices.getPortfolioById(this.clientId, portfolio.id).subscribe(res => {
                this.investmentStrategy = res;
            });
        } else {
            this.investmentStrategy = null;
        }
    }

    getSelectedCurrency(currency) {
        this.selectedCurrency = currency;
    }

    getTotalCurrent() {
        this.totalCurrent = this.investmentProducts.reduce((sum, account) => sum + account.totalAssets, 0);
    }

    getTotalRecommended() {
        this.totalRecommended = this.investmentProducts.reduce((sum, account) => sum + account.totalAssets, 0);

    }

    changeProductAction(index: number) {
        if ($('#dropdownProductAction' + index).is(':visible')) {
            $('.dropdown-product-action').hide();
        } else {
            $('.dropdown-product-action').hide();
            $('#dropdownProductAction' + index).toggle();
        }
    }

}
