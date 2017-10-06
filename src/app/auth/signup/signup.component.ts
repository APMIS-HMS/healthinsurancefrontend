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
		private _genderService:GenderService
	) { }

	ngOnInit() {
		this.signupFormGroup = this._fb.group({
			firstName: ['', [<any>Validators.required]],
			lastName: ['', [<any>Validators.required]],
			phoneNumber: ['', [<any>Validators.pattern(PHONE_REGEX)]],
			email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
			mothersMaidenName: ['', [<any>Validators.required]],
			password: ['', [<any>Validators.required]]
		});
		this._getCurrentPlatform();
	}

	_getGender(){
		this._genderService.find({}).then(payload =>{

		}).catch(err =>{
			
		})
	}

	_getCurrentPlatform() {
		this._facilityService.findWithOutAuth({ query: { shortName: 'LASHMA' } }).then(res => {
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
