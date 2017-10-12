import { RouterModule, Routes } from '@angular/router';
import { CheckinComponent } from './checkin.component';
import { CheckedinComponent } from './checkedin/checkedin.component';
import { NewCheckinComponent } from './new-checkin/new-checkin.component';

const CHECKIN_ROUTES: Routes = [
    {
        path: '', component: CheckinComponent, children: [
            { path: '', redirectTo: 'checkedin', pathMatch: 'full' },
            { path: 'checkedin', component: CheckedinComponent },
            { path: 'new', component: NewCheckinComponent }
        ]
    }
];

export const checkinRoutes = RouterModule.forChild(CHECKIN_ROUTES);