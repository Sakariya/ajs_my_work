import { fadeInAnimation } from '../../shared/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import * as $ from 'jquery';

import { TaskNotificationService } from '../task-notification.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-task-notification',
    templateUrl: './task-notification.component.html',
    styleUrls: ['./task-notification.component.css'],
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@fadeInAnimation]': '' }
})
export class TaskNotificationComponent implements OnInit {
    @ViewChild('system') public system: NgbTooltip;
    @ViewChild('manual') public manual: NgbTooltip;
    clientId = '';
    currentClient = '';
    groupValues = [];
    groupTasks = {};
    messageBadges = {};
    viewList = [
        { id: 1, name: 'All' },
        { id: 2, name: 'Completed' },
        { id: 3, name: 'Current client' },
        { id: 4, name: 'New' },
        { id: 5, name: 'Uncompleted' }
    ];
    filterViewList = Object.assign([], this.viewList);
    defaultView = this.filterViewList[4];
    sortList = [
        { id: 1, name: 'Assigned' },
        { id: 2, name: 'Client name' },
        { id: 3, name: 'Completed date' },
        { id: 4, name: 'Due date' },
        { id: 5, name: 'Type' },
    ];
    defaultSort = this.sortList[3];
    groupList = [
        { id: 1, name: 'Assigned', groupBy: 'planner', field: 'planner' },
        { id: 2, name: 'None', groupBy: 'none', field: '' },
        { id: 3, name: 'Status', groupBy: 'type', field: '' },
        { id: 4, name: 'Type', groupBy: 'taskType', field: 'label' },
        { id: 5, name: 'Uncompleted / Completed', groupBy: 'complete', field: '' }
    ];
    defaultGroup = this.groupList[0];
    taskTypes = [];
    taskData: any;
    taskList = [];
    assignList = [
        { id: 1, value: 'Joe Advisor' }
    ];
    dataModel: any = {};
    fromDateList = [
        { id: 1, date: 'Past 30 days', daysToAdd: '-30' },
        { id: 2, date: 'Past 7 days', daysToAdd: '-7' },
        { id: 3, date: 'Yesterday', daysToAdd: '-1' },
        { id: 4, date: 'Next 7 days', daysToAdd: '+7' }
    ];
    toDateList = [
        { id: 1, date: 'Tomorrow', daysToAdd: '+1' },
        { id: 2, date: 'Next 7 days', daysToAdd: '+7' },
        { id: 3, date: 'Next 30 days', daysToAdd: '+30' },
        { id: 4, date: 'Next 90 days', daysToAdd: '+90' },
        { id: 5, date: 'Past 7 days', daysToAdd: '-7' }
    ];
    filterData: any = {};
    taskIndicator = [];
    today = new Date().toISOString().substring(0, 10);

    constructor(
        private _location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private taskNotificationService: TaskNotificationService
    ) {
        this.route.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
            if (this.clientId !== undefined) {
                localStorage.setItem('currentClientId', this.clientId);
            } else {
                this.clientId = 'all';
            }
            if (this.clientId === 'all' && localStorage.getItem('currentClientId') !== 'all') {
                this.currentClient = localStorage.getItem('currentClientId');
                localStorage.removeItem('currentClientId');
            }
            if (this.currentClient == null || this.currentClient === '') {
                this.filterViewList = Object.assign([], this.viewList);
                this.filterViewList.splice(2, 1);
                this.defaultView = this.filterViewList[3];
            }
        });
    }

    ngOnInit() {
        this.dataModel['complete'] = new Date();
        this.selectDatePeriod({ value: { daysToAdd: '-30' } }, 'fromDate');
        this.selectDatePeriod({ value: { daysToAdd: '+30' } }, 'toDate');
        this.filterData = {
            from: this.dataModel['fromDate'].toISOString(),
            to: this.dataModel['toDate'].toISOString(),
            groupBy: this.defaultGroup.name,
            sortBy: this.defaultSort.name,
            view: this.defaultView.name
        };
        this.getTaskList();
        this.taskNotificationService.getTaskTypes().subscribe(res => {
            this.taskTypes = res;
        });
    }

    getTaskList() {
        this.taskNotificationService.getAllTaskByFilter(this.filterData, 0, 20).subscribe(response => {
            this.taskData = response;
            this.taskData.badges.forEach(badge => {
                if (!this.messageBadges.hasOwnProperty(badge.id)) {
                    this.messageBadges[badge.id] = {};
                }
                this.messageBadges[badge.id]['total'] = badge.value;
            });
            this.taskData.messageBadgeList.forEach(messageBadge => {
                if (!this.messageBadges.hasOwnProperty(messageBadge.id)) {
                    this.messageBadges[messageBadge.id] = {};
                }
                this.messageBadges[messageBadge.id]['todayDue'] = messageBadge.todayDue;
                this.messageBadges[messageBadge.id]['pastDue'] = messageBadge.pastDue;
            });
            this.manageGroupping(Object.assign([], response['messages']));
        });
    }
    manageGroupping(taskList) {
        const groupTasks = {};
        const groupValues = [];
        const selectedGroupping = this.defaultGroup;
        taskList.forEach(function (task) {
            let groupByString;
            if (selectedGroupping.groupBy === 'none') {
                groupByString = selectedGroupping.groupBy;
            } else if (selectedGroupping.groupBy === 'complete') {
                groupByString = (task[selectedGroupping.groupBy]) ? 'Completed' : 'Uncompleted';
            } else if (selectedGroupping.groupBy === 'type') {
                groupByString = task[selectedGroupping.groupBy].toLowerCase();
                groupByString = groupByString.charAt(0).toUpperCase() + groupByString.slice(1);
            } else {
                groupByString = task[selectedGroupping.groupBy];
                if (selectedGroupping.field !== '') {
                    groupByString = task[selectedGroupping.groupBy][selectedGroupping.field];
                }
            }

            if (!groupTasks.hasOwnProperty(groupByString)) {
                groupTasks[groupByString] = {
                    tasks: []
                };
                groupValues.push(groupByString);
            }
            if (task.completedDate != null) {
                if (new Date(task.completedDate) >= new Date(this.changeDateFormat(new Date()))) {
                    task.editable = true;
                } else {
                    task.editable = false;
                }
            } else {
                task.editable = true;
            }
            groupTasks[groupByString].tasks.push(task);
        }, this);
        this.groupTasks = groupTasks;
        this.groupValues = groupValues;
    }

    selectDatePeriod(selectedOption, modelName) {
        const today = new Date();
        const daysToAdd = selectedOption.value.daysToAdd;
        this.dataModel[modelName] = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    }

    changeDateFormat(dbDate) {
        const d = new Date(dbDate);
        const year = d.getFullYear();
        let month = <any>d.getMonth() + 1;
        month = (month > 9) ? month : '0' + month;
        const date = <any>d.getDate();
        return year + '-' + month + '-' + date;
        // return new Date(dbDate).toISOString().substring(0, 10);
    }

    taskTypeFilter(data) {
        this.dataModel.key = data.key;
        this.dataModel.taskModel = this.taskTypes.filter(result => result.descr === data.taskType.descr)[0];
        this.dataModel.dueDateModel = data.dueDate.substring(0, 10);
    }

    dateCampare(data_from, data_to) {
        if (data_from !== '' && data_to !== '') {
            const from = data_from;
            const to = data_to;
            if (((Date.parse(from) < Date.parse(to) === false))) {
                this.dataModel['fromDate'] = this.dataModel['toDate'];
                this.filterData['from'] = this.dataModel['fromDate'];
                this.filterData['to'] = this.dataModel['toDate'];
                this.getTaskList();
            } else {
                this.filterData['from'] = this.dataModel['fromDate'];
                this.filterData['to'] = this.dataModel['toDate'];
                this.getTaskList();
            }
        }
    }

    async saveTaskNotification() {
        let messageObj = [];
        await this.groupValues.forEach(function (groupValue) {
            messageObj = messageObj.concat(this.groupTasks[groupValue].tasks.filter(t => t.type === 'TASK'));
        }, this);
        this.taskNotificationService.updateAllTask(messageObj).subscribe(res => {
            Swal('Success', 'Changes saved successfully.', 'success');
        }, err => {
            Swal('Error', 'Some issue to save changes.', 'error');
        });
    }

    deleteTask(data, key) {
        Swal({
            title: 'Are you sure want to delete task?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(result => {
            if (result.value) {
                this.taskNotificationService.deleteTask(key).subscribe(respon => {
                    this.getTaskList();
                    Swal('Deleted!', 'Task has been deleted successfully.', 'success');
                }, err => {
                    Swal('Error', 'Some issue to delete task.', 'error');
                });
            }
        });
    }

    checked(event, data) {
        if (event === true) {
            if (data.completedDate === null) {
                data.completedDate = new Date().toISOString().substring(0, 10);
                data.editable = true;
            } else {
                if (new Date(data.completedDate) >= new Date(this.changeDateFormat(new Date()))) {
                    data.editable = true;
                } else {
                    data.editable = false;
                }
                data.completedDate = this.changeDateFormat(data.completedDate);
            }
            data.complete = true;
        } else {
            data.editable = true;
            data.complete = false;
            data.completedDate = null;
        }
        const messageObj = [
            data
        ];
        this.taskNotificationService.updateAllTask(messageObj).subscribe(respon => {
            Swal('Updated!', 'Task has been updated successfully.', 'success');
        }, err => {
            Swal('Error', 'Some issue to update task.', 'error');
        });
    }

    viewSorting(event) {
        if (event.id !== 3) {
            this.defaultView = event;
            this.filterData.view = this.defaultView.name;
            this.getTaskList();
        } else {
            // this.router.navigate(['/task-notification', this.currentClient]);
            this.router.navigate(['/client', this.currentClient, 'task-notification']);
        }
    }

    sorting(event) {
        this.defaultSort = event;
        this.filterData.sortBy = this.defaultSort.name;
        this.getTaskList();
    }

    groupSorting(event) {
        this.defaultGroup = event;
        this.filterData.groupBy = this.defaultGroup.name;
        this.getTaskList();
    }

    expandTab() {
        $('#tasktList_').toggle('slow');
    }

    back() {
        this._location.back();
    }
}
