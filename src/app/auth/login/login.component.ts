import { CoolLocalStorage } from 'angular2-cool-storage';
import { UserTypeService } from './../../services/common/user-type.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	showLoginTab: Boolean = false;
	showRegTab: Boolean = false;
	loginFormGroup: FormGroup;
	loginBtnText: String = 'LOG IN &nbsp; <i class="fa fa-sign-in"></i>';

	constructor(
		private _toastr: ToastsManager,
		private _fb: FormBuilder,
		private _router: Router,
		private _authService: AuthService,
		private _userTypeService: UserTypeService,
		private _locker: CoolLocalStorage
	) {
	}

	ngOnInit() {
		this.loginFormGroup = this._fb.group({
			email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
			password: ['', [<any>Validators.required]]
		});

		this._authService.checkAuth();
		// this.getUserTypes();
	}

	getUserTypes() {
		this._userTypeService.find({}).then(payload => {
			console.log(payload);
		});
	}

	onClickLogin(value: any, valid: boolean) {
		if (valid) {
			this.loginBtnText = 'Please wait... &nbsp; <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';

			this._authService.login(value).then(payload => {
				this._locker.setObject('auth', payload);
				console.log(payload);

				this._router.navigate(['/modules/beneficiary/beneficiaries']).then(res => {
					this._authService.announceMission({ status: 'On' });
				});
				setTimeout(e => {
					this._toastr.success('You have successfully logged in!', 'Success!');
				}, 1000);
			}).catch(err => {
				console.log(err);
				this._toastr.error('Invalid email or password!', 'Error!');
				this.loginFormGroup.controls['password'].reset();
				this.loginBtnText = 'LOG IN &nbsp; <i class="fa fa-sign-in"></i>';
			});
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
		if (tab === 'login') {
			this.showLoginTab = !this.showLoginTab;
		} else {
			this.showRegTab = !this.showRegTab;
		}
	}

}
