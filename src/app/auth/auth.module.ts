import { AuthService } from './services/auth.service';
import { PersonService } from '../services/index';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AuthComponent } from './auth.component';
import { authModulesRoutes } from './auth.route';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';


@NgModule({
    declarations: [
        AuthComponent,
        LoginComponent,
        SignupComponent
    ],
    exports: [],
    imports: [NgbModule, ReactiveFormsModule, authModulesRoutes],
    providers: [AuthService, PersonService]
})

export class AuthModule {

}