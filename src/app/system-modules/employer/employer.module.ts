import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import {
    FacilityService, IndustryService, CountryService, BankService, ContactPositionService,
    UserTypeService, SystemModuleService,
} from './../../services/index';

import { employerRoutes } from './employer.route';
import { EmployerComponent } from './employer.component';
import { ListEmployerComponent } from './list-employer/list-employer.component';
import { EmployerDetailsComponent } from './employer-details/employer-details.component';
import { NewEmployerComponent } from './new-employer/new-employer.component';

@NgModule({
    imports: [
        SharedModule,
        employerRoutes
    ],
    declarations: [EmployerComponent, EmployerDetailsComponent, NewEmployerComponent],
    providers: [FacilityService, IndustryService, CountryService, BankService, ContactPositionService,
        UserTypeService, SystemModuleService]
})
export class EmployerModule { }
