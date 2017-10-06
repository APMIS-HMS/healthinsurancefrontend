import { MyDatePickerModule } from 'mydatepicker';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
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

@NgModule({
    imports: [
        SharedModule,
        platformRoutes,
        MyDatePickerModule
    ],
    declarations: [PlatformOwnerComponent, ListPlatformComponent, NewPlatformComponent, PlatformDetailsComponent],
    providers: [ContactPositionService, PlatformOwnerService, CountryService, BankService ]
})
export class PlatformOwnerModule { }
