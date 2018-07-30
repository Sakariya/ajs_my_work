import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { StackedBarChartService } from '../../../shared/chart/stacked-bar-chart.service';
import * as $ from 'jquery';
import {
    AppState,
    getNetworthInvestmentPayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-investments-tile',
    templateUrl: './investments-tile.component.html',
    styleUrls: ['./investments-tile.component.css']
})
export class InvestmentsTileComponent implements OnInit {

    @Input() public clientId;
    public data: any;
    public managedDataProvider = [{
        accounttype: 1
    }];
    public managedGraphsData = [];
    public managedChartColor = ['#99f', '#bd6', '#66CCEE', '#77aaff', '#cde'];
    public managedChartClass = ['mauve', 'green', 'cyan', 'blue', 'lightgrey'];

    public plannedDataProvider = [{
        accounttype: 1
    }];
    public plannedGraphsData = [];
    public plannedChartColor = ['#77aaff', '#66CCEE', '#bd6', '#99f'];
    public plannedChartClass = ['blue', 'cyan', 'green', 'mauve'];

    constructor(
        private store: Store<AppState>,
        private AmCharts: AmChartsService,
        private stackedBarChart: StackedBarChartService
    ) { }

    ngOnInit(): void {
        this.store
            .select(getNetworthInvestmentPayload)
            .subscribe(data => {
                this.data = data;
                if (data) {
                    this.InvestmentProgressChart(data);
                }
            });
    }

    @HostListener('window:resize') onResize() {
        const overviewWidth = $('#client_overview').width();
        // guard against resize before view is rendered
        if ($(window).width() < 767) {
            $('#managedTypeChartDiv').css('width', (overviewWidth - 50));
            $('#plannedTypeChartDiv').css('width', (overviewWidth - 50));
        } else if ($(window).width() < 976) {
            $('#managedTypeChartDiv').css('width', ((overviewWidth / 2) - 50));
            $('#plannedTypeChartDiv').css('width', ((overviewWidth / 2) - 50));
        } else {
            $('#managedTypeChartDiv').css('width', ((overviewWidth / 4) - 50) + 1);
            $('#plannedTypeChartDiv').css('width', ((overviewWidth / 4) - 50) + 1);
        }
    }

    InvestmentProgressChart(response) {
        response.investmentsByManaged.forEach((res, index) => {
            this.managedDataProvider[0][res.type] = Math.round(res.value / this.getInvestmentsByManaged() * 100);
            this.managedGraphsData.push({
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.managedChartColor[index],
                lineColor: '#FFFFFF',
                title: res.type,
                type: 'column',
                color: '#000000',
                valueField: res.type,
                fixedColumnWidth: 11
            });
        });

        response.investmentsByPlanned.forEach((res, index) => {
            this.plannedDataProvider[0][res.type] = Math.round(res.value / this.getInvestmentsByPlanned() * 100);
            this.plannedGraphsData.push({
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.plannedChartColor[index],
                lineColor: '#FFFFFF',
                title: res.type,
                type: 'column',
                color: '#000000',
                valueField: res.type,
                fixedColumnWidth: 11
            });
        });
        setTimeout(() => {
            this.AmCharts.makeChart('managedTypeChartDiv',
                this.stackedBarChart.commonOption(this.managedDataProvider, this.managedGraphsData)
            );
            this.AmCharts.makeChart('plannedTypeChartDiv',
                this.stackedBarChart.commonOption(this.plannedDataProvider, this.plannedGraphsData)
            );
        }, 100);
    }

    getInvestmentsByManaged(): number {
        return this.data.investmentsByManaged.reduce((sum, item) => sum + item.value, 0);
    }

    getInvestmentsByPlanned(): number {
        return this.data.investmentsByPlanned.reduce((sum, item) => sum + item.value, 0);
    }

}
