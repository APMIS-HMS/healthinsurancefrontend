import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { userRoutes } from './user.route';
import { UserComponent } from './user.component';
import { ListUserComponent } from './list-user/list-user.component';
import { NewUserComponent } from './new-user/new-user.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        userRoutes
    ],
    declarations: [UserComponent, ListUserComponent, NewUserComponent],
    providers: []
})
export class UserModule { }
