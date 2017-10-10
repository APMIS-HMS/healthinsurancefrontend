import { BankService } from './../../services/common/bank.service';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import {
    CountryService, UserTypeService, GenderService, TitleService, MaritalStatusService,
    PlanTypeService, BeneficiaryService, UploadService, SystemModuleService, FacilityService
} from '../../services/index';
import { beneficiaryRoutes } from './beneficiary.route';
import { BeneficiaryComponent } from '../beneficiary/beneficiary.component';
import { NewBeneficiaryComponent } from './new-beneficiary/new-beneficiary.component';
import { BeneficiaryDetailsComponent } from './beneficiary-details/beneficiary-details.component';
import { BeneficiaryTopBarComponent } from './beneficiary-details/beneficiary-top-bar/beneficiary-top-bar.component';
import { MyDatePickerModule } from 'mydatepicker';
import { NewBeneficiaryDependantComponent } from './new-beneficiary/new-beneficiary-dependant/new-beneficiary-dependant.component';
import { NewBeneficiaryProgramComponent } from './new-beneficiary/new-beneficiary-program/new-beneficiary-program.component';
import { NewBeneficiaryDataComponent } from './new-beneficiary/new-beneficiary-data/new-beneficiary-data.component';
import { NewBeneficiaryConfirmComponent } from './new-beneficiary/new-beneficiary-confirm/new-beneficiary-confirm.component';
import { NewBeneficiaryNokComponent } from './new-beneficiary/new-beneficiary-nok/new-beneficiary-nok.component';

@NgModule({
    imports: [
        SharedModule,
        beneficiaryRoutes,
        MyDatePickerModule
    ],
    declarations: [BeneficiaryComponent, NewBeneficiaryComponent, BeneficiaryDetailsComponent, BeneficiaryTopBarComponent, NewBeneficiaryDependantComponent, NewBeneficiaryProgramComponent, NewBeneficiaryDataComponent, NewBeneficiaryConfirmComponent, NewBeneficiaryNokComponent],
    providers: [CountryService, GenderService, TitleService, MaritalStatusService,
    PlanTypeService, BeneficiaryService, SystemModuleService, BankService]
})
export class BeneficiaryModule { }
