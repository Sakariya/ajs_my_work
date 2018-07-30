import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService, ClientProfileService } from '../../../service';
import {
    AppState,
    getFamilyMemberPayload,
    getSavingsDetailsPayload
} from '../../../../shared/app.reducer';

@Component({
    selector: 'app-edit-savings',
    templateUrl: './edit-savings.component.html',
    styleUrls: ['./edit-savings.component.css']
})

export class EditSavingsComponent implements OnInit {

    public goals;
    public savings;
    public clientId;
    public savingsId;
    public portfolios;
    public linkedGoal;
    public portfolioType;
    public savingsRegType;
    public checked = false;
    public frequencyOptions;
    public savingsData: any;
    public currentYear = new Date().getFullYear();
    public savingsName: string;
    public currentSavings: any;
    public tier1StartAge = [];
    public tier1EndAge = [];
    public tier2StartAge = [];
    public tier2EndAge = [];
    public tier3StartAge = [];
    public tier3EndAge = [];
    public viewBy = [
        { id: 1, name: 'Year' },
        { id: 2, name: 'Age' },
    ];
    public selectedViewBy = this.viewBy[0];
    public endYearOptions = [
        { id: 1, type: 'Goal start' },
        { id: 2, type: 'Goal end' },
        { id: 3, type: 'Fixed end' },
        { id: 4, type: 'Lump sum' }
    ];
    public numberMask = {
        prefix: '$',
        thousands: ',',
        decimal: '.'
    };
    public goalsList: SelectItem[] = [{ value: 0, label: 'Unallocated' }];
    public selectedGoalsList: SelectItem[] = [{ value: 0, label: 'Unallocated' }];
    constructor(
        private router: Router,
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private planningServices: PlanningService,
        private profileService: ClientProfileService,
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.savingsId = this.route.snapshot.params['savingsId'];
    }

    ngOnInit() {
        this.planningServices.getListOfPortfolios(this.clientId).subscribe(res => {
            this.portfolios = res['portfolios'];
        });
        this.planningServices.getListOfFrequency().subscribe(res => {
            this.frequencyOptions = res;
        });
        this.store
            .select(getSavingsDetailsPayload)
            .subscribe(data => {
                if (data) {
                    this.savingsData = data;

                } else {
                    this.planningServices.getSavingsDetails(this.clientId).subscribe(response => {
                        this.savingsData = response;
                    });
                }
            });
        this.getGoalsDropdown();
    }

    getGoalsDropdown() {
        this.planningServices.getAllGoalsList(this.clientId).subscribe(result => {
            this.goals = result;
            this.goals.forEach(goal => {
                this.goalsList.push({ value: goal.key, label: goal.description });
                if (goal.goalType === '3') {
                    this.selectedGoalsList.push({ value: goal.key, label: goal.description });
                }
            });
            this.getCurrentSavings();
        });
    }

    getCurrentSavings() {
        this.tier1StartAge = [];
        this.tier1EndAge = [];
        this.tier2StartAge = [];
        this.tier2EndAge = [];
        this.tier3StartAge = [];
        this.tier3EndAge = [];
        const ownerList = {};
        let familyMembers;
        this.planningServices.getSavingsBySavingsId(this.savingsId).subscribe(data => {
            this.currentSavings = data;
            this.currentSavings.frequency = 5;
            this.savingsName = this.currentSavings.description;
            this.savingsRegType = this.currentSavings.linkedAccountDetails.regulatoryTypeDTO.description;
            this.profileService.getFamilyMembers(this.clientId).subscribe(result => {
                familyMembers = result;
                familyMembers.forEach(member => {
                    ownerList[member.id] = { initials: member.firstName[0] + member.lastName[0], birthYear: member.birthDate.split('-')[0] };
                });
                let array;
                this.currentSavings.linkedAccountDetails.ownership.forEach(owner => {
                    array = owner.externalKey.split('/');
                    owner['birthYear'] = parseInt(ownerList[array[array.length - 1]]['birthYear'], 10);
                    owner['initials'] = ownerList[array[array.length - 1]]['initials'];
                    this.tier1StartAge.push(this.currentSavings.tier1StartYear - owner.birthYear);
                    this.tier1EndAge.push(this.currentSavings.tier1EndYear - owner.birthYear);
                    this.tier2StartAge.push(this.currentSavings.tier2StartYear > 0 ? this.currentSavings.tier2StartYear - owner.birthYear : 0);
                    this.tier2EndAge.push(this.currentSavings.tier2EndYear > 0 ? this.currentSavings.tier2EndYear - owner.birthYear : 0);
                    this.tier3StartAge.push(this.currentSavings.tier3StartYear > 0 ? this.currentSavings.tier3StartYear - owner.birthYear : 0);
                    this.tier3EndAge.push(this.currentSavings.tier3EndYear > 0 ? this.currentSavings.tier3EndYear - owner.birthYear : 0);
                });
                this.makeSavingsData();
            });
        });
    }

    makeSavingsData() {
        this.savings = {
            key: this.savingsId,
            index: this.currentSavings.index,
            useDefaultIndex: this.currentSavings.useDefaultIndex,
            secondTier: false,
            thirdTier: false,
            tier1StartYear: this.currentSavings.tier1StartYear,
            tier1EndYear: this.currentSavings.tier1EndYear,
            tier1StartYearLinkType: this.currentSavings.tier1StartYearLinkType,
            tier1EndYearLinkType: this.currentSavings.tier1EndYearLinkType,
            tier1AmountPerYear: this.currentSavings.tier1AmountPerYear,
            tier1EmployerContribAmt: this.currentSavings.tier1EmployerContribAmt,
            tier2StartYear: this.currentSavings.tier2StartYear,
            tier2EndYear: this.currentSavings.tier2EndYear,
            tier2StartYearLinkType: this.currentSavings.tier2StartYearLinkType,
            tier2EndYearLinkType: this.currentSavings.tier2EndYearLinkType,
            tier2AmountPerYear: this.currentSavings.tier2AmountPerYear,
            tier2EmployerContribAmt: this.currentSavings.tier2EmployerContribAmt,
            tier3StartYear: this.currentSavings.tier3StartYear,
            tier3EndYear: this.currentSavings.tier3EndYear,
            tier3StartYearLinkType: this.currentSavings.tier3StartYearLinkType,
            tier3EndYearLinkType: this.currentSavings.tier3EndYearLinkType,
            tier3AmountPerYear: this.currentSavings.tier3AmountPerYear,
            tier3EmployerContribAmt: this.currentSavings.tier3EmployerContribAmt,
            tier1StartAge: Object.assign([], this.tier1StartAge),
            tier1EndAge: Object.assign([], this.tier1EndAge),
            tier2StartAge: Object.assign([], this.tier2StartAge),
            tier2EndAge: Object.assign([], this.tier2EndAge),
            tier3StartAge: Object.assign([], this.tier3StartAge),
            tier3EndAge: Object.assign([], this.tier3EndAge),
        };
        this.portfolioType = this.portfolios[this.portfolios.findIndex(p => p.id === this.currentSavings.linkedAccountDetails.portfolio)]['description'];
        this.checked = this.currentSavings.useDefaultIndex === 1 ? false : true;
        this.savings.tier1EndYearLinkType = this.endYearOptions[this.endYearOptions.findIndex(e => e.id === this.currentSavings.tier1EndYearLinkType)];
        if (this.currentSavings.tier2AmountPerYear > 0) {
            this.savings['secondTier'] = true;
            this.savings.tier2EndYearLinkType = this.endYearOptions[this.endYearOptions.findIndex(e => e.id === this.currentSavings.tier2EndYearLinkType)];
        }
        if (this.currentSavings.tier3AmountPerYear > 0) {
            this.savings['thirdTier'] = true;
            this.savings.tier3EndYearLinkType = this.endYearOptions[this.endYearOptions.findIndex(e => e.id === this.currentSavings.tier3EndYearLinkType)];
        }
        if (this.currentSavings.linkedGoal !== null) {
            this.savings['linkedGoal'] = this.goalsList[this.goalsList.findIndex(g => g.value === this.currentSavings.linkedGoal)].value;
            this.linkedGoal = this.goals[this.goals.findIndex(f => f.key === this.savings['linkedGoal'])];
        } else {
            this.savings['linkedGoal'] = 0;
            this.linkedGoal = null;
        }
        this.savings['frequency'] = this.frequencyOptions[this.frequencyOptions.findIndex(f => f.frequencyId === this.currentSavings.frequency)];
    }

    changeSavings(savingsId, savingsName) {
        this.savingsId = savingsId;
        this.savingsName = savingsName;
        this.getCurrentSavings();
        this.router.navigate(['/client/' + this.clientId + '/planning/assets-liabilities-savings/' + savingsId + '/edit-savings']);
    }

    changeGoal(value) {
        this.linkedGoal = value > 0 ? this.goals[this.goals.findIndex(f => f.key === value)] : null;
        if (this.linkedGoal !== null) {
            if (this.savings.thirdTier) {
                this.changeEndYearAge(this.savings.tier3EndYearLinkType, 3);
            } else if (this.savings.secondTier) {
                this.changeEndYearAge(this.savings.tier2EndYearLinkType, 2);
            } else {
                this.changeEndYearAge(this.savings.tier1EndYearLinkType, 1);
            }
        } else {
        }
    }

    displayViewBy(event) {
        this.selectedViewBy = event;
    }

    displayAge(date) {
        const numberOfOwners = this.currentSavings.linkedAccountDetails.ownership.length;
        if (numberOfOwners === 1) {
            const age = date - this.currentSavings.linkedAccountDetails.ownership[0]['birthYear'];
            return age > 0 && date.toString().length === 4 ? age : 0;
        } else {
            let age = '';
            for (let i = 0; i < numberOfOwners; i++) {
                if (date - this.currentSavings.linkedAccountDetails.ownership[i]['birthYear'] > 0 && date.toString().length === 4) {
                    if (i < numberOfOwners - 1) {
                        age = age + (date - this.currentSavings.linkedAccountDetails.ownership[i]['birthYear']) + '/';
                    } else if (i === numberOfOwners - 1) {
                        age = age + (date - this.currentSavings.linkedAccountDetails.ownership[i]['birthYear']);
                    }
                } else {
                    age = '0';
                }
            }
            return age;
        }
    }

    addTier() {
        if (!this.savings['secondTier']) {
            this.savings['secondTier'] = true;
            this.savings.tier2StartYear = this.savings.tier1EndYear + 1;
            this.savings.tier2EndYearLinkType = this.endYearOptions[0];
            this.savings.tier2EndYear = this.linkedGoal.goalStartYear - 1;
            for (let i = 0; i < this.tier1StartAge.length; i++) {
                this.tier2StartAge[i] = this.savings.tier2StartYear - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
                this.tier2EndAge[i] = this.savings.tier2EndYear - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
            }
            this.savings.tier2StartAge = Object.assign([], this.tier2StartAge);
            this.savings.tier2EndAge = Object.assign([], this.tier2EndAge);
        } else if (!this.savings['thirdTier']) {
            this.savings['thirdTier'] = true;
            this.savings.tier3StartYear = this.savings.tier2EndYear + 1;
            this.savings.tier3EndYearLinkType = this.endYearOptions[0];
            this.savings.tier3EndYear = this.linkedGoal.goalStartYear - 1;
            for (let i = 0; i < this.tier1StartAge.length; i++) {
                this.tier3StartAge[i] = this.savings.tier3StartYear - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
                this.tier3EndAge[i] = this.savings.tier3EndYear - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
            }
            this.savings.tier3StartAge = Object.assign([], this.tier3StartAge);
            this.savings.tier3EndAge = Object.assign([], this.tier3EndAge);
        } else {
            Swal('Sorry!', 'No more tiers can be added.', 'warning');
        }
    }

