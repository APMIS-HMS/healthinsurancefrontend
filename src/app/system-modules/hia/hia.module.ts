import { HiaTypeService } from './../../services/hia/hia-type.service';
import { HiaGradeService } from './../../services/hia/hia-grade.service';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import {
    SystemModuleService, CountryService, BankService, ContactPositionService, UserTypeService, FacilityService,
    BeneficiaryService, PlanService
} from '../../services/index';
import { hiaRoutes } from './hia.route';
import { HiaComponent } from './hia.component';
import { NewHiaComponent } from './new-hia/new-hia.component';
import { HiaDetailsComponent } from './hia-details/hia-details.component';
import { TabTopBarComponent } from './hia-details/tab-top-bar/tab-top-bar.component';
import { MyDatePickerModule } from 'mydatepicker';
import { ListPlansComponent } from './hia-details/list-plans/list-plans.component';
import { DetailsComponent } from './hia-details/details/details.component';
import { ListEmployersComponent } from './hia-details/list-employers/list-employers.component';
import { ListClaimsComponent } from './hia-details/list-claims/list-claims.component';
import { ListComplaintsComponent } from './hia-details/list-complaints/list-complaints.component';
import { ListPreauthorizationsComponent } from './hia-details/list-preauthorizations/list-preauthorizations.component';
import { ListBeneficiariesComponent } from './hia-details/list-beneficiaries/list-beneficiaries.component';
import { ListPaymentsComponent } from './hia-details/list-payments/list-payments.component';
import { ListReferralsComponent } from './hia-details/list-referrals/list-referrals.component';

@NgModule({
    imports: [
        SharedModule,
        hiaRoutes,
        MyDatePickerModule
    ],
    declarations: [HiaComponent,
        NewHiaComponent,
        HiaDetailsComponent,
        TabTopBarComponent,
        ListPlansComponent,
        DetailsComponent,
        ListEmployersComponent,
        ListClaimsComponent,
        ListComplaintsComponent,
        ListPreauthorizationsComponent,
        ListBeneficiariesComponent,
        ListPaymentsComponent, ListReferralsComponent],
    providers: [CountryService,
        BankService, ContactPositionService, UserTypeService, FacilityService,
        HiaGradeService, HiaTypeService, BeneficiaryService, PlanService]
})
export class HiaModule { }
