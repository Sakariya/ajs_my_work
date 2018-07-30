import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import {
    AppState,
    getFamilyMemberRiskPayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-risk-tile',
    templateUrl: './risk-tile.component.html',
    styleUrls: ['./risk-tile.component.css']
})
export class RiskTileComponent implements OnInit {

    public familyMembers: any;
    @Input() public clientId;

    constructor(
        private store: Store<AppState>
    ) { }

    ngOnInit() {
        this.store
            .select(getFamilyMemberRiskPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembers = data['familyMembers'];
                }
            });
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
