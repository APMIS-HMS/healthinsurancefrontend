import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import { MyDatePickerModule } from 'mydatepicker';

import { claimsPaymentRoutes } from './claims-payment.route';
import { ClaimsPaymentComponent } from './claims-payment.component';
import { ClaimsPaymentDetailsComponent } from './claims-payment-details/claims-payment-details.component';
import { ListClaimsPaymentComponent } from './list-claims-payment/list-claims-payment.component';

@NgModule({
    imports: [
        SharedModule,
        claimsPaymentRoutes,
        MyDatePickerModule
    ],
    declarations: [ClaimsPaymentComponent, ClaimsPaymentDetailsComponent, ListClaimsPaymentComponent],
    providers: []
})
export class ClaimsPaymentModule { }
