import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { roleRoutes } from './role.route';
import { RoleService } from '../../services/auth/role/role.service';
import { ModuleService } from '../../services/common/module.service';
import { RoleComponent } from './role.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListRoleComponent } from '../role/list-role/list-role.component';

@NgModule({
    declarations: [
        RoleComponent,
        ListRoleComponent,
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        roleRoutes
    ],
    providers: [RoleService, ModuleService]
})

export class RoleModule {

}