import { PremiumTypeService } from './services/common/premium-type.service';
import { UploadService } from './services/common/upload.service';
import { SystemModuleService } from './services/common/system-module.service';
import { UserTypeService } from './services/common/user-type.service';
import { AuthService } from './auth/services/auth.service';
import { FacilityService } from './services/common/facility.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoolStorageModule } from 'angular2-cool-storage';

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
    NgbModule.forRoot(),
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
    SetupService.MaritalStatusService,
    SetupService.UserService, SetupService.HiaService, SetupService.HiaNameService, SetupService.HiaProgramService,
    SetupService.HiaPlanService, SetupService.HiaPositionService, SetupService.OwnershipService,
    SetupService.CorporateFacilityService, SetupService.IndustryTypesService, AuthService, FacilityService,
    UserTypeService, SystemModuleService, UploadService, PremiumTypeService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { }
}
