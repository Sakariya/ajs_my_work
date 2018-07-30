import { AmChartsService } from '@amcharts/amcharts3-angular';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { pieChartArray } from '../../../../client-models/portfolio-charts';

@Component({
    selector: 'app-allocation',
    templateUrl: './allocation.component.html',
    styleUrls: ['./allocation.component.css']
})
export class AllocationComponent implements OnInit, OnChanges {
    @Input() public clientId;
    @Input() public portfolioId;
    @Input() public isEditableRoute;
    @Input() public allocationResponse;
    @Input() public currentCashPercent;
    public graphColors = ['#77AAFF', '#66CCEE', '#AADD55', '#FFAA22', '#FF6644', '#FF44AA', '#CC77FF', '#CC99AA'];

    constructor(
        private AmCharts: AmChartsService
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes) {
        if (changes.allocationResponse) {
            this.changeAllocationDetail(changes.allocationResponse.currentValue);
        }
    }

    changeAllocationDetail(allocationResponse) {
        const currentDataProvider = [];
        const tragetDataProvider = [];
        allocationResponse.allocations.forEach(alloca => {
            currentDataProvider.push({ category: alloca.id, percent: alloca.standardDeviation });
            tragetDataProvider.push({ category: alloca.id, percent: alloca.suggestedPercent });
        });
        this.drawGraph('currentPieChart', currentDataProvider, allocationResponse.currentSummary.rateOfReturn, allocationResponse.currentSummary.risk);
        this.drawGraph('targetPieChart', tragetDataProvider, allocationResponse.suggestedSummary.rateOfReturn, allocationResponse.suggestedSummary.risk);
    }

    drawGraph(chartId, dataProvider, rateOfReturn, risk) {
        const pieChart = {
            ...pieChartArray,
            allLabels: [
                {
                    text: 'Return ' + rateOfReturn + '%',
                    align: 'center',
                    bold: false,
                    size: 14,
                    color: '#345',
                    y: 80,
                    id: 'text1'
                },
                {
                    text: 'Risk ' + risk + '%',
                    align: 'center',
                    bold: false,
                    y: 100,
                    color: '#345',
                    size: 14,
                    id: 'text2'
                }
            ],
            balloonText: '[[category]] [[percent]]%',
            titleField: 'category',
            valueField: 'percent',
            colors: this.graphColors,
            dataProvider: dataProvider,
        };
        this.AmCharts.makeChart(chartId, pieChart);
    }

}
