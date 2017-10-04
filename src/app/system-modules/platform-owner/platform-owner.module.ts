import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { platformRoutes } from './platform-owner.route';
import { PlatformOwnerComponent } from './platform-owner.component';
import { ListPlatformComponent } from './list-platform/list-platform.component';
import { NewPlatformComponent } from './new-platform/new-platform.component';
import { PlatformDetailsComponent } from './platform-details/platform-details.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        platformRoutes
    ],
    declarations: [ListPlatformComponent, NewPlatformComponent, PlatformDetailsComponent],
    providers: [PlatformOwnerComponent]
})
export class PlatformOwnerModule { }
