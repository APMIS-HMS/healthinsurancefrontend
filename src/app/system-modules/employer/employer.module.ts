import { PlanService } from './../../services/plan/plan.service';
import { ClaimService } from './../../services/common/claim.service';
import { TitleService } from './../../services/common/titles.service';
import { RelationshipService } from './../../services/common/relationship.service';
import { PolicyService } from './../../services/policy/policy.service';
import { NgModule } from '@angular/core';
import { Angular4PaystackModule } from 'angular4-paystack';
import { SharedModule } from '../../shared-modules/shared.module';
import {
    FacilityService, IndustryService, CountryService, BankService, ContactPositionService,
    UserTypeService, SystemModuleService, BeneficiaryService, MaritalStatusService, PlanTypeService, PremiumPaymentService,BulkBeneficiaryUploadService
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
    declarations: [
        EmployerComponent,
        EmployerDetailsComponent,
        NewEmployerComponent, EmployerBeneficiariesComponent,
        PremiumPaymentTabComponent,
        UnbatchedComponent,
        ExcelUploadItemsComponent,
        BatchedComponent
    ],
    providers: [FacilityService, IndustryService, CountryService, BankService, ContactPositionService, PlanService,
        UserTypeService, SystemModuleService, BeneficiaryService, PolicyService, TitleService, ClaimService,
        MaritalStatusService, PlanTypeService, PremiumPaymentService,BatchedComponent,BulkBeneficiaryUploadService, RelationshipService]
})
export class EmployerModule { }
