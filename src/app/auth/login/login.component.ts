import { CoolLocalStorage } from 'angular2-cool-storage';
import { UserTypeService } from './../../services/api-services/setup/user-type.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	showLoginTab: boolean = false;
	showRegTab: boolean = false;
	loginFormGroup: FormGroup;
	loginBtnText: string = "LOG IN &nbsp; <i class='fa fa-sign-in'></i>";

	constructor(
		private toastr: ToastsManager,
		private _fb: FormBuilder,
		private _router: Router,
		private _authService: AuthService,
		private _userTypeService: UserTypeService,
		private _locker: CoolLocalStorage
	) {
	}

	ngOnInit() {
		this.loginFormGroup = this._fb.group({
			email: ['', [<any>Validators.required]],
			password: ['', [<any>Validators.required]]
		});
		this._authService.checkAuth();
		// this.getUserTypes();
	}
	getUserTypes() {
		this._userTypeService.findAll().then(payload => {
			console.log(payload);
		})
	}

	onClickLogin(value: any, valid: boolean) {
		// this.getUserTypes();

		if (valid) {
			this.loginBtnText = "Please wait... &nbsp; <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>";

			this._authService.login(value).then(payload => {
				this._locker.setObject('auth', payload);
				console.log(payload);
				// this.getUserTypes();
				this.toastr.success('You have successfully logged in!', 'Success!');
				this._router.navigate(['/modules/beneficiary/beneficiaries']);

			})
		}


		// if (valid) {
		// 	this.loginBtnText = "Please wait... &nbsp; <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>";

		// 	setTimeout(() => {
		// 		this.toastr.success('You have successfully logged in!', 'Success!');
		// 		this._router.navigate(['/modules/beneficiary/beneficiaries']);
		// 	}, 2000);
		// }
	}

	onClickTab(tab) {
		if (tab === "login") {
			this.showLoginTab = !this.showLoginTab;
		} else {
			this.showRegTab = !this.showRegTab;
		}
	}

}
