import { RouterModule, Routes } from '@angular/router';

import { HiaComponent } from './hia.component';
import { NewHiaComponent } from './new-hia/new-hia.component';
import { ListHiaComponent } from './list-hia/list-hia.component';
import { HiaDetailsComponent } from './hia-details/hia-details.component';
import { ListPlanComponent } from './hia-details/list-plan/list-plan.component';
import { DetailsComponent } from './hia-details/details/details.component';
import { ListBeneficiariesComponent } from './hia-details/list-beneficiaries/list-beneficiaries.component';
import { ListEmployersComponent } from './hia-details/list-employers/list-employers.component';
import { ListClaimComponent } from './hia-details/list-claim/list-claim.component';
import { ListPreauthorizationsComponent } from './hia-details/list-preauthorizations/list-preauthorizations.component';
import { ListComplaintsComponent } from './hia-details/list-complaints/list-complaints.component';
import { ListPaymentsComponent } from './hia-details/list-payments/list-payments.component';
import { ListReferralsComponent } from './hia-details/list-referrals/list-referrals.component';

const HIA_ROUTES: Routes = [
    {
        path: '', component: HiaComponent, children: [
            { path: '', redirectTo: 'hias', pathMatch: 'full' },
            { path: 'hias', component: ListHiaComponent },
            {
                path: 'hias/:id', component: HiaDetailsComponent,
                children: [
                    { path: '', component: DetailsComponent },
                    { path: 'plans', component: ListPlanComponent },
                    { path: 'beneficiaries', component: ListBeneficiariesComponent },
                    { path: 'organizations', component: ListEmployersComponent },
                    { path: 'claims', component: ListClaimComponent },
                    { path: 'pre-authorizations', component: ListPreauthorizationsComponent },
                    { path: 'payments', component: ListPaymentsComponent },
                    { path: 'complaints', component: ListComplaintsComponent },
                    { path: 'referrals', component: ListReferralsComponent },
                ]
            },
            { path: 'new', component: NewHiaComponent },
            { path: 'new/:id', component: NewHiaComponent },
        ]
    }
];

export const hiaRoutes = RouterModule.forChild(HIA_ROUTES);