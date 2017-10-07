import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import {
    SystemModuleService, CountryService, BankService, ContactPositionService, UserTypeService, FacilityService
} from '../../services/index';
import { hiaRoutes } from './hia.route';
import { HiaComponent } from './hia.component';
import { NewHiaComponent } from './new-hia/new-hia.component';
import { HiaDetailsComponent } from './hia-details/hia-details.component';
import { TabTopBarComponent } from './hia-details/tab-top-bar/tab-top-bar.component';

@NgModule({
    imports: [
        SharedModule,
        hiaRoutes
    ],
    declarations: [HiaComponent, NewHiaComponent, HiaDetailsComponent, TabTopBarComponent],
    providers: [CountryService, BankService, ContactPositionService, UserTypeService, FacilityService]
})
export class HiaModule { }
