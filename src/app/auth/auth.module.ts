import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { authModulesRoutes } from './auth.route';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthService } from './services/auth.service';
import { PersonService } from '../services/person/person.service';


@NgModule({
    declarations: [
        AuthComponent,
        LoginComponent,
        SignupComponent
    ],
    exports: [],
    imports: [ReactiveFormsModule, authModulesRoutes],
    providers: [AuthService, PersonService]
})

export class AuthModule {

}