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
import { EmployerTopBarComponent } from './employer-details/employer-top-bar/employer-top-bar.component';

@NgModule({
    imports: [
        SharedModule,
        employerRoutes
    ],
    declarations: [EmployerComponent, EmployerDetailsComponent, NewEmployerComponent, EmployerTopBarComponent],
    providers: [FacilityService, IndustryService, CountryService, BankService, ContactPositionService,
        UserTypeService, SystemModuleService, BeneficiaryService, PolicyService, TitleService, ClaimService]
})
export class EmployerModule { }