    deleteTier() {
        this.planningServices.deleteTier(this.savingsId).subscribe(res => {
            if (this.savings['thirdTier']) {
                this.savings['thirdTier'] = false;
                this.savings.tier3StartYear = 0;
                this.savings.tier3StartYearLinkType = 0;
                this.savings.tier3EndYearLinkType = 0;
                this.savings.tier3AmountPerYear = 0;
                this.savings.tier3MatchingAmountPerYear = 0;
                this.savings.tier3EmployerContribAmt = 0;
                this.savings.tier2EndYear = this.savings.tier3EndYear;
                this.savings.tier3EndYear = 0;
                this.tier2EndAge = Object.assign([], this.tier3EndAge);
                this.tier3StartAge = [];
                this.tier3EndAge = [];
                this.savings.tier2EndAge = Object.assign([], this.tier2EndAge);
                this.savings.tier3StartAge = Object.assign([], this.tier3StartAge);
                this.savings.tier3EndAge = Object.assign([], this.tier3EndAge);
            } else {
                this.savings['secondTier'] = false;
                this.savings.tier2StartYear = 0;
                this.savings.tier2StartYearLinkType = 0;
                this.savings.tier2EndYearLinkType = 0;
                this.savings.tier2AmountPerYear = 0;
                this.savings.tier2MatchingAmountPerYear = 0;
                this.savings.tier2EmployerContribAmt = 0;
                this.savings.tier1EndYear = this.savings.tier2EndYear;
                this.savings.tier2EndYear = 0;
                this.tier1EndAge = Object.assign([], this.tier2EndAge);
                this.tier2StartAge = [];
                this.tier2EndAge = [];
                this.savings.tier1EndAge = Object.assign([], this.tier1EndAge);
                this.savings.tier2StartAge = Object.assign([], this.tier2StartAge);
                this.savings.tier2EndAge = Object.assign([], this.tier2EndAge);
            }
        });
    }

    changeYear(value, n) {
        if (value.length === 4) {
            if (n === 4) {
                for (let i = 0; i < this.tier1EndAge.length; i++) {
                    this.tier3EndAge[i] = this.savings.tier3EndYear - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
                }
            } else if (n === 3) {
                const diff = this.savings.tier3StartYear;
                this.savings.tier3StartYear = parseInt(value, 10) + 1;
                for (let i = 0; i < this.tier1StartAge.length; i++) {
                    this.tier2EndAge[i] = this.savings.tier2EndYear - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
                    this.tier3StartAge[i] = this.savings.tier3StartYear - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
                }
            } else if (n === 2) {
                const diff = this.savings.tier2StartYear;
                this.savings.tier2StartYear = parseInt(value, 10) + 1;
                for (let i = 0; i < this.tier1StartAge.length; i++) {
                    this.tier1EndAge[i] = this.savings.tier1EndYear - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
                    this.tier2StartAge[i] = this.savings.tier2StartYear - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
                }
            } else if (n === 1) {
                for (let i = 0; i < this.tier1StartAge.length; i++) {
                    this.tier1StartAge[i] = this.savings.tier1StartYear - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
                }
            }
            this.savings.tier1EndAge = Object.assign([], this.tier1EndAge);
            this.savings.tier1StartAge = Object.assign([], this.tier1StartAge);
            this.savings.tier2StartAge = Object.assign([], this.tier2StartAge);
            this.savings.tier2EndAge = Object.assign([], this.tier2EndAge);
            this.savings.tier3StartAge = Object.assign([], this.tier3StartAge);
            this.savings.tier3EndAge = Object.assign([], this.tier3EndAge);
        }
    }

    changeAge(value, n) {
        let diff;
        if (value.length === 2) {
            if (n === 4) {
                diff = this.tier3EndAge[0] - this.savings.tier3EndAge[0];
                this.savings.tier3EndAge[0] = this.tier3EndAge[0];
                for (let i = 1; i < this.tier1EndAge.length; i++) {
                    this.tier3EndAge[i] += diff;
                }
                this.savings.tier3EndYear += diff;
            } else if (n === 3) {
                diff = this.tier2EndAge[0] - this.savings.tier2EndAge[0];
                this.savings.tier2EndAge[0] = this.tier2EndAge[0];
                for (let i = 1; i < this.tier1EndAge.length; i++) {
                    this.tier2EndAge[i] += diff;
                }
                this.savings.tier2EndYear += diff;
                for (let i = 0; i < this.tier1StartAge.length; i++) {
                    this.tier3StartAge[i] = parseInt(this.tier2EndAge[i], 10) + 1;
                }
                this.savings.tier3StartYear = this.savings.tier2EndYear + 1;
            } else if (n === 2) {
                diff = this.tier1EndAge[0] - this.savings.tier1EndAge[0];
                this.savings.tier1EndAge[0] = this.tier1EndAge[0];
                for (let i = 1; i < this.tier1EndAge.length; i++) {
                    this.tier1EndAge[i] += diff;
                }
                this.savings.tier1EndYear += diff;
                for (let i = 0; i < this.tier1StartAge.length; i++) {
                    this.tier2StartAge[i] = parseInt(this.tier1EndAge[i], 10) + 1;
                }
                this.savings.tier2StartYear = this.savings.tier1EndYear + 1;
            } else if (n === 1) {
                diff = this.tier1StartAge[0] - this.savings.tier1StartAge[0];
                this.savings.tier1StartAge[0] = this.tier1StartAge[0];
                for (let i = 1; i < this.tier1StartAge.length; i++) {
                    this.tier1StartAge[i] += diff;
                }
                this.savings.tier1StartYear += diff;
            }
            this.savings.tier1EndAge = Object.assign([], this.tier1EndAge);
            this.savings.tier1StartAge = Object.assign([], this.tier1StartAge);
            this.savings.tier2StartAge = Object.assign([], this.tier2StartAge);
            this.savings.tier2EndAge = Object.assign([], this.tier2EndAge);
            this.savings.tier3StartAge = Object.assign([], this.tier3StartAge);
            this.savings.tier3EndAge = Object.assign([], this.tier3EndAge);
        }
    }

    changeEndYearAge(value, n) {
        if (this.linkedGoal !== null) {
            if (n === 3) {
                if (value.id === 1) {
                    this.savings.tier3EndYear = this.linkedGoal.goalStartYear - 1;
                    for (let i = 0; i < this.tier1EndAge.length; i++) {
                        this.tier3EndAge[i] = (this.linkedGoal.goalStartYear - 1) - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
                    }
                } else if (value.id === 2) {
                    this.savings.tier3EndYear = this.linkedGoal.goalTier3EndYear ? this.linkedGoal.goalTier3EndYear - 1 : this.savings.tier3StartYear + 1;
                    for (let i = 0; i < this.tier1EndAge.length; i++) {
                        this.tier3EndAge[i] = this.linkedGoal.goalTier3EndYear ? (this.linkedGoal.goalTier3EndYear - 1) - this.currentSavings.linkedAccountDetails.ownership[i].birthYear
                            : this.tier3StartAge[i] + 1;
                    }
                } else if (value.id === 4) {
                    this.savings.tier3EndYear = this.savings.tier3StartYear;
                    for (let i = 0; i < this.tier1EndAge.length; i++) {
                        this.tier3EndAge[i] = this.tier3StartAge[i];
                    }
                }
                this.savings.tier3EndAge = Object.assign([], this.tier3EndAge);
            } else if (n === 2) {
                if (value.id === 1) {
                    this.savings.tier2EndYear = this.linkedGoal.goalStartYear - 1;
                    for (let i = 0; i < this.tier1EndAge.length; i++) {
                        this.tier2EndAge[i] = (this.linkedGoal.goalStartYear - 1) - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
                    }
                } else if (value.id === 2) {
                    this.savings.tier2EndYear = this.linkedGoal.goalTier2EndYear ? this.linkedGoal.goalTier2EndYear - 1 : this.savings.tier2StartYear + 1;
                    for (let i = 0; i < this.tier1EndAge.length; i++) {
                        this.tier2EndAge[i] = this.linkedGoal.goalTier2EndYear ? (this.linkedGoal.goalTier2EndYear - 1) - this.currentSavings.linkedAccountDetails.ownership[i].birthYear
                            : this.tier2StartAge[i] + 1;
                    }
                } else if (value.id === 4) {
                    this.savings.tier2EndYear = this.savings.tier2StartYear;
                    for (let i = 0; i < this.tier1EndAge.length; i++) {
                        this.tier2EndAge[i] = this.tier2StartAge[i];
                    }
                }
                this.savings.tier1EndAge = Object.assign([], this.tier1EndAge);
            } else if (n === 1) {
                if (value.id === 1) {
                    this.savings.tier1EndYear = this.linkedGoal.goalStartYear - 1;
                    for (let i = 0; i < this.tier1EndAge.length; i++) {
                        this.tier1EndAge[i] = (this.linkedGoal.goalStartYear - 1) - this.currentSavings.linkedAccountDetails.ownership[i].birthYear;
                    }
                } else if (value.id === 2) {
                    this.savings.tier1EndYear = this.linkedGoal.goalTier1EndYear ? this.linkedGoal.goalTier1EndYear - 1 : this.savings.tier1StartYear + 1;
                    for (let i = 0; i < this.tier1EndAge.length; i++) {
                        this.tier1EndAge[i] = this.linkedGoal.goalTier1EndYear ? (this.linkedGoal.goalTier1EndYear - 1) - this.currentSavings.linkedAccountDetails.ownership[i].birthYear
                            : this.tier1StartAge[i] + 1;
                    }
                } else if (value.id === 4) {
                    this.savings.tier1EndYear = this.savings.tier1StartYear;
                    for (let i = 0; i < this.tier1EndAge.length; i++) {
                        this.tier1EndAge[i] = this.tier1StartAge[i];
                    }
                }
                this.savings.tier2EndAge = Object.assign([], this.tier2EndAge);
            }
        }
    }

