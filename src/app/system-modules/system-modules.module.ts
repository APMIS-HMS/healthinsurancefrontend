import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { SystemModulesComponent } from './system-modules.component';
import { systemModulesRoutes } from './system-modules.route';

import { HeaderEventEmitterService } from '../services/event-emitters/header-event-emitter.service';

@NgModule({
    declarations: [
        SystemModulesComponent
    ],
    exports: [],
    imports: [NgbModule, systemModulesRoutes],
    providers: [HeaderEventEmitterService]
})

export class SystemModules {

}