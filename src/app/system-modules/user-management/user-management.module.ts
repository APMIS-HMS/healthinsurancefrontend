import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';

import { userManagementRoutes } from './user-management.route';

import { UserManagementComponent } from './user-management.component';
import { ListUserComponent } from './list-user/list-user.component';
import { NewUserComponent } from './new-user/new-user.component';
import { DetailsUserComponent } from './details-user/details-user.component';
import { ModalAddRoleComponent } from './details-user/modal-add-role/modal-add-role.component';

@NgModule({
    declarations: [
        UserManagementComponent,
        ListUserComponent,
        NewUserComponent,
        DetailsUserComponent,
        ModalAddRoleComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        userManagementRoutes,
        MyDatePickerModule
    ],
    providers: []
})

export class UserManagementModule {

}