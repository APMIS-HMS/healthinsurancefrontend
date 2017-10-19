import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import { MyDatePickerModule } from 'mydatepicker';
import {
    ClaimTypeService, VisitTypeService,DiagnosisService,ProcedureService,DrugService,SymptomService,InvestigationService,
    CheckInService, ClaimService,DiagnosisTypeService
} from '../../services/index';
import { claimsRoutes } from './claims.route';
import { ClaimsComponent } from './claims.component';
import { ClaimsDetailsComponent } from './claims-details/claims-details.component';
import { NewClaimComponent } from './new-claim/new-claim.component';
// import { ListClaimsComponent } from './list-claims/list-claims.component';
import { ClaimsTopBarComponent } from './claims-details/claims-top-bar/claims-top-bar.component';
import { ClaimsDetailTabComponent } from './claims-details/claims-detail-tab/claims-detail-tab.component';
import { ModalApproveClaimComponent } from './claims-details/modal-approve-claim/modal-approve-claim.component';
import { ModalRejectClaimComponent } from './claims-details/modal-reject-claim/modal-reject-claim.component';
import { ModalHoldClaimComponent } from './claims-details/modal-hold-claim/modal-hold-claim.component';
import { ModalQueryClaimComponent } from './claims-details/modal-query-claim/modal-query-claim.component';
import { ClaimsOthersTabComponent } from './claims-details/claims-others-tab/claims-others-tab.component';

@NgModule({
    imports: [
        SharedModule,
        claimsRoutes,
        MyDatePickerModule
    ],
    declarations: [ClaimsComponent, ClaimsDetailsComponent, NewClaimComponent, ClaimsTopBarComponent, ClaimsDetailTabComponent, ModalApproveClaimComponent, ModalRejectClaimComponent, ModalHoldClaimComponent, ModalQueryClaimComponent, ClaimsOthersTabComponent],
    providers: [ClaimTypeService,VisitTypeService,SymptomService,InvestigationService,DrugService,DiagnosisService,
        ProcedureService,CheckInService, ClaimService,DiagnosisTypeService]
})
export class ClaimsModule { }
