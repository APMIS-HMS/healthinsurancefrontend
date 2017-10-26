import { ReferralService } from './../../services/referral/referral.service';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import { MyDatePickerModule } from 'mydatepicker';

import { ReferalRoutes } from './referal.route';
import { ReferalComponent } from './referal.component';
import { ReferalDetailsComponent } from './referal-details/referal-details.component';
import { NewReferalComponent } from './new-referal/new-referal.component';
import { ReferalTopBarComponent } from './referal-details/referal-top-bar/referal-top-bar.component';
import { ReferalDetailTabComponent } from './referal-details/referal-detail-tab/referal-detail-tab.component';
import { ModalApproveReferalComponent } from './referal-details/modal-approve-referal/modal-approve-referal.component';
import { ModalRejectReferalComponent } from './referal-details/modal-reject-referal/modal-reject-referal.component';
import { NewReferalConfirmComponent } from './new-referal/new-referal-confirm/new-referal-confirm.component';
import { VisitTypeService, CheckInService, SymptomService, InvestigationService, DrugService, DiagnosisService, ProcedureService, DiagnosisTypeService } from '../../services/index';
import { DrugPackSizeService } from '../../services/common/drug-pack-size.service';
import { PolicyService } from '../../services/policy/policy.service';
import { PreAuthorizationService } from '../../services/pre-authorization/pre-authorization.service';
import { ReplyReferalTabsComponent } from './referal-details/reply-referal-tabs/reply-referal-tabs.component';

@NgModule({
    imports: [
        SharedModule,
        ReferalRoutes,
        MyDatePickerModule
    ],
    declarations: [
        ReferalComponent,
        ReferalDetailsComponent,
        NewReferalComponent,
        ReferalTopBarComponent,
        ReferalDetailTabComponent,
        ModalApproveReferalComponent,
        ModalRejectReferalComponent,
        NewReferalConfirmComponent,
        ReplyReferalTabsComponent],
    providers: [VisitTypeService, CheckInService, SymptomService,InvestigationService,DrugService,DiagnosisService,
        ProcedureService, DiagnosisTypeService, DrugPackSizeService, PolicyService, ReferralService]
})
export class ReferalModule { }
