import { RouterModule, Routes } from '@angular/router';

import { RoleComponent } from './role.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { RoleDetailsComponent } from './role-details/role-details.component';

const ROLE_ROUTES: Routes = [
    {
        path: '', component: RoleComponent, children: [
            { path: '', redirectTo: 'roles', pathMatch: 'full' },
            { path: 'roles', component: ListRolesComponent },
            { path: 'new', component: NewRoleComponent },
            { path: 'new/:id', component: NewRoleComponent },
        ]
    }
];

export const roleRoutes = RouterModule.forChild(ROLE_ROUTES);