import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';

import {
    FileUploadComponent,
    MemberAvatarComponent,
    ProfileModuleDropDownComponent,
    FamilyMemberDropdownComponent,
    CommonDropDownComponent,
    PaginationComponent,
    PlanningModuleDropDownComponent,
    FamilyPortfolioDropdownComponent,
    FileUploadService,
    ImageUploadComponent,
    ProductCodeDropdownComponent,
    CustomSliderComponent,
    RenameItemComponent
} from '.';


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule,
        SharedModule,
        ImageCropperModule,
        NgbModule.forRoot(),
        IonRangeSliderModule,
    ],
    declarations: [
        FileUploadComponent,
        MemberAvatarComponent,
        ProfileModuleDropDownComponent,
        CommonDropDownComponent,
        FamilyMemberDropdownComponent,
        PaginationComponent,
        PlanningModuleDropDownComponent,
        FamilyPortfolioDropdownComponent,
        ImageUploadComponent,
        ProductCodeDropdownComponent,
        CustomSliderComponent,
        RenameItemComponent
    ],
    exports: [
        FileUploadComponent,
        MemberAvatarComponent,
        ProfileModuleDropDownComponent,
        CommonDropDownComponent,
        FamilyMemberDropdownComponent,
        PaginationComponent,
        PlanningModuleDropDownComponent,
        FamilyPortfolioDropdownComponent,
        ImageUploadComponent,
        ProductCodeDropdownComponent,
        CustomSliderComponent,
        RenameItemComponent
    ],
    providers: [FileUploadService]
})
export class UiModule { }
