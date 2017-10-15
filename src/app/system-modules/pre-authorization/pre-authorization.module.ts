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
import { ModalApproveAuthorizationComponent } from    './pre-authorization-details/modal-approve-authorization/modal-approve-authorization.component';
import { ModalRejectAuthorizationComponent } from    './pre-authorization-details/modal-reject-authorization/modal-reject-authorization.component';
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
    providers: []
})
export class PreAuthorizationModule { }