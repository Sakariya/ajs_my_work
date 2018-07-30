import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from '../../../service';

@Component({
    selector: 'app-rebalancing-summary',
    templateUrl: './rebalancing-summary.component.html',
    styleUrls: ['./rebalancing-summary.component.css']
})
export class RebalancingSummaryComponent implements OnInit {
    clientId;
    currencies;
    selectedCurrency;
    investmentStrategy;
    portfolioTypes = [{
        id: 'ALLPORTFOLIO',
        name: 'All Portfolios'
    }];
    selectedPortfolio = this.portfolioTypes[0];
    totalCurrentAllocation;
    totalModelWeighting;
    totalYourWeighting;
    rebalancingSummaries = [
        {
            assetClass: 'Cash',
            currentAllocation: {
                amount: 25000,
                percent: 25.0
            },
            modelWeighting: {
                amount: 5000,
                percent: 5.0
            },
            yourWeighting: {
                amount: 20000,
                percent: 16
            }
        },
        {
            assetClass: 'Short-term fixed income',
            currentAllocation: {
                amount: 25000,
                percent: 25.0
            },
            modelWeighting: {
                amount: 5000,
                percent: 5.0
            },
            yourWeighting: {
                amount: 25000,
                percent: 20
            }
        },
        {
            assetClass: 'Canadian equities',
            currentAllocation: {
                amount: 25000,
                percent: 25.0
            },
            modelWeighting: {
                amount: 50000,
                percent: 50.0
            },
            yourWeighting: {
                amount: 50000,
                percent: 40
            }
        },
        {
            assetClass: 'International equities',
            currentAllocation: {
                amount: 25000,
                percent: 25.0
            },
            modelWeighting: {
                amount: 40000,
                percent: 40.0
            },
            yourWeighting: {
                amount: 30000,
                percent: 24
            }
        }
    ];

    constructor(
        private route: ActivatedRoute,
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
            this.getTotalCurrentAllocation();
            this.getTotalModelWeighting();
            this.getTotalYourWeighting();
        });
    }

    getTotalCurrentAllocation() {
        this.totalCurrentAllocation = this.rebalancingSummaries.reduce((sum, reb) => sum + reb.currentAllocation.amount, 0);
    }

    getTotalModelWeighting() {
        this.totalModelWeighting = this.rebalancingSummaries.reduce((sum, reb) => sum + reb.modelWeighting.amount, 0);
    }

    getTotalYourWeighting() {
        this.totalYourWeighting = this.rebalancingSummaries.reduce((sum, reb) => sum + reb.yourWeighting.amount, 0);
    }

    getSelectedPortfolio(portfolio) {
        this.selectedPortfolio = portfolio;
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

}
