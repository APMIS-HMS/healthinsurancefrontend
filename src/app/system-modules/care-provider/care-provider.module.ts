import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CareProviderComponent } from './care-provider.component';
import { careProviderRoutes } from './care-provider.route';
import { NewProviderComponent } from './new-provider/new-provider.component';
import { ListProvidersComponent } from './list-providers/list-providers.component';
import { DetailsProviderComponent } from './details-provider/details-provider.component';
import { NewRequestComponent } from './new-request/new-request.component';

@NgModule({
    declarations: [
        CareProviderComponent,
        NewProviderComponent,
        ListProvidersComponent,
        DetailsProviderComponent,
        NewRequestComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        careProviderRoutes
    ],
    providers: []
})

export class CareProviderModule {

}