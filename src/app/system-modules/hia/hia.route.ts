import { RouterModule, Routes } from '@angular/router';

import { HiaComponent } from './hia.component';
import { NewHiaComponent } from './new-hia/new-hia.component';
import { ListHiaComponent } from './list-hia/list-hia.component';
import { HiaDetailsComponent } from './hia-details/hia-details.component';

const HIA_ROUTES: Routes = [
    {
        path: '', component: HiaComponent, children: [
            { path: '', redirectTo: 'hias', pathMatch: 'full' },
            { path: 'hias', component: ListHiaComponent },
            { path: 'hias/:hia-id', component: HiaDetailsComponent },
            { path: 'new', component: NewHiaComponent },
        ]
    }
];

export const hiaRoutes = RouterModule.forChild(HIA_ROUTES);