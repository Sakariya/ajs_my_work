import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ClientProfileService } from '../service';
import * as _ from 'lodash';
import {
    AppState,
    getClientPayload,
    getIsClientLoaded,
    getFamilyMemberRiskPayload
} from '../../shared/app.reducer';


@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit {

    public clientId: string;
    public familyName: string;
    public clientProfile: string;
    public spouseProfile: string;
    public people: any;

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private profileService: ClientProfileService
    ) {
        this.route.params.subscribe(params => {
            this.clientId = params['clientId'];
            localStorage.setItem('currentClientId', this.clientId);
        });
        window.scrollTo(0, 0);
    }

    ngOnInit() {
        this.store
            .select(getIsClientLoaded)
            .pipe(take(1))
            .subscribe((loaded: boolean) => {
                if (!loaded) {
                    this.profileService.getClientDocumentPayloads(this.clientId);
                    this.profileService.getClientFamilyMembersRisk(this.clientId);
                    this.profileService.getClientAddress(this.clientId);
                    this.profileService.getClientTaskPayloads(this.clientId);
                    this.profileService.getClientGoalPayload(this.clientId);
                    this.profileService.getClientPortfolioPayload(this.clientId);
                    this.profileService.getClientAllocPayload(this.clientId);
                    this.profileService.getClientNetworthInvestmentPayload(this.clientId);
                    this.store
                        .select(getFamilyMemberRiskPayload)
                        .subscribe(data => {
                            if (data.hasOwnProperty('familyMembers')) {
                                this.people = data['familyMembers'];
                                this.familyName = this.getFamilyName();
                            }
                        });
                } else {
                    this.store
                        .select(getFamilyMemberRiskPayload)
                        .subscribe(data => {
                            if (data.hasOwnProperty('familyMembers')) {
                                this.people = data['familyMembers'];
                                this.familyName = this.getFamilyName();
                            }
                        });
                }
            });
    }

    private getClientPayload() {
        const clientIndex: number = _.findIndex(
            this.people,
            item => item.relation === 1
        );
        return this.people[clientIndex];
    }

    private getSpousePayload() {
        const spouseIndex: number = _.findIndex(
            this.people,
            item => item.relation === 2
        );
        if (spouseIndex >= 0) {
            return this.people[spouseIndex];
        }
        return null;
    }

    private getFamilyName() {
        if (this.people.length === 1) {
            return this.people[0].firstName + ' ' + this.people[0].lastName;
        } else {
            const clientIndex: number = _.findIndex(
                this.people,
                item => item.relation === 1
            );
            const spouseIndex: number = _.findIndex(
                this.people,
                item => item.relation === 2
            );
            if (clientIndex >= 0) {
                if (spouseIndex < 0) {
                    return (
                        this.people[clientIndex].firstName +
                        ' ' +
                        this.people[clientIndex].lastName
                    );
                } else {
                    if (
                        this.people[clientIndex].lastName ===
                        this.people[spouseIndex].lastName
                    ) {
                        return (
                            this.people[clientIndex].firstName +
                            ' & ' +
                            this.people[spouseIndex].firstName +
                            '<br/>  ' +
                            this.people[clientIndex].lastName
                        );
                    } else {
                        return (
                            this.people[clientIndex].firstName +
                            ' ' +
                            this.people[clientIndex].lastName +
                            '<br/>& ' +
                            this.people[spouseIndex].firstName +
                            ' ' +
                            this.people[spouseIndex].lastName
                        );
                    }
                }
            }
        }
    }

    getMarried() {
        return this.getSpousePayload() && this.getClientPayload();
    }

}
