import { RouterModule, Routes } from '@angular/router';

import { ClaimsComponent } from './claims.component';
import { ClaimsDetailsComponent } from './claims-details/claims-details.component';
import { NewClaimComponent } from './new-claim/new-claim.component';
import { ListClaimsComponent } from './list-claims/list-claims.component';

const CLAIMS_ROUTES: Routes = [
    {
        path: '', component: ClaimsComponent, children: [
            { path: '', redirectTo: 'claims', pathMatch: 'full' },
            { path: 'claims', component: ListClaimsComponent },
            { path: 'claims/:id', component: ClaimsDetailsComponent },
            { path: 'new', component: NewClaimComponent },
            { path: 'new/:id', component: NewClaimComponent },
        ]
    }
];

export const claimsRoutes = RouterModule.forChild(CLAIMS_ROUTES);