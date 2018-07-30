import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { APIService } from '../../../api.service';
import { Store } from '@ngrx/store';
import {
    AppState,
    getFamilyMemberPayload,
    getClientAddressPayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-family-tile',
    templateUrl: './family-tile.component.html',
    styleUrls: ['./family-tile.component.css']
})
export class FamilyTileComponent implements OnInit {

    @ViewChild('entities') public entities: NgbTooltip;
    @ViewChild('fmembers') public fmembers: NgbTooltip;

    @Input() public clientId;
    public familyMembers: any;
    public clientAddresses: any;

    constructor(
        private apiService: APIService,
        private permissionsService: NgxPermissionsService,
        private store: Store<AppState>
    ) { }

    ngOnInit() {
        const perm = ['ADVISOR'];
        this.permissionsService.loadPermissions(perm);

        this.store
            .select(getFamilyMemberPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembers = data['familyMembers'];
                }
            });

        this.store
            .select(getClientAddressPayload)
            .subscribe(addresses => {
                this.clientAddresses = addresses;
            });
    }

    getRelation(status: number) {
        switch (status) {
            case 1:
                return 'Client 1';
            case 2:
                return 'Client 2';
            case 3:
                return 'Daughter';
            default:
                return '';
        }
    }

}
