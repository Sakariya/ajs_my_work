import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from '../../../service';
import { riskScoreBadge } from '../../../client-models';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';

@Component({
    selector: 'app-portfolios-landing',
    templateUrl: './portfolios-landing.component.html',
    styleUrls: ['./portfolios-landing.component.css'],
    providers: [NgbTooltipConfig]
})

export class PortfoliosLandingComponent implements OnInit, OnDestroy {
    public clientId;
    public totalInvested;
    public moreDetailsArr = ['rateOfReturn', 'risk', 'sharpRation',  'fees'];
    public isCollapsed = true;
    public portfoliosData = [];
    public investmentSummary = [];
    public portfoliosDropDownArr = [];
    public totalca; totalsp; totalsd; totalrp; totalta; totalimp;
    public recommendedExist = false; suggestedExist = false;
    public allocationsData = []; currentSummary = []; suggestedSummary = []; recommendedSummary = [];
    public classesOptions = [
        { id: 1, name: 2 },
        { id: 2, name: 3 },
        { id: 3, name: 4 },
        { id: 4, name: 10 }
    ];
    public selectedClass = this.classesOptions[0];
    public viewBy = [
        { id: 1, name: 'Current' },
        { id: 2, name: 'Current-Policy Range' },
        { id: 3, name: 'Target-Policy Range' },
        { id: 4, name: 'Implemented-Policy Range' },
        { id: 5, name: 'Current-Target' },
        { id: 6, name: 'Current-Implemented' },
        { id: 7, name: 'Target-Implemented' },
    ];
    public selectedViewBy = this.viewBy[0];
    public groupPortfolios = [
        { id: 'PORTFOLIOGROUPID1', name: 'All Portfolios owned', type: 'group', totalInvested: 0 },
        { id: 'PORTFOLIOGROUPID2', name: 'All Personal Portfolios', type: 'group', totalInvested: 0 },
        { id: 'PORTFOLIOGROUPID3', name: 'All Corporate Portfolios', type: 'group', totalInvested: 0 },
        { id: 'PORTFOLIOGROUPID4', name: 'Other Portfolios', type: 'group', totalInvested: 0 }
    ];
    public selectedPortfolio = this.groupPortfolios[0];

    public graphData = {
        'currentData': [],
        'suggestedData': [],
        'recommendedData': [],
    };
    public currentChart: AmChart;
    public suggestedChart: AmChart;
    public recommendedChart: AmChart;
    public graphColors = ['#77AAFF', '#9999FF', '#66CCEE', '#CC77FF', '#55DDAA', '#FF44AA', '#AADD55', '#FF6644', '#DDDD44', '#FFAA22', '#FFCC44'];

    constructor(
        config: NgbTooltipConfig,
        private route: ActivatedRoute,
        private service: PlanningService,
        private AmCharts: AmChartsService
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        config.placement = 'bottom';
        config.triggers = 'click';
    }

    ngOnInit() {
        this.getPortfoliosData();
    }

    getPortfoliosData() {
        if (this.clientId != null) {
            this.service.getAllPortfoliosData(this.clientId).subscribe(result => {
                this.portfoliosData = result;
                setTimeout(() => {
                    for (let i = 0; i < this.portfoliosData.length; i++) {
                        this.portfoliosData[i]['totalInvested'] = this.portfoliosData[i]['portfolioDetails'].ownership.reduce((sum, investor) => sum + investor.invested, 0);
                    }
                    this.getPortfoliosDropdown();
                    this.getAllocationData();
                }, 1000);
            });
        }
    }

