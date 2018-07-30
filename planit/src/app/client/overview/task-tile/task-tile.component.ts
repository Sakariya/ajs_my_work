import { AppState, getTaskPayloads } from '../../../shared/app.reducer';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { APIService } from '../../../api.service';
import { Store } from '@ngrx/store';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-task-tile',
    templateUrl: './task-tile.component.html',
    styleUrls: ['./task-tile.component.css']
})
export class TaskTileComponent implements OnInit {

    @ViewChild('system') public system: NgbTooltip;
    @ViewChild('manual') public manual: NgbTooltip;

    public data: any;
    @Input() public clientId;

    constructor(
        private store: Store<AppState>,
        private apiService: APIService
    ) { }

    ngOnInit() {
        this.store
            .select(getTaskPayloads)
            .subscribe(data => (this.data = data));
    }

    getStatus(type: string) {
        if (type === 'TSKTYPE001' || 'TSKTYPE002' || 'TSKTYPE003' || 'TSKTYPE004'
            || 'TSKTYPE005' || 'TSKTYPE006' || 'PLANREVIEW' || 'PROTREVIE') {
            return true;
        } else {
            return false;
        }
    }

    toggleClass(task: any) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (task.completedDate > today) {
            task.completedDate = null;
        } else if (task.completedDate == null) {
            task.completedDate = new Date();
        }
    }

    getCompletionStatus(task: any) {
        return task.completedDate !== null;
    }

}
