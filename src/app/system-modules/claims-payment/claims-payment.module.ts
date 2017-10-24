import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import { MyDatePickerModule } from 'mydatepicker';

import { claimsPaymentRoutes } from './claims-payment.route';
import { ClaimsPaymentComponent } from './claims-payment.component';
import { ClaimsPaymentDetailsComponent } from './claims-payment-details/claims-payment-details.component';
import { ListClaimsPaymentComponent } from './list-claims-payment/list-claims-payment.component';
import { QueuedClaimsPaymentComponent } from './queued-claims-payment/queued-claims-payment.component';
import { ClaimsPaymentService, ClaimService, CapitationFeeService, PolicyService } from '../../services/index';
import { ListDetailsClaimsComponent } from './list-details-claims/list-details-claims.component';

@NgModule({
    imports: [
        SharedModule,
        claimsPaymentRoutes,
        MyDatePickerModule
    ],
    declarations: [
        ClaimsPaymentComponent,
        ClaimsPaymentDetailsComponent,
        ListClaimsPaymentComponent,
        QueuedClaimsPaymentComponent,
        ListDetailsClaimsComponent],
    providers: [ClaimsPaymentService, ClaimService, CapitationFeeService, PolicyService]
})
export class ClaimsPaymentModule { }
