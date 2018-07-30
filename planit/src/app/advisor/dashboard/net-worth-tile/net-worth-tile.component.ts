import { StackedBarChartService } from '../../../shared/chart/stacked-bar-chart.service';
import { AdvisorService } from '../../service/advisor.service';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { Component, OnInit, HostListener } from '@angular/core';
import { take } from 'rxjs/operators/take';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import {
    AppState,
    getIsAdvisorNetworthInvestmentLoaded,
    getAdvisorNetworthInvestmentPayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-net-worth-tile',
    templateUrl: './net-worth-tile.component.html',
    styleUrls: ['./net-worth-tile.component.css']
})
export class NetWorthTileComponent implements OnInit {

    public netWorth: any;
    public dataProvider = [{
        accounttype: 1
    }];
    public graphsData = [];
    chartColor = ['#99f', '#bd6', '#66CCEE', '#c7f', '#77aaff', '#cde'];

    constructor(
        private store: Store<AppState>,
        private AmCharts: AmChartsService,
        private stackedBarChart: StackedBarChartService,
        private advisorService: AdvisorService
    ) { }

    ngOnInit() {
        this.store
            .select(getIsAdvisorNetworthInvestmentLoaded)
            .pipe(take(1))
            .subscribe((loaded: boolean) => {
                if (!loaded) {
                    this.advisorService.getAdvisorNetworthInvestmentPayload('CAD').subscribe(data => {
                        this.netWorth = data;
                        this.networthProgressChart(data);
                    });
                } else {
                    this.store
                        .select(getAdvisorNetworthInvestmentPayload)
                        .subscribe(data => {
                            this.netWorth = data;
                            this.networthProgressChart(data);
                        });
                }
            });
    }

    @HostListener('window:resize') onResize() {
        const advisorWidth = $('#advisor_dashboard').width();
        // guard against resize before view is rendered
        if ($(window).width() < 976) {
            $('#networthchartdiv').css('width', (advisorWidth - 60));
        } else {
            $('#networthchartdiv').css('width', ((advisorWidth / 2) - 60));
        }
    }

    private networthProgressChart(response) {
        response.accountTypeRollup.forEach((res, index) => {
            const key = res.ssid.split('id of ')[1].toLowerCase();
            this.dataProvider[0][key] = Math.round(res.amount / response.accountTypeTotal * 100);
            this.graphsData.push({
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.chartColor[index],
                lineColor: '#FFFFFF',
                title: res.ssid.split('id of ')[1],
                type: 'column',
                color: '#000000',
                valueField: res.ssid.split('id of ')[1].toLowerCase(),
                fixedColumnWidth: 11
            });
        });
        setTimeout(() => {
            this.AmCharts.makeChart('networthchartdiv', this.stackedBarChart.commonOption(this.dataProvider, this.graphsData));
        }, 100);
    }

    /**For AcctType and Managed Columns*/
    getColorByIndexOddColumn(x: number): string {
        switch (x) {
            case 1:
                return 'mauve';
            case 2:
                return 'green';
            case 3:
                return 'cyan';
            case 4:
                return 'violet';
            case 5:
                return 'blue';
            case 6:
                return 'lightgrey';
        }
    }

}
