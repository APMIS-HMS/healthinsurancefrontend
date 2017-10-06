import { MyDatePickerModule } from 'mydatepicker';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import {
    ContactPositionService,
    PlatformOwnerService,
    CountryService
} from '../../services/index';

import { BankService } from '../../services/common/bank.service';

import { platformRoutes } from './platform-owner.route';
import { PlatformOwnerComponent } from './platform-owner.component';
import { ListPlatformComponent } from './list-platform/list-platform.component';
import { NewPlatformComponent } from './new-platform/new-platform.component';
import { PlatformDetailsComponent } from './platform-details/platform-details.component';
import { ListHiaComponent } from '../hia/list-hia/list-hia.component';
import { ListProviderComponent } from '../provider/list-provider/list-provider.component';
import { ListEmployerComponent } from '../employer/list-employer/list-employer.component';
import { ListBeneficiaryComponent } from '../beneficiary/list-beneficiary/list-beneficiary.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        platformRoutes,
        MyDatePickerModule
    ],
    declarations: [PlatformOwnerComponent, ListPlatformComponent, NewPlatformComponent,
        PlatformDetailsComponent, ListHiaComponent, ListProviderComponent, ListEmployerComponent, ListBeneficiaryComponent],
    providers: [ContactPositionService, PlatformOwnerService, CountryService, BankService ]
})
export class PlatformOwnerModule { }
