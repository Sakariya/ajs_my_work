import { Component, OnInit, Input, HostListener } from '@angular/core';
import * as $ from 'jquery';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { StackedBarChartService } from '../../../../../shared/chart/stacked-bar-chart.service';

@Component({
    selector: 'app-linked-goals',
    templateUrl: './linked-goals.component.html',
    styleUrls: ['./linked-goals.component.css']
})
export class LinkedGoalsComponent implements OnInit {
    @Input() public clientId;
    @Input() public portfolioId;
    @Input() public isEditableRoute;

    public linkedGoals = [
        {
            description: 'Zak\'s education',
            year: 20000,
            from_to: '2017-2020',
            amount: 50000,
            colour: 'mauve',
            percent: 10
        },
        {
            description: 'Retirement',
            year: 20000,
            from_to: '2020-2024',
            amount: 1340284,
            colour: 'green',
            percent: 10
        },
        {
            description: 'Home improvement',
            year: 100000,
            from_to: '2020-2025',
            amount: 340284,
            colour: 'orange',
            percent: 80
        }
    ];
    public allocatedGoals = 100;

    public dataProvider = [{
        accounttype: 1
    }];
    public graphsData = [];
    chartColor = ['#9999FF', '#bbdd66', '#fbaa35'];

    constructor(
        private AmCharts: AmChartsService,
        private stackedBarChart: StackedBarChartService
    ) { }

    ngOnInit() {
        this.invstorsProgressChart(this.linkedGoals);
    }

    private invstorsProgressChart(response) {
        response.forEach((res, index) => {
            const key = res.colour.toLowerCase();
            this.dataProvider[0][key] = res.percent;
            this.graphsData.push({
                balloonText: '[[title]]: <b>[[value]]%</b></span>',
                fillAlphas: 1,
                fillColors: this.chartColor[index],
                lineColor: '#FFFFFF',
                title: res.colour,
                type: 'column',
                color: '#000000',
                valueField: res.colour.toLowerCase(),
                fixedColumnWidth: 11
            });
        });
        setTimeout(() => {
            this.AmCharts.makeChart(
                'linkedGoalChart',
                this.stackedBarChart.commonOption(this.dataProvider, this.graphsData)
            );
        }, 100);
    }
}
