import { RouterModule, Routes } from '@angular/router';

import { ClaimsPaymentComponent } from './claims-payment.component';
import { ClaimsPaymentDetailsComponent } from './claims-payment-details/claims-payment-details.component';
import { ListClaimsPaymentComponent } from './list-claims-payment/list-claims-payment.component';
import { QueuedClaimsPaymentComponent } from './queued-claims-payment/queued-claims-payment.component';
import { ListDetailsClaimsComponent } from './list-details-claims/list-details-claims.component';
import { CapitationPaymentComponent } from './capitation-payment/capitation-payment.component';

const CLAIMS_PAYMENT_ROUTES: Routes = [
    {
        path: '', component: ClaimsPaymentComponent, children: [
            { path: '', redirectTo: 'claims-payment', pathMatch: 'full' },
            { path: 'claims-payment', component: ListClaimsPaymentComponent },
            { path: 'capitation/:id', component: CapitationPaymentComponent },
            { path: 'claims-payment/:id', component: ClaimsPaymentDetailsComponent },
            { path: 'queued-claims', component: QueuedClaimsPaymentComponent },
            { path: 'queued-claims/:id', component: ListDetailsClaimsComponent }
        ]
    }
];

export const claimsPaymentRoutes = RouterModule.forChild(CLAIMS_PAYMENT_ROUTES);
