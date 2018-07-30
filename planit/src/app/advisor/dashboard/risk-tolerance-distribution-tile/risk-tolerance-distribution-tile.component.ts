import { Component, OnInit, DebugElement, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AmChartsService, } from '@amcharts/amcharts3-angular';
import { AdvisorService } from '../../service/advisor.service';
import { TimePeriodList } from '../../advisor-models/commom.medel';
import { Store } from '@ngrx/store';
import { AppState, getIsAdvisorLoaded, getBehaviouralRiskTolerancePayLoad } from '../../../shared/app.reducer';
import { take } from 'rxjs/operators';
import { subscribeOn } from 'rxjs/operator/subscribeOn';
import { SetBehaviouralRiskTolerance } from '../../../shared/app.actions';
import * as $ from 'jquery';
@Component({
    selector: 'app-risk-tolerance-distribution-tile',
    templateUrl: './risk-tolerance-distribution-tile.component.html',
    styleUrls: ['./risk-tolerance-distribution-tile.component.css']
})
export class RiskToleranceDistributionTileComponent implements OnInit {
    chart;
    chartData = [];
    timePeriodList = TimePeriodList;
    riskGroups;
    selectedtimePeriod;
    selectedRiskGroup;
    behaviouralRiskToleranceData;
    @ViewChild('widgetParentDiv') parentDiv: ElementRef;
    constructor(private AmCharts: AmChartsService,
        private advisorService: AdvisorService,
        private store: Store<AppState>) { }

    ngOnInit() {
        this.riskGroups = [
            { name: '5 risk groups', id: 'FM12' },
            { name: '7 risk groups', id: 'FM25' }
        ];
        this.selectedtimePeriod = { name: '12 months', id: 12 };
        this.selectedRiskGroup = { name: '5 risk groups', id: 'FM12' };
        this.store
            .select(getIsAdvisorLoaded)
            .subscribe(loaded => {
                if (!loaded) {
                    this.getBehaviouralRiskTolerance(this.selectedRiskGroup.id, this.selectedtimePeriod.id);
                } else {
                    if (this.selectedtimePeriod.id === 6 && this.selectedRiskGroup.id === 'FM12') {
                        this.store
                            .select(getBehaviouralRiskTolerancePayLoad)
                            .subscribe(data => {
                                this.behaviouralRiskToleranceData = data;
                                this.draChart();
                            });
                    } else {
                        this.getBehaviouralRiskTolerance(this.selectedRiskGroup.id, this.selectedtimePeriod.id);
                    }
                }
            });
    }
    @HostListener('window:resize') onResize() {
        // guard against resize before view is rendered
        if (this.parentDiv) {
            if ($(window).width() < 976) {
                $('#chartdiv1').css('width', ($('#advisor_dashboard').width() - 55));
            } else {
                $('#chartdiv1').css('width', ($('#advisor_dashboard').width() - (($('#advisor_dashboard').width() * 50) / 100 ) - 55));
            }
        }
    }

    getBehaviouralRiskTolerance(ristGroup, period) {
        this.advisorService.getBehaviouralRiskTolerance(ristGroup, period)
            .subscribe(data => {
                if (this.selectedtimePeriod.id === 12 && this.selectedRiskGroup.id === 'FM12') {
                    this.store.dispatch(new SetBehaviouralRiskTolerance(data));
                }
                this.behaviouralRiskToleranceData = data;
                this.draChart();
            });
    }
    getFilterByTimePeriod(event) {
        this.selectedtimePeriod = event;
        this.getBehaviouralRiskTolerance(this.selectedRiskGroup.id, this.selectedtimePeriod.id);
    }
    getFilterByRiskGroup(event) {
        this.selectedRiskGroup = event;
        this.getBehaviouralRiskTolerance(this.selectedRiskGroup.id, this.selectedtimePeriod.id);
    }
    draChart() {
        this.chartData = [];
        if (this.behaviouralRiskToleranceData !== null && this.behaviouralRiskToleranceData !== undefined) {
            for (let i = 0; i < 5; i++) {
                this.chartData.push({
                    value: this.behaviouralRiskToleranceData.riskGroupNumbers[this.selectedRiskGroup.id + '-G' + (i + 1)],
                    group: (i + 1)
                });
            }
        }
        this.chart = this.AmCharts.makeChart('chartdiv1', {
            'type': 'serial',
            'theme': 'light',
            'dataProvider': this.chartData,
            'valueAxes': [{
                'axisAlpha': 0,
                'lineColor': '000',
                'gridThickness': 0,
                'axisThickness': 1,
                'gridCount': 20,
                'minimum': 0,
                'strictMinMax': true,
            }],
            'graphs': [{
                'bulletSize': 7,
                'customBullet': '',
                'bullet': 'round',
                'id': 'g1',
                'bulletBorderAlpha': 1,
                'bulletColor': '#FFFFFF',
                'lineThickness': 2,
                'valueField': 'value',
                'useLineColorForBulletBorder': true,
                // tslint:disable-next-line:max-line-length
                'balloonText': '<div style="margin:10px; text-align:left;"><span style="font-size:13px">Risk Group :[[category]]</span><br><span style="font-size:18px">Value:[[value]]</span>',
            }],
            'marginTop': 5,
            'chartCursor': {
                'graphBulletSize': 1.5,
                'zoomable': false,
                'cursorAlpha': 0,
                'valueLineBalloonEnabled': true,
                'valueLineAlpha': 0
            },
            'autoMargins': true,
            'categoryField': 'group',
            'categoryAxis': {
                'lineAlpha': 1,
                'fillAlpha': 1,
                'lineLength': 0,
                'inside': false,
                'labelRotation': 0,
                'title': 'RISK GROUP',
            },
            'responsive': {
                'enabled': false,
                'rules': [
                    {
                        'maxWidth': 597,
                        'overrides': {
                            'graphs': [
                                {
                                    'fixedColumnWidth': 40
                                }
                            ],
                        }
                    },
                    {
                        'maxWidth': 493,
                        'overrides': {
                            'graphs': [
                                {
                                    'fixedColumnWidth': 30
                                }
                            ],
                        }
                    },
                    {
                        'maxWidth': 200,
                        'overrides': {
                            'graphs': [
                                {
                                    'fixedColumnWidth': 20
                                }
                            ],
                        }
                    }
                ]
            }
        });
    }

}
