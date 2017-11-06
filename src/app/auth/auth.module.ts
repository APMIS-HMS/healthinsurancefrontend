import { PolicyService } from './../services/policy/policy.service';
import { BeneficiaryService } from './../services/beneficiary/beneficiary.service';
import { RoleService } from './../services/auth/role/role.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { authModulesRoutes } from './auth.route';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthService } from './services/auth.service';
import { PersonService } from '../services/person/person.service';
import { LoadingBarModule } from '@ngx-loading-bar/core';

@NgModule({
    declarations: [
        AuthComponent,
        LoginComponent,
        SignupComponent
    ],
    exports: [],
    imports: [ReactiveFormsModule, authModulesRoutes, LoadingBarModule.forRoot(), CommonModule],
    providers: [AuthService, PersonService, RoleService, BeneficiaryService, PolicyService]
})

export class AuthModule {

}