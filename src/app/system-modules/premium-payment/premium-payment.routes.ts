import { RouterModule, Routes } from '@angular/router';
 
import { PremiumPaymentComponent } from './premium-payment.component';
import { ListOrganizationComponent } from './list-oraganization/list-organization.component';
import { ListIndividualComponent } from './list-individual/list-individual.component';
import { NewOrganizationPaymentComponent } from './new-organization-payment/new-organization-payment.component';

const CLAIMS_ROUTES: Routes = [
    {
        path: '', component: PremiumPaymentComponent, children: [
            { path: '', redirectTo: 'outstanding', pathMatch: 'full' },
            { path: 'outstanding', component: ListIndividualComponent },
            { path: 'previous', component: ListOrganizationComponent },
            { path: 'new-organization', component: NewOrganizationPaymentComponent },
        ]
    }
];

export const premiumPaymantRoutes = RouterModule.forChild(CLAIMS_ROUTES);