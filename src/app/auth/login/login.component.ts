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
	loginBtnText: boolean = true;
	loginBtnProcessing: boolean = false;
	disableBtn: boolean = false;

	constructor(
		private _toastr: ToastsManager,
		private _fb: FormBuilder,
		private _router: Router,
		private _authService: AuthService,
		private _locker: CoolLocalStorage
	) {
	}

	ngOnInit() {
		this.loginFormGroup = this._fb.group({
			email: ['', [<any>Validators.pattern(EMAIL_REGEX), <any>Validators.required]],
			password: ['', [<any>Validators.required]]
		});

		this._authService.logOut();
	}

	setLoggedInUser(email: String, loggInState: boolean) {
		this._authService.find({ query: { email: email } }).then(payload => {
			let currentUser = payload.data[0];
			currentUser.loggedInUserStatus = {
				'isLoggedIn': loggInState
			};
			this._authService.patch(currentUser._id, currentUser, {});
		});
	}

	onClickLogin(value: any, valid: boolean) {
		if (valid) {
			this.loginBtnText = false;
			this.loginBtnProcessing = true;
			this.disableBtn = true;


			this._authService.login(value).then(payload => {
				this._locker.setObject('auth', payload);
				if (payload.user !== undefined && payload.user.roles !== undefined) {
					this.setLoggedInUser(this.loginFormGroup.controls['email'].value, true);
					this.loginBtnText = true;
					this.loginBtnProcessing = false;
					this.disableBtn = false;
					this._router.navigate(['/modules/welcome']).then(res => {
						this._authService.announceMission({ status: 'On' });
						this._toastr.success('You have successfully logged in!', 'Success!');
					});
				}else{
					this.loginBtnText = true;
					this.loginBtnProcessing = false;
					this.disableBtn = false;
					this._authService.logOut();
				}
			}).catch(err => {
				this._toastr.error('Invalid email or password!', 'Error!');
				this.loginFormGroup.controls['password'].reset();
				this.loginBtnText = true;
				this.loginBtnProcessing = false;
				this.disableBtn = false;
			});
		} else {
			this._toastr.error('Please fill in the required fields!', 'Form Validation Error!');
		}
	}

	onClickTab(tab) {
		if (tab === 'login') {
			this.showLoginTab = !this.showLoginTab;
		} else {
			this.showRegTab = !this.showRegTab;
		}
	}

}
