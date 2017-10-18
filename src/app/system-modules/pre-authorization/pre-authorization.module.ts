import { PolicyService } from './../../services/policy/policy.service';
import { DrugPackSizeService } from './../../services/common/drug-pack-size.service';
import { DiagnosisTypeService } from './../../services/common/diagnosis-type.service';
import { DiagnosisService } from './../../services/common/diagnosis.service';
import { DrugService } from './../../services/common/drug.service';
import { SymptomService } from './../../services/common/symptoms.service';
import { ProcedureService } from './../../services/common/procedure.service';
import { InvestigationService } from './../../services/common/investigation.service';
import { CheckInService } from './../../services/common/check-in.service';
import { VisitTypeService } from './../../services/common/visit-type.service';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import { MyDatePickerModule } from 'mydatepicker';


import { PreAuthorizationRoutes } from './pre-authorization.routes';
import { PreAuthorizationComponent } from './pre-authorization.component';
import { PreAuthorizationDetailsComponent } from './pre-authorization-details/pre-authorization-details.component';
import { PreAuthorizationNewComponent } from './pre-authorization-new/pre-authorization-new.component';
import { PreAuthorizationListComponent } from './pre-authorization-list/pre-authorization-list.component';
import { AuthorizationTopBarComponent } from './pre-authorization-details/authorization-top-bar/authorization-top-bar.component';
import { AuthorizationDetailsTabComponent } from './pre-authorization-details/authorization-details-tab/authorization-details-tab.component';
import { AuthorizationOthersTabComponent } from './pre-authorization-details/authorization-others-tab/authorization-others-tab.component';
import { ModalApproveAuthorizationComponent } from './pre-authorization-details/modal-approve-authorization/modal-approve-authorization.component';
import { ModalRejectAuthorizationComponent } from './pre-authorization-details/modal-reject-authorization/modal-reject-authorization.component';
import { ModalHoldAuthorizationComponent } from './pre-authorization-details/modal-hold-authorization/modal-hold-authorization.component';
import { ModalQueryAuthorizationComponent } from './pre-authorization-details/modal-query-authorization/modal-query-authorization.component';

@NgModule({
    imports: [
        SharedModule,
        MyDatePickerModule,
        PreAuthorizationRoutes,
    ],
    declarations: [PreAuthorizationComponent,
        PreAuthorizationDetailsComponent,
        PreAuthorizationNewComponent,
        PreAuthorizationListComponent,
        AuthorizationTopBarComponent,
        AuthorizationDetailsTabComponent,
        AuthorizationOthersTabComponent,
        ModalApproveAuthorizationComponent,
        ModalRejectAuthorizationComponent,
        ModalHoldAuthorizationComponent,
        ModalQueryAuthorizationComponent],
    providers: [VisitTypeService, CheckInService, SymptomService,InvestigationService,DrugService,DiagnosisService,
        ProcedureService, DiagnosisTypeService, ProcedureService, DrugPackSizeService, PolicyService]
})
export class PreAuthorizationModule { }