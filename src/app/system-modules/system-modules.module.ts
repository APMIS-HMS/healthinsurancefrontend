import { NgModule } from '@angular/core';
import { SharedModule } from '../shared-modules/shared.module';

import { SystemModulesComponent } from './system-modules.component';
import { systemModulesRoutes } from './system-modules.route';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ModuleService, RoleService} from '../services/index';
import { AccessManagementComponent } from './access-management/access-management.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ChangePassComponent } from './top-bar/change-pass/change-pass.component';
import { NotificationService } from './../services/common/notification.service';


@NgModule({
    declarations: [
        SystemModulesComponent,
        TopBarComponent,
        MainMenuComponent,
        AccessManagementComponent,
        WelcomeComponent,
        ChangePassComponent
    ],
    exports: [],
    imports: [systemModulesRoutes, LoadingBarModule.forRoot(), SharedModule],
    providers: [ModuleService, RoleService, NotificationService]
})

export class SystemModules {

}