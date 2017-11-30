import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListHiaComponent } from '../system-modules/hia/list-hia/list-hia.component';
import { ListProviderComponent } from '../system-modules/provider/list-provider/list-provider.component';
import { ListEmployerComponent } from '../system-modules/employer/list-employer/list-employer.component';
import { ListBeneficiaryComponent } from '../system-modules/beneficiary/list-beneficiary/list-beneficiary.component';
import { ListClaimsComponent } from '../system-modules/claims/list-claims/list-claims.component';
import { ListReferalsComponent } from '../system-modules/referal/list-referals/list-referals.component';
import { ListPlansComponent } from '../system-modules/plan/list-plans/list-plans.component';
import { PreAuthorizationListComponent } from '../system-modules/pre-authorization/pre-authorization-list/pre-authorization-list.component';
import { LashmaCodesComponent } from './lashma-codes/lashma-codes.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { Angular4FlutterwaveComponent } from './angular-4-flutterwave/angular-4-flutterwave.component';
import { WindowRef } from '../services/index';

@NgModule({
    declarations: [
        ListHiaComponent,
        ListProviderComponent,
        ListEmployerComponent,
        ListBeneficiaryComponent,
        ListClaimsComponent,
        ListReferalsComponent,
        LashmaCodesComponent,
        ListPlansComponent,
        PreAuthorizationListComponent,
        PaymentHistoryComponent,
        Angular4FlutterwaveComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ListHiaComponent,
        ListProviderComponent,
        ListEmployerComponent,
        ListBeneficiaryComponent,
        ListClaimsComponent,
        ListReferalsComponent,
        ListPlansComponent,
        LashmaCodesComponent,
        PreAuthorizationListComponent,
        PaymentHistoryComponent,
        Angular4FlutterwaveComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [WindowRef]
})
export class SharedModule {}