import { RouterModule, Routes } from '@angular/router';
import { SystemModulesComponent } from './system-modules.component';

const SYSTEMMODULES_ROUTES: Routes = [
    {
        path: '', component: SystemModulesComponent, children: [
            { path: '', redirectTo: "beneficiary", pathMatch: 'full' },
            {
                path: 'beneficiary',
                loadChildren: './beneficiary/beneficiary.module#BeneficiaryModule'
            },
            {
                path: 'employer',
                loadChildren: './employer/employer.module#EmployerModule'
            },
            {
                path: 'care-provider',
                loadChildren: './care-provider/care-provider.module#CareProviderModule'
            },
            {
                path: 'hia',
                loadChildren: './hia/hia.module#HiaModule'
            },
            {
                path: 'platform',
                loadChildren: './platform-owner/platform-owner.module#PlatformOwnerModule'
            },
            {
                path: 'plan',
                loadChildren: './plan/plan.module#PlanModule'
            },
            {
                path: 'user-management',
                loadChildren: './user-management/user-management.module#UserManagementModule'
            }
        ]
    }
];

export const systemModulesRoutes = RouterModule.forChild(SYSTEMMODULES_ROUTES);