import { LoadingBarService } from '@ngx-loading-bar/core';
import { SystemModuleService } from './../../services/common/system-module.service';
import { UserService } from './../../services/common/user.service';
import { GenderService } from './../../services/common/gender.service';
import { FacilityService } from './../../services/common/facility.service';
import { Facility } from './../../models/organisation/facility';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { UserTypeService } from './../../services/common/user-type.service';
import { AuthService } from './../services/auth.service';
import { PersonService } from '../../services/person/person.service';
import { Person } from '../../models/index';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';
import { CurrentPlaformShortName } from '../../services/globals/config'

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;
@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
	signupFormGroup: FormGroup;
	signupBtnText: String = 'SIGN UP &nbsp; <i class="fa fa-sign-in"></i>';
	currentPlatform: any;
	constructor(
		private _toastr: ToastsManager,
		private _fb: FormBuilder,
		private _router: Router,
		private _authService: AuthService,
		private _personService: PersonService,
		private _locker: CoolLocalStorage,
		private _facilityService: FacilityService,
		private _systemService: SystemModuleService,
		private _genderService: GenderService,
		private loadingService: LoadingBarService,
		private _userService: UserService) { }

	ngOnInit() {
		this._systemService.notificationAnnounced$.subscribe((value: any) => {
			if (value.status === 'On') {
				this.loadingService.startLoading();
			} else {
				this.loadingService.endLoading();
			}
		});
		this.signupFormGroup = this._fb.group({
			firstName: ['', [<any>Validators.required]],
			lastName: ['', [<any>Validators.required]],
			phoneNumber: ['', [<any>Validators.pattern(PHONE_REGEX)]],
			email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
			mothersMaidenName: ['', [<any>Validators.required]],
			password: ['', [<any>Validators.required]]
		});
		this._getCurrentPlatform();

		this.signupFormGroup.controls['email'].valueChanges
			.debounceTime(200)
			.distinctUntilChanged()
			.subscribe(value => {
				this._checkEmail(value);
			});

		this.signupFormGroup.controls['phoneNumber'].valueChanges
			.debounceTime(200)
			.distinctUntilChanged()
			.subscribe(value => {
				this._checkPhoneNumber(value);
			});
	}

	_checkEmail(value) {
		this._systemService.on();
		let person$ = Observable.fromPromise(this._personService.findWithOutAuth({ query: { email: value } }));
		let user$ = Observable.fromPromise(this._userService.findWithOutAuth({ query: { email: value } }));

		Observable.forkJoin([person$, user$]).subscribe((results: any) => {
			this._systemService.off();
			if (results[0].data.length > 0 || results[1].data.length > 0) {
				this.signupFormGroup.controls['email'].setErrors({ 'duplicate': true });
				console.log(this.signupFormGroup.controls['email'].errors);
			}
			console.log(results);
		}, error => {
			console.log(error)
			this._systemService.off();
		});
	}

	_checkPhoneNumber(value) {
		this._systemService.on();
		let person$ = Observable.fromPromise(this._personService.findWithOutAuth({ query: { phoneNumber: value } }));
		let user$ = Observable.fromPromise(this._userService.findWithOutAuth({ query: { phoneNumber: value } }));

		Observable.forkJoin([person$, user$]).subscribe((results: any) => {
			this._systemService.off();
			if (results[0].data.length > 0 || results[1].data.length > 0) {
				this.signupFormGroup.controls['phoneNumber'].setErrors({ 'duplicate': true });
				console.log(this.signupFormGroup.controls['phoneNumber'].errors);
			}
			console.log(results);
		}, error => {
			console.log(error)
			this._systemService.off();
		});
	}
	_getGender() {
		this._genderService.find({}).then(payload => {

		}).catch(err => {

		})
	}

	_getCurrentPlatform() {
		this._facilityService.findWithOutAuth({ query: { shortName: '' } }).then(res => {
			console.log(res);
			if (res.data.length > 0) {
				this.currentPlatform = res.data[0];
			}
		}).catch(err => {
			console.log(err);
		});
	}
	onClickRegister(value: any, valid: boolean) {
		if (valid) {
			this.signupBtnText = 'Please wait... &nbsp; <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';
			const person = <Person>{
				firstName: value.firstName,
				lastName: value.lastName,
				email: value.email,
				phoneNumber: value.phoneNumber,
				mothersMaidenName: value.mothersMaidenName,
				// platformOnwerId: this.currentPlatform._id
			};

			const user = {
				email: value.email,
				password: value.password
			};
			// console.log(person);
			// this._personService.find({query: {
			// 	email: person.email,
			// 	mothersMaidenName: person.mothersMaidenName,
			// 	phoneNumber: person.phoneNumber,
			// 	lastName: person.lastName,
			// 	firstName: person.firstName
			// }}).then(findRes => {
			// 	console.log(findRes);
			// }).catch(err => {
			// 	console.log(err);
			// });
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
		}
	}

	private createPerson(person: any): Promise<any> {
		return new Promise<any>(
			(resolve, reject) => {
				this._personService.createWithOutAuth(person).then(res => {
					resolve(res);
				}).catch(err => {
					reject(err);
				});
			}
		);
	}

	private createUser(user: any): Promise<any> {
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

	private logUser(user: any): Promise<any> {
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
