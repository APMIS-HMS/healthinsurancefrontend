import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CountryService, UserTypeService, GenderService, TitleService, MaritalStatusService } from '../../services/index';
import { beneficiaryRoutes } from './beneficiary.route';
import { BeneficiaryComponent } from '../beneficiary/beneficiary.component';
import { NewBeneficiaryComponent } from './new-beneficiary/new-beneficiary.component';
import { ListBeneficiaryComponent } from './list-beneficiary/list-beneficiary.component';
import { BeneficiaryDetailsComponent } from './beneficiary-details/beneficiary-details.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        beneficiaryRoutes
    ],
    declarations: [BeneficiaryComponent, NewBeneficiaryComponent, ListBeneficiaryComponent, BeneficiaryDetailsComponent],
    providers: [UserTypeService, CountryService, GenderService, TitleService, MaritalStatusService]
})
export class BeneficiaryModule { }
