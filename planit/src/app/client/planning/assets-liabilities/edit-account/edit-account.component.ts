import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from '../../../service/planning.service';
import { ClientProfileService } from '../../../service/profile.service';
import { AppState, getFamilyMemberPayload } from '../../../../shared/app.reducer';

@Component({
    selector: 'app-edit-account',
    templateUrl: './edit-account.component.html',
    styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {

    public clientId;
    public accountId;
    public currentAccount;
    public accountsData: any;
    public totalHoldings;
    public totalLiability;
    public familyMembers;
    public ownerShipTotal;
    public accountTypeData;
    public isOwnerShipMultiple: boolean;
    public individualOwnerShip: string;
    public portfolioType;

    public account = {
        managed: false,
        description: null,
        accountNumber: null,
        accountType: null,
        created: null,
        portfolio_id: null,
        ownerList: []
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private planningServices: PlanningService,
        private profileService: ClientProfileService
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.accountId = this.route.snapshot.params['accountId'];
    }

    ngOnInit() {
        this.planningServices.getListOfPortfolios(this.clientId).subscribe(res => {
            this.portfolioType = res.portfolios;
        });
        this.store
            .select(getFamilyMemberPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembers = Object.assign([], data['familyMembers']);
                    this.getAllAccountTypes();
                } else {
                    this.profileService.getFamilyMembers(this.clientId).subscribe(result => {
                        this.familyMembers = result;
                        this.getAllAccountTypes();
                    });
                }
            });
    }

    getAllAccountTypes() {
        this.planningServices.getAllAccountType().subscribe(data => {
            this.accountTypeData = data;
            this.getAllAccounts();
        });
    }

    getAllAccounts() {
        this.planningServices.getAccountSummaryByAccountType(this.clientId).subscribe(data => {
            this.accountsData = data;
            this.getCurrentAccountData();
        });
    }

    getCurrentAccountData() {
        this.currentAccount = this.accountsData[this.accountsData.findIndex(a => a.id === this.accountId)];
        this.account.ownerList = [];
        this.familyMembers.forEach(member => {
            this.account.ownerList.push({ externalKey: member.id, owned: null, isOwned: false });
        });
        this.account.ownerList.forEach((member, mKey) => {
            this.currentAccount.ownership.forEach(owner => {
                const splitData = owner.externalKey.split('/');
                if (splitData[splitData.length - 1] === member.externalKey) {
                    this.account.ownerList[mKey].owned = owner.owned;
                    this.account.ownerList[mKey].isOwned = true;
                }
            });
        });
        this.account.description = this.currentAccount.description;
        this.account.accountNumber = this.currentAccount.accountNumber;
        this.account.managed = this.currentAccount.managed;
        this.account.created = new Date(this.currentAccount.created);
        this.account.accountType = this.accountTypeData[this.accountTypeData
            .findIndex(acc => acc.id === this.currentAccount.regulatoryTypeDTO.id)];
        this.account.portfolio_id = this.portfolioType[this.portfolioType
            .findIndex(port => port.id === this.currentAccount.portfolio)];
        this.totalLiability = this.currentAccount.liabilityAmount;
        this.totalHoldings = this.currentAccount.totalAssets;
        this.allowMultipleOwner(this.currentAccount.regulatoryTypeDTO);
        this.totalOwnershipPercentage();
    }

    allowMultipleOwner(regulatoryType) {
        if (regulatoryType.jointTic === 0 && regulatoryType.jointWros === 0 && regulatoryType.jointQcNonspouse === 0 && regulatoryType.itfCapable === 0) {
            this.individualOwnerShip = this.account.ownerList[0].externalKey;
            this.isOwnerShipMultiple = false;
        } else {
            this.isOwnerShipMultiple = true;
        }
    }

    changeAccount(accountId) {
        this.accountId = accountId;
        this.getCurrentAccountData();
        this.router.navigate(['/client/' + this.clientId + '/planning/assets-liabilities/' + accountId + '/edit-account']);
    }

    changeOwnerShip(event, i) {
        // tslint:disable-next-line:radix
        this.account.ownerList[i].owned = event.target.value !== '' ? parseInt(event.target.value) : '';
        if (event.target.value <= 100 && this.account.ownerList.length === 2) {
            const nextIndex = this.nextOwner(i);
            this.account.ownerList[nextIndex].owned = 100 - event.target.value;
        }
        this.totalOwnershipPercentage();
    }

    totalOwnershipPercentage() {
        // tslint:disable-next-line:radix
        this.ownerShipTotal = this.account.ownerList.reduce((sum, owner) => sum + (owner.isOwned ? parseInt(owner.owned) : 0), 0);
    }

    checkOwnership(i) {
        if (this.account.ownerList[i].isOwned) {
            this.account.ownerList[i].owned = 0;
        } else {
            this.account.ownerList[i].owned = null;
        }
        this.totalOwnershipPercentage();
    }

    nextOwner(index) {
        index += 1;
        if (index >= this.account.ownerList.length) {
            index = 0;
        }
        return index;
    }

    updateAccount() {
        const ownerShipList = [];
        if (!this.isOwnerShipMultiple) {
            ownerShipList.push({ externalKey: this.individualOwnerShip, owned: 100 });
        } else {
            this.account.ownerList.forEach(o => {
                if (o.owned !== null && o.isOwned) {
                    ownerShipList.push({ externalKey: o.externalKey, owned: o.owned });
                }
            });
        }
        const accountValue = {
            description: this.account.description,
            accountNumber: this.account.accountNumber,
            accountType: this.account.accountType.value,
            created: Date.parse(this.account.created.toString()),
            portfolioKey: this.account.portfolio_id.id,
            ownerList: ownerShipList,
            managed: this.account.managed ? 1 : 0
        };
        this.planningServices.updateAccountDetail(this.accountId, accountValue)
            .subscribe(response => {
                Swal('Updated!', 'Account has been updated successfully!', 'success');
                this.back();
            },
                (errorResponse) => {
                    Swal('Oops...', errorResponse.error.errorMessage, 'error');
                });
    }

    back() {
        this.router.navigate(['/client/' + this.clientId + '/planning/assets-liabilities']);
    }

}
