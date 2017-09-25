import { AuthService } from './auth/services/auth.service';
import { UserTypeService } from './services/api-services/setup/user-type.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoolStorageModule } from 'angular2-cool-storage';

import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { SocketService, RestService } from './feathers/feathers.service';
import * as SetupService from './services/api-services/index';

import { appRouter } from './app.route';
import { AppComponent } from './app.component';

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
    CoolStorageModule
  ],
  providers: [SocketService, RestService, SetupService.FacilitiesService, SetupService.FacilityTypesService,
    SetupService.CountriesService, SetupService.GenderService, SetupService.TitleService,
    SetupService.ProfessionService, SetupService.PersonService, SetupService.RelationshipService,
    SetupService.MaritalStatusService,
    SetupService.UserService, SetupService.HiaService, SetupService.HiaNameService, SetupService.HiaProgramService,
    SetupService.HiaPlanService, SetupService.HiaPositionService, SetupService.OwnershipService,
    SetupService.CorporateFacilityService, SetupService.IndustryTypesService, UserTypeService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { }
}
