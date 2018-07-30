import { CalculateAgeFromDate } from '../../core/utility/calculate-date-to-age';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import {
    AppState,
    getIsClientLoaded,
    getIsDocumentLoaded,
    getFamilyMemberPayload,
    getClientAddressPayload,
    getFamilyMemberRiskPayload,
    getIsTaskLoaded,
    getIsGoalLoaded,
    getIsPortfolioLoaded,
    getIsAllocLoaded,
    getIsNetworthInvestmentLoaded,
    getkycQuestionsPayLoad
} from '../../shared/app.reducer';

import {
    SetFamilyMembers,
    SetFamilyMembersRisk,
    SetDocuments,
    SetClient,
    SetClientAddress,
    SetTasks,
    SetGoal,
    SetPortfolio,
    SetAlloc,
    SetNetworthInvestment,
    SetKycQuestions
} from '../../shared/app.actions';

import {
    FamilyMember,
    ProfileProgress
} from '../client-models';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class ClientProfileService {

    constructor(
        private http: HttpClient,
        private store: Store<AppState>,
        private calculateAgeFromDate: CalculateAgeFromDate
    ) { }

    getFamilyPayload(clientId: string) {
        this.store
            .select(getIsClientLoaded)
            .pipe(take(1))
            .subscribe(loaded => {
                if (!loaded) {
                    this.http
                        .get('/client/' + clientId, {})
                        .map((response: Response) => {
                            return response;
                        })
                        .subscribe(data => {
                            this.store.dispatch(new SetClient(data));
                        });
                }
            });
    }

    getFamilyMembers(clientId: string): Observable<FamilyMember> {
        return this.http.get('/client/' + clientId + '/familymember')
            .map(response => <any>(<FamilyMember>response));
    }

    getFamilyMembersRisk(clientId: string): Observable<any> {
        return this.http.get('/client/' + clientId + '/risk')
            .map(response => <any>(<any>response));
    }

    getFamilyMembersWithRisk(clientId: string): Observable<any> {
        return Observable.forkJoin(
            this.http.get('/client/' + clientId + '/familymember').map(response => <any>(<FamilyMember>response)),
            this.http.get('/client/' + clientId + '/risk').map(response => <any>(<any>response))
        );
    }

    getClientFamilyMembers(clientId: string) {
        this.store
            .select(getFamilyMemberPayload)
            .pipe(take(1))
            .subscribe(data => {
                if (!data.hasOwnProperty('familyMembers')) {
                    this.http
                        .get('/client/' + clientId + '/familymember', {})
                        .map(response => <any>(<FamilyMember>response))
                        .subscribe(response => {
                            this.processFamilyMembers(response);
                        });
                }
            });
    }

    getClientFamilyMembersRisk(clientId: string) {
        this.store
            .select(getFamilyMemberRiskPayload)
            .pipe(take(1))
            .subscribe(data => {
                if (!data.hasOwnProperty('familyMembers')) {
                    this.getFamilyMembersWithRisk(clientId)
                        .subscribe(response => {
                            this.processFamilyMembersRiskData(response[0], response[1]);
                        });
                }
            });
    }

    getClientAddress(clientId: string) {
        this.store
            .select(getClientAddressPayload)
            .pipe(take(1))
            .subscribe(data => {
                if (!data.hasOwnProperty('familyMembers')) {
                    this.http
                        .get('/client/' + clientId + '/address', {})
                        .map(response => <any>(<any>response))
                        .subscribe(response => {
                            this.store.dispatch(new SetClientAddress(response));
                        });
                }
            });
    }

    getClientDocumentPayloads(clientId: string) {
        this.store
            .select(getIsDocumentLoaded)
            .pipe(take(1))
            .subscribe(loaded => {
                this.http
                    .get('/document/' + clientId + '/list', {})
                    .map((response: any[]) => {
                        return response;
                    })
                    .subscribe(data => this.store.dispatch(new SetDocuments(data)));
            });
    }

    getClientTaskPayloads(clientId: string) {
        this.store
            .select(getIsTaskLoaded)
            .pipe(take(1))
            .subscribe(loaded => {
                this.http
                    .get('/task/' + clientId + '/list', {})
                    .map((response: any[]) => {
                        return response;
                    })
                    .subscribe(data => this.store.dispatch(new SetTasks(data)));
            });
    }

    getClientGoalPayload(clientId: string) {
        this.store
            .select(getIsGoalLoaded)
            .pipe(take(1))
            .subscribe(loaded => {
                if (!loaded) {
                    this.http
                        .get('/goal/' + clientId + '/list', {})
                        .map((response: any[]) => {
                            return response;
                        })
                        .subscribe(data => this.store.dispatch(new SetGoal(data)));
                }
            });
    }

    getClientPortfolioPayload(clientId: string) {
        this.store
            .select(getIsPortfolioLoaded)
            .pipe(take(1))
            .subscribe(loaded => {
                if (!loaded) {
                    this.http
                        .get('/portfolio/' + clientId + '/list', {})
                        .map((response: any[]) => {
                            return response;
                        })
                        .subscribe(data => this.store.dispatch(new SetPortfolio(data)));
                }
            });
    }

    getClientNetworthInvestmentPayload(clientId: string) {
        this.store
            .select(getIsNetworthInvestmentLoaded)
            .pipe(take(1))
            .subscribe(loaded => {
                this.http
                    .get('/accounts/' + clientId + '/list', {})
                    .map((response: any[]) => {
                        return response;
                    })
                    .subscribe(data => this.store.dispatch(new SetNetworthInvestment(data)));
            });
    }

    getClientAllocPayload(clientId: string) {
        return this.store
            .select(getIsAllocLoaded)
            .pipe(take(1))
            .subscribe(loaded => {
                if (!loaded) {
                    this.http
                        .get('/assetAlloc/' + clientId + '/list', {})
                        .subscribe(data => this.store.dispatch(new SetAlloc(data[0])));
                }
            });
    }

    processFamilyMembers(familyMembers) {
        const familyMemberIdMapping = {};
        familyMembers.forEach((member, key) => {
            const relation_staus = this.checkStatus(member.relation);
            familyMembers[key]['btnColor'] = relation_staus['btnColor'];
            familyMembers[key]['relation_staus'] = relation_staus['relation'];
            familyMembers[key]['age'] = this.calculateAgeFromDate.calculate(member.birthDate);
            familyMemberIdMapping[member.id] = key;
        });
        const familyMemberPayload = {
            'idMapping': familyMemberIdMapping,
            'familyMembers': familyMembers
        };
        this.store.dispatch(new SetFamilyMembers(familyMemberPayload));
        return familyMembers;
    }

    processFamilyMembersRiskData(familyMembers, memberRisks) {
        this.processFamilyMembers(familyMembers);
        const familyMemberIdMapping = {};
        familyMembers.forEach((member, key) => {
            const relation_staus = this.checkStatus(member.relation);
            familyMembers[key]['btnColor'] = relation_staus['btnColor'];
            familyMembers[key]['relation_staus'] = relation_staus['relation'];
            familyMembers[key]['age'] = this.calculateAgeFromDate.calculate(member.birthDate);
            familyMemberIdMapping[member.id] = key;
            memberRisks.forEach((risk, risk_key) => {
                const splitData = risk['self'].split('/');
                if (familyMembers[key]['id'] === splitData[splitData.length - 1]) {
                    familyMembers[key]['memberRisk'] = risk;
                    if (!risk.completedDate) {
                        const days = this.getDays(risk.inviteSentDate);
                        familyMembers[key]['memberRisk']['isPending'] = days > 14 ? true : false;
                    }
                }
            });
        });
        const familyMemberRiskPayload = {
            'idMapping': familyMemberIdMapping,
            'familyMembers': familyMembers
        };
        this.store.dispatch(new SetFamilyMembersRisk(familyMemberRiskPayload));
        return familyMembers;
    }

    private getDays(inviteSentDate) {
        const invitedDate: Date = new Date(inviteSentDate);
        const currentDate: Date = new Date();
        const diff = Math.abs(invitedDate.getTime() - currentDate.getTime());
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        return diffDays;
    }

    checkStatus(status) {
        let btnColor;
        switch (status) {
            case 1:
                btnColor = { btnColor: 'client', relation: 'Client 1' };
                break;
            case 2:
                btnColor = { btnColor: 'spouse', relation: 'Client 2' };
                break;
            case 3:
                btnColor = { btnColor: 'childs', relation: 'Daughter' };
                break;
            case 4:
                btnColor = { btnColor: 'childs', relation: 'Son' };
                break;
            case 5:
                btnColor = { btnColor: 'childs', relation: 'Daughter' };
                break;
            case 6:
                btnColor = { btnColor: 'siblings', relation: 'Brother' };
                break;
            case 7:
                btnColor = { btnColor: 'siblings', relation: 'Sister' };
                break;
            case 8:
                btnColor = { btnColor: 'parents', relation: 'Mother' };
                break;
            case 9:
                btnColor = { btnColor: 'parents', relation: 'Father' };
                break;
            case 10:
                btnColor = { btnColor: 'grand-child', relation: 'Grandson' };
                break;
            case 11:
                btnColor = { btnColor: 'grand-child', relation: 'Granddaughter' };
                break;
            default:
                btnColor = { btnColor: 'other', relation: 'Other Dependant' };
        }
        return btnColor;
    }

    addNewClient(clientDetail) {
        return this.http.post('/client/', clientDetail)
            .map((response: Response) => {
                return response;
            })
            .catch(error => Observable.throw(error));
    }

    AddFamilyMember(familyMember: FamilyMember, clientId: string): Observable<String> {
        return this.http.post('/client/' + clientId + '/familymember', familyMember)
            .map((response: Response) => {
                return response;
            })
            .catch(error => Observable.throw(error));
    }

    getProfileSummary(familyId: string): Observable<ProfileProgress> {
        return this.http.get('/client/' + familyId + '/progress')
            .map(response => <any>(<ProfileProgress>response));
    }

    uploadAvatar(avatar: any, clientId: string, personId: string): Observable<String> {
        return this.http.post('/client/' + clientId + '/member/' + personId + '/avatar', avatar)
            .map((response: Response) => {
                return response;
            })
            .catch(error => Observable.throw(error));
    }

    getFamilyAddress(familyId: string) {
        return this.http.get('/client/' + familyId + '/address');
    }

    sendInvite(inviteEmail: any, familyId: string, clientId: string): Observable<any> {
        return this.http.post('/client/' + clientId + '/risk/' + familyId + '/invite', inviteEmail)
            .map((response: Response) => {
                return response;
            })
            .catch(error => Observable.throw(error));
    }

    sendReminder(reminderEmail: any, familyId: string, clientId: string): Observable<any> {
        return this.http.post('/client/' + clientId + '/risk/' + familyId + '/remind', reminderEmail)
            .map((response: Response) => {
                return response;
            })
            .catch(error => Observable.throw(error));
    }

    getFamilyData(familyId: string) {
        return this.http.get('/client/' + familyId);
    }

    updateFamilyDetails(editFamilymember: any, familyId: string, personId: string) {
        return this.http.post('/client/' + familyId + '/familymember/' + personId, editFamilymember)
            .map(response => <any>(<any>response));
    }
    updateFamilyDataDetails(updateDataofFamily: any, familyId: string) {
        return this.http.post('/client/' + familyId, updateDataofFamily).map(response => <any>(<any>response));
    }

    updateAddressDetails(updateAdd: any, familyId: string, addressId: string) {
        return this.http.post('/client/' + familyId + '/address/' + addressId, updateAdd).map(response => <any>(<any>response));
    }

    getCountryLanguageProvince(): Observable<any> {
        return Observable.forkJoin(
            this.http.get('./assets/country.json').map(response => <any>(<any>response)),
            this.http.get('./assets/province.json').map(response => <any>(<any>response)),
            this.http.get('./assets/languages.json').map(response => <any>(<any>response))
        );
    }

    getKycquestions(kycType, storeData) {
        return this.http.get('/kyc/' + kycType + '/questions')
            .subscribe(response => {
                this.processQuestions(kycType, storeData, response['questions']);
            });
    }

    processQuestions(kycType, storeData, questions) {
        const questionsArrId = {};
        questions.forEach(question => {
            question['answerJson'] = this.convertArrayToJson(question.options, 'id');
            questionsArrId[question.id] = question;
        });
        storeData[kycType] = questionsArrId;
        const sData = Object.assign({}, storeData);
        this.store.dispatch(new SetKycQuestions(sData));
    }

    convertArrayToJson(array, filterKey) {
        const json = {};
        array.forEach(element => {
            const filter = element[filterKey];
            if (!json.hasOwnProperty(filter)) {
                json[filter] = [];
            }
            json[filter].push(element);
        });
        return json;
    }

    getKycAnswersByPerson(familyId: string, personId: string): Observable<any> {
        return this.http.get('/client/' + familyId + '/kyc/' + personId);
    }

    updateKycAnswerByPerson(updateQA: any, familyId: string, personId: string): Observable<any> {
        return this.http.post('/client/' + familyId + '/kyc/' + personId, updateQA).map(response => <any>(<any>response));
    }

    updateAgreedRisk(changeScore: any, personId: string, familyId: string): Observable<any> {
        return this.http.post('/client/' + familyId + '/risk/' + personId + '/agreed', changeScore)
            .map((response: Response) => {
                return response;
            })
            .catch(error => Observable.throw(error));
    }

    getRiskQuestions(familyId: string, riskProfileId: string, locale: string): Observable<any> {
        return this.http.get('/client/' + familyId + '/risk/' + riskProfileId + '/questions?locale=' + locale + '-ca')
            .map(response => <any>(<any>response));
    }

}