    getAllocationData() {
        if (this.clientId != null && this.selectedPortfolio) {
            if (this.selectedPortfolio.type === 'single') {
                this.service.getAllocationDetails(this.clientId, this.selectedPortfolio.id, this.selectedClass.id).subscribe(result => {
                    this.allocationsData = result['allocations'];
                    this.currentSummary = result['currentSummary'];
                    if (result['suggestedSummary']) {
                        this.suggestedSummary = result['suggestedSummary'];
                        this.suggestedExist = true;
                        if (result['recommendedSummary']) {
                            this.recommendedSummary = result['recommendedSummary'];
                            this.recommendedExist = true;
                        }
                    }
                    this.totalsd = 0;
                    this.totalca = 0;
                    this.totalsp = 0;
                    this.totalrp = 0;
                    this.totalta = 0;
                    this.totalimp = 0;
                    this.allocationsData.forEach(asset => {
                        asset.currentAmount = (asset.standardDeviation * this.selectedPortfolio.totalInvested) / 100;
                        asset.targetAmount = (asset.suggestedPercent * this.selectedPortfolio.totalInvested) / 100;
                        asset.implementedAmount = (asset.recommendedPercent * this.selectedPortfolio.totalInvested) / 100;
                        this.totalca += asset.currentAmount;
                        this.totalsd += asset.standardDeviation;
                        this.totalta += asset.targetAmount;
                        this.totalsp += asset.suggestedPercent;
                        this.totalimp += asset.implementedAmount;
                        this.totalrp += asset.recommendedPercent;

                        const minValue = (this.selectedPortfolio.totalInvested * asset.minimumRange) / 100;
                        const maxValue = (this.selectedPortfolio.totalInvested * asset.maximumRange) / 100;
                        if (asset.minimumRange > asset.standardDeviation) {
                            asset.currentOutOfRange = minValue - asset.currentAmount;
                        } else if (asset.maximumRange < asset.standardDeviation) {
                            asset.currentOutOfRange = maxValue - asset.currentAmount;
                        } else {
                            asset.currentOutOfRange = 0;
                        }

                        if (asset.minimumRange > asset.recommendedPercent) {
                            asset.implementedOutOfRange = minValue - asset.implementedAmount;
                        } else if (asset.maximumRange < asset.recommendedPercent) {
                            asset.implementedOutOfRange = maxValue - asset.implementedAmount;
                        } else {
                            asset.implementedOutOfRange = 0;
                        }
                    });
                    this.getIncomeDistrbution();
                    this.makeChart();
                });
            }
        }
    }

    makePositive(number) {
        return Math.abs(number);
    }

    getIncomeDistrbution() {
        this.investmentSummary = [];
        const len = this.currentSummary['incomeDistribution'].length;
        for (let i = 0; i < len; i++) {
            if (!this.recommendedExist && this.suggestedExist) {
                this.investmentSummary.push({
                    'id': this.currentSummary['incomeDistribution'][i]['id'],
                    'currentPercent': this.currentSummary['incomeDistribution'][i]['percent'],
                    'suggestedPercent': this.suggestedSummary['incomeDistribution'][i]['percent'],
                });
            } else if (!this.suggestedExist) {
                this.investmentSummary.push({
                    'id': this.currentSummary['incomeDistribution'][i]['id'],
                    'currentPercent': this.currentSummary['incomeDistribution'][i]['percent'],
                });
            } else {
                this.investmentSummary.push({
                    'id': this.currentSummary['incomeDistribution'][i]['id'],
                    'currentPercent': this.currentSummary['incomeDistribution'][i]['percent'],
                    'suggestedPercent': this.suggestedSummary['incomeDistribution'][i]['percent'],
                    'recommendedPercent': this.recommendedSummary['incomeDistribution'][i]['percent']
                });
            }
        }
    }

    getPortfoliosDropdown() {
        this.portfoliosDropDownArr = [];
        this.portfoliosData.forEach(portfolio => {
            this.portfoliosDropDownArr.push({ id: portfolio.id, name: portfolio.description, type: 'single', totalInvested: portfolio.totalInvested });
        });
        this.portfoliosDropDownArr = this.portfoliosDropDownArr.concat(this.groupPortfolios);
        this.selectedPortfolio = this.portfoliosDropDownArr[0];
    }

    getRiskBadge(score) {
        return riskScoreBadge(score);
    }

    changePortfolioOwnedAction(index: number) {
        if ($('#dropdownPortfolioOwnedAction' + index).is(':visible')) {
            $('.dropdown-portfolio-owned-action').hide();
        } else {
            $('.dropdown-portfolio-owned-action').hide();
            $('#dropdownPortfolioOwnedAction' + index).toggle();
        }
    }

    changePortfolioAction(index: number) {
        if ($('#dropdownPortfolioAction' + index).is(':visible')) {
            $('.dropdown-portfolio-action').hide();
        } else {
            $('.dropdown-portfolio-action').hide();
            $('#dropdownPortfolioAction' + index).toggle();
        }
    }

    changeView(value) {
        this.selectedViewBy = value;
        this.makeChart();
    }

    changeAssets(value) {
        this.selectedClass = value;
        this.getAllocationData();
    }

    makeDataProvider() {
        this.graphData.currentData = [];
        this.graphData.suggestedData = [];
        this.graphData.recommendedData = [];
        this.allocationsData.forEach(element => {
            this.graphData.currentData.push({
                category: element.id,
                percent: element.standardDeviation,
            });
            if (this.suggestedExist) {
                this.graphData.suggestedData.push({
                    category: element.id,
                    percent: element.suggestedPercent,
                });
            }
            if (this.recommendedExist) {
                this.graphData.recommendedData.push({
                    category: element.id,
                    percent: element.recommendedPercent,
                });
            }
        });
    }

    makeChart() {
        this.makeDataProvider();
        setTimeout(() => {
            this.currentChart = this.AmCharts.makeChart('chartdiv1',
                this.makeOptions(this.graphData.currentData, this.currentSummary['rateOfReturn'], this.currentSummary['risk']));
        }, 50);

        setTimeout(() => {
            this.suggestedChart = this.AmCharts.makeChart('chartdiv2',
                this.makeOptions(this.graphData.suggestedData, this.suggestedSummary['rateOfReturn'], this.suggestedSummary['risk']));
        }, 50);

        setTimeout(() => {
            this.recommendedChart = this.AmCharts.makeChart('chartdiv3',
                this.makeOptions(this.graphData.recommendedData,
                    this.recommendedSummary['rateOfReturn'], this.recommendedSummary['rateOfReturn']));
        }, 50);
    }

    makeOptions(dataProvider, rateOfReturn, risk) {
        return {
            'type': 'pie',
            'innerRadius': '70%',
            'precision': 2,
            'balloonText': '[[category]] [[percent]]%',
            'labelText': '',
            'startRadius': '0%',
            'colors': this.graphColors,
            'gradientRatio': [],
            'hoverAlpha': 0.64,
            'labelTickAlpha': 0,
            'outlineAlpha': 0,
            'startDuration': 0.8,
            'autoMargins': false,
            'marginLeft': 10,
            'marginRight': 10,
            'pullOutRadius': 0,
            'startEffect': 'easeOutSine',
            'titleField': 'category',
            'valueField': 'percent',
            'accessibleTitle': '',
            'theme': 'light',
            'listeners': [
                {
                    'event': 'rendered',
                    'method': this.handleRendered
                }
            ],
            'allLabels': [
                {
                    'text': 'Return ' + rateOfReturn + '%',
                    'align': 'center',
                    'bold': false,
                    'size': 14,
                    'color': '#345',
                    'y': 80,
                    'id': 'text1'
                },
                {
                    'text': 'Risk ' + risk + '%',
                    'align': 'center',
                    'bold': false,
                    'y': 100,
                    'color': '#345',
                    'size': 14,
                    'id': 'text2'
                }
            ],
            'balloon': {
                'offsetX': 0,
                'offsetY': 0
            },
            'titles': [],
            'dataProvider': dataProvider
        };
    }

    ngOnDestroy() {
        if (this.currentChart) {
            this.AmCharts.destroyChart(this.currentChart);
        }
        if (this.suggestedChart) {
            this.AmCharts.destroyChart(this.suggestedChart);
        }
        if (this.recommendedChart) {
            this.AmCharts.destroyChart(this.recommendedChart);
        }
    }

    handleRendered() {
        $('[font-family]').removeAttr('font-family');
    }

    delete(portfolioId) {
        Swal({
            title: 'Are you sure want to delete this portfolio?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(result => {
            if (result.value) {
                this.service.deleteSavings(portfolioId).subscribe(response => {
                    const saveIndex = this.portfoliosData.findIndex(p => p.id === portfolioId);
                    this.portfoliosData.splice(saveIndex, 1);
                    Swal('Deleted!', 'Portfolio has been deleted successfully.', 'success');
                });
            }
        });
    }
}
