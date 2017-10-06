import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
    CountryService, UserTypeService, GenderService, TitleService, MaritalStatusService,
    PlanTypeService, BeneficiaryService, UploadService, SystemModuleService, FacilityService
} from '../../services/index';
import { beneficiaryRoutes } from './beneficiary.route';
import { BeneficiaryComponent } from '../beneficiary/beneficiary.component';
import { NewBeneficiaryComponent } from './new-beneficiary/new-beneficiary.component';
import { BeneficiaryDetailsComponent } from './beneficiary-details/beneficiary-details.component';
import { ListBeneficiaryComponent } from './list-beneficiary/list-beneficiary.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        beneficiaryRoutes
    ],
    exports: [
        ListBeneficiaryComponent
    ],
    declarations: [BeneficiaryComponent, NewBeneficiaryComponent, BeneficiaryDetailsComponent, ListBeneficiaryComponent],
    providers: [CountryService, GenderService, TitleService, MaritalStatusService,
    PlanTypeService, BeneficiaryService, SystemModuleService]
})
export class BeneficiaryModule { }
