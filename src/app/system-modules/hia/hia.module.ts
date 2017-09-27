import { FacilityService } from './../../services/common/facility.service';
import { UserTypeService } from './../../services/common/user-type.service';
import { BankService } from './../../services/common/bank.service';
import { CountryService } from './../../services/common/country.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { hiaRoutes } from './hia.route';

import { HiaComponent } from './hia.component';
import { ListHiasComponent } from './list-hias/list-hias.component';
import { NewHiaComponent } from './new-hia/new-hia.component';
import { DetailsHiaComponent } from './details-hia/details-hia.component';
import { NewRequestComponent } from './new-request/new-request.component';

@NgModule({
    declarations: [
        HiaComponent,
        ListHiasComponent,
        NewHiaComponent,
        DetailsHiaComponent,
        NewRequestComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        hiaRoutes
    ],
    providers: [CountryService, BankService, UserTypeService,FacilityService]
})

export class HiaModule {

}