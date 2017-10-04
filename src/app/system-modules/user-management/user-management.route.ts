import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { ListUserComponent } from './list-user/list-user.component';
import { NewUserComponent } from './new-user/new-user.component';

const USERMANAGEMENT_ROUTES: Routes = [
    {
        path: '', component: UserManagementComponent, children: [
            { path: '', redirectTo: 'users', pathMatch: 'full' },
            { path: 'users', component: ListUserComponent },
            { path: 'users/:id', component: NewUserComponent },
            { path: 'new', component: NewUserComponent }
        ]
    }
];

export const userManagementRoutes = RouterModule.forChild(USERMANAGEMENT_ROUTES);