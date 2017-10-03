import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SystemModulesComponent } from './system-modules.component';
import { systemModulesRoutes } from './system-modules.route';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
@NgModule({
    declarations: [
        SystemModulesComponent,
        TopBarComponent,
        MainMenuComponent
    ],
    exports: [FormsModule, ReactiveFormsModule],
    imports: [FormsModule, ReactiveFormsModule, systemModulesRoutes, LoadingBarModule.forRoot(), CommonModule],
    providers: []
})

export class SystemModules {

}