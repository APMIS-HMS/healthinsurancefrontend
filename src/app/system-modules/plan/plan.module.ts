import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared-modules/shared.module';

import { PlanService, PlanTypeService, DrugService, InvestigationService, VisitTypeService, ProcedureService } from '../../services/index';

import { DetailsPlanComponent } from './details-plan/details-plan.component';
// import { ListPlansComponent } from './list-plans/list-plans.component';
import { NewPlanComponent } from './new-plan/new-plan.component';
import { planRoutes } from './plan.route';
import { PlanComponent } from './plan.component';
import { UserTypeService } from '../../services/common/user-type.service';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    planRoutes
],
  declarations: [PlanComponent, DetailsPlanComponent, NewPlanComponent],
  providers: [PlanService, PlanTypeService, DrugService, InvestigationService, VisitTypeService, ProcedureService]
})
export class PlanModule { } 
