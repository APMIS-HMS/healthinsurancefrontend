import { RouterModule, Routes } from '@angular/router';

import { ClaimsPaymentComponent } from './claims-payment.component';
import { ClaimsPaymentDetailsComponent } from './claims-payment-details/claims-payment-details.component';
import { ListClaimsPaymentComponent } from './list-claims-payment/list-claims-payment.component';
import { QueuedClaimsPaymentComponent } from './queued-claims-payment/queued-claims-payment.component';

const CLAIMS_PAYMENT_ROUTES: Routes = [
    {
        path: '', component: ClaimsPaymentComponent, children: [
            { path: '', redirectTo: 'claims-payment', pathMatch: 'full' },
            { path: 'claims-payment', component: ListClaimsPaymentComponent },
            { path: 'claims-payment/:id', component: ClaimsPaymentDetailsComponent },
            { path: 'queued-claims', component: QueuedClaimsPaymentComponent }
        ]
    }
];

export const claimsPaymentRoutes = RouterModule.forChild(CLAIMS_PAYMENT_ROUTES);