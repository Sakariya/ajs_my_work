import { Component, OnInit, Input } from '@angular/core';
import { ClientProfileService } from '../../service';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import * as $ from 'jquery';
import {
    AppState,
    getIsGoalLoaded,
    getGoalPayload,
    getClientPayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-goal-tile',
    templateUrl: './goal-tile.component.html',
    styleUrls: ['./goal-tile.component.css']
})
export class GoalTileComponent implements OnInit {
    public data: any[];
    @Input() public clientId;

    constructor(
        private profileService: ClientProfileService,
        private store: Store<AppState>
    ) { }

    ngOnInit() {
        this.store
            .select(getIsGoalLoaded)
            .pipe(take(1))
            .subscribe((loaded: boolean) => {
                if (!loaded) {
                    this.profileService.getClientGoalPayload(this.clientId);
                }
            });
        this.store
            .select(getGoalPayload)
            .subscribe(data => (this.data = data));

    }

    public changeGoalAction(index: number) {
        if ($('#dropdownGoalAction' + index).is(':visible')) {
            $('.dropdown-goal-action').hide();
        } else {
            $('.dropdown-goal-action').hide();
            $('#dropdownGoalAction' + index).toggle();
        }
    }

}
