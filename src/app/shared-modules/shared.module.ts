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

@NgModule({
    declarations: [
        ListHiaComponent,
        ListProviderComponent,
        ListEmployerComponent,
        ListBeneficiaryComponent,
        ListClaimsComponent,
        ListReferalsComponent
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
        ListReferalsComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: []
})
export class SharedModule {}