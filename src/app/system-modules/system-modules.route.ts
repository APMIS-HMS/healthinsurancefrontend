import { RouterModule, Routes } from '@angular/router';
import { SystemModulesComponent } from './system-modules.component';
import { AccessManagementComponent } from './access-management/access-management.component';

const SYSTEMMODULES_ROUTES: Routes = [
    {
        path: '', component: SystemModulesComponent, children: [
            { path: '', redirectTo: 'plan', pathMatch: 'full' },
            {
                path: 'plan',
                loadChildren: './plan/plan.module#PlanModule'
            },
            {
                path: 'user',
                loadChildren: './user-management/user-management.module#UserManagementModule'
            },
            {
                path: 'platform',
                loadChildren: './platform-owner/platform-owner.module#PlatformOwnerModule'
            },
            {
                path: 'role',
                loadChildren: './role/role.module#RoleModule'
            },
            {
                path: 'provider',
                loadChildren: './provider/provider.module#ProviderModule'
            },
            {
                path: 'beneficiary',
                loadChildren: './beneficiary/beneficiary.module#BeneficiaryModule'
            },
            {
                path: 'hia',
                loadChildren: './hia/hia.module#HiaModule'
            },
            {
                path: 'employer',
                loadChildren: './employer/employer.module#EmployerModule'
            },
            {
                path: 'claim',
                loadChildren: './claims/claims.module#ClaimsModule'
            },
            {
                path: 'claims',
                loadChildren: './claims-payment/claims-payment.module#ClaimsPaymentModule'
            },
            {
                path: 'checkin',
                loadChildren: './checkin/checkin.module#CheckinModule'
            },
            { path: 'access', component: AccessManagementComponent }
        ]
    }
];

export const systemModulesRoutes = RouterModule.forChild(SYSTEMMODULES_ROUTES);