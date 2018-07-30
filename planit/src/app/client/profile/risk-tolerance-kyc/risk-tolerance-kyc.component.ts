import { AppState, getkycQuestionsPayLoad, getFamilyMemberRiskPayload } from '../../../shared/app.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientProfileService } from '../../service';
import { Component, OnInit } from '@angular/core';
import { RiskGroups } from '../../client-models';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-risk-tolerance-kyc',
    templateUrl: './risk-tolerance-kyc.component.html',
    styleUrls: ['./risk-tolerance-kyc.component.css']
})

export class RiskToleranceKycComponent implements OnInit {
    familyMembersRisk: any;
    currTabIndex = -1;
    clientId;
    personalId;
    kycType;
    public riskGroup = RiskGroups;
    questionsArrId = {};
    personDetail = {};
    kycAnswers = {};
    kycAnswersApi = {};
    familyMembers;
    allowEdit = false;
    expandToggled = false;
    expandAll = false;
    answerProcessed = false;
    modifiedAnswers = {};
    pageLayout = {
        'left': ['CORE-4', 'CORE-5', 'CORE-6'],
        'right': ['CORE-1', 'CORE-2', 'CORE-3']
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private profileService: ClientProfileService,
        private store: Store<AppState>
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.personalId = this.route.snapshot.params['personalId'];
            this.kycType = 'CORE';
            this.getQuestions();
            this.store
                .select(getFamilyMemberRiskPayload)
                .subscribe(data => {
                    if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                        this.familyMembers = data['familyMembers'];
                        this.personDetail = this.familyMembers[data['idMapping'][this.personalId]];
                    } else {
                        this.getFamilymemberRisk();
                    }
                });
        });
    }

    isExist(questionId, option) {
        return this.kycAnswers[questionId].indexOf(option.id);
    }

    toggleEdit() {
        this.allowEdit = !this.allowEdit;
    }

    toggleExpand() {
        this.expandToggled = true;
        this.expandAll = !this.expandAll;
    }

    getSelected(i) {
        let allowSelect: Boolean;
        if (i === 0 && !this.expandToggled) {
            allowSelect = true;
        } else if (this.expandToggled) {
            allowSelect = this.expandAll;
        } else {
            allowSelect = false;
        }
        return allowSelect;
    }

    getFamilymemberRisk() {
        if (this.clientId != null) {
            this.profileService.
                getFamilyMembersWithRisk(this.clientId).
                subscribe(result => {
                    this.familyMembersRisk = this.profileService.processFamilyMembersRiskData(result[0], result[1]);
                });
        }
    }

    getQuestions() {
        this.store.select(getkycQuestionsPayLoad).subscribe(data => {
            if (data && data.hasOwnProperty(this.kycType)) {
                this.questionsArrId = data[this.kycType];
                this.getAnswers();
            } else {
                this.profileService.getKycquestions(this.kycType, data);
            }
        });
    }

    getAnswers() {
        this.profileService.getKycAnswersByPerson(this.clientId, this.personalId).subscribe(answerResults => {
            this.kycAnswersApi = answerResults;
            this.processAnswers(answerResults.answers);
        });
    }

    processAnswers(answers) {
        for (const queId in answers) {
            if (answers.hasOwnProperty(queId)) {
                const answerArr = answers[queId].split(':');
                if (answerArr.length === 1) {
                    this.kycAnswers[queId] = this.questionsArrId[queId]['answerJson'][answerArr[0]][0];
                    this.modifiedAnswers[queId] = this.kycAnswers[queId]['id'];
                } else {
                    this.kycAnswers[queId] = answerArr;
                }
            }
        }
        this.answerProcessed = true;
    }

    editkyc() {
        const reqObj = {};
        for (const queId in this.kycAnswers) {
            if (this.kycAnswers.hasOwnProperty(queId)) {
                if (this.modifiedAnswers.hasOwnProperty(queId)) {
                    reqObj[queId] = this.modifiedAnswers[queId];
                } else {
                    reqObj[queId] = this.kycAnswers[queId].join(':');
                }
            }
        }
        this.kycAnswersApi['answers'] = reqObj;
        this.profileService.updateKycAnswerByPerson(this.kycAnswersApi, this.clientId, this.personalId).subscribe(result => {

        });
        this.toggleEdit();
    }

    onDropDownChange(questionId) {
        const actualAnswer = Object.assign({}, this.kycAnswers[questionId]);
        this.modifiedAnswers[questionId] = actualAnswer.id;
    }

    memberSwitch(memberId) {
        this.router.navigate(['/client/' + this.clientId + '/profile/risk-tolerance/' + memberId + '/know-your-client']);
    }
}
