import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoolStorageModule } from 'angular2-cool-storage';
import { SystemModuleService } from './services/common/system-module.service';
import { UserTypeService } from './services/common/user-type.service';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { SocketService, RestService } from './feathers/feathers.service';
import * as SetupService from './services/api-services/index';

import { appRouter } from './app.route';
import { AppComponent } from './app.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    appRouter,
    CoolStorageModule,
    LoadingBarModule.forRoot(),
  ],
  providers: [SocketService, RestService, SetupService.FacilitiesService, SetupService.FacilityTypesService,
    SetupService.CountriesService, SetupService.GenderService, SetupService.TitleService,
    SetupService.ProfessionService, SetupService.PersonService, SetupService.RelationshipService,
    SetupService.MaritalStatusService, SystemModuleService, UserTypeService,
    SetupService.UserService, SetupService.HiaService, SetupService.HiaNameService, SetupService.HiaProgramService,
    SetupService.HiaPlanService, SetupService.HiaPositionService, SetupService.OwnershipService,
    SetupService.CorporateFacilityService, SetupService.IndustryTypesService],
    bootstrap: [AppComponent]})
    
export class AppModule {
  constructor() { }
}
