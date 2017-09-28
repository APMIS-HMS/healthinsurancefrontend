import { RouterModule, Routes } from '@angular/router';

import { EmployerComponent } from './employer.component';
import { ListEmployersComponent } from './list-employers/list-employers.component';
import { NewEmployerComponent } from './new-employer/new-employer.component';
import { DetailsEmployerComponent } from './details-employer/details-employer.component';
import { NewRequestComponent } from './new-request/new-request.component';

const EMPLOYER_ROUTES: Routes = [
    {
        path: '', component: EmployerComponent, children: [
            { path: '', redirectTo: "employers", pathMatch: 'full' },
            { path: 'employers', component: ListEmployersComponent },
            { path: 'employers/:id', component: DetailsEmployerComponent },
            { path: 'employers/:id/request', component: NewRequestComponent },
            { path: 'new', component: NewEmployerComponent },
            { path: 'edit-employer/:id', component: NewEmployerComponent },
        ]
    }
];

export const employerRoutes = RouterModule.forChild(EMPLOYER_ROUTES);