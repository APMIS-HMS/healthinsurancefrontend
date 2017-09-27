import { UserTypeService } from './../../services/common/user-type.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BeneficiaryComponent } from './beneficiary.component';
import { NewBeneficiaryComponent } from './new-beneficiary/new-beneficiary.component';
import { beneficiaryRoutes } from './beneficiary.route';
import { ListBeneficiariesComponent } from './list-beneficiaries/list-beneficiaries.component';
import { DetailsBeneficiaryComponent } from './details-beneficiary/details-beneficiary.component';

@NgModule({
    declarations: [
        BeneficiaryComponent, NewBeneficiaryComponent, ListBeneficiariesComponent, DetailsBeneficiaryComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        beneficiaryRoutes
    ],
    providers: [UserTypeService]
})

export class BeneficiaryModule {

}