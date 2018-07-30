import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../../shared/animations';
import { Relation, Titles } from '../../client-models';
import { CalculateAgeFromDate } from '../../../core/utility/calculate-date-to-age';
import { ActivatedRoute } from '@angular/router';
import { ClientProfileService } from '../../service';
import { Store } from '@ngrx/store';
import { AppState, getFamilyMemberPayload, getFamilyMemberRiskPayload } from '../../../shared/app.reducer';
import { SetFamilyMembers, SetFamilyMembersRisk } from '../../../shared/app.actions';
import { Location } from '@angular/common';
@Component({
    selector: 'app-add-client',
    templateUrl: './add-family-member.component.html',
    styleUrls: ['./add-family-member.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class AddFamilymemberComponent implements OnInit {
    familyMembers: any;
    model: any = {};
    familyMemberModel: any = {};
    uploadedImage;
    familyMemberAge;
    loading = false;
    familyRelation;
    clientId;
    titles = Titles;
    uploadedFiles;
    btnColor = {};
    maxDate;
    yearRange;
    familyMembersRisk;
    isGenderDisable = true;
    constructor(
        private calculateAgeFromDate: CalculateAgeFromDate,
        private route: ActivatedRoute,
        private clientProfileService: ClientProfileService,
        private store: Store<AppState>,
        private _location: Location
    ) {
        this.maxDate = new Date();
        this.yearRange = (this.maxDate.getFullYear() - 100) + ':' + this.maxDate.getFullYear();

        this.route.parent.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });

    }

    ngOnInit() {
        this.familyRelation = Relation.filter(x => x.id !== 1 && x.id !== 2);
    }

    public calculateAge(dateOfBirth) {
        this.familyMemberAge = this.calculateAgeFromDate.calculate(dateOfBirth);
    }

    register() {
        const formData = new FormData();
        formData.append('mediaType', 'image/png');
        formData.append('image', this.uploadedImage);
        this.familyMemberModel = {
            'title': this.model.title.name,
            'relation': this.model.relation.id,
            'firstName': this.model.firstName,
            'lastName': this.model.lastName,
            'gender': this.model.gender,
            'birthDate': this.model.birthDate,
            'email': this.model.email,
        };
        this.loading = true;
        let familyMemberIdMapping = {};
        this.store
            .select(getFamilyMemberPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembers = Object.assign([], data['familyMembers']);
                    familyMemberIdMapping = Object.assign({}, data['idMapping']);
                }
            });
        this.store
            .select(getFamilyMemberRiskPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembersRisk = Object.assign([], data);
                }
            });
        this.clientProfileService.AddFamilyMember(this.familyMemberModel, this.clientId).subscribe(
            res => {
                this.clientProfileService.uploadAvatar(formData, this.clientId, 'CLIENT');
                this.familyMemberModel.id = this.familyMemberModel.firstName.toUpperCase();
                const relation_staus = this.clientProfileService.checkStatus(this.familyMemberModel.relation);
                this.familyMemberModel.btnColor = relation_staus['btnColor'];
                this.familyMemberModel.relation_staus = relation_staus['relation'];
                this.familyMemberModel.uploadAvatar = this.uploadedImage;
                // this.familyMemberModel.birthDate = datePipe.transform(this.familyMemberModel.birthDate, 'yyyy-MM-dd');
                this.familyMemberModel.age = this.calculateAgeFromDate.calculate(this.familyMemberModel.birthDate);
                this.familyMembers.push(this.familyMemberModel);
                familyMemberIdMapping[this.familyMemberModel.id] = this.familyMembers.length - 1;
                const familyMemberPayload = {
                    'idMapping': familyMemberIdMapping,
                    'familyMembers': this.familyMembers
                };
                this.familyMembersRisk['familyMembers'].push(this.familyMemberModel);
                this.familyMembersRisk['idMapping'][this.familyMemberModel.id] = this.familyMembers.length - 1;
                this.store.dispatch(new SetFamilyMembers(familyMemberPayload));
                this.store.dispatch(new SetFamilyMembersRisk(this.familyMembersRisk));
                this.loading = false;
                this.back();
            },
            (errorResponse) => {
            }
        );
    }
    back() {
        this._location.back();
    }
    uploadeImage(event) {
        this.uploadedImage = event;
    }
    setGender(relation) {
        this.isGenderDisable = true;
        if (relation.id === 3) {
            this.isGenderDisable = false;
        } else if (relation.id === 5 || relation.id === 8 || relation.id === 11 || relation.id === 7) {
            this.model.gender = 'F';
        } else {
            this.model.gender = 'M';
        }
    }
}
