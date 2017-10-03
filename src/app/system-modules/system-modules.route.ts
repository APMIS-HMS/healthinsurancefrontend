import { RouterModule, Routes } from '@angular/router';
import { SystemModulesComponent } from './system-modules.component';

const SYSTEMMODULES_ROUTES: Routes = [
    {
        path: '', component: SystemModulesComponent, children: [
            { path: '', redirectTo: 'plan', pathMatch: 'full' },
            {
                path: 'plan',
                loadChildren: './plan/plan.module#PlanModule'
            },
            {
                path: 'role',
                loadChildren: './role/role.module#RoleModule'
            }
        ]
    }
];

export const systemModulesRoutes = RouterModule.forChild(SYSTEMMODULES_ROUTES);