import { NewBeneficiaryConfirmComponent } from './new-beneficiary/new-beneficiary-confirm/new-beneficiary-confirm.component';
import { NewBeneficiaryProgramComponent } from './new-beneficiary/new-beneficiary-program/new-beneficiary-program.component';
import { NewBeneficiaryNokComponent } from './new-beneficiary/new-beneficiary-nok/new-beneficiary-nok.component';
import { NewBeneficiaryDependantComponent } from './new-beneficiary/new-beneficiary-dependant/new-beneficiary-dependant.component';
import { NewBeneficiaryDataComponent } from './new-beneficiary/new-beneficiary-data/new-beneficiary-data.component';
import { ListReferalsComponent } from './../referal/list-referals/list-referals.component';
import { ListClaimsComponent } from './../claims/list-claims/list-claims.component';
import { CheckinHistoryComponent } from './beneficiary-details/checkin-history/checkin-history.component';
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
                    { path: 'checkedin-history', component: CheckinHistoryComponent },
                    { path: 'payment', component: PaymentDetailBeneficiaryComponent },
                    { path: 'claims', component: ListClaimsComponent },
                    { path: 'referrals', component: ListReferalsComponent }
                ]
            },
            {
                path: 'new', component: NewBeneficiaryComponent,
                children: [
                    { path: '', component: PersonalDetailsComponent },
                    { path: 'principal/:id', component: NewBeneficiaryDataComponent },
                    { path: 'principal', component: NewBeneficiaryDataComponent },
                    { path: 'dependants/:id', component: NewBeneficiaryDependantComponent },
                    { path: 'next-of-kin/:id', component: NewBeneficiaryNokComponent },
                    { path: 'program/:id', component: NewBeneficiaryProgramComponent },
                    { path: 'complete/:id', component: NewBeneficiaryConfirmComponent }
                ]
            },
            { path: 'new/:id', component: NewBeneficiaryComponent }
        ]
    }
];

export const beneficiaryRoutes = RouterModule.forChild(BENEFICIARY_ROUTES);