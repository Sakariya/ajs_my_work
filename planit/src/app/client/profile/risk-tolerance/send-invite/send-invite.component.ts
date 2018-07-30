import { slideInOutAnimation } from '../../../../shared/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientProfileService } from '../../../service';
import { AppState, getFamilyMemberRiskPayload } from '../../../../shared/app.reducer';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { Location} from '@angular/common';

@Component({
    selector: 'app-send-invite',
    templateUrl: './send-invite.component.html',
    styleUrls: ['./send-invite.component.css'],
    animations: [slideInOutAnimation],
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})

export class SendInviteComponent implements OnInit {
    public clientId: string;
    public invite: any = {};
    public returnUrl: string;
    public personalId;

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private clientProfileService: ClientProfileService,
        private _location: Location
    ) { }

    ngOnInit() {
        this.invite.from = 'advisor@gmail.com';
        this.route.parent.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.personalId = this.route.snapshot.params['personalId'];
        if (this.personalId) {
            this.store
                .select(getFamilyMemberRiskPayload)
                .subscribe(data => {
                    if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                        const dataIndex = data['idMapping'][this.personalId];
                        this.invite.to = data['familyMembers'][dataIndex]['email'];
                    } else {
                        this.getFamilyMembersRisk();
                    }
                });
        }
    }

    getFamilyMembersRisk() {
        if (this.clientId != null) {
            this.clientProfileService.
                getFamilyMembersWithRisk(this.clientId).
                subscribe(result => {
                    const familyMembersRisk = this.clientProfileService.processFamilyMembersRiskData(result[0], result[1]);
                    const activeIndex = familyMembersRisk.findIndex((member) => (member.id === this.personalId));
                    this.invite.to = familyMembersRisk[activeIndex]['email'];
                });
        }
    }

    sendInvite() {
        this.clientProfileService.
            sendInvite(this.invite, this.personalId, this.clientId).
            subscribe(res => {
                this.back();
            },
            (errorResponse) => {
                Swal('Oops...', errorResponse.error.errorMessage, 'error');
            });
    }
    back() {
        this._location.back();
    }
}
