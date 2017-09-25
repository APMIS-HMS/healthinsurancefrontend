import { RouterModule, Routes } from '@angular/router';
import {RoleComponent } from './role.component';
import { ListRoleComponent } from '../role/list-role/list-role.component';

const ROLE_ROUTES: Routes = [
    {
        path: '', component: RoleComponent, children: [
            { path: '', redirectTo: 'roles', pathMatch: 'full' },
            { path: 'roles', component: ListRoleComponent },
        ]
    }
];

export const roleRoutes = RouterModule.forChild(ROLE_ROUTES);