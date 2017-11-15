import { PlanService } from './../../services/plan/plan.service';
import { ClaimService } from './../../services/common/claim.service';
import { TitleService } from './../../services/common/titles.service';
import { PolicyService } from './../../services/policy/policy.service';
import { NgModule } from '@angular/core';
import { Angular4PaystackModule } from 'angular4-paystack';
import { SharedModule } from '../../shared-modules/shared.module';
import {
    FacilityService, IndustryService, CountryService, BankService, ContactPositionService,
    UserTypeService, SystemModuleService, BeneficiaryService,MaritalStatusService,PlanTypeService,PremiumPaymentService
} from './../../services/index';
import { MyDatePickerModule } from 'mydatepicker';
import { employerRoutes } from './employer.route';
import { EmployerComponent } from './employer.component';
import { EmployerDetailsComponent } from './employer-details/employer-details.component';
import { ExcelUploadItemsComponent } from './employer-details/excel-upload-items/excel-upload-items.component';
import { NewEmployerComponent } from './new-employer/new-employer.component';
import { EmployerBeneficiariesComponent } from './employer-details/employer-beneficiaries/employer-beneficiaries.component';
import { PremiumPaymentTabComponent } from './employer-details/premium-payment-tab/premium-payment-tab.component';
import { UnbatchedComponent } from './employer-details/premium-payment-tab/unbatched/unbatched.component';
import { BatchedComponent } from './employer-details/premium-payment-tab/batched/batched.component';

@NgModule({
    imports: [
        SharedModule,
        employerRoutes,
        MyDatePickerModule,
        Angular4PaystackModule
    ],
<<<<<<< HEAD
    declarations: [EmployerComponent, EmployerDetailsComponent, NewEmployerComponent, EmployerBeneficiariesComponent,ExcelUploadItemsComponent],
    providers: [FacilityService, IndustryService, CountryService, BankService, ContactPositionService, PlanService,
        UserTypeService, SystemModuleService, BeneficiaryService, PolicyService, TitleService, ClaimService,MaritalStatusService,PlanTypeService]
=======
    declarations: [
        EmployerComponent,
        EmployerDetailsComponent,
        NewEmployerComponent, EmployerBeneficiariesComponent,
        PremiumPaymentTabComponent,
        UnbatchedComponent,
        BatchedComponent],
    providers: [FacilityService, IndustryService, CountryService, BankService, ContactPositionService, PlanService,
        UserTypeService, SystemModuleService, BeneficiaryService, PolicyService, TitleService, ClaimService, PremiumPaymentService]
>>>>>>> e6918bfd09bfb73a3a798dee7345835950a1ece0
})
export class EmployerModule { }
