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
    PolicyService
  ]
})
export class CheckinModule { }
