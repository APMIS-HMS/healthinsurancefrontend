import { RouterModule, Routes } from '@angular/router';

import { PlatformOwnerComponent } from './platform-owner.component';

const PLATFORM_ROUTES: Routes = [
    {
        path: '', component: PlatformOwnerComponent, children: [
            { path: '', redirectTo: 'roles', pathMatch: 'full' },
            { path: 'platform', component: PlatformOwnerComponent },
            { path: 'platform/platform-id', component: PlatformOwnerComponent },
            { path: 'new', component: PlatformOwnerComponent },
        ]
    }
];

export const platformRoutes = RouterModule.forChild(PLATFORM_ROUTES);