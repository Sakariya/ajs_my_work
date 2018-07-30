import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { slideInOutAnimation } from '../../../../shared/animations';
import * as $ from 'jquery';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { suitabilityChartArray, backTestChartArray, efficientFrontierCashArray, cashWedgeChartArray } from '../../../client-models';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { PlanningService } from '../../../service';
import { ActivatedRoute } from '@angular/router';
import { chartColors } from '../../../client-models/chart-colors';
import { pieChartArray } from '../../../client-models/portfolio-charts';
@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class AnalyticsComponent implements OnInit {
    // isexpand;
    @ViewChild('inprogress') public inprogress: NgbTooltip;
    isExpandSuitability;
    isExpandBack;
    isExpandAllocation;
    isExpandEfficient;
    isExpandCash;
    chart: AmChart;
    allocationDetails;
    totalBreakDown = 0;
    totalBreakDownAmt = 0;
    chartColors = chartColors;
    public cashGraphColors = ['#bd6', '#FC4', '#77aaff', '#f64'];
    cashWedge;
    clientId;
    portfolioId;
    chartType;
    constructor(private _location: Location,
        private amcharts: AmChartsService,
        private route: ActivatedRoute,
        private planningService: PlanningService) { }

    ngOnInit() {
        this.route.parent.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.route.params.subscribe(params => {
            this.portfolioId = params['portfolioId'];
        });
        if (!this.portfolioId) {
            this.route.parent.params.subscribe(params => {
                this.portfolioId = params['portfolioId'];
            });
        }
        this.chartType = this.route.snapshot.params['chartType'];
        this.cashWedge = [
            {
                allocationBreakdownId: 1,
                allocationBreakdown: 'Cash wedge',
                allocationPercent: 0,
                displayOrder: 0
            },
            {
                allocationBreakdownId: 2,
                allocationBreakdown: 'Illiquid ',
                allocationPercent: 50,
                displayOrder: 1
            },
            {
                allocationBreakdownId: 3,
                allocationBreakdown: 'Excess liquidity ',
                allocationPercent: 20,
                displayOrder: 2
            },
            {
                allocationBreakdownId: 4,
                allocationBreakdown: 'Additional liquidity needed',
                allocationPercent: 0,
                displayOrder: 3
            }];
        setTimeout(() => {
            this.drawChart();
        }, 200);
        this.getAllocationDetail();
        this.removeAccordionHref();
    }
    back() {
        this._location.back();
    }
    toggleAssetsList(toggleid) {
        $('#' + toggleid).toggle();
    }
    removeAccordionHref() {
        setTimeout(() => {
            $('.ui-accordion').find('a').each(function () {
                $(this).removeAttr('href');
            });
        }, 1000);
    }

    drawChart() {
        const backTestChart = {
            ...backTestChartArray,
            dataProvider: [{
                lineColor: '#ad5',
                date: 1,
                visits: 12,
                status: 'Rising',
                bullet: 'none'
            },
            {
                lineColor: '#f64',
                date: 2,
                visits: 22.7,
                status: 'Falling',
                bullet: 'round'
            },
            {
                lineColor: '#fc4',
                date: 3,
                visits: 10.5,
                status: 'Recovering',
                bullet: 'round'
            },
            {
                lineColor: '#ad5',
                date: 4,
                visits: 22.7,
                status: 'Rising',
                bullet: 'round'
            },
            {
                lineColor: '#ad5',
                date: 5,
                visits: 66.8,
                status: 'Rising ',
                bullet: 'none'
            },
            ]
        };
        this.amcharts.makeChart('suitabilityChartdiv', suitabilityChartArray);
        this.amcharts.makeChart('backTestChartdiv', backTestChart);
        this.amcharts.makeChart('efficientFrontierChartDiv', efficientFrontierCashArray);
        const cashWedgeArray = {
            ...cashWedgeChartArray,
            dataProvider: this.cashWedge,
            balloonText: '[[allocationBreakdown]] [[allocationPercent]]%',
            colors: this.cashGraphColors,
        };
        this.amcharts.makeChart('cashWedgeChartDiv', cashWedgeArray);

    }
    totalAllocation() {
        this.totalBreakDown = 0;
        this.totalBreakDownAmt = 0;
        this.allocationDetails.allocations.forEach(item => {
            if (this.chartType === 'current') {
                this.totalBreakDown += item.standardDeviation;
                this.totalBreakDownAmt += item.currentAmount;
            } else {
                this.totalBreakDown += item.suggestedPercent;
                this.totalBreakDownAmt += item.targetAmount;
            }
        });
    }
    getAllocationDetail() {
        this.planningService.getAllocationDetails(this.clientId, this.portfolioId)
            .subscribe(result => {
                if (result) {
                    this.allocationDetails = result;
                    setTimeout(() => {
                        this.drawAllocationGraphGraph();
                    }, 200);
                    this.totalAllocation();
                }
            });
    }
    drawAllocationGraphGraph() {
        let balloonText = '[[id]] [[standardDeviation]]%';
        let valueField = 'standardDeviation';
        let textReturn = this.allocationDetails.currentSummary.rateOfReturn;
        let textRisk = this.allocationDetails.currentSummary.rateOfReturn;
        if (this.chartType === 'target') {
            balloonText = '[[id]] [[suggestedPercent]]%';
            valueField = 'suggestedPercent';
            textReturn = this.allocationDetails.suggestedSummary.rateOfReturn;
            textRisk = this.allocationDetails.suggestedSummary.rateOfReturn;
        }
        const chartArray = {
            ...pieChartArray,
            balloonText: balloonText,
            dataProvider: this.allocationDetails.allocations,
            titleField: 'id',
            valueField: valueField,
            colors: chartColors,
            allLabels: [
                {
                    text: 'Return ' + textReturn + '%',
                    align: 'center',
                    bold: true,
                    size: 12,
                    color: '#345',
                    y: 80,
                    id: 'text1'
                },
                {
                    text: 'Risk ' + textRisk + '%',
                    align: 'center',
                    bold: true,
                    y: 100,
                    color: '#345',
                    size: 12,
                    id: 'text2'
                }]
        };
        this.amcharts.makeChart('allocationChartDiv', chartArray);
    }
}
