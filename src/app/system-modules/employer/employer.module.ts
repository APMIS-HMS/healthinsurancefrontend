import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { employerRoutes } from './employer.route';
import { EmployerComponent } from './employer.component';
import { ListEmployerComponent } from './list-employer/list-employer.component';
import { EmployerDetailsComponent } from './employer-details/employer-details.component';
import { NewEmployerComponent } from './new-employer/new-employer.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        employerRoutes
    ],
    declarations: [EmployerComponent, ListEmployerComponent, EmployerDetailsComponent, NewEmployerComponent],
    providers: []
})
export class EmployerModule { }
