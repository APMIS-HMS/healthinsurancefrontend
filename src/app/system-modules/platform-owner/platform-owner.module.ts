import { CountryService } from './../../services/common/country.service';
import { CountriesService } from './../../services/api-services/setup/countries.service';
import { BankService } from './../../services/common/bank.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { platformRoutes } from './platform-owner.route';

import { PlatformOwnerComponent } from './platform-owner.component';
import { NewPlatformComponent } from './new-platform/new-platform.component';
import { ListPlatformComponent } from './list-platform/list-platform.component';
import { DetailsPlatformComponent } from './details-platform/details-platform.component';
import { PlatformOwnerService } from '../../services/index';

@NgModule({
    declarations: [
    PlatformOwnerComponent,
    NewPlatformComponent,
    ListPlatformComponent,
    DetailsPlatformComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        platformRoutes
    ],
    providers: [PlatformOwnerService, BankService, CountryService]
})

export class PlatformOwnerModule {

}