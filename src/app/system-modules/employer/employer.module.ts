import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { employerRoutes } from './employer.route';

import { EmployerComponent } from './employer.component';
import { ListEmployersComponent } from './list-employers/list-employers.component';
import { NewEmployerComponent } from './new-employer/new-employer.component';
import { DetailsEmployerComponent } from './details-employer/details-employer.component';
import { NewRequestComponent } from './new-request/new-request.component';

@NgModule({
    declarations: [
        EmployerComponent,
        ListEmployersComponent,
        NewEmployerComponent,
        DetailsEmployerComponent,
        NewRequestComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        employerRoutes
    ],
    providers: []
})

export class EmployerModule {

}