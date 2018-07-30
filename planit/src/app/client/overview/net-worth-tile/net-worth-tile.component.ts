import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { StackedBarChartService } from '../../../shared/chart/stacked-bar-chart.service';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import * as $ from 'jquery';
import {
    AppState,
    getNetworthInvestmentPayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-net-worth-tile',
    templateUrl: './net-worth-tile.component.html',
    styleUrls: ['./net-worth-tile.component.css']
})
export class NetWorthTileComponent implements OnInit {

    @Input() public clientId;
    public assetsDataProvider = [{
        accounttype: 1
    }];
    public assetsGraphsData = [];
    public assetsChartColor = ['#99f', '#bd6', '#66CCEE', '#77aaff', '#cde'];
    public assetsChartClass = ['mauve', 'green', 'cyan', 'blue', 'lightgrey'];

    public ownerDataProvider = [{
        accounttype: 1
    }];
    public ownerGraphsData = [];
    public ownerChartColor = ['#77aaff', '#66CCEE', '#bd6', '#99f'];
    public ownerChartClass = ['blue', 'cyan', 'green', 'mauve'];
    public data: any;

    constructor(
        private store: Store<AppState>,
        private AmCharts: AmChartsService,
        private stackedBarChart: StackedBarChartService
    ) { }

    ngOnInit() {
        this.store
            .select(getNetworthInvestmentPayload)
            .subscribe(data => {
                this.data = data;
                if (data) {
                    this.accountTypeProgressChart(data);
                }
            });
    }

    @HostListener('window:resize') onResize() {
        const overviewWidth = $('#client_overview').width();
        // guard against resize before view is rendered
        if ($(window).width() < 767) {
            $('#accountTypeChartDiv').css('width', (overviewWidth - 50));
            $('#ownerTypeChartDiv').css('width', (overviewWidth - 50));
        } else if ($(window).width() < 976) {
            $('#accountTypeChartDiv').css('width', ((overviewWidth / 2) - 50));
            $('#ownerTypeChartDiv').css('width', ((overviewWidth / 2) - 50));
        } else {
            $('#accountTypeChartDiv').css('width', ((overviewWidth / 4) - 50) + 1);
            $('#ownerTypeChartDiv').css('width', ((overviewWidth / 4) - 50) + 1);
        }
    }

    accountTypeProgressChart(response) {
        response.assetsByTypes.forEach((res, index) => {
            this.assetsDataProvider[0][res.type] = Math.round(res.value / this.getAssetsTotaleByTypes() * 100);
            this.assetsGraphsData.push({
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.assetsChartColor[index],
                lineColor: '#FFFFFF',
                title: res.type,
                type: 'column',
                color: '#000000',
                valueField: res.type,
                fixedColumnWidth: 11
            });
        });

        response.assetsByOwners.forEach((res, index) => {
            this.ownerDataProvider[0][res.type] = Math.round(res.value / this.getAssetsTotaleByOwners() * 100);
            this.ownerGraphsData.push({
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.ownerChartColor[index],
                lineColor: '#FFFFFF',
                title: res.type,
                type: 'column',
                color: '#000000',
                valueField: res.type,
                fixedColumnWidth: 11
            });
        });
        setTimeout(() => {
            this.AmCharts.makeChart('accountTypeChartDiv',
                this.stackedBarChart.commonOption(this.assetsDataProvider, this.assetsGraphsData)
            );
            this.AmCharts.makeChart('ownerTypeChartDiv',
                this.stackedBarChart.commonOption(this.ownerDataProvider, this.ownerGraphsData)
            );
        }, 100);
    }

    getAssetsTotaleByTypes(): number {
        return this.data.assetsByTypes.reduce((sum, item) => sum + item.value, 0);
    }

    getAssetsTotaleByOwners(): number {
        return this.data.assetsByOwners.reduce((sum, item) => sum + item.value, 0);
    }

}
