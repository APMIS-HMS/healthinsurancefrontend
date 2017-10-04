import { RouterModule, Routes } from '@angular/router';

import { ProviderComponent } from './provider.component';
import { ListProviderComponent } from './list-provider/list-provider.component';
import { NewProviderComponent } from './new-provider/new-provider.component';
import { ProviderDetailsComponent } from './provider-details/provider-details.component';

const PROVIDER_ROUTES: Routes = [
    {
        path: '', component: ProviderComponent, children: [
            { path: '', redirectTo: 'roles', pathMatch: 'full' },
            { path: 'providers', component: ListProviderComponent },
            { path: 'provider/provider-id', component: ProviderDetailsComponent },
            { path: 'new', component: NewProviderComponent },
        ]
    }
];

export const providerRoutes = RouterModule.forChild(PROVIDER_ROUTES);