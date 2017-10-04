import { GenderService } from './../../../services/api-services/setup/gender.service';
import { PlanTypeService } from './../../../services/common/plan-type.service';
import { UserTypeService } from './../../../services/common/user-type.service';
import { UploadService } from './../../../services/common/upload.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthService } from './../../../auth/services/auth.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };

  userFormGroup: FormGroup;
  disableSaveBtn: boolean = false;
  showOwnerDropdown: boolean = false;
  selectedDropdown: String = '';

  owners: any = <any>[];
  genders: any[] = [];
  user: any = <any>{};
  saveBtn: String = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';

  constructor(
    private _toastr: ToastsManager,
    private _fb: FormBuilder,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private loadingService: LoadingBarService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService, private _userTypeService: UserTypeService,
    private _planTypeService: PlanTypeService, private _genderService: GenderService
  ) { }

  ngOnInit() {

    this.userFormGroup = this._fb.group({
      userType: ['', [<any>Validators.required]],
      platformOwner: [''],
      gender: ['male', [<any>Validators.required]],
      lastName: ['', [<any>Validators.required]],
      firstName: ['', [<any>Validators.required]],
      otherName: [''],
      email: ['', [<any>Validators.required]],
      phoneNumber: ['', [<any>Validators.required]],
      mothersMaidenName: ['', [<any>Validators.required]],
      dob: ['', [<any>Validators.required]],
    });
  }

  _getUserTypes() {
    this._systemService.on();
    this._genderService.findAll().then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.genders = payload.data;
      }
    }, error => {
      this._systemService.off();
    });
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

  clearDate(): void {
    // Clear the date using the patchValue function
    this.userFormGroup.patchValue({ dob: null });
  }

}
