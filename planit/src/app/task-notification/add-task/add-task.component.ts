import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { slideInOutAnimation } from '../../shared/animations';
import { TaskNotificationService } from '../task-notification.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class AddTaskComponent implements OnInit {
    public clientId;
    taskTypes = [];
    taskObj = {
        detail: '',
        taskType: {},
        type: 'TASK',
        dueDate: <any>new Date(),
    };

    constructor(
        private router: ActivatedRoute,
        private _location: Location,
        private taskNotificationService: TaskNotificationService
    ) {
        this.router.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {
        this.getTaskTypes();
    }

    getTaskTypes() {
        this.taskNotificationService.getTaskTypes().subscribe(res => {
            this.taskTypes = res;
        });
    }

    back() {
        this._location.back();
    }

    addNewTask(f) {
        const reqObj = Object.assign({}, this.taskObj);
        reqObj['dueDate'] = reqObj['dueDate'].toISOString();
        reqObj['taskType'] = reqObj['taskType'];
        this.taskNotificationService.addClientTask('0ZDSFW6EYM', reqObj).subscribe(res => {
            Swal('Success', '', 'success');
            this.back();
        }, err => {
            Swal('Error', '', 'error');
        });
    }
}
