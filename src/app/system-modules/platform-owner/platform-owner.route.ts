import { RouterModule, Routes } from '@angular/router';
import { PlatformOwnerComponent } from './platform-owner.component';
import { NewPlatformComponent } from './new-platform/new-platform.component';
import { ListPlatformComponent } from './list-platform/list-platform.component';
import { DetailsPlatformComponent } from './details-platform/details-platform.component';

const PLATFORM_ROUTES: Routes = [
    {
        path: '', component: PlatformOwnerComponent, children: [
            { path: '', redirectTo: 'new-platform', pathMatch: 'full' },
            { path: 'platforms', component: ListPlatformComponent },
            { path: 'platforms/:id', component: DetailsPlatformComponent },
            { path: 'new-platform', component: NewPlatformComponent }
        ]
    }
];

export const platformRoutes = RouterModule.forChild(PLATFORM_ROUTES);