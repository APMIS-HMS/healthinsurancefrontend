import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import { providerRoutes } from './provider.route';
import {
    FacilityOwnershipService, FacilityCategoryService, UserTypeService, CountryService, BankService,
    ContactPositionService, FacilityService, ProviderGradesService, ProviderStatusesService
} from '../../services/index';
import { ProviderComponent } from './provider.component';
import { NewProviderComponent } from './new-provider/new-provider.component';
import { ProviderDetailsComponent } from './provider-details/provider-details.component';
import { ProviderTopBarComponent } from './provider-details/provider-top-bar/provider-top-bar.component';

@NgModule({
    imports: [
        SharedModule,
        providerRoutes
    ],
    declarations: [ProviderComponent, NewProviderComponent, ProviderDetailsComponent, ProviderTopBarComponent],
    providers: [FacilityOwnershipService, FacilityCategoryService, UserTypeService, CountryService, BankService,
        ContactPositionService, FacilityService, ProviderGradesService, ProviderStatusesService]
})
export class ProviderModule { }
