import { RouterModule, Routes } from '@angular/router';

import { PremiumPaymentComponent } from './premium-payment.component';
// import { ListOrganizationComponent } from './list-oraganization/list-organization.component';
// import { ListIndividualComponent } from './list-individual/list-individual.component';
import { NewOrganizationPaymentComponent } from './new-organization-payment/new-organization-payment.component';
import { PendingPaymentsComponent } from './pending-payments/pending-payments.component';
import { PreviousPaymentsComponent } from './previous-payments/previous-payments.component';

const CLAIMS_ROUTES: Routes = [
    {
        path: '', component: PremiumPaymentComponent, children: [
            { path: '', redirectTo: 'pending', pathMatch: 'full' },
            { path: 'pending', component: PendingPaymentsComponent },
            { path: 'previous', component: PreviousPaymentsComponent },
            { path: 'new-organization', component: NewOrganizationPaymentComponent },
        ]
    }
];

export const premiumPaymantRoutes = RouterModule.forChild(CLAIMS_ROUTES);