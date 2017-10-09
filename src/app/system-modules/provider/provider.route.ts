import { RouterModule, Routes } from '@angular/router';

import { ProviderComponent } from './provider.component';
import { ListProviderComponent } from './list-provider/list-provider.component';
import { NewProviderComponent } from './new-provider/new-provider.component';
import { ProviderDetailsComponent } from './provider-details/provider-details.component';

const PROVIDER_ROUTES: Routes = [
    {
        path: '', component: ProviderComponent, children: [
            { path: '', redirectTo: 'providers', pathMatch: 'full' },
            { path: 'providers', component: ListProviderComponent },
            { path: 'providers/:id', component: ProviderDetailsComponent },
            { path: 'new', component: NewProviderComponent },
            { path: 'new/:id', component: NewProviderComponent },
        ]
    }
];

export const providerRoutes = RouterModule.forChild(PROVIDER_ROUTES);