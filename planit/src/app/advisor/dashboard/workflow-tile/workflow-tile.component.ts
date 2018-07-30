import { Component, OnInit } from '@angular/core';
import { AdvisorService } from '../../service/advisor.service';
import { Store } from '@ngrx/store';
import { AppState, getAdvisorWorkflowPayload, getIsAdvisorLoaded } from '../../../shared/app.reducer';
import { take } from 'rxjs/operators';
import { SetAdvisorWorkflow } from '../../../shared/app.actions';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { CurrencyPipe } from '@angular/common';
import * as $ from 'jquery';
import { TimePeriodList } from '../../advisor-models/commom.medel';
@Component({
    selector: 'app-workflow-tile',
    templateUrl: './workflow-tile.component.html',
    styleUrls: ['./workflow-tile.component.css']
})
export class WorkflowTileComponent implements OnInit {
    currentChart: any;
    currentTotal: any;
    workflowSummary;
    selectedtimePeriod;
    public currentMarker = 'K';
    timePeriodList = TimePeriodList;
    allLabel;
    public currentChartData: {
        category: string;
        'column-1': number;
        per?: number;
    }[] = [];
    constructor(private advisorService: AdvisorService,
        private store: Store<AppState>,
        private AmCharts: AmChartsService
    ) { }
    ngOnInit() {
        this.selectedtimePeriod = { name: '6 months', id: 6 };
        this.store
            .select(getIsAdvisorLoaded)
            .subscribe((loaded: boolean) => {
                if (!loaded) {
                    this.getWorkflow(this.selectedtimePeriod.id);
                } else {
                    if (this.selectedtimePeriod.id === 6) {
                        this.store
                            .select(getAdvisorWorkflowPayload)
                            .subscribe(data => (this.workflowSummary = data));
                        this.fillGraph();
                    } else { this.getWorkflow(this.selectedtimePeriod.id); }
                }

            });
    }
    getFilterWorkflow(selectedTimePeriod) {
        this.getWorkflow(selectedTimePeriod.id);
    }
    getWorkflow(timePeriod) {
        this.advisorService.getWorkFlowPayload(timePeriod).subscribe(data => {
            if (this.selectedtimePeriod.id === 6) {
                this.store.dispatch(new SetAdvisorWorkflow(data));
            }
            this.workflowSummary = data;
            this.fillGraph();
        });
    }
    fillGraph() {
        this.allLabel = [];
        this.currentChartData = [];
        if (this.workflowSummary) {
            this.currentChartData =
                [{
                    category: 'In Progress',
                    'column-1': this.workflowSummary.inProgress
                },
                {
                    category: 'Under Review',
                    'column-1': this.workflowSummary.underReview
                },
                {
                    category: 'Completed',
                    'column-1': this.workflowSummary.completed
                },
                {
                    category: 'Shared',
                    'column-1': this.workflowSummary.shared
                },
                {
                    category: 'Monitoring ',
                    'column-1': this.workflowSummary.monitoring
                }];
            this.currentTotal = this.workflowSummary.totalGoals;
            this.allLabel = [
                {
                    text: this.currentTotal + this.currentMarker,
                    align: 'center',
                    bold: false,
                    size: 22,
                    y: 60,
                    id: 'text1'
                },
                {
                    text: 'Total',
                    align: 'center',
                    bold: false,
                    y: 40,
                    color: '#aabbcc',
                    size: 16,
                    id: 'text2'
                },
                {
                    text: 'goals',
                    align: 'center',
                    bold: false,
                    y: 90,
                    color: '#aabbcc',
                    size: 14,
                    id: 'text3'
                }
            ];

        }
        this.currentChart = this.AmCharts.makeChart('chartWorkFlow', {
            type: 'pie',
            innerRadius: '87%',
            precision: 0,
            balloonText: '[[category]]' + ': ' + '[[value]]' + this.currentMarker,
            labelText: '',
            startRadius: '50%',
            colors: ['#9999FF', '#CC77FF', '#CCDDEE', '#66CCEE', '#77AAFF'],
            gradientRatio: [],
            hoverAlpha: 0.64,
            labelTickAlpha: 0,
            outlineAlpha: 0,
            startDuration: 0.8,
            autoMargins: false,
            marginTop: 1,
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
            allLabels: this.allLabel,
            balloon: {
                offsetX: 0,
                offsetY: 0
            },
            titles: [],
            dataProvider: this.currentChartData
        });
    }
    handleRendered() {
        $('[font-family]').removeAttr('font-family');
    }

}
