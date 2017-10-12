import { PolicyService } from './../../services/policy/policy.service';
import { JsonDataService } from './../../services/common/json-data.service';
import { PremiumTypeService } from './../../services/common/premium-type.service';
import { PlanService } from './../../services/plan/plan.service';
import { RelationshipService } from './../../services/common/relationship.service';
import { BankService } from './../../services/common/bank.service';
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
import { MyDatePickerModule } from 'mydatepicker';
import { NewBeneficiaryDependantComponent } from './new-beneficiary/new-beneficiary-dependant/new-beneficiary-dependant.component';
import { NewBeneficiaryProgramComponent } from './new-beneficiary/new-beneficiary-program/new-beneficiary-program.component';
import { NewBeneficiaryDataComponent } from './new-beneficiary/new-beneficiary-data/new-beneficiary-data.component';
import { NewBeneficiaryConfirmComponent } from './new-beneficiary/new-beneficiary-confirm/new-beneficiary-confirm.component';
import { NewBeneficiaryNokComponent } from './new-beneficiary/new-beneficiary-nok/new-beneficiary-nok.component';
import { CheckinDetailsComponent } from './beneficiary-details/checkin-details/checkin-details.component';

@NgModule({
    imports: [
        SharedModule,
        beneficiaryRoutes,
        MyDatePickerModule
    ],
    declarations: [BeneficiaryComponent, NewBeneficiaryComponent, BeneficiaryDetailsComponent, BeneficiaryTopBarComponent, NewBeneficiaryDependantComponent, NewBeneficiaryProgramComponent, NewBeneficiaryDataComponent, NewBeneficiaryConfirmComponent, NewBeneficiaryNokComponent, CheckinDetailsComponent],
    providers: [CountryService, GenderService, TitleService, MaritalStatusService, PlanService, PremiumTypeService,
        PlanTypeService, BeneficiaryService, BankService, RelationshipService, JsonDataService, PolicyService]
})
export class BeneficiaryModule { }
