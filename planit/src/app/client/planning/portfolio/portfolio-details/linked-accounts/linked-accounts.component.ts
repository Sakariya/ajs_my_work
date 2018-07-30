import { Component, OnInit, Input } from '@angular/core';
import { PlanningService } from '../../../../service/planning.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-linked-accounts',
    templateUrl: './linked-accounts.component.html',
    styleUrls: ['./linked-accounts.component.css']
})
export class LinkedAccountsComponent implements OnInit {
    @Input() public clientId;
    @Input() public portfolioId;
    @Input() public isEditableRoute;
    public linkedAccounts;

    constructor(
        private planningService: PlanningService
    ) { }

    ngOnInit() {
        this.planningService.getLinkedAccounts(this.clientId, this.portfolioId).subscribe(response => {
            this.linkedAccounts = response;
        });
    }

    changeAccountAction(index) {
        if ($('#dropdownAccountAction_' + index).is(':visible')) {
            $('.dropdown-account-action').hide();
        } else {
            $('.dropdown-account-action').hide();
            $('#dropdownAccountAction_' + index).toggle();
        }
    }

}
