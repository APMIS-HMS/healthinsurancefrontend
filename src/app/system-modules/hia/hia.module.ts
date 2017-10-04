import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { hiaRoutes } from './hia.route';
import { HiaComponent } from './hia.component';
import { NewHiaComponent } from './new-hia/new-hia.component';
import { ListHiaComponent } from './list-hia/list-hia.component';
import { HiaDetailsComponent } from './hia-details/hia-details.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        hiaRoutes
    ],
    declarations: [HiaComponent, NewHiaComponent, ListHiaComponent, HiaDetailsComponent],
    providers: []
})
export class HiaModule { }
