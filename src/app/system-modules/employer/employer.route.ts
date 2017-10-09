import { RouterModule, Routes } from '@angular/router';

import { EmployerComponent } from './employer.component';
import { ListEmployerComponent } from './list-employer/list-employer.component';
import { EmployerDetailsComponent } from './employer-details/employer-details.component';
import { NewEmployerComponent } from './new-employer/new-employer.component';

const EMPLOYER_ROUTES: Routes = [
    {
        path: '', component: EmployerComponent, children: [
            { path: '', redirectTo: 'employers', pathMatch: 'full' },
            { path: 'employers', component: ListEmployerComponent },
            { path: 'employers/:id', component: EmployerDetailsComponent },
            { path: 'new', component: NewEmployerComponent },
            { path: 'new/:id', component: NewEmployerComponent },
        ]
    }
];

export const employerRoutes = RouterModule.forChild(EMPLOYER_ROUTES);