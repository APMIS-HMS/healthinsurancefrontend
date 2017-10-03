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
	showLoginTab: Boolean = false;
	showRegTab: Boolean = false;
	loginFormGroup: FormGroup;
	loginBtnText: String = 'LOG IN &nbsp; <i class="fa fa-sign-in"></i>';

	constructor(
		private _toastr: ToastsManager,
		private _fb: FormBuilder,
		private _router: Router,
	) {
	}

	ngOnInit() {
		this.loginFormGroup = this._fb.group({
			email: ['', [<any>Validators.required]],
			password: ['', [<any>Validators.required]]
		});
	}

	onClickLogin(value: any, valid: boolean) {
		
	}

	onClickTab(tab) {
		if (tab === 'login') {
			this.showLoginTab = !this.showLoginTab;
		} else {
			this.showRegTab = !this.showRegTab;
		}
	}

}
