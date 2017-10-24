import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import { MyDatePickerModule } from 'mydatepicker';

import { premiumPaymantRoutes } from './premium-payment.routes';
import { PremiumPaymentComponent } from './premium-payment.component';
import { ListOrganizationComponent } from './list-oraganization/list-organization.component';
import { ListIndividualComponent } from './list-individual/list-individual.component';
import { NewOrganizationPaymentComponent } from './new-organization-payment/new-organization-payment.component';
import { ModalAddOrganizationPaymentComponent } from './list-oraganization/modal-add-organization-payment/modal-add-organization-payment.component';
import { ModalPaymentModeComponent } from './new-organization-payment/modal-payment-mode/modal-payment-mode.component';


@NgModule({
    imports: [
        SharedModule,
        MyDatePickerModule,
        premiumPaymantRoutes,
    ],
    declarations: [PremiumPaymentComponent,
        ListOrganizationComponent,
        ListIndividualComponent,
        NewOrganizationPaymentComponent,
        ModalAddOrganizationPaymentComponent,
        ModalPaymentModeComponent],
    providers: []
})
export class PremiumPaymentModule { }