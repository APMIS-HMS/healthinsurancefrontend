import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { UserTypeService } from './../../services/common/user-type.service';
import { AuthService } from './../services/auth.service';
import { PersonService } from '../../services/person/person.service';
import { Person } from '../../models/index';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
	signupFormGroup: FormGroup;
	signupBtnText: String = 'SIGN UP &nbsp; <i class="fa fa-sign-in"></i>';
	constructor(
		private _toastr: ToastsManager,
		private _fb: FormBuilder,
		private _router: Router,
		private _authService: AuthService,
		private _personService: PersonService,
		private _locker: CoolLocalStorage
	) { }

	ngOnInit() {
		this.signupFormGroup = this._fb.group({
			firstName: ['', [<any>Validators.required]],
			lastName: ['', [<any>Validators.required]],
			phoneNumber: ['', [<any>Validators.required]],
			email: ['', [<any>Validators.required]],
			mothersMaidenName: ['', [<any>Validators.required]],
			password: ['', [<any>Validators.required]]
		});
	}

	onClickRegister(value: any, valid: boolean) {
		if (valid) {
			this.signupBtnText = 'Please wait... &nbsp; <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';
			const person = <Person> {
				firstName: value.firstName,
				lastName: value.lastName,
				email: value.email,
				phoneNumber: value.phoneNumber,
				mothersMaidenName: value.mothersMaidenName
			};

			const user = {
				email: value.email,
				password: value.password
			};

			this.createPerson(person).then(res => {
				console.log(res);
				return this.createUser(user);
			}).then(res => {
				console.log(res);
				return this.logUser(user);
			}).then(res => {
				console.log(res);
				this._locker.setObject('auth', res);
				this._router.navigate(['/modules/beneficiary/new']).then(navRes => {
					this._authService.announceMission({ status: 'On' });
				});
				setTimeout(e => {
					this._toastr.success('You have successfully logged in!', 'Success!');
				}, 1000);
			}).catch(err => console.log(err));
			// this.createPerson(person).then(this.createUser(user).then(this.logUser(user).then(res => {
			// 	// this._locker.setObject('auth', loginRes);
			// 	// console.log(res);
			// 	// this._router.navigate(['/modules/beneficiary/new']).then(navRes => {
			// 	// 	this._authService.announceMission({ status: 'On' });
			// 	// });
			// 	// setTimeout(e => {
			// 	// 	this._toastr.success('You have successfully logged in!', 'Success!');
			// 	// }, 1000);
			// })));

			// this._personService.create(person).then(payload => {
			// 	this._locker.setObject('auth', payload);
			// 	console.log(payload);
			// 	const user = {
			// 		email: value.email,
			// 		password: value.password
			// 	};

			// 	this._authService.create(user).then(res => {
			// 		console.log(res);
			// 		this._authService.login(user).then(loginRes => {
			// 			this._locker.setObject('auth', loginRes);
			// 			console.log(loginRes);
			// 			this._router.navigate(['/modules/beneficiary/new']).then(navRes => {
			// 				this._authService.announceMission({ status: 'On' });
			// 			});
			// 			setTimeout(e => {
			// 				this._toastr.success('You have successfully logged in!', 'Success!');
			// 			}, 1000);
			// 		}).catch(err => console.log(err));
			// 	}).catch(err => console.log(err));

			// }).catch(err => {
			// 	console.log(err);
			// 	this.signupFormGroup.controls['password'].reset();
			// 	this.signupBtnText = 'LOG IN &nbsp; <i class="fa fa-sign-in"></i>';
			// });
		}
	}

	private createPerson(person: any): Promise<any> {
		return new Promise<any>(
			(resolve, reject) => {
				this._personService.create(person).then(res => {
					resolve(res);
				}).catch(err => {
					reject(err);
				});
			}
		);
	}

	private createUser(user: any): Promise < any > {
		return new Promise<any>(
			(resolve, reject) => {
				this._authService.create(user).then(res => {
					resolve(res);
				}).catch(err => {
					reject(err);
				});
			}
		);
	}

	private logUser(user: any): Promise < any > {
		return new Promise<any>(
			(resolve, reject) => {
				this._authService.login(user).then(res => {
					resolve(res);
				}).catch(err => {
					reject(err);
				});
			}
		);
	}
}
