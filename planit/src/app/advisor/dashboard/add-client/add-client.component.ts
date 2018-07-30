import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { slideInOutAnimation } from '../../../shared/animations';
import { MaritalStatus } from '../../../client/client-models';
import { CalculateAgeFromDate } from '../../../core/utility/calculate-date-to-age';
import { ClientProfileService } from '../../../client/service/profile.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-add-client',
    templateUrl: './add-client.component.html',
    styleUrls: ['./add-client.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})

export class AddClientComponent implements OnInit {

    uploadedImage;
    familyMemberAge;
    clientModel: any;
    loading = false;
    maxDate = new Date();
    yearRange = (this.maxDate.getFullYear() - 100) + ':' + this.maxDate.getFullYear();
    maritalStatuses = MaritalStatus;
    @ViewChild('f') public form: NgForm;
    client = {
        maritalStatus: this.maritalStatuses[0],
        firstName: null,
        lastName: null,
        initials: null,
        retired: false,
        gender: 'Male',
        birthDate: null,
        email: null
    };

    imageChangedEvent: any;
    croppedImage: any;

    constructor(
        private calculateAgeFromDate: CalculateAgeFromDate,
        private clientProfileService: ClientProfileService,
        private _location: Location,
        private router: Router
    ) {
    }

    ngOnInit() {
    }

    back() {
        this._location.back();
    }

    uploadeImage(event) {
        this.uploadedImage = event;
    }

    public calculateAge(dateOfBirth) {
        this.familyMemberAge = this.calculateAgeFromDate.calculate(dateOfBirth);
    }

    public addClient(isValid, option) {
        if (isValid) {
            const formData = new FormData();
            formData.append('mediaType', 'image/png');
            formData.append('image', this.uploadedImage);
            this.clientModel = {
                familyData: {
                    clientFirstName: this.client.firstName,
                    clientLastName: this.client.lastName,
                    clientInitial: this.client.initials,
                    maritalStatus: this.client.maritalStatus.id,
                    clientGender: this.client.gender,
                    clientBirthdate: Date.parse(this.client.birthDate.toString()),
                    clientEmail: this.client.email,
                    retired: this.client.retired ? 0 : 1
                }
            };

            this.loading = true;
            this.clientProfileService.addNewClient(this.clientModel).subscribe(
                response => {
                    this.loading = false;
                    if (option === 1) {
                        this._location.back();
                    } else if (option === 2) {
                        this.router.navigate(['/client', response.id, 'profile', 'personal-info', response.id, 'edit']);
                    } else if (option === 3) {
                        if (this.client.maritalStatus.name === 'Married' || this.client.maritalStatus.name === 'Common law' || this.client.maritalStatus.name === 'Married/Single') {
                            this.router.navigate(['/advisor', 'dashboard', response.id, 'add-family-member']);
                        } else {
                            Swal('', 'Please change the marital status of Client1 from ' + this.client.maritalStatus.name + ' to Married or Common Law or Married-single', 'warning');
                        }
                    }
                    // this.clientProfileService.uploadAvatar(formData, 'CLIENT', 'CLIENT').subscribe(respUpload => {
                    //     console.log('respUpload --->>> ', respUpload);
                    // });
                },
                (errorResponse) => {
                    this.loading = false;
                    Swal('Oops...', errorResponse.error.errorMessage, 'error');
                }
            );
        } else {
            Swal('Oops...', 'Form is not valid!', 'error');
        }
    }

}
