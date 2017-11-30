import { RouterModule, Routes } from '@angular/router';

import { PlatformOwnerComponent } from './platform-owner.component';
import { ListPlatformComponent } from './list-platform/list-platform.component';
import { NewPlatformComponent } from './new-platform/new-platform.component';
import { PlatformDetailsComponent } from './/platform-details/platform-details.component';

const PLATFORM_ROUTES: Routes = [
    {
        path: '', component: PlatformOwnerComponent, children: [
            { path: '', redirectTo: 'platforms', pathMatch: 'full' },
            { path: 'platforms', component: ListPlatformComponent },
            { path: 'platforms/:id', component: PlatformDetailsComponent },
            { path: 'new', component: NewPlatformComponent },
            { path: 'new/:id', component: NewPlatformComponent },
        ]
    }
];

export const platformRoutes = RouterModule.forChild(PLATFORM_ROUTES);