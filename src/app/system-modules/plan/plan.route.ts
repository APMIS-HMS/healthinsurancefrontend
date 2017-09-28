import { RouterModule, Routes } from '@angular/router';

import { DetailsPlanComponent } from './details-plan/details-plan.component';
import { ListPlansComponent } from './list-plans/list-plans.component';
import { NewPlanComponent } from './new-plan/new-plan.component';
import { PlanComponent } from './plan.component';

const PLAN_ROUTES: Routes = [
    {
        path: '', component: PlanComponent, children: [
            { path: '', redirectTo: "plans", pathMatch: 'full' },
            { path: 'plans', component: ListPlansComponent },
            { path: 'plans/:id', component: DetailsPlanComponent },
            { path: 'new', component: NewPlanComponent }
        ]
    }
];

export const planRoutes = RouterModule.forChild(PLAN_ROUTES);