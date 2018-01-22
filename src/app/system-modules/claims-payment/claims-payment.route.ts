import { RouterModule, Routes } from '@angular/router';

import { ClaimsPaymentComponent } from './claims-payment.component';
import { ClaimsPaymentDetailsComponent } from './claims-payment-details/claims-payment-details.component';
import { ListClaimsPaymentComponent } from './list-claims-payment/list-claims-payment.component';
import { CapitationPaymentComponent } from './capitation-payment/capitation-payment.component';
import { ClaimsProviderDetailsComponent } from './claims-provider-details/claims-provider-details.component';
import { ListPaidClaimsComponent } from './list-paid-claims/list-paid-claims.component';

const CLAIMS_PAYMENT_ROUTES: Routes = [
    {
        path: '', component: ClaimsPaymentComponent, children: [
            { path: '', redirectTo: 'claims-payment', pathMatch: 'full' },
            { path: 'claims-payment', component: ListClaimsPaymentComponent },
            { path: 'capitation/:id', component: CapitationPaymentComponent },
            { path: 'claims-payment/:id', component: ClaimsProviderDetailsComponent },
            { path: 'claims-payment/:providerId/details/:id', component: ClaimsPaymentDetailsComponent },
            { path: 'paid-claims', component: ListPaidClaimsComponent },
        ]
    }
];

export const claimsPaymentRoutes = RouterModule.forChild(CLAIMS_PAYMENT_ROUTES);
