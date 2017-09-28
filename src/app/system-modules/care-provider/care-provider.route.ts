import { RouterModule, Routes } from '@angular/router';

import { CareProviderComponent } from './care-provider.component';
import { NewProviderComponent } from './new-provider/new-provider.component';
import { ListProvidersComponent } from './list-providers/list-providers.component';
import { DetailsProviderComponent } from './details-provider/details-provider.component';
import { NewRequestComponent } from './new-request/new-request.component';

const CARE_PROVIDER_ROUTES: Routes = [
    {
        path: '', component: CareProviderComponent, children: [
            { path: '', redirectTo: "providers", pathMatch: 'full' },
            { path: 'providers', component: ListProvidersComponent },
            { path: 'providers/:id', component: DetailsProviderComponent },
            { path: 'providers/:id/request', component: NewRequestComponent },
            { path: 'new', component: NewProviderComponent }
        ]
    }
];

export const careProviderRoutes = RouterModule.forChild(CARE_PROVIDER_ROUTES);