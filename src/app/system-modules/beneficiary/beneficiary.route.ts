import { PaymentDetailBeneficiaryComponent } from './beneficiary-details/payment-detail-beneficiary/payment-detail-beneficiary.component';
import { CheckinDetailsComponent } from './beneficiary-details/checkin-details/checkin-details.component';
import { PersonalDetailsComponent } from './beneficiary-details/personal-details/personal-details.component';
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
            {
                path: 'beneficiaries/:id', component: BeneficiaryDetailsComponent,
                children: [
                    { path: '', component: PersonalDetailsComponent },
                    { path: 'checkin', component: CheckinDetailsComponent },
                    { path: 'payment', component: PaymentDetailBeneficiaryComponent }
                ]
            },
            { path: 'new', component: NewBeneficiaryComponent },
            { path: 'new/:id', component: NewBeneficiaryComponent }
        ]
    }
];

export const beneficiaryRoutes = RouterModule.forChild(BENEFICIARY_ROUTES);