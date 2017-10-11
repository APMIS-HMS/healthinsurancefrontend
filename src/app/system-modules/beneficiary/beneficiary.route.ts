import { RouterModule, Routes } from '@angular/router';

import { BeneficiaryComponent } from './beneficiary.component';
import { NewBeneficiaryComponent } from './new-beneficiary/new-beneficiary.component';
import { ListBeneficiaryComponent } from './list-beneficiary/list-beneficiary.component';
import { BeneficiaryDetailsComponent } from './beneficiary-details/beneficiary-details.component';

const BENEFICIARY_ROUTES: Routes = [
    {
        path: '', component: BeneficiaryComponent, children: [
            { path: '', redirectTo: 'beneficiaries', pathMatch: 'full' },
            { path: 'beneficiaries', component: ListBeneficiaryComponent },
            { path: 'beneficiaries/:beneficiary-id', component: BeneficiaryDetailsComponent },
            { path: 'new', component: NewBeneficiaryComponent },
            { path: 'new/:id', component: NewBeneficiaryComponent },        ]
    }
];

export const beneficiaryRoutes = RouterModule.forChild(BENEFICIARY_ROUTES);