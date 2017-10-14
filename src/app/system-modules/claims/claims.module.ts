import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import { MyDatePickerModule } from 'mydatepicker';

import { claimsRoutes } from './claims.route';
import { ClaimsComponent } from './claims.component';
import { ClaimsDetailsComponent } from './claims-details/claims-details.component';
import { NewClaimComponent } from './new-claim/new-claim.component';
import { ListClaimsComponent } from './list-claims/list-claims.component';
import { ClaimsTopBarComponent } from './claims-details/claims-top-bar/claims-top-bar.component';
import { ClaimsDetailTabComponent } from './claims-details/claims-detail-tab/claims-detail-tab.component';

@NgModule({
    imports: [
        SharedModule,
        claimsRoutes,
        MyDatePickerModule
    ],
    declarations: [ClaimsComponent, ClaimsDetailsComponent, NewClaimComponent, ListClaimsComponent, ClaimsTopBarComponent, ClaimsDetailTabComponent],
    providers: []
})
export class ClaimsModule { }
