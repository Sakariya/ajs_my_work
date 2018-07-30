import { Component, OnInit, Input } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { APIService } from '../../../api.service';
import { Store } from '@ngrx/store';
import {
    AppState,
    getFamilyMemberRiskPayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-colaboration-tile',
    templateUrl: './colaboration-tile.component.html',
    styleUrls: ['./colaboration-tile.component.css']
})
export class ColaborationTileComponent implements OnInit {
    @Input() public clientId;
    public client1: any;
    public client2: any;

    constructor(
        private apiService: APIService,
        private store: Store<AppState>
    ) { }

    ngOnInit() {
        this.store
            .select(getFamilyMemberRiskPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    const client1Index = data['familyMembers'].findIndex(member => member.relation === 1);
                    const client2Index = data['familyMembers'].findIndex(member => member.relation === 2);
                    this.client1 = data['familyMembers'][client1Index];
                    this.client2 = data['familyMembers'][client2Index];
                }
            });
    }

}
