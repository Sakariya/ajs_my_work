import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../../../shared/animations';
import { PlanningService, ClientProfileService } from '../../../service';
import { AppState, getFamilyMemberPayload } from '../../../../shared/app.reducer';

@Component({
    selector: 'app-add-account',
    templateUrl: './add-account.component.html',
    styleUrls: ['./add-account.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})

export class AddAccountComponent implements OnInit {
    public clientId;
    public portfolioType;
    public today = new Date();
    accountModel = {
        ownerList: [],
        ownership: [],
        managed: true,
        accountName: null,
        accountType: null,
        portfolio: null,
        assets: null,
        liability: null
    };
    allAccountType;
    familyMembers;
    public ownerShipTotal = 0;
    public isOwnerShipMultiple = false;
    public individualOwnerShip: string;

    constructor(
        private route: ActivatedRoute,
        private _location: Location,
        private store: Store<AppState>,
        private assetsServices: PlanningService,
        private profileService: ClientProfileService
    ) {
        this.route.parent.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        if (!this.clientId) {
            this.route.parent.parent.parent.parent.params.subscribe(params => {
                this.clientId = params['clientId'];
            });
        }
        this.getFamilyMembers();
    }

    ngOnInit() {
        this.assetsServices.getAllAccountType().subscribe(response => {
            this.allAccountType = response;
        });
        this.assetsServices.getListOfPortfolios(this.clientId).subscribe(res => {
            this.portfolioType = res['portfolios'];
        });
    }

    getFamilyMembers() {
        this.store
            .select(getFamilyMemberPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembers = Object.assign([], data['familyMembers']);
                    this.assignOwners();
                } else {
                    this.profileService.getFamilyMembers(this.clientId).subscribe(result => {
                        this.familyMembers = result;
                        this.assignOwners();
                    });
                }
            });
    }

    assignOwners() {
        if (this.familyMembers) {
            this.accountModel.ownerList = [];
            this.familyMembers.forEach(member => {
                this.accountModel.ownerList.push({ externalKey: member.id, owned: null, isOwned: false });
            });
        }
    }

    allowMultipleOwner(regulatoryType) {
        if (regulatoryType.jointTic === 0 && regulatoryType.jointWros === 0 && regulatoryType.jointQcNonspouse === 0 && regulatoryType.itfCapable === 0) {
            this.individualOwnerShip = this.accountModel.ownerList[0].externalKey;
            this.isOwnerShipMultiple = false;
        } else {
            this.isOwnerShipMultiple = true;
        }
    }

    changeOwnerShip(event, i) {
        // tslint:disable-next-line:radix
        this.accountModel.ownerList[i].owned = event.target.value !== '' ? parseInt(event.target.value) : '';
        if (event.target.value <= 100 && this.accountModel.ownerList.length === 2) {
            const nextIndex = this.nextOwner(i);
            this.accountModel.ownerList[nextIndex].owned = 100 - event.target.value;
        }
        this.totalOwnershipPercentage();
    }

    totalOwnershipPercentage() {
        // tslint:disable-next-line:radix
        this.ownerShipTotal = this.accountModel.ownerList.reduce((sum, owner) => sum + (owner.isOwned ? parseInt(owner.owned) : 0), 0);
    }

    checkOwnership(i) {
        if (this.accountModel.ownerList[i].isOwned) {
            this.accountModel.ownerList[i].owned = 0;
        } else {
            this.accountModel.ownerList[i].owned = null;
        }
        this.totalOwnershipPercentage();
    }

    nextOwner(index) {
        index += 1;
        if (index >= this.accountModel.ownerList.length) {
            index = 0;
        }
        return index;
    }

    back() {
        this._location.back();
    }

    convertFloat(n) {
        return parseFloat(n);
    }

    addAccount(f) {
        if (f.valid) {
            const ownerShipList = [];
            if (!this.isOwnerShipMultiple) {
                ownerShipList.push({ externalKey: this.individualOwnerShip, owned: 100 });
            } else {
                this.accountModel.ownerList.forEach(o => {
                    if (o.owned !== null && o.isOwned) {
                        ownerShipList.push({ externalKey: o.externalKey, owned: o.owned });
                    }
                });
            }
            const accountDetail = {
                description: this.accountModel.accountName,
                accountType: this.accountModel.accountType.description,
                portfolioKey: this.accountModel.portfolio.id,
                created: this.today,
                assets: this.accountModel.assets,
                ownerList: ownerShipList,
                liabilityAmount: this.accountModel.liability,
                managed: this.accountModel.managed ? 1 : 0
            };
            this.assetsServices.addAccountOnAssetsAndLiability(this.clientId, accountDetail)
                .subscribe(res => {
                    this.back();
                });
        }
    }

}
