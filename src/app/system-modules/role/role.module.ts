import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { roleRoutes } from './role.route';
import { RoleComponent } from './role.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { RoleDetailsComponent } from './role-details/role-details.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        roleRoutes
    ],
    declarations: [RoleComponent, ListRolesComponent, NewRoleComponent, RoleDetailsComponent],
    providers: []
})
export class RoleModule { }
