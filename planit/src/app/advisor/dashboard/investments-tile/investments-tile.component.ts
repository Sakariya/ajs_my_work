import { StackedBarChartService } from '../../../shared/chart/stacked-bar-chart.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { AdvisorService } from '../../service/advisor.service';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import {
    AppState,
    getIsAdvisorNetworthInvestmentLoaded,
    getAdvisorNetworthInvestmentPayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-investments-tile',
    templateUrl: './investments-tile.component.html',
    styleUrls: ['./investments-tile.component.css']
})
export class InvestmentsTileComponent implements OnInit {

    public investment: any;
    public allocationDataProvider = [];
    public allocationGraphsData = [];
    public manageDataProvider = [];
    public manageGraphsData = [];
    public plannedDataProvider = [];
    public plannedGraphsData = [];
    chartColor = ['#99f', '#bd6', '#66CCEE'];

    constructor(
        private store: Store<AppState>,
        private advisorService: AdvisorService,
        private AmCharts: AmChartsService,
        private stackedBarChart: StackedBarChartService
    ) { }

    ngOnInit() {
        this.store
            .select(getIsAdvisorNetworthInvestmentLoaded)
            .subscribe((loaded: boolean) => {
                if (!loaded) {
                    this.advisorService.getAdvisorNetworthInvestmentPayload('CAD').subscribe(data => {
                        this.investment = data;
                        setTimeout(() => {
                            this.allocationProgressChart(data);
                            this.manageProgressChart(data);
                            this.plannedProgressChart(data);
                        }, 100);
                    });
                } else {
                    this.store
                        .select(getAdvisorNetworthInvestmentPayload)
                        .subscribe(data => {
                            this.investment = data;
                            setTimeout(() => {
                                this.allocationProgressChart(data);
                                this.manageProgressChart(data);
                                this.plannedProgressChart(data);
                            }, 100);
                        });
                }
            });
    }

    @HostListener('window:resize') onResize() {
        // guard against resize before view is rendered
        const advisorWidth = $('#advisor_dashboard').width();
        if ($(window).width() < 976) {
            $('#allocation_chart_div').css('width', (advisorWidth - 60));
            $('#manage_chart_div').css('width', (advisorWidth - 60));
            $('#planned_chart_div').css('width', (advisorWidth - 60));

        } else {
            $('#allocation_chart_div').css('width', ((advisorWidth / 2) - 60));
            $('#manage_chart_div').css('width', ((advisorWidth / 2) - 60));
            $('#planned_chart_div').css('width', ((advisorWidth / 2) - 60));
        }
    }

    private allocationProgressChart(repsonse) {
        this.allocationDataProvider = [{
            accounttype: 1,
            cash: Math.round(repsonse.assetCategoryRollup['CASH'] / repsonse.assetCategoryTotal * 100),
            fixed_income: Math.round(repsonse.assetCategoryRollup['FIXED_INCOME'] / repsonse.assetCategoryTotal * 100),
            equity: Math.round(repsonse.assetCategoryRollup['EQUITY'] / repsonse.assetCategoryTotal * 100)
        }];
        this.allocationGraphsData = [
            {
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.chartColor[0],
                lineColor: '#FFFFFF',
                title: 'Cash',
                type: 'column',
                color: '#000000',
                valueField: 'cash',
                fixedColumnWidth: 11
            },
            {
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.chartColor[1],
                lineColor: '#FFFFFF',
                title: 'Fixed Income',
                type: 'column',
                color: '#000000',
                valueField: 'fixed_income',
                fixedColumnWidth: 11
            },
            {
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.chartColor[2],
                lineColor: '#FFFFFF',
                title: 'Equity',
                type: 'column',
                color: '#000000',
                valueField: 'equity',
                fixedColumnWidth: 11
            }
        ];
        this.AmCharts.makeChart('allocation_chart_div',
            this.stackedBarChart.commonOption(this.allocationDataProvider, this.allocationGraphsData)
        );
    }

    private manageProgressChart(repsonse) {
        this.manageDataProvider = [{
            accounttype: 1,
            managed: Math.round(repsonse.totalManaged / repsonse.totalManageNonManage * 100),
            unmanaged: Math.round(repsonse.totalNonManaged / repsonse.totalManageNonManage * 100)
        }];
        this.manageGraphsData = [
            {
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.chartColor[0],
                lineColor: '#FFFFFF',
                title: 'Managed',
                type: 'column',
                color: '#000000',
                valueField: 'managed',
                fixedColumnWidth: 11
            },
            {
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.chartColor[1],
                lineColor: '#FFFFFF',
                title: 'Unmanaged',
                type: 'column',
                color: '#000000',
                valueField: 'unmanaged',
                fixedColumnWidth: 11
            }
        ];
        this.AmCharts.makeChart('manage_chart_div',
            this.stackedBarChart.commonOption(this.manageDataProvider, this.manageGraphsData)
        );
    }
    private plannedProgressChart(repsonse) {
        this.plannedDataProvider = [{
            accounttype: 1,
            planned: Math.round(repsonse.totalPlanned / repsonse.totalPlanUnplan * 100),
            unplanned: Math.round(repsonse.totalUnPlanned / repsonse.totalPlanUnplan * 100)
        }];
        this.plannedGraphsData = [
            {
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: '#77aaff',
                lineColor: '#FFFFFF',
                title: 'Planned',
                type: 'column',
                color: '#000000',
                valueField: 'planned',
                fixedColumnWidth: 11
            },
            {
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: '#66CCEE',
                lineColor: '#FFFFFF',
                title: 'Unplanned',
                type: 'column',
                color: '#000000',
                valueField: 'unplanned',
                fixedColumnWidth: 11
            }
        ];
        this.AmCharts.makeChart('planned_chart_div',
            this.stackedBarChart.commonOption(this.plannedDataProvider, this.plannedGraphsData)
        );
    }

}
