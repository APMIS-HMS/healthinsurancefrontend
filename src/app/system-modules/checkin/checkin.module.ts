import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckinComponent } from './checkin.component';
import { checkinRoutes } from './checkin.route';
import { CheckedinComponent } from './checkedin/checkedin.component';
import { NewCheckinComponent } from './new-checkin/new-checkin.component';
import { CheckinDetailsComponent } from './checkin-details/checkin-details.component';
import { CheckinTopBarComponent } from './checkin-details/checkin-top-bar/checkin-top-bar.component';

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
    CheckinTopBarComponent
  ]
})
export class CheckinModule { }
