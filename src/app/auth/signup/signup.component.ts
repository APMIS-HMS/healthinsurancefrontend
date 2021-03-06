import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Observable} from 'rxjs/Observable';

import {environment} from '../../../environments/environment';
import {PasswordValidation} from '../../services/common/password-validation';

import {Facility, Person, User} from './../../models/index';
import {FacilityService, GenderService, PersonService, SystemModuleService, UserService, UserTypeService} from './../../services/index';
import {AuthService} from './../services/auth.service';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX =
    /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupFormGroup: FormGroup;
  currentPlatform: any;
  userType: any;
  signupBtnText: boolean = true;
  signupBtnProcessing: boolean = false;
  disableBtn: boolean = false;
  platformName: string;

  constructor(
      private _toastr: ToastsManager, private _fb: FormBuilder,
      private _router: Router, private _authService: AuthService,
      private _personService: PersonService, private _locker: CoolLocalStorage,
      private _facilityService: FacilityService,
      private _systemService: SystemModuleService,
      private _genderService: GenderService,
      private _userTypeService: UserTypeService,
      private _userService: UserService) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this.signupFormGroup = this._fb.group(
        {
          firstName: ['', [<any>Validators.required]],
          lastName: ['', [<any>Validators.required]],
          phoneNumber: [
            '',
            [<any>Validators.pattern(PHONE_REGEX), <any>Validators.required]
          ],
          email: [
            '',
            [<any>Validators.pattern(EMAIL_REGEX), <any>Validators.required]
          ],
          mothersMaidenName: ['', [<any>Validators.required]],
          password: ['', [<any>Validators.required]],
          cpassword: ['', [<any>Validators.required]]
        },
        {validator: PasswordValidation.MatchPassword});
    this._getCurrentPlatform();
    this._getUserType();

    this.signupFormGroup.controls['email']
        .valueChanges.debounceTime(200)
        .distinctUntilChanged()
        .subscribe(value => {
          this._checkEmail(value);
        });

    this.signupFormGroup.controls['phoneNumber']
        .valueChanges.debounceTime(200)
        .distinctUntilChanged()
        .subscribe(value => {
          this._checkPhoneNumber(value);
        });
  }

  _checkEmail(value) {
    this._systemService.on();
    let person$ = Observable.fromPromise(
        this._personService.findWithOutAuth({query: {email: value}}));
    // let user$ = Observable.fromPromise(this._userService.findWithOutAuth({
    // query: { email: value } }));

    Observable.forkJoin([person$]).subscribe(
        (results: any) => {
          this._systemService.off();
          if (results[0].data.length > 0) {
            this.signupFormGroup.controls['email'].setErrors({duplicate: true});
          }
        },
        error => {
          this._systemService.off();
        });
  }

  _checkPhoneNumber(value) {
    this._systemService.on();
    let person$ = Observable.fromPromise(
        this._personService.findWithOutAuth({query: {phoneNumber: value}}));
    // let user$ = Observable.fromPromise(this._userService.findWithOutAuth({
    // query: { phoneNumber: value } }));

    Observable.forkJoin([person$]).subscribe(
        (results: any) => {
          this._systemService.off();
          if (results[0].data.length > 0) {
            this.signupFormGroup.controls['phoneNumber'].setErrors(
                {duplicate: true});
          }
        },
        error => {
          this._systemService.off();
        });
  }

  onClickRegister(value: any, valid: boolean) {
    if (valid) {
      if (!!this.userType && !!this.currentPlatform) {
        this.signupBtnText = false;
        this.signupBtnProcessing = true;
        this.disableBtn = true;

        const person = <Person>{
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          phoneNumber: value.phoneNumber,
          mothersMaidenName: value.mothersMaidenName
        };

        const user = {
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          phoneNumber: value.phoneNumber,
          mothersMaidenName: value.mothersMaidenName,
          platformOwnerId: this.currentPlatform,
          userType: this.userType,
          password: value.password
        };

        this.createPerson(person)
            .then(res => {
              return this.createUser(user);
            })
            .then(res => {
              // return this.logUser(user);
              this.signupBtnText = true;
              this.signupBtnProcessing = false;
              this.disableBtn = false;

              // this._locker.setObject('auth', res);
              this._router.navigate(['/auth/login']).then(navRes => {
                this._authService.announceMission({status: 'On'});
                this._toastr.success(
                    'You have successfully signed up!', 'Success!');
              });
            })
            .catch(err => {
              this.signupBtnText = true;
              this.signupBtnProcessing = false;
              this.disableBtn = false;
            });
        // .then(res => {
        // 	// this.signupBtnText = true;
        // 	// this.signupBtnProcessing = false;
        // 	// this.disableBtn = false;

        // 	// this._locker.setObject('auth', res);
        // 	//
        // this._router.navigate(['/modules/beneficiary/new']).then(navRes => {
        // 	// 	this._authService.announceMission({ status: 'On' });
        // 	// 	this._toastr.success('You have successfully logged in!',
        // 'Success!');
        // 	// });
        // }).catch(err => {
        // 	console.log(err);
        // 	this.signupBtnText = true;
        // 	this.signupBtnProcessing = false;
        // 	this.disableBtn = false;
        // });
      } else {
        this._toastr.error(
            'There is a connection error, Please try again later!', 'Error!');
      }
    } else {
      this._toastr.error(
          'Please fill in the required fields!', 'Form Validation Error!');
    }
  }

  private _getCurrentPlatform() {
    this._facilityService
        .findWithOutAuth({query: {shortName: this.platformName}})
        .then(res => {
          if (res.data.length > 0) {
            this.currentPlatform = res.data[0];
          }
        })
        .catch(err => {});
  }

  private _getUserType() {
    this._systemService.on();
    this._userTypeService.findWithOutAuth().then(
        (res: any) => {
          this._systemService.off();
          if (res.data.length > 0) {
            const index = res.data.findIndex(x => x.name === 'Beneficiary');
            if (index > -1) {
              this.userType = res.data[index];
            }
          }
        },
        error => {
          this._systemService.off();
        });
  }

  private createPerson(person: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._personService.createWithOutAuth(person)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
    });
  }

  private createUser(user: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._authService.create(user)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
    });
  }

  private _getGender() {
    this._genderService.find({}).then(payload => {}).catch(err => {});
  }

  private logUser(user: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._authService.login(user)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
    });
  }
}
