import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { roleRoutes } from './role.route';
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
    providers: []
})

export class RoleModule {

}