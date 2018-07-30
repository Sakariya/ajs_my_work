import { Component, OnInit, ViewChild, OnDestroy, } from '@angular/core';
import { NgbDropdownConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { RiskGroups } from '../../client-models';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ClientProfileService } from '../../service';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { AppState, getFamilyMemberPayload, getFamilyMemberRiskPayload } from '../../../shared/app.reducer';

@Component({
    selector: 'app-risk-tolerance-results',
    templateUrl: './risk-tolerance-results.component.html',
    styleUrls: ['./risk-tolerance-results.component.css'],
    providers: [NgbDropdownConfig]
})
export class RiskToleranceResultsComponent implements OnInit, OnDestroy {

    public clientId;
    public personalId;
    public personDetails: any;
    public familyMembersRisk;
    public count: number;
    public agreed: any = {};
    public riskGroup = RiskGroups;
    public riskProfileId;
    public riskQuestionnaire;
    public questions = [];
    public allClosed = false;
    public personAnswers: Object = {};
    public IsSelected: boolean;
    public keys;
    public comment;
    public locale = 'en';
    public keyDifferences;
    private chart: AmChart;
    public questionId;
    @ViewChild('t') public tooltip: NgbTooltip;

    public displayTooltip(): void {
        const isOpen = this.tooltip.isOpen();
        if (!isOpen) {
            this.tooltip.open();
        }
    }
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private profileService: ClientProfileService,
        private store: Store<AppState>,
        config: NgbDropdownConfig,
        public translate: TranslateService,
        private AmCharts: AmChartsService
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        config.autoClose = false;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.personalId = params['personalId'];
            this.locale = this.translate.store.currentLang;
            this.store
                .select(getFamilyMemberRiskPayload)
                .subscribe(data => {
                    if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                        this.familyMembersRisk = data['familyMembers'];
                        this.personDetails = this.familyMembersRisk[data['idMapping'][this.personalId]];
                        this.riskProfileId = this.personDetails.memberRisk.questionnaireType;
                        this.personAnswers = this.personDetails.memberRisk.answers;
                        this.keys = Object.keys(this.personAnswers);
                        this.keyDifferences = this.personDetails.memberRisk.keyDifferences;
                        this.getRiskQuestionnaire();
                        this.removeAccordionHref();
                    } else {
                        this.getFamilyMembersRisk();
                        this.removeAccordionHref();
                    }
                });
        });
    }

    removeAccordionHref() {
        setTimeout(() => {
            $('.ui-accordion').find('a').each(function () {
                $(this).removeAttr('href');
            });
        }, 1000);
    }

    getFamilyMembersRisk() {
        if (this.clientId != null) {
            this.profileService.
                getFamilyMembersWithRisk(this.clientId).
                subscribe(result => {
                    this.familyMembersRisk = this.profileService.processFamilyMembersRiskData(result[0], result[1]);
                });
        }
    }

    getRiskQuestionnaire() {
        if (this.riskProfileId != null && this.locale != null) {
            this.profileService.getRiskQuestions(this.clientId, this.riskProfileId, this.locale).subscribe(res => {
                this.riskQuestionnaire = res;
                this.questions = this.riskQuestionnaire.questions;
            });
        }
    }

    changeRisk(form: NgForm) {
        this.profileService.
            updateAgreedRisk(this.agreed, this.personalId, this.clientId).
            subscribe(res => {
                this.personDetails.memberRisk.agreedScore = this.agreed.riskScore;
                this.personDetails.memberRisk.comments = this.agreed.comment;
                this.displayTooltip();
                form.resetForm();
            },
                (errorResponse) => {
                    Swal('Oops...', errorResponse.error.errorMessage, 'error');
                });
    }

    optSelected(oid, qid) {
        this.IsSelected = false;
        if (this.keys.includes(qid)) {
            if (this.personAnswers[qid]['selectedAns'] === oid) {
                this.IsSelected = true;
            } else if (this.personAnswers[qid]['selectedAns'].includes(':')) {
                const opts = this.personAnswers[qid]['selectedAns'].split(':');
                opts.forEach(opt => {
                    if (opt === oid) {
                        this.IsSelected = true;
                    }
                });
            }
        }
    }

    makeChart(qid, event) {
        this.questionId = qid;
        $('.popover').each(function (index) {
            if (event.target.nextElementSibling.id !== $(this).attr('id')) {
                $(this).find('.sidebar_action_icon').click();
            }
        });
        setTimeout(() => {
            this.chart = this.AmCharts.makeChart('chartdiv', this.makeOptions(this.makeDataProvider(qid)));
        }, 50);
    }

    makeDataProvider(qid) {
        const dataProvider = [];
        const diffKeys = Object.keys(this.keyDifferences);
        const currentGroup = this.personDetails['memberRisk']['calculatedRiskGroup'];
        if (diffKeys.includes(qid)) {
            for (const riskGroupId in this.riskGroup) {
                if (this.riskGroup.hasOwnProperty(riskGroupId)) {
                    dataProvider.push({
                        riskGroups: this.riskGroup[riskGroupId],
                        riskScores: this.keyDifferences[qid][riskGroupId],
                        color: (riskGroupId === currentGroup ? '#9999FF' : '#CCDDEE'),
                    });
                }
            }
        }
        return dataProvider;
    }

    makeOptions(dataProvider) {
        return {
            'type': 'serial',
            'theme': 'light',
            'dataProvider': dataProvider,
            'valueAxes': [{
                'axisAlpha': 0,
                'gridColor': '#ddd',
                'gridThickness': 0.8,
                'gridAlpha': 1,
                'dashLength': 0,
                'maximum': 100,
                'autoGridCount': false,
                'gridCount': 2,
                'tickLength': 0,
                'title': '%',
                'color': '#bbb',
                'titleColor': '#bbb'
            }],
            'balloon': {
                'enabled': false
            },
            'gridAboveGraphs': false,
            'startDuration': 1,
            'graphs': [{
                'fillAlphas': 1,
                'fillColorsField': 'color',
                'lineAlpha': 0.2,
                'type': 'column',
                'fixedColumnWidth': 70,
                'valueField': 'riskScores'
            }],
            'chartCursor': {
                'enabled': true,
                'zoomable': false,
                'valueBalloonsEnabled': false,
                'cursorAlpha': 0.2,
                'categoryBalloonColor': '#99AABB',
            },
            'categoryField': 'riskGroups',
            'categoryAxis': {
                'axisColor': '#ddd',
                'gridPosition': 'start',
                'gridAlpha': 0,
                'tickLength': 0,
                'color': '#99AABB'
            },
            'export': {
                'enabled': true
            }
        };
    }

    ngOnDestroy() {
        if (this.chart) {
            this.AmCharts.destroyChart(this.chart);
        }
    }
    memberSwitch(memberId) {
        this.router.navigate(['/client/' + this.clientId + '/profile/risk-tolerance/' + memberId + '/results']);
    }
}


