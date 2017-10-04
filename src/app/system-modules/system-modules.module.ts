import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SystemModulesComponent } from './system-modules.component';
import { systemModulesRoutes } from './system-modules.route';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ModuleService } from '../services/index';
import { AccessManagementComponent } from './access-management/access-management.component';
@NgModule({
    declarations: [
        SystemModulesComponent,
        TopBarComponent,
        MainMenuComponent,
        AccessManagementComponent
    ],
    exports: [FormsModule, ReactiveFormsModule],
    imports: [FormsModule, ReactiveFormsModule, systemModulesRoutes, LoadingBarModule.forRoot(), CommonModule],
    providers: [ModuleService]
})

export class SystemModules {

}