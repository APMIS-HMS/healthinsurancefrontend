import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { userManagementRoutes } from './user-management.route';

import { PersonService, RoleService } from '../../services/index';
import { UserManagementComponent } from './user-management.component';
import { ListUserComponent } from './list-user/list-user.component';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        UserManagementComponent,
        ListUserComponent,
        NewUserComponent,
        EditUserComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        userManagementRoutes
    ],
    providers: [PersonService, RoleService]
})

export class UserManagementModule {

}