import { AppState, getFamilyMemberPayload } from '../../../shared/app.reducer';
import { fadeInAnimation } from '../../../shared/animations';
import { SetFamilyMembers } from '../../../shared/app.actions';
import { Route, ActivatedRoute } from '@angular/router';
import { ClientProfileService } from '../../service';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-personal-info',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.css'],
    animations: [fadeInAnimation],
    // attach the fade in animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@fadeInAnimation]': '' }
})
export class PersonalInfoComponent implements OnInit {
    public clientId: string;
    public familyMembers;
    base64Image;

    constructor(
        private clientProfileService: ClientProfileService,
        private route: ActivatedRoute,
        private store: Store<AppState>
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {
        this.store
            .select(getFamilyMemberPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembers = data['familyMembers'];
                } else {
                    this.getFamilyMembers();
                }
            });
    }

    getFamilyMembers() {
        if (this.clientId != null) {
            this.clientProfileService.getFamilyMembers(this.clientId).subscribe(result => {
                this.familyMembers = this.clientProfileService.processFamilyMembers(result);
            });
        }
    }
    getbase64Image(inputValue: any) {
        const file: File = inputValue;
        const myReader: FileReader = new FileReader();
        let ba4Image;
        myReader.onloadend = (e) => {
            ba4Image = myReader.result;
        };
        myReader.readAsDataURL(file);
        return ba4Image;

    }
}