    updateSavings() {
        const updatedSavings = {
            key: parseInt(this.savingsId, 10),
            index: parseInt(this.savings.index, 10),
            useDefaultIndex: this.checked ? 0 : 1,
            linkedGoal: this.savings.linkedGoal === 0 ? null : this.savings.linkedGoal,
            tier1StartYear: parseInt(this.savings.tier1StartYear, 10),
            tier1EndYear: parseInt(this.savings.tier1EndYear, 10),
            tier1StartYearLinkType: this.savings.tier1StartYearLinkType,
            tier1EndYearLinkType: this.savings.tier1EndYearLinkType.id,
            tier1AmountPerYear: this.savings.tier1AmountPerYear,
            tier1EmployerContribAmt: this.savings.tier1EmployerContribAmt,
            tier2StartYear: this.savings.secondTier ? parseInt(this.savings.tier2StartYear, 10) : 0,
            tier2EndYear: this.savings.secondTier ? parseInt(this.savings.tier2EndYear, 10) : 0,
            tier2StartYearLinkType: this.savings.tier2StartYearLinkType,
            tier2EndYearLinkType: this.savings.secondTier ? this.savings.tier2EndYearLinkType.id : 0,
            tier2AmountPerYear: this.savings.tier2AmountPerYear,
            tier2EmployerContribAmt: this.savings.tier2EmployerContribAmt,
            tier3StartYear: this.savings.thirdTier ? parseInt(this.savings.tier3StartYear, 10) : 0,
            tier3EndYear: this.savings.thirdTier ? parseInt(this.savings.tier3EndYear, 10) : 0,
            tier3StartYearLinkType: this.savings.tier3StartYearLinkType,
            tier3EndYearLinkType: this.savings.thirdTier ? this.savings.tier3EndYearLinkType.id : 0,
            tier3AmountPerYear: this.savings.tier3AmountPerYear,
            tier3EmployerContribAmt: this.savings.tier3EmployerContribAmt,
        };
        this.planningServices.updateSavings(this.savingsId, updatedSavings).subscribe(res => {
            console.log(updatedSavings);
            this.router.navigate(['/client/' + this.clientId + '/planning/assets-liabilities-savings/']);
        });
    }

    back() {
        this.router.navigate(['/client/' + this.clientId + '/planning/assets-liabilities-savings/']);
    }
}
