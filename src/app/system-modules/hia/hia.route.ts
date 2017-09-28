import { RouterModule, Routes } from '@angular/router';

import { HiaComponent } from './hia.component';
import { ListHiasComponent } from './list-hias/list-hias.component';
import { NewHiaComponent } from './new-hia/new-hia.component';
import { DetailsHiaComponent } from './details-hia/details-hia.component';
import { NewRequestComponent } from './new-request/new-request.component';

const HIA_ROUTES: Routes = [
    {
        path: '', component: HiaComponent, children: [
            { path: '', redirectTo: "hias", pathMatch: 'full' },
            { path: 'hias', component: ListHiasComponent },
            { path: 'hias/:id', component: DetailsHiaComponent },
            { path: 'hias/:id/request', component: NewRequestComponent },
            { path: 'new', component: NewHiaComponent }
        ]
    }
];

export const hiaRoutes = RouterModule.forChild(HIA_ROUTES);