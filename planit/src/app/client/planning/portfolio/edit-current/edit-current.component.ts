import { slideInOutAnimation } from '../../../../shared/animations';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { PlanningService } from '../../../service';
import { pieChartArray } from '../../../client-models/portfolio-charts';
import { chartColors } from '../../../client-models/chart-colors';

@Component({
    selector: 'app-edit-current',
    templateUrl: './edit-current.component.html',
    styleUrls: ['./edit-current.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class EditCurrentComponent implements OnInit {
    clientId;
    portfolioId;
    private policyChart: AmChart;
    public graphColors = ['#77AAFF', '#66CCEE', '#AADD55', '#FFAA22', '#FF6644', '#FF44AA', '#CC77FF'];
    public percentMask = {
        align: 'left',
        prefix: '',
        suffix: '%',
        decimal: '.'
    };
    public currencyMask = {
        prefix: '$',
        thousands: ',',
        decimal: '.'
    };
    assetsBreakdown;
    isDetailExpand = false;
    isCost = false;
    isIncome = false;
    totalSum = 0;
    totalAmount = 0;
    cashAllocation;
    defaultAllocation;
    filterdAssetsBreakdown;
    defaultAmount;
    filterAllocation;
    allocation;
    currentSummary;
    incomeDistribution;
    constructor(
        private _location: Location,
        private AmCharts: AmChartsService,
        private router: Router,
        private route: ActivatedRoute,
        private planningService: PlanningService
    ) {
        this.route.parent.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.portfolioId = this.route.snapshot.parent.params['portfolioId'];
    }

    ngOnInit() {
        this.planningService.getAllocationDetails(this.clientId, this.portfolioId).subscribe(result => {
            this.allocation = result;
            this.allocation['access'] = true;
            this.totalAllocation();
            this.cashAllocation = this.allocation.allocations[0].standardDeviation;
            this.defaultAllocation = this.allocation.allocations[0].standardDeviation;
            this.defaultAmount = this.allocation.allocations[0].currentAmount;
            setTimeout(() => {
                this.drawGraph();
            }, 200);
        });
    }

    drawGraph() {
        const chartArray = {
            ...pieChartArray,
            balloonText: '[[id]] [[standardDeviation]]%',
            dataProvider: this.allocation.allocations,
            titleField: 'id',
            valueField: 'standardDeviation',
            colors: chartColors,
            allLabels: [
                {
                    text: 'Return ' + this.allocation.currentSummary.rateOfReturn + '%',
                    align: 'center',
                    bold: false,
                    size: 14,
                    color: '#345',
                    y: 80,
                    id: 'text1'
                },
                {
                    text: 'Risk ' + this.allocation.currentSummary.risk + '%',
                    align: 'center',
                    bold: false,
                    y: 100,
                    color: '#345',
                    size: 14,
                    id: 'text2'
                }]
        };
        this.policyChart = this.AmCharts.makeChart('chartdiv', chartArray);
    }

    updateGraph(event, i) {
        // for calculating amount
        let sum = 0;
        this.filterdAssetsBreakdown = this.allocation.allocations.filter(result => result.displayOrder !== 1);
        this.filterdAssetsBreakdown.forEach(element => {
            sum = (sum + element.standardDeviation);
        });
        if (event > 0 && sum < 100) {
            this.allocation.allocations[0].standardDeviation = (this.allocation.allocations[0].standardDeviation - event);
            this.allocation.allocations[0].standardDeviation = 100 - sum;
        } else if (sum <= 100) {
            this.allocation.allocations[0].standardDeviation = 100 - sum;
        } else {
            this.allocation.allocations[0].currentAmount = 0;
        }
        this.amountCalculate();
        this.cashAllocation = this.allocation.allocations[0].standardDeviation;
        this.drawGraph();
    }

    amountCalculate() {
        let amt;
        let temp;
        this.allocation.allocations.forEach(element => {
            amt = element.standardDeviation / 100;
            temp = Math.round((this.defaultAmount) * amt);
            element.currentAmount = temp;
        });
        this.totalAllocation();
    }
    totalAllocation() {
        this.totalSum = 0;
        this.totalAmount = 0;
        this.allocation.allocations.forEach(element => {
            this.totalSum += element.standardDeviation;
            this.totalAmount += element.currentAmount;
        });
    }

    saveCurrent(f) {
        if (this.totalSum === 100) {
            delete this.allocation['access'];
            const saveData = this.allocation;
            this.planningService.saveEditPolicy(this.clientId, this.portfolioId, saveData).subscribe(result => {
                Swal('Success', 'Changes saved successfully.', 'success');
            });
            this._location.back();
        } else {
            Swal('Error', 'Check your inputs', 'error');
        }
    }

    toggle() {
        $('#moreDetai').toggle();
    }

    back() {
        this._location.back();
    }
}
