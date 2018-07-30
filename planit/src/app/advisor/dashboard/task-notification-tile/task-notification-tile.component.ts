import { AdvisorService } from '../../service/advisor.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
    AppState,
    getAdvisorTaskNotificationPayload,
    getIsAdvisorTaskNotificationPayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-task-notification-tile',
    templateUrl: './task-notification-tile.component.html',
    styleUrls: ['./task-notification-tile.component.css']
})
export class TaskNotificationTileComponent implements OnInit {

    @ViewChild('system') public system: NgbTooltip;
    @ViewChild('manual') public manual: NgbTooltip;

    public tasks: any;

    constructor(
        private store: Store<AppState>,
        private advisorService: AdvisorService
    ) { }

    ngOnInit() {
        this.store
            .select(getIsAdvisorTaskNotificationPayload)
            .pipe(take(1))
            .subscribe((loaded: boolean) => {
                if (!loaded) {
                    this.advisorService.getAdvisorTaskNotification('FAMILYID', 'TASK', 10, 1).subscribe(data => {
                        this.tasks = data;
                    });
                } else {
                    this.store
                        .select(getAdvisorTaskNotificationPayload)
                        .subscribe(data => {
                            this.tasks = data;
                        });
                }
            });
    }

    toggleClass(task: any) {
        task.complete = !task.complete;
        // const today = new Date();
        // const dueDate = new Date(task.dueDate);
        // today.setHours(0, 0, 0, 0);
        // if (dueDate > today) {
        //     task.dueDate = null;
        // } else if (dueDate == null) {
        //     task.dueDate = new Date();
        // }
    }

}
