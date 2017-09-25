import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsPlanComponent } from './details-plan/details-plan.component';
import { ListPlansComponent } from './list-plans/list-plans.component';
import { NewPlanComponent } from './new-plan/new-plan.component';
import { planRoutes } from './plan.route';
import { PlanComponent } from './plan.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    planRoutes
],
  declarations: [PlanComponent, DetailsPlanComponent, ListPlansComponent, NewPlanComponent]
})
export class PlanModule { }
