import { RouterModule, Routes } from '@angular/router';

import { BeneficiaryComponent } from './beneficiary.component';
import { ListBeneficiariesComponent } from './list-beneficiaries/list-beneficiaries.component';
import { NewBeneficiaryComponent } from './new-beneficiary/new-beneficiary.component';
import { DetailsBeneficiaryComponent } from './details-beneficiary/details-beneficiary.component';

const BENEFICIARY_ROUTES: Routes = [
    {
        path: '', component: BeneficiaryComponent, children: [
            { path: '', redirectTo: "beneficiaries", pathMatch: 'full' },
            { path: 'beneficiaries', component: ListBeneficiariesComponent },
            { path: 'beneficiaries/:id', component: DetailsBeneficiaryComponent },
            { path: 'new', component: NewBeneficiaryComponent }
        ]
    }
];

export const beneficiaryRoutes = RouterModule.forChild(BENEFICIARY_ROUTES);