import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { providerRoutes } from './provider.route';
import {
    FacilityOwnershipService, FacilityCategoryService, UserTypeService, CountryService, BankService,
    ContactPositionService, FacilityService
} from '../../services/index';
import { ProviderComponent } from './provider.component';
import { ListProviderComponent } from './list-provider/list-provider.component';
import { NewProviderComponent } from './new-provider/new-provider.component';
import { ProviderDetailsComponent } from './provider-details/provider-details.component';
import { ProviderTopBarComponent } from './provider-details/provider-top-bar/provider-top-bar.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        providerRoutes
    ],
    declarations: [ProviderComponent, ListProviderComponent, NewProviderComponent, ProviderDetailsComponent, ProviderTopBarComponent],
    providers: [FacilityOwnershipService, FacilityCategoryService, UserTypeService, CountryService, BankService,
        ContactPositionService, FacilityService]
})
export class ProviderModule { }
