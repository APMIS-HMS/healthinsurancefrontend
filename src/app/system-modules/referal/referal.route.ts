import { RouterModule, Routes } from '@angular/router';

import { ReferalComponent } from './referal.component';
import { ReferalDetailsComponent } from './referal-details/referal-details.component';
import { ListReferalsComponent } from './list-referals/list-referals.component';
import { NewReferalComponent } from './new-referal/new-referal.component';

const REFERAL_ROUTES: Routes = [
    {
        path: '', component: ReferalComponent, children: [
            { path: '', redirectTo: 'referals', pathMatch: 'full' },
            { path: 'referals', component: ListReferalsComponent },
            { path: 'referals/:id', component: ReferalDetailsComponent },
            { path: 'new', component: NewReferalComponent },
            { path: 'new/:id', component: NewReferalComponent },
            { path: 'view/:refid', component: NewReferalComponent }
        ]
    }
];

export const ReferalRoutes = RouterModule.forChild(REFERAL_ROUTES);