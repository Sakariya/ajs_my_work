import { AppState, getFamilyMemberRiskPayload } from '../../../../shared/app.reducer';
import { slideInOutAnimation } from '../../../../shared/animations';
import { ActivatedRoute } from '@angular/router';
import { ClientProfileService } from '../../../service';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { Location} from '@angular/common';

@Component({
    selector: 'app-send-reminder',
    templateUrl: './send-reminder.component.html',
    styleUrls: ['./send-reminder.component.css'],
    animations: [slideInOutAnimation],
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})

export class SendReminderComponent implements OnInit {

    public clientId: string;
    public reminder: any = {};
    public personalId;

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private clientProfileService: ClientProfileService,
        private _location: Location
    ) { }

    ngOnInit() {
        this.reminder.from = 'advisor@gmail.com';
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
                        this.reminder.to = data['familyMembers'][dataIndex]['email'];
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
                    this.reminder.to = familyMembersRisk[activeIndex]['email'];
                });
        }
    }

    sendReminder() {
        this.clientProfileService.
            sendReminder(this.reminder, this.personalId, this.clientId).
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
