import { NgModule } from '@angular/core';
import { SharedModule } from '../shared-modules/shared.module';

import { SystemModulesComponent } from './system-modules.component';
import { systemModulesRoutes } from './system-modules.route';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ModuleService, RoleService} from '../services/index';
import { AccessManagementComponent } from './access-management/access-management.component';
import { CheckinComponent } from './checkin/checkin.component';
// import { ListBeneficiaryComponent } from '../system-modules/beneficiary/list-beneficiary/list-beneficiary.component';

@NgModule({
    declarations: [
        SystemModulesComponent,
        TopBarComponent,
        MainMenuComponent,
        AccessManagementComponent,
        CheckinComponent
    ],
    exports: [],
    imports: [systemModulesRoutes, LoadingBarModule.forRoot(), SharedModule],
    providers: [ModuleService, RoleService]
})

export class SystemModules {

}