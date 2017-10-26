import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PlanService, PlanTypeService } from '../../services/index';

import { DetailsPlanComponent } from './details-plan/details-plan.component';
import { ListPlansComponent } from './list-plans/list-plans.component';
import { NewPlanComponent } from './new-plan/new-plan.component';
import { planRoutes } from './plan.route';
import { PlanComponent } from './plan.component';
import { UserTypeService } from '../../services/common/user-type.service';
import { LashmaCodesListComponent } from './details-plan/lashma-codes-list/lashma-codes-list.component';
import { EditDrugCodeComponent } from './details-plan/lashma-codes-list/edit-drug-code/edit-drug-code.component';
import { EditInvestigationCodeComponent } from './details-plan/lashma-codes-list/edit-investigation-code/edit-investigation-code.component';
import { EditProcedureCodeComponent } from './details-plan/lashma-codes-list/edit-procedure-code/edit-procedure-code.component';
import { EditVisitCodeComponent } from './details-plan/lashma-codes-list/edit-visit-code/edit-visit-code.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    planRoutes
],
  declarations: [PlanComponent, DetailsPlanComponent, ListPlansComponent, NewPlanComponent, LashmaCodesListComponent, EditDrugCodeComponent, EditInvestigationCodeComponent, EditProcedureCodeComponent, EditVisitCodeComponent],
  providers: [PlanService, PlanTypeService]
})
export class PlanModule { }
