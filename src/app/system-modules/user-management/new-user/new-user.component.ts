import { Profession } from './../../../models/setup/profession';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';

import {
  UserService, GenderService, PlanTypeService, UserTypeService, UploadService, SystemModuleService,
  FacilityService, ProfessionService
} from './../../../services/index';
import { AuthService } from './../../../auth/services/auth.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

import { IMyDpOptions, IMyDate } from 'mydatepicker';
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;
@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  selectedUser: any;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  }

  userFormGroup: FormGroup;
  disableSaveBtn: boolean = false;
  showOwnerDropdown: boolean = false;
  selectedDropdown: String = '';
  owners: any = <any>[];
  genders: any[] = [];
  userTypes: any[] = [];
  facilities: any[] = [];
  professions: any[] = [];
  caders: any[] = [];
  selectedUserType: any = <any>{};
  auth: any;
  user: any;
  showHIA = false;
  showProvider = false;
  showEmployer = false;
  showPlatformOwner = false;
  btnText = "SAVE"

  saveBtn: String = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';
  updateBtn: String = 'UPDATE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';

  constructor(
    private _toastr: ToastsManager,
    private _fb: FormBuilder,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private _userTypeService: UserTypeService,
    private _genderService: GenderService,
    private _locker: CoolLocalStorage,
    private _facilityService: FacilityService,
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _professionService: ProfessionService
  ) {
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getUser(param.id);
        this.btnText = "UPDATE";
      }
    })
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New User');
    this._headerEventEmitter.setMinorRouteUrl('Create new user');
    this._initializedUser();

    this.user = (<any>this._locker.getObject('auth')).user;
    // this._getGenders();
    this._getUserTypes();
    this._getProfessions();



  }
  _initializedUser() {
    this.userFormGroup = this._fb.group({
      userType: [this.selectedUser != null ? this.selectedUser.userType : '', [<any>Validators.required]],
      platformOwnerId: [this.selectedUser != null ? this.selectedUser.platformOwnerId : ''],
      facilityId: [this.selectedUser != null ? this.selectedUser.facilityId : ''],
      lastName: [this.selectedUser != null ? this.selectedUser.lastName : '', [<any>Validators.required]],
      firstName: [this.selectedUser != null ? this.selectedUser.firstName : '', [<any>Validators.required]],
      otherName: [this.selectedUser != null ? this.selectedUser.otherNames : ''],
      email: [this.selectedUser != null ? this.selectedUser.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      phoneNumber: [this.selectedUser != null ? this.selectedUser.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      profession: [this.selectedUser != null ? this._getProfession(this.selectedUser.profession) : ''],
      cader: [this.selectedUser != null ? this.selectedUser.cader : ''],
      readonly: [this.selectedUser != null ? true : false]
    });
    // this._resolveShowType();

    this.userFormGroup.controls['userType'].valueChanges.subscribe(value => {
      this._systemService.on();
      if (value !== null && value._id !== undefined) {
        this.selectedUserType = value;
        this._facilityService.find({
          query: {
            'facilityType._id': value._id, $limit: 200,
            $select: ['name', 'email', 'phoneNumber', 'facilityType', 'shortName']
          }
        }).then((payload: any) => {
          this.facilities = payload.data;
          console.log(this.facilities)
          this._resolveShowType();
          this._systemService.off();
        }).catch(err => {
          this._systemService.off();
        });
      }
    });

    this.userFormGroup.controls['profession'].valueChanges.subscribe(val => {
      if (!!val._id) {
        this.caders = val.caders;
      }
    });
  }
  _getUser(id) {
    this._userService.get(id, {}).then((payload: any) => {
      this.selectedUser = payload;

      this._facilityService.find({
        query: {
          'facilityType._id': payload.userType._id, $limit: 200,
          $select: ['name', 'email', 'phoneNumber', 'facilityType', 'shortName']
        }
      }).then((payload: any) => {
        this.facilities = payload.data;
        console.log(this.facilities)
        this._resolveShowType();
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });


      this._initializedUser();
    }).catch(err => {
      console.log(err)
    })
  }
  _getGenders() {
    this._systemService.on();
    this._genderService.find({}).then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.genders = payload.data;
      }
    });
  }
  private _getProfession(profession) {
    if (profession !== undefined) {
      let index = this.professions.findIndex(x => x._id === profession._id);
      console.log(this.professions)
      console.log(index)
      if (index > -1) {
        this.caders = this.professions[index].caders;
      }
      return this.professions[index];
    } else {
      return undefined;
    }

  }
  private _getProfessions() {
    this._systemService.on();
    this._professionService.find({}).then((res: any) => {
      this._systemService.off();
      if (res.data.length > 0) {
        this.professions = res.data;
        this._initializedUser();
      }
    }).catch(err => {
      console.log(err);
    });
  }

  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        payload.data.forEach((item, i) => {
          if (item.name === 'Platform Owner') {
            if (this.user.userType === undefined) {
              this.userTypes.push(item);
            }
          } else {
            this.userTypes.push(item);
          }
        });
      }
    });
  }

  _falseAllTypes() {
    this.showEmployer = false;
    this.showHIA = false;
    this.showPlatformOwner = false;
    this.showProvider = false;
  }

  _resolveShowType() {
    this._falseAllTypes();
    if (this.selectedUserType.name === 'Health Insurance Agent' || (this.selectedUser !== undefined && this.selectedUser.userType.name === 'Health Insurance Agent')) {
      this.showHIA = true;
    } else if (this.selectedUserType.name === 'Platform Owner' || (this.selectedUser !== undefined && this.selectedUser.userType.name === 'Platform Owner')) {
      this.showPlatformOwner = true;
    } else if (this.selectedUserType.name === 'Provider' || (this.selectedUser !== undefined && this.selectedUser.userType.name === 'Provider')) {
      this.showProvider = true;
    } else if (this.selectedUserType.name === 'Employer' || (this.selectedUser !== undefined && this.selectedUser.userType.name === 'Employer')) {
      this.showEmployer = true;
    }
  }

  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1._id === l2._id;
    }
    return false;
  }
  setDate(): void {
    // Set today date using the patchValue function
    let date = new Date();
    this.userFormGroup.patchValue({
      dob: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      }
    });
  }

  onClickSaveUser(valid, value: any) {
    try {
      if (valid) {
        this._systemService.on();
        if (this.user.userType === undefined) {
          value.platformOwnerId = value.facilityId;
        } else {
          value.platformOwnerId = this.user.platformOwnerId;
        }

        if (value.userType.name === 'Provider') {
          value.profession = {
            name: value.profession.name,
            _id: value.profession._id
          };
        } else {
          delete value.profession;
          delete value.cader;
        }
        value.completeRegistration = true;
        delete value.readonly;
        if (this.selectedUser !== undefined) {
          this.selectedUser.email = value.email;
          this.selectedUser.firstName = value.firstName;
          this.selectedUser.lastName = value.lastName;
          this.selectedUser.otherNames = value.otherName;
          this.selectedUser.phoneNumber = value.phoneNumber;
          this.selectedUser.profession = value.profession;
          this.selectedUser.cader = value.cader;
          if (this.selectedUser.userType.name !== 'Provider') {
            delete this.selectedUser.profession;
            delete this.selectedUser.cader;
          }
          this._userService.patch(this.selectedUser._id, this.selectedUser, {}).then(pay => {
            this._toastr.success('You have successfully updated a user!', "Update")
            this._router.navigate(['/modules/user/users']).then(res => {
              this._systemService.off();
            }).catch(exp => {
              this._systemService.off();
            });
          }).catch(err => {
            this._systemService.off()
          })

        } else {
          this._userService.create(value).then(payload => {
            this._systemService.off();
            this._toastr.success('You have successfully created a user!', 'Success!');
            this._router.navigate(['/modules/user/users']).then(res => {

            }).catch(exp => {
              this._systemService.off();
            });
          }).catch(err => {
            console.log(err);
            this._toastr.error('Email has already been taken. Please use another email address!', 'Duplicate Email!');
            this._systemService.off();
          });
        }

      } else {
        this._toastr.error('One or more required value is missing, supply the missing required value and try again!', "Validation");
        this._systemService.off();
      }
    } catch (error) {
      this._toastr.error('An error has occured while processing your request', "Error");
      this._systemService.off();
    }

  }

  clearDate(): void {
    // Clear the date using the patchValue function
    this.userFormGroup.patchValue({ dob: null });
  }

  navigate(url: string, id?: string) {
    if (!!id) {
      this._systemService.on()
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._systemService.on()
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }

}
