import { CheckInService } from './../../services/common/check-in.service';
import { EncounterTypeService } from './../../services/common/encounter-type.service';
import { EncounterStatusService } from './../../services/common/encounter-status.service';
import { ClaimStatusService } from './../../services/common/claim-status.service';
import { ClaimTypeService } from './../../services/common/claim-type.service';
import { PolicyService } from './../../services/policy/policy.service';
import { BeneficiaryService } from './../../services/beneficiary/beneficiary.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckinComponent } from './checkin.component';
import { checkinRoutes } from './checkin.route';
import { CheckedinComponent } from './checkedin/checkedin.component';
import { NewCheckinComponent } from './new-checkin/new-checkin.component';

@NgModule({
  imports: [
    CommonModule,
    checkinRoutes,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [
    CheckinComponent,
    CheckedinComponent,
    NewCheckinComponent,
  ],
  providers:[
    BeneficiaryService,
    PolicyService,
    ClaimTypeService,
    ClaimStatusService,
    EncounterStatusService,
    EncounterTypeService,
    CheckInService
  ]
})
export class CheckinModule { }
