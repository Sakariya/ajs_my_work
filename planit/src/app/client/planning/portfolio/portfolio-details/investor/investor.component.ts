import * as $ from 'jquery';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { StackedBarChartService } from '../../../../../shared/chart/stacked-bar-chart.service';
import { Component, OnInit, HostListener, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { riskScoreBadge } from '../../../../client-models/risk-group';

@Component({
    selector: 'app-investor',
    templateUrl: './investor.component.html',
    styleUrls: ['./investor.component.css']
})
export class InvestorComponent implements OnInit, OnChanges {
    @Input() public clientId;
    @Input() public portfolioId;
    @Input() public isEditableRoute;
    @Input() public portfolioDetailResponse;
    @Output() public decisionMakerChanged = new EventEmitter();
    public decisionMaker = 'CLIENT';
    public totalInvested;
    chartColor = ['#3b6cb8', '#779afc', '#779afc', '#CCDDAA'];

    constructor(
        private AmCharts: AmChartsService,
        private stackedBarChart: StackedBarChartService
    ) { }

    ngOnInit() {
        this.decisionMakerChanged.emit(this.decisionMaker);
    }

    ngOnChanges(changes) {
        if (changes.portfolioDetailResponse) {
            this.invstorsProgressChart(changes.portfolioDetailResponse.currentValue.ownership);
            this.totalInvested = changes.portfolioDetailResponse.currentValue.ownership.reduce((sum, invstor) => sum + invstor.invested, 0);
        }
    }

    getRiskBadge(score) {
        return riskScoreBadge(score);
    }

    changeDecisionMaker(event) {
        this.decisionMakerChanged.emit(event);
    }

    private invstorsProgressChart(response) {
        const graphsData = [];
        const dataProvider = [{
            accounttype: 1
        }];
        response.forEach((res, index) => {
            const key = res.investor.id.toLowerCase();
            dataProvider[0][key] = res.percent;
            graphsData.push({
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.chartColor[index],
                lineColor: '#FFFFFF',
                title: res.investor.id,
                type: 'column',
                color: '#000000',
                valueField: res.investor.id.toLowerCase(),
                fixedColumnWidth: 11
            });
        });
        this.AmCharts.makeChart(
            'investorChart',
            this.stackedBarChart.commonOption(dataProvider, graphsData)
        );
    }

}
