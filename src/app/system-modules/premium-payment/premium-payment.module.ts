import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import { MyDatePickerModule } from 'mydatepicker';

import { premiumPaymantRoutes } from './premium-payment.routes';
import { PremiumPaymentComponent } from './premium-payment.component';;
import { Angular4PaystackModule } from 'angular4-paystack';
import { NewOrganizationPaymentComponent } from './new-organization-payment/new-organization-payment.component';
import { ModalPaymentModeComponent } from './new-organization-payment/modal-payment-mode/modal-payment-mode.component';
import { PolicyService, PremiumPaymentService } from '../../services/index';
import { PendingPaymentsComponent } from './pending-payments/pending-payments.component';
import { PreviousPaymentsComponent } from './previous-payments/previous-payments.component';


@NgModule({
    imports: [
        SharedModule,
        MyDatePickerModule,
        premiumPaymantRoutes,
        Angular4PaystackModule
    ],
    declarations: [PremiumPaymentComponent,
        NewOrganizationPaymentComponent,
        ModalPaymentModeComponent,
        PendingPaymentsComponent,
        PreviousPaymentsComponent],
    providers: [PolicyService, PremiumPaymentService]
})
export class PremiumPaymentModule { }