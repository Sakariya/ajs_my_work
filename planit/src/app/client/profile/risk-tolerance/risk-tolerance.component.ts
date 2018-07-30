import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientProfileService } from '../../service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import {
    AppState,
    getFamilyMemberPayload,
    getFamilyMemberRiskPayload
} from '../../../shared/app.reducer';
import { RiskGroups } from '../../client-models';
@Component({
    selector: 'app-risk-tolerance',
    templateUrl: './risk-tolerance.component.html',
    styleUrls: ['./risk-tolerance.component.css']
})

export class RiskToleranceComponent implements OnInit {
    public familyMembersRisk: any;
    public clientId: string;
    public riskGroup = RiskGroups;

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private profileService: ClientProfileService
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {
        this.store
            .select(getFamilyMemberRiskPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembersRisk = data['familyMembers'];
                } else {
                    this.getFamilyMembersRisk();
                }
            });
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

    public changeRiskAction(index: number) {
        if ($('#dropdownQuestionnaire' + index).is(':visible')) {
            $('#dropdownRiskAction' + index).hide();
        } else {
            if ($('#dropdownRiskAction' + index).is(':visible')) {
                $('.dropdown-risk-action').hide();
            } else {
                $('.dropdown-risk-action').hide();
                $('#dropdownRiskAction' + index).toggle();
            }
        }
    }

    public changeQuestionnaire(index: number) {
        $('#dropdownQuestionnaire' + index).toggle();
    }
}
