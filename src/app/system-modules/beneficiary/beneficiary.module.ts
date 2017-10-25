import { ClaimService } from './../../services/common/claim.service';
import { CheckInService } from './../../services/common/check-in.service';
import { EncounterTypeService } from './../../services/common/encounter-type.service';
import { EncounterStatusService } from './../../services/common/encounter-status.service';
import { ClaimStatusService } from './../../services/common/claim-status.service';
import { ClaimTypeService } from './../../services/common/claim-type.service';
import { PolicyService } from './../../services/policy/policy.service';
import { JsonDataService } from './../../services/common/json-data.service';
import { PremiumTypeService } from './../../services/common/premium-type.service';
import { PlanService } from './../../services/plan/plan.service';
import { RelationshipService } from './../../services/common/relationship.service';
import { BankService } from './../../services/common/bank.service';
import { NgModule } from '@angular/core';
import { Angular4PaystackModule } from 'angular4-paystack';
import { SharedModule } from '../../shared-modules/shared.module';
import {
    CountryService, UserTypeService, GenderService, TitleService, MaritalStatusService,
    PlanTypeService, BeneficiaryService, UploadService, SystemModuleService, FacilityService, PremiumPaymentService
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
import { CheckinHistoryComponent } from './beneficiary-details/checkin-history/checkin-history.component';
import { PaymentDetailBeneficiaryComponent } from './beneficiary-details/payment-detail-beneficiary/payment-detail-beneficiary.component';

@NgModule({
    imports: [
        SharedModule,
        beneficiaryRoutes,
        MyDatePickerModule,
        Angular4PaystackModule
    ],
    declarations: [
        BeneficiaryComponent, NewBeneficiaryComponent, BeneficiaryDetailsComponent,
        BeneficiaryTopBarComponent, NewBeneficiaryDependantComponent, NewBeneficiaryProgramComponent, NewBeneficiaryDataComponent,
        NewBeneficiaryConfirmComponent, NewBeneficiaryNokComponent, CheckinDetailsComponent, CheckinHistoryComponent,
        PaymentDetailBeneficiaryComponent
    ],
    providers: [CountryService, GenderService, TitleService, MaritalStatusService, PlanService, PremiumTypeService,
        PlanTypeService, BeneficiaryService, BankService, RelationshipService, JsonDataService, PolicyService,     ClaimTypeService,
        ClaimStatusService,
        EncounterStatusService,
        EncounterTypeService,
        PremiumPaymentService,
        ClaimService,
        CheckInService]
})
export class BeneficiaryModule { }
