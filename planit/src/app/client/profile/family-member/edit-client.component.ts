import { Component, OnInit } from '@angular/core';
import { CalculateAgeFromDate } from '../../../core/utility/calculate-date-to-age';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientProfileService } from '../../service';
import { NgModule } from '@angular/core';
import { Relation } from '../../client-models';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState, getFamilyMemberPayload } from '../../../shared/app.reducer';
import { SetFamilyMembers } from '../../../shared/app.actions';
import { FileUploadService } from '../../../ui/services/file-upload-service';
@Component({
    selector: 'app-add-client',
    templateUrl: './edit-client.component.html'
})

export class EditClientComponent implements OnInit {
    clientId: string;
    personalId;
    familyMembers: any;
    model: any = {};
    modelAddress: any = [];
    maritalArr = [];
    familyMemberAge;
    editFamilyMember;
    editClientAddress;
    editMaritalStatus;
    loading = false;
    addressId;
    uploadedImage;
    relation = Relation;
    relationId = 0;
    maretialStatusId = 0;
    modelFmailyData: any = [];
    modelgetcountry;
    countries;
    provinceArr = [];
    relationArr = [];
    provinces;
    languages;
    selectedRelation = {};
    storeFamilyMember;
    maxDateValue;
    isGenderDisable = true;

    constructor(
        private calculateAgeFromDate: CalculateAgeFromDate,
        private route: ActivatedRoute,
        private router: Router,
        private clientProfileService: ClientProfileService,
        private _location: Location,
        private store: Store<AppState>,
        private fileUploadService: FileUploadService
    ) { }


    ngOnInit() {
        this.route.params.subscribe(paramsObj => {
            this.maxDateValue = new Date;
            this.route.parent.parent.params.subscribe(params => {
                this.clientId = params['clientId'];
            });
            this.personalId = this.route.snapshot.params['personalId'];
            this.maritalArr = [
                { 'id': 1, 'value': 'Married' },
                { 'id': 2, 'value': 'Single' },
                { 'id': 3, 'value': 'Married being treated as single' }
            ];
            this.clientProfileService.getCountryLanguageProvince().subscribe(result => {
                this.countries = result[0];
                this.provinceArr = result[1];
                this.languages = result[2];
                this.getFamilyMembers();
            });
        });
    }

    getFamilyMembers() {
        this.store
            .select(getFamilyMemberPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembers = Object.assign([], data['familyMembers']);
                    this.storeFamilyMember = Object.assign({}, data);
                    const personDetail = Object.assign({}, this.familyMembers[data['idMapping'][this.personalId]]);
                    this.fileUploadService.showExistFile(personDetail.uploadAvatar);
                    this.processFamilyMemberData(Object.assign({}, personDetail));
                } else {
                    this.clientProfileService.getFamilyMembers(this.clientId).subscribe(result => {
                        this.clientProfileService.processFamilyMembers(result);
                    });
                }
            });
    }

    processFamilyMemberData(personDetail) {
        if (!personDetail) {
            this.router.navigate(['/client', this.clientId, 'profile', 'personal-info']);
        }
        this.model = Object.assign({}, personDetail);
        this.model.relation = this.relation.filter(relation => relation.id === this.model.relation)[0];
        this.relationId = this.model.relation.id;
        // Remove Client 1 from relation drop-down
        this.relationArr = this.relation.filter(relation => relation.id !== 1);
        this.familyMemberAge = this.calculateAgeFromDate.calculate(this.model.birthDate);
        if (this.model.homePhone && this.model.officePhone) {
        } else {
            this.model.homePhone = this.model.cellPhone;
            this.model.officePhone = this.model.cellPhone;
        }
        if (this.relationId === 1) {
            this.getAddress(this.clientId);
            this.getFamilyAllData(this.clientId);
        }
        if (this.relationId === 1 || this.relationId === 3 || this.relationId === 2) {
            this.isGenderDisable = false;
        }
        if (this.model.uploadAvatar) {
            this.uploadedImage = this.model.uploadAvatar;
        }
    }
    selectProvince(country) {
        this.provinces = this.provinceArr.filter(province => province.country === country.code);
    }
    calculateAge(birthDate) {
        this.familyMemberAge = this.calculateAgeFromDate.calculate(birthDate);
    }

    getAddress(clientId: string) {
        if (this.model.isAddressSet) {
            this.processAddresss(Object.assign({}, this.model.clientAddress));
        } else {
            this.clientProfileService.getFamilyAddress(clientId).subscribe(result => {
                this.processAddresss(Object.assign({}, result[0]));
            });
        }
    }

    processAddresss(clientAddress) {
        this.modelAddress = clientAddress;
        this.provinces = this.provinceArr.filter(province => province.country === this.modelAddress.country);
        this.modelAddress.province = this.provinceArr.filter(province => province.short === this.modelAddress.province &&
            province.country === this.modelAddress.country)[0];
        if (this.countries) {
            this.modelAddress.country = this.countries.filter(countries => countries.code === this.modelAddress.country)[0];
        }
    }

    getFamilyAllData(clientId: string) {
        this.clientProfileService.getFamilyData(clientId).subscribe(result => {
            this.modelFmailyData = result;
            if (this.model.maritalStatus) {
            } else {
                this.model.maritalStatus = this.maritalArr.filter(maritalstatus =>
                    maritalstatus.id === this.modelFmailyData.maritalStatus)[0];
            }
            if (this.model.language) {
            } else {
                this.model.language = this.languages.filter(language => language.value === this.modelFmailyData.language)[0];
            }
        });
    }

    editClient() {
        this.editFamilyMember = this.model;
        const relationadd = this.model.relation.id;
        this.editFamilyMember['relation'] = relationadd;
        const relation_staus = this.clientProfileService.checkStatus(relationadd);
        this.editFamilyMember.btnColor = relation_staus['btnColor'];
        this.editFamilyMember.relation_staus = relation_staus['relation'];
        this.editFamilyMember.uploadAvatar = this.uploadedImage;
        this.editFamilyMember['birthDate'] = this.model.birthDate;
        this.editFamilyMember['age'] = this.calculateAgeFromDate.calculate(this.editFamilyMember.birthDate);
        if (this.editFamilyMember['relation'] === 1) {
            const retireadd = this.model.retired;
            this.editFamilyMember['retired'] = retireadd;
            this.editClientAddress = this.modelAddress;
            const countryadd = this.modelAddress.country.code;
            this.editClientAddress['country'] = countryadd;
            const provinceadd = this.modelAddress.province.short;
            this.editClientAddress['province'] = provinceadd;
            this.editMaritalStatus = {
                ...this.modelFmailyData
            };
            const maritaladd = this.model.maritalStatus.id;
            this.editMaritalStatus['maritalStatus'] = maritaladd;
            this.editMaritalStatus['language'] = this.modelFmailyData.language.value;
        }
        const formData = new FormData();
        formData.append('mediaType', 'image/png');
        formData.append('image', this.uploadedImage);
        this.loading = true;
        this.clientProfileService.updateFamilyDetails(this.editFamilyMember, this.clientId, this.personalId).subscribe(res => {
            this.clientProfileService.uploadAvatar(formData, this.clientId, this.personalId);
            if (this.editFamilyMember['relation'] === 1) {
                this.editFamilyMember['isAddressSet'] = true;
                this.editFamilyMember['clientAddress'] = this.editClientAddress;
                this.clientProfileService.updateAddressDetails(this.editClientAddress, this.clientId, this.addressId);
                this.clientProfileService.updateFamilyDataDetails(this.editMaritalStatus, this.clientId);
            }
            this.updateStore(this.editFamilyMember);
            this.loading = false;
            this.router.navigate(['/client', this.clientId, 'profile', 'personal-info']);
        });
    }
    updateStore(editFamilyMember) {
        const idmaping = this.storeFamilyMember['idMapping'];
        const index = idmaping[this.personalId];
        this.storeFamilyMember['familyMembers'][index] = editFamilyMember;
        // this.store.dispatch(new SetFamilyMembers(this.storeFamilyMember));
    }
    uploadeImage(event) {
        this.uploadedImage = event;
    }
    clientChange(event) {
        this.relationId = event.value.id;
        this.isGenderDisable = true;
        if (this.relationId === 3 || this.relationId === 2) {
            this.isGenderDisable = false;
        } else if (this.relationId === 5 || this.relationId === 8 || this.relationId === 11 || this.relationId === 7) {
            this.model.gender = 'F';
        } else {
            this.model.gender = 'M';
        }
    }
    back() {
        this.router.navigate(['/client/' + this.clientId + '/profile/personal-info/']);
    }

    memberSwitch(memberId) {
        this.isGenderDisable = true;
        this.router.navigate(['/client/' + this.clientId + '/profile/personal-info/' + memberId + '/edit']);
    }
}
