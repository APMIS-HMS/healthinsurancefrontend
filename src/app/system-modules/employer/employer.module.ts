import { PlanService } from './../../services/plan/plan.service';
import { ClaimService } from './../../services/common/claim.service';
import { TitleService } from './../../services/common/titles.service';
import { PolicyService } from './../../services/policy/policy.service';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import {
    FacilityService, IndustryService, CountryService, BankService, ContactPositionService,
    UserTypeService, SystemModuleService, BeneficiaryService,
} from './../../services/index';

import { employerRoutes } from './employer.route';
import { EmployerComponent } from './employer.component';
import { EmployerDetailsComponent } from './employer-details/employer-details.component';
import { NewEmployerComponent } from './new-employer/new-employer.component';

@NgModule({
    imports: [
        SharedModule,
        employerRoutes
    ],
    declarations: [EmployerComponent, EmployerDetailsComponent, NewEmployerComponent],
    providers: [FacilityService, IndustryService, CountryService, BankService, ContactPositionService, PlanService,
        UserTypeService, SystemModuleService, BeneficiaryService, PolicyService, TitleService, ClaimService]
})
export class EmployerModule { }
