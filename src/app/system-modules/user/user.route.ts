import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { ListUserComponent } from './list-user/list-user.component';
import { NewUserComponent } from './new-user/new-user.component';

const USER_ROUTES: Routes = [
    {
        path: '', component: UserComponent, children: [
            { path: '', redirectTo: 'users', pathMatch: 'full' },
            { path: 'users', component: ListUserComponent },
            { path: 'users/:user-id', component: ListUserComponent },
            { path: 'new', component: NewUserComponent }, ]
    }
];

export const userRoutes = RouterModule.forChild(USER_ROUTES);