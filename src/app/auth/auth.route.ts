import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const AUTH_ROUTES: Routes = [
    {
        path: '', component: AuthComponent, children: [
            { path: '', redirectTo: "login", pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'sign-up', component: SignupComponent }
        ]
    }
];

export const authModulesRoutes = RouterModule.forChild(AUTH_ROUTES);