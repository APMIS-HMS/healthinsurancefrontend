import { Router } from '@angular/router';
import { UserService } from './../../../services/common/user.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { GenderService } from './../../../services/common/gender.service';

import { PlanTypeService } from './../../../services/common/plan-type.service';
import { UserTypeService } from './../../../services/common/user-type.service';
import { UploadService } from './../../../services/common/upload.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { AuthService } from './../../../auth/services/auth.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FacilityService } from '../../../services/common/facility.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
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
  selectedUserType: any = <any>{};
  auth: any;
  showHIA = false;
  showProvider = false;
  showEmployer = false;
  showPlatformOwner = false;

  saveBtn: String = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';

  constructor(
    private _toastr: ToastsManager,
    private _fb: FormBuilder,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private loadingService: LoadingBarService,
    private _userTypeService: UserTypeService,
    private _genderService: GenderService,
    private _locker: CoolLocalStorage,
    private _facilityService: FacilityService,
    private _userService: UserService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New User');
    this._headerEventEmitter.setMinorRouteUrl('Create new user');
    this.userFormGroup = this._fb.group({
      userType: ['', [<any>Validators.required]],
      platformOwnerId: [''],
      facilityId: [''],
      lastName: ['', [<any>Validators.required]],
      firstName: ['', [<any>Validators.required]],
      otherName: [''],
      email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      phoneNumber: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
    });

    this.auth = this._locker.getObject('auth');
    this._getGenders();
    this._getUserTypes();

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
        })
      }
    });

  }

  _getGenders() {
    this._systemService.on();
    this._genderService.find({}).then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.genders = payload.data;
      }
    })
  }

  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        payload.data.forEach((item, i) => {
          if (item.name === 'Platform Owner') {
            if (this.auth.user.userType === undefined) {
              this.userTypes.push(item);
            }
          } else {
            this.userTypes.push(item);
          }
        });
      }
    })
  }

  _falseAllTypes() {
    this.showEmployer = false;
    this.showHIA = false;
    this.showPlatformOwner = false;
    this.showProvider = false;
  }

  _resolveShowType() {
    this._falseAllTypes();
    if (this.selectedUserType.name === 'Health Insurance Agent') {
      this.showHIA = true;
    } else if (this.selectedUserType.name === 'Platform Owner') {
      this.showPlatformOwner = true;
    } else if (this.selectedUserType.name === 'Provider') {
      this.showProvider = true;
    } else if (this.selectedUserType.name === 'Employer') {
      this.showEmployer = true;
    }
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
    if (valid) {
      this._systemService.on();
      if (this.auth.user.userType === undefined) {
        value.platformOwnerId = value.facilityId;
      } else {
        value.platformOwnerId = this.auth.user.platformOwnerId;
      }

      this._userService.create(value).then(payload => {
        console.log(payload);
        this._systemService.off();
        this._toastr.success('You have successfully created a user!', 'Success!');
        this.userFormGroup.reset();
        this._router.navigate(['/modules/user/users']).then(res => {
       
        }).catch(exp => {
          this._systemService.off();
        });
      }).catch(err => {
        console.log(err);
        this._toastr.error('Invalid email or password!', 'Error!');
        this._systemService.off();
      });

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
