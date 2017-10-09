import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import {
    CountryService, UserTypeService, GenderService, TitleService, MaritalStatusService,
    PlanTypeService, BeneficiaryService, UploadService, SystemModuleService, FacilityService
} from '../../services/index';
import { beneficiaryRoutes } from './beneficiary.route';
import { BeneficiaryComponent } from '../beneficiary/beneficiary.component';
import { NewBeneficiaryComponent } from './new-beneficiary/new-beneficiary.component';
import { BeneficiaryDetailsComponent } from './beneficiary-details/beneficiary-details.component';
import { BeneficiaryTopBarComponent } from './beneficiary-details/beneficiary-top-bar/beneficiary-top-bar.component';

@NgModule({
    imports: [
        SharedModule,
        beneficiaryRoutes
    ],
    declarations: [BeneficiaryComponent, NewBeneficiaryComponent, BeneficiaryDetailsComponent, BeneficiaryTopBarComponent],
    providers: [CountryService, GenderService, TitleService, MaritalStatusService,
    PlanTypeService, BeneficiaryService, SystemModuleService]
})
export class BeneficiaryModule { }
