import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../../../shared/animations';
import { Location } from '@angular/common';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from '../../../service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { chartColors } from '../../../client-models/chart-colors';
import { pieChartArray } from '../../../client-models/portfolio-charts';

@Component({
    selector: 'app-edit-policy',
    templateUrl: './edit-policy.component.html',
    styleUrls: ['./edit-policy.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class EditPolicyComponent implements OnInit {
    public percentMask = {
        align: 'left',
        prefix: '',
        suffix: '%',
        decimal: '.'
    };
    clientId;
    portfolioId;
    private policyChart: AmChart;
    totalBreakDown = 0;
    chartColors = chartColors;
    constructor(private _location: Location,
        private AmCharts: AmChartsService,
        private route: ActivatedRoute,
        private planningService: PlanningService,
        public translate: TranslateService
    ) { }
    assetsBreakdown;
    isDetailExpand;
    isfeesCosts = false;
    isInvestmentIncome = false;
    IsAccessRight = true;
    ngOnInit() {
        this.route.parent.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.route.parent.params.subscribe(params => {
            this.portfolioId = params['portfolioId'];
        });
        this.getEditPolicyDetail();
    }
    getEditPolicyDetail() {
        this.planningService.getAllocationDetails(this.clientId, this.portfolioId)
            .subscribe(result => {
                if (result) {
                    this.assetsBreakdown = result;
                    setTimeout(() => {
                        this.drawGraph();
                    }, 200);
                    this.totalAllocation();
                }
            });
    }
    drawGraph() {
        const chartArray = {
            ...pieChartArray,
            balloonText: '[[id]] [[standardDeviation]]%',
            dataProvider: this.assetsBreakdown.allocations,
            titleField: 'id',
            valueField: 'standardDeviation',
            colors: chartColors,
            allLabels: [
                {
                    text: 'Return ' + this.assetsBreakdown.currentSummary.rateOfReturn + '%',
                    align: 'center',
                    bold: true,
                    size: 12,
                    color: '#345',
                    y: 80,
                    id: 'text1'
                },
                {
                    text: 'Risk ' + this.assetsBreakdown.currentSummary.risk + '%',
                    align: 'center',
                    bold: true,
                    y: 100,
                    color: '#345',
                    size: 12,
                    id: 'text2'
                }]
        };
        this.policyChart = this.AmCharts.makeChart('chartdiv', chartArray);
    }
    back() {
        this._location.back();
    }
    savePolicy(form: NgForm) {
        this.planningService.saveEditPolicy(this.clientId, this.portfolioId, this.assetsBreakdown)
            .subscribe(result => {
                if (result) {
                    this.back();
                    //     form.resetForm();
                    //     this.assetsBreakdown = result;
                    //     this.drawGraph();
                    //   //  this.getEditPolicyDetail();
                    this.translate.get(['ALERT_MESSAGE.SUCCESS_TITLE', 'PORTFOLIO.EDIT_POLICY.SAVE_MESSAGE'])
                        .subscribe((res: string) => {
                            Swal(res['ALERT_MESSAGE.SUCCESS_TITLE'], res['PORTFOLIO.EDIT_POLICY.SAVE_MESSAGE'],
                                'success');
                        });
                }
            });
    }
    totalAllocation() {
        this.totalBreakDown = 0;
        this.assetsBreakdown.allocations.forEach(item => {
            this.totalBreakDown += item.standardDeviation;
        });
        this.drawGraph();
    }
    toggle() {
        $('#moreDetai').toggle();
    }
}
