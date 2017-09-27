import { IndustryService } from './../../services/common/industry.service';
import { IndustryTypesService } from './../../services/api-services/setup/industry-type.service';
import { UserTypeService } from './../../services/common/user-type.service';
import { CountryService } from './../../services/common/country.service';
import { BankService } from './../../services/common/bank.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { employerRoutes } from './employer.route';

import { EmployerComponent } from './employer.component';
import { ListEmployersComponent } from './list-employers/list-employers.component';
import { NewEmployerComponent } from './new-employer/new-employer.component';
import { DetailsEmployerComponent } from './details-employer/details-employer.component';
import { NewRequestComponent } from './new-request/new-request.component';

@NgModule({
    declarations: [
        EmployerComponent,
        ListEmployersComponent,
        NewEmployerComponent,
        DetailsEmployerComponent,
        NewRequestComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        employerRoutes
    ],
    providers: [BankService, CountryService, UserTypeService, IndustryService]
})

export class EmployerModule {

}