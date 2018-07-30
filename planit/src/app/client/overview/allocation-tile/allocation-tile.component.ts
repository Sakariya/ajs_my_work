import { Component, OnInit, Input, AfterViewInit, OnDestroy, LOCALE_ID, Inject } from '@angular/core';
import { AppState, getAllocPayload } from '../../../shared/app.reducer';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { APIService } from '../../../api.service';
import { inject } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import * as $ from 'jquery';


@Component({
    selector: 'app-allocation-tile',
    templateUrl: './allocation-tile.component.html',
    styleUrls: ['./allocation-tile.component.css']
})
export class AllocationTileComponent implements OnInit, OnDestroy {
    @Input() public clientId;
    public data: any;
    private currentChart: AmChart;
    private targetChart: AmChart;
    public currentData: {
        category: string;
        'column-1': number;
        per?: number;
    }[] = [];
    public targetData: {
        category: string;
        'column-1': number;
        per?: number;
    }[] = [];
    public currentTotal = 0;
    public targetTotal = 0;
    public currentMarker = 'K';
    public targetMarker = 'K';

    constructor(
        private AmCharts: AmChartsService,
        private apiService: APIService,
        private store: Store<AppState>,
        @Inject(LOCALE_ID) private locale: string
    ) { }

    ngOnInit() {
        this.store.select(getAllocPayload).subscribe(data => {
            if (data != null) {
                this.data = data;
                this.currentData.push(
                    {
                        category: 'Cash',
                        'column-1': this.data.currentAllocation.Cash[0].allocAmount
                    },
                    {
                        category: 'Fixed Income',
                        'column-1': this.data.currentAllocation['Fixed Income'][0]
                            .allocAmount
                    },
                    {
                        category: 'Equity',
                        'column-1': this.data.currentAllocation.Equity[0].allocAmount
                    }
                );
                this.currentTotal =
                    this.data.currentAllocation.Cash[0].allocAmount +
                    this.data.currentAllocation['Fixed Income'][0].allocAmount +
                    this.data.currentAllocation.Equity[0].allocAmount;
                if (this.currentTotal >= 1000000) {
                    this.currentTotal = this.currentTotal / 1000000;
                    this.currentMarker = 'Mil';
                    this.currentData[0].per =
                        this.currentData[0]['column-1'] / this.currentTotal / 10000;
                    this.currentData[1].per =
                        this.currentData[1]['column-1'] / this.currentTotal / 10000;
                    this.currentData[2].per =
                        this.currentData[2]['column-1'] / this.currentTotal / 10000;
                } else {
                    this.currentTotal = this.currentTotal / 1000;
                    this.currentMarker = 'K';
                    this.currentData[0].per =
                        this.currentData[0]['column-1'] / this.currentTotal / 10;
                    this.currentData[1].per =
                        this.currentData[1]['column-1'] / this.currentTotal / 10;
                    this.currentData[2].per =
                        this.currentData[2]['column-1'] / this.currentTotal / 10;
                }

                this.targetData.push(
                    {
                        category: 'Cash',
                        'column-1': this.data.targetAllocation.Cash[0].allocAmount
                    },
                    {
                        category: 'Fixed Income',
                        'column-1': this.data.targetAllocation['Fixed Income'][0]
                            .allocAmount
                    },
                    {
                        category: 'Equity',
                        'column-1': this.data.targetAllocation.Equity[0].allocAmount
                    }
                );
                this.targetTotal =
                    this.data.targetAllocation.Cash[0].allocAmount +
                    this.data.targetAllocation['Fixed Income'][0].allocAmount +
                    this.data.targetAllocation.Equity[0].allocAmount;
                if (this.targetTotal >= 1000000) {
                    this.targetTotal = this.targetTotal / 1000000;
                    this.targetMarker = 'Mil';
                    this.targetData[0].per =
                        this.targetData[0]['column-1'] / this.targetTotal / 10000;
                    this.targetData[1].per =
                        this.targetData[1]['column-1'] / this.targetTotal / 10000;
                    this.targetData[2].per =
                        this.targetData[2]['column-1'] / this.targetTotal / 10000;
                } else {
                    this.targetTotal = this.targetTotal / 1000;
                    this.targetMarker = 'K';
                    this.targetData[0].per =
                        this.targetData[0]['column-1'] / this.targetTotal / 10;
                    this.targetData[1].per =
                        this.targetData[1]['column-1'] / this.targetTotal / 10;
                    this.targetData[2].per =
                        this.targetData[2]['column-1'] / this.targetTotal / 10;
                }

                setTimeout(() => {

                    this.currentChart = this.AmCharts.makeChart('chartdiv1', {
                        type: 'pie',
                        innerRadius: '87%',
                        precision: 2,
                        balloonText: '$[[value]]',
                        balloonFunction: (item, graph) => {
                            return item.dataContext['category'] + ': ' + new CurrencyPipe(this.locale).transform(
                                item.dataContext['column-1'],
                                'CAD',
                                'symbol-narrow',
                                '0.0-0'
                            );
                        },
                        labelText: '',
                        startRadius: '50%',
                        colors: ['#9999ff', '#BBDD66', '#66ccee'],
                        gradientRatio: [],
                        hoverAlpha: 0.64,
                        labelTickAlpha: 0,
                        outlineAlpha: 0,
                        startDuration: 0.8,
                        autoMargins: false,
                        marginTop: 2,
                        marginBottom: 40,
                        marginLeft: 0,
                        marginRight: 0,
                        pullOutRadius: 0,
                        startEffect: 'easeOutSine',
                        titleField: 'category',
                        valueField: 'column-1',
                        accessibleTitle: '',
                        theme: 'dark',
                        listeners: [
                            {
                                event: 'rendered',
                                method: this.handleRendered
                            }
                        ],
                        allLabels: [
                            {
                                text:
                                    new CurrencyPipe(this.locale).transform(
                                        this.currentTotal,
                                        'CAD',
                                        'symbol-narrow',
                                        '0.0-2'
                                    ) + this.currentMarker,
                                align: 'center',
                                bold: false,
                                size: 22,
                                y: 50,
                                id: 'text1'
                            },
                            {
                                text: 'Total',
                                align: 'center',
                                bold: false,
                                y: 30,
                                color: '#aabbcc',
                                size: 14,
                                id: 'text2'
                            }
                        ],
                        balloon: {
                            offsetX: 0,
                            offsetY: 0
                        },
                        titles: [],
                        dataProvider: this.currentData
                    });
                    this.targetChart = this.AmCharts.makeChart('chartdiv2', {
                        type: 'pie',

                        innerRadius: '87%',
                        precision: 2,
                        balloonText: '$[[value]]',
                        balloonFunction: (item, graph) => {
                            return item.dataContext['category'] + ': ' + new CurrencyPipe(this.locale).transform(
                                item.dataContext['column-1'],
                                'CAD',
                                'symbol-narrow',
                                '0.0-0'
                            );
                        },
                        labelText: '',
                        startRadius: '50%',
                        colors: ['#9999ff', '#BBDD66', '#66ccee'],
                        gradientRatio: [],
                        hoverAlpha: 0.64,
                        labelTickAlpha: 0,
                        outlineAlpha: 0,
                        startDuration: 0.8,
                        autoMargins: false,
                        marginTop: 2,
                        marginBottom: 40,
                        marginLeft: 0,
                        marginRight: 0,
                        pullOutRadius: 0,
                        startEffect: 'easeOutSine',
                        titleField: 'category',
                        valueField: 'column-1',
                        accessibleTitle: '',
                        theme: 'dark',
                        listeners: [
                            {
                                event: 'rendered',
                                method: this.handleRendered
                            }
                        ],
                        allLabels: [
                            {
                                text:
                                    new CurrencyPipe(this.locale).transform(
                                        this.targetTotal,
                                        'CAD',
                                        'symbol-narrow',
                                        '0.0-2'
                                    ) + this.targetMarker,
                                align: 'center',
                                bold: false,
                                size: 22,
                                y: 50,
                                id: 'text1'
                            },
                            {
                                text: 'Total',
                                align: 'center',
                                bold: false,
                                y: 30,
                                color: '#aabbcc',
                                size: 14,
                                id: 'text2'
                            }
                        ],
                        balloon: {
                            offsetX: 0,
                            offsetY: 0
                        },
                        titles: [],
                        dataProvider: this.targetData
                    });
                }, 50);

            }
        });
    }

    ngOnDestroy() {
        if (this.currentChart) {
            this.AmCharts.destroyChart(this.currentChart);
        }
        if (this.targetChart) {
            this.AmCharts.destroyChart(this.targetChart);
        }
    }

    handleRendered() {
        $('[font-family]').removeAttr('font-family');
    }

}
