import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClientProfileService } from '../../client/service';
import { AppState, getFamilyMemberRiskPayload, getFamilyMemberPayload } from '../../shared/app.reducer';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-family-member-dropdown',
    templateUrl: './family-member-dropdown.component.html',
    styleUrls: ['./family-member-dropdown.component.css'],
    providers: [NgbDropdownConfig]
})
export class FamilyMemberDropdownComponent implements OnInit {
    @Input() public clientId: string;
    @Input() public personalId: string;
    @Input() public typeId: string;
    public familyMembersRisk;
    public personDetails = {};
    public familyMembers = [];
    @Output() public memberSwitch = new EventEmitter();

    constructor(
        private route: ActivatedRoute,
        private profileService: ClientProfileService,
        private store: Store<AppState>,
        config: NgbDropdownConfig
    ) {
        config.autoClose = true;
    }

    ngOnInit() {
        if (this.typeId === 'risk') {
            this.store.select(getFamilyMemberRiskPayload).subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembersRisk = data['familyMembers'];
                    this.personDetails = this.familyMembersRisk[data['idMapping'][this.personalId]];
                    this.filterMembers();
                } else {
                    if (this.clientId != null) {
                        this.profileService.
                            getFamilyMembersWithRisk(this.clientId).
                            subscribe(result => {
                                this.familyMembersRisk = this.profileService.processFamilyMembersRiskData(result[0], result[1]);
                            });
                    }
                }
            });
        } else if (this.typeId === 'family') {
            this.store.select(getFamilyMemberPayload).subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembers = Object.assign([], data['familyMembers']);
                    this.personDetails  = Object.assign({}, this.familyMembers[data['idMapping'][this.personalId]]);
                } else {
                    this.profileService.getFamilyMembers(this.clientId).subscribe(result => {
                        this.profileService.processFamilyMembers(result);
                    });
                }
            });
        }
    }

    filterMembers() {
        this.familyMembers = [];
        for (const member of this.familyMembersRisk) {
            if (member.memberRisk) {
                this.familyMembers.push(member);
            }
        }
    }

    memberClick(member) {
        this.personDetails = member;
        this.memberSwitch.emit(member.id);
    }

}
