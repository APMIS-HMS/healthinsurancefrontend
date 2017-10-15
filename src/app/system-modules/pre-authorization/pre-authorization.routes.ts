import {RouterModule, Routes } from '@angular/router';

import { PreAuthorizationComponent } from './pre-authorization.component';
import { PreAuthorizationDetailsComponent } from './pre-authorization-details/pre-authorization-details.component';
import { PreAuthorizationListComponent } from './pre-authorization-list/pre-authorization-list.component';
import { PreAuthorizationNewComponent } from './pre-authorization-new/pre-authorization-new.component';


const CLAIMS_ROUTES: Routes = [
    {
        path: '', component: PreAuthorizationComponent, children: [
            { path: '', redirectTo: 'pre-authorizations', pathMatch: 'full' },
            { path: 'pre-authorizations', component: PreAuthorizationListComponent },
            { path: 'pre-authorizations/:id', component: PreAuthorizationDetailsComponent },
            { path: 'new', component: PreAuthorizationNewComponent },
            { path: 'new/:id', component: PreAuthorizationNewComponent },
        ]
    }
];

export const PreAuthorizationRoutes = RouterModule.forChild(CLAIMS_ROUTES);
