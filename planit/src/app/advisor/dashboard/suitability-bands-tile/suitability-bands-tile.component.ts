import { Component, OnInit, LOCALE_ID, Inject, HostListener } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { AdvisorService } from '../../service/advisor.service';
import { CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import {
    AppState,
    getIsAdvisorSuitabilityPayload,
    getAdvisorSuitabilityPayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-suitability-bands-tile',
    templateUrl: './suitability-bands-tile.component.html',
    styleUrls: ['./suitability-bands-tile.component.css']
})

export class SuitabilityBandsTileComponent implements OnInit {
    public suitabilities: any;

    constructor(
        private store: Store<AppState>,
        private AmCharts: AmChartsService,
        private advisorService: AdvisorService,
        @Inject(LOCALE_ID) private locale: string
    ) { }

    ngOnInit() {
        this.store
            .select(getIsAdvisorSuitabilityPayload)
            .subscribe((loaded: boolean) => {
                if (!loaded) {
                    this.advisorService.getAdvisorSuitabilitySummaryPayload('CAD').subscribe(data => {
                        this.suitabilities = data;
                        this.suitabilityChart(data);
                    });
                } else {
                    this.store
                        .select(getAdvisorSuitabilityPayload)
                        .subscribe(data => {
                            this.suitabilities = data;
                            this.suitabilityChart(data);
                        });
                }
            });
    }

    @HostListener('window:resize') onResize() {
        const advisorWidth = $('#advisor_dashboard').width();
        $('#columnChartDiv').css('width', (advisorWidth - ((advisorWidth * 10) / 100 )));
        $('#respColumnChartDiv1').css('width', (advisorWidth - ((advisorWidth * 15) / 100 )));
        $('#respColumnChartDiv2').css('width', (advisorWidth - ((advisorWidth * 15) / 100 )));
    }

    private suitabilityChart(data) {
        this.AmCharts.makeChart('columnChartDiv', this.makeColumnOptions(this.setSuitabilityProvider(data, false)));
        this.AmCharts.makeChart('respColumnChartDiv1', this.makeColumnOptions(this.setSuitabilityProvider(data.slice(0, 4), true, 0)));
        this.AmCharts.makeChart('respColumnChartDiv2', this.makeColumnOptions(this.setSuitabilityProvider(data.slice(4, 7), true, 4)));
    }

    private setSuitabilityProvider(suitabilities: any[], isResponsive: boolean, indexStart?: number): any {
        const dataProvider = [];
        suitabilities.forEach((suitability, index) => {
            dataProvider.push(
                {
                    Portfolios: this.assetLabel(suitability.displayOrder),
                    assetValue: suitability.numberOfPortfolios,
                    color: '#77aaff'
                }
            );
            if (isResponsive) {
                this.makePieChartOption('resPieChartDiv' + (index + indexStart + 1), suitability);
            } else {
                this.makePieChartOption('pieChartDiv' + (index + 1), suitability);
            }
        });
        return dataProvider;
    }

    private makePieChartOption(id: string, data: any) {
        this.AmCharts.makeChart(id, {
            type: 'pie',
            innerRadius: '80%',
            precision: 2,
            balloonText: '[[title]]: [[value]]%',
            outlineThickness: 3,
            outlineColor: '#FFFFFF',
            labelText: '',
            startRadius: '50%',
            colors: ['#9999ff', '#BBDD66', '#66ccee'],
            gradientRatio: [],
            hoverAlpha: 0.64,
            labelTickAlpha: 0,
            outlineAlpha: 1,
            startDuration: 0.8,
            autoMargins: false,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 10,
            marginRight: 10,
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
                    text: 'Portfolios',
                    align: 'center',
                    bold: false,
                    size: 15,
                    y: 110,
                    color: '#789',
                    id: 'text4'
                },
                {
                    text: data.numberOfPortfolios,
                    align: 'center',
                    bold: false,
                    size: 15,
                    y: 90,
                    color: '#789',
                    id: 'text3'
                },
                {
                    text:
                        new CurrencyPipe(this.locale).transform(
                            data.totalAssetValue > 1000 ? (data.totalAssetValue / 1000) : data.totalAssetValue,
                            'CAD',
                            'symbol-narrow',
                            '0.0-2'
                        ) + 'K',
                    align: 'center',
                    bold: true,
                    size: 16,
                    y: 70,
                    color: '#000000',
                    id: 'text2'
                },
                {
                    text: 'Total',
                    align: 'center',
                    bold: false,
                    y: 45,
                    color: '#789',
                    size: 15,
                    id: 'text1'
                }
            ],
            balloon: {
                offsetX: 0,
                offsetY: 0
            },
            titles: [],
            dataProvider: [
                {
                    'category': 'Cash',
                    'column-1': data.allocation['CASH']
                },
                {
                    'category': 'Fixed Income',
                    'column-1': data.allocation['FIXED_INCOME']
                },
                {
                    'category': 'Equity',
                    'column-1': data.allocation['EQUITY']
                }
            ],
            responsive: {
                enabled: true,
                addDefaultRules: false,
                rules: [
                    {
                        minWidth: 1194,
                        overrides: {
                            allLabels: [
                                {
                                    size: 13,
                                    id: 'text4'
                                },
                                {
                                    size: 13,
                                    id: 'text3'
                                },
                                {
                                    size: 14,
                                    id: 'text2'
                                },
                                {
                                    size: 13,
                                    id: 'text1'
                                }
                            ],
                            marginLeft: 10,
                            marginRight: 10
                        }
                    },
                    {
                        maxWidth: 1024,
                        overrides: {
                            marginLeft: 5,
                            marginRight: 5
                        }
                    }
                ]
            }
        });
    }

    private makeColumnOptions(dataProvider: any): any {
        return {
            'type': 'serial',
            'theme': 'light',
            'autoMarginOffset': 30,
            'dataProvider': dataProvider,
            'valueAxes': [
                {
                    'gridColor': '#789',
                    'gridPosition': 'start',
                    'gridAlpha': 0,
                    'dashLength': 0,
                    'tickLength': 0,
                    'color': '#789'
                }
            ],
            'categoryAxis': {
                'gridColor': '#789',
                'gridPosition': 'start',
                'gridAlpha': 1,
                'tickLength': 0,
                'color': '#789'
            },
            'gridAboveGraphs': true,
            'startDuration': 1,
            'graphs': [
                {
                    'balloonText': '[[category]]: <b>[[value]]</b>',
                    'fillColorsField': 'color',
                    'fillAlphas': 1,
                    'lineAlpha': 0.2,
                    'type': 'column',
                    'fixedColumnWidth': 70,
                    'valueField': 'assetValue'
                }
            ],
            'chartCursor': {
                'categoryBalloonEnabled': false,
                'cursorAlpha': 0,
                'zoomable': false
            },
            'categoryField': 'Portfolios',
            'export': {
                'enabled': true
            },
            'titles': [
                {
                    'size': 15,
                    'color': '#556677',
                    'text': 'Distribution of selected suitability bands'
                }
            ],
            'allLabels': [
                {
                    'text': '# Portfolios',
                    'rotation': 270,
                    'x': '10',
                    'y': '40%',
                    'width': '50%',
                    'size': 16,
                    'bold': false,
                    'align': 'right'
                }
            ],
            'responsive': {
                'enabled': true,
                'addDefaultRules': false,
                'rules': [
                    {
                        'maxWidth': 1194,
                        'overrides': {
                            'graphs': [
                                {
                                    'fixedColumnWidth': 50
                                }
                            ],
                        }
                    },
                    {
                        'maxWidth': 987,
                        'overrides': {
                            'graphs': [
                                {
                                    'fixedColumnWidth': 40
                                }
                            ],
                        }
                    },
                    {
                        'maxWidth': 400,
                        'overrides': {
                            'graphs': [
                                {
                                    'fixedColumnWidth': 20
                                }
                            ],
                            'categoryAxis': {
                                'labelRotation': 45
                            },
                        }
                    }
                ]
            }
        };
    }

    private assetLabel(x: number): string {
        switch (x) {
            case 1:
                return 'ALL INCOME';
            case 2:
                return 'INCOME';
            case 3:
                return 'INCOME & GROWTH';
            case 4:
                return 'BALANCED';
            case 5:
                return 'GROWTH & INCOME';
            case 6:
                return 'GROWTH';
            case 7:
                return 'ALL EQUITY';
        }
    }

    private handleRendered() {
        $('[font-family]').removeAttr('font-family');
    }

}
