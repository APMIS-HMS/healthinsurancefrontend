import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared-modules/shared.module';
import { MyDatePickerModule } from 'mydatepicker';

import { ReferalRoutes } from './referal.route';
import { ReferalComponent } from './referal.component';
import { ReferalDetailsComponent } from './referal-details/referal-details.component';
import { ListReferalsComponent } from './list-referals/list-referals.component';
import { NewReferalComponent } from './new-referal/new-referal.component';
import { ReferalTopBarComponent } from './referal-details/referal-top-bar/referal-top-bar.component';
import { ReferalDetailTabComponent } from './referal-details/referal-detail-tab/referal-detail-tab.component';
import { ModalApproveReferalComponent } from './referal-details/modal-approve-referal/modal-approve-referal.component';
import { ModalRejectReferalComponent } from './referal-details/modal-reject-referal/modal-reject-referal.component';

@NgModule({
    imports: [
        SharedModule,
        ReferalRoutes,
        MyDatePickerModule
    ],
    declarations: [ReferalComponent,ReferalDetailsComponent, ListReferalsComponent, NewReferalComponent, ReferalTopBarComponent, ReferalDetailTabComponent, ModalApproveReferalComponent, ModalRejectReferalComponent],
    providers: []
})
export class ReferalModule { }
