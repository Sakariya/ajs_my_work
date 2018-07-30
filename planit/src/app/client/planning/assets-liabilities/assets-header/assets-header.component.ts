import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PlanningService } from '../../../service/planning.service';

@Component({
    selector: 'app-assets-header',
    templateUrl: './assets-header.component.html',
    styleUrls: ['./assets-header.component.css']
})
export class AssetsHeaderComponent implements OnInit {
    @Output() public switchAccount = new EventEmitter();
    @Input() public clientId;
    @Input() public accountId;
    @Input() public currentPage;
    public accountsData: any;
    public accountName: string;

    constructor(
        private router: Router,
        private planningServices: PlanningService
    ) { }

    ngOnInit() {
        this.planningServices.getAccountSummaryByAccountType(this.clientId).subscribe(data => {
            this.accountsData = data;
            this.accountName = this.accountsData[this.accountsData.findIndex(d => d.id === this.accountId)]['description'];
        });
    }

    deleteAccount() {
        Swal({
            title: 'Are you sure want to delete an account?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(result => {
            if (result.value) {
                localStorage.setItem('accountId', this.accountId);
                this.router.navigate(['./client', this.clientId, 'planning', 'assets-liabilities']);
            }
        });
    }

    changeAccount(accountId) {
        this.accountId = accountId;
        this.accountName = this.accountsData[this.accountsData.findIndex(d => d.id === accountId)]['description'];
        this.switchAccount.emit(accountId);
    }

}
