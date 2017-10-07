import { ListLoggedInUserComponent } from './system-modules/user-management/list-loggedin-user/list-loggedin-user.component';
import { UserService } from './services/common/user.service';
import { GenderService } from './services/common/gender.service';

import { UploadService } from './services/common/upload.service';
import { AuthService } from './auth/services/auth.service';
import { PremiumTypeService } from './services/common/premium-type.service';
import { HeaderEventEmitterService } from './services/event-emitters/header-event-emitter.service';
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
import { appRouter } from './app.route';
import { AppComponent } from './app.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { FacilityService } from './services/common/facility.service';
import { PersonService } from './services/person/person.service';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedModule } from './shared-modules/shared.module';
@NgModule({
	declarations: [
		AppComponent,
		ListLoggedInUserComponent
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
		MyDatePickerModule,
		LoadingBarModule.forRoot(),
		SharedModule
	],
	providers: [SocketService, RestService, SystemModuleService, HeaderEventEmitterService, PremiumTypeService,
		UserTypeService, AuthService, UploadService, FacilityService, GenderService, UserService, PersonService],
	bootstrap: [AppComponent]
})

export class AppModule {
	constructor() { }
}
