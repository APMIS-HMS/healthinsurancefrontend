
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SystemModuleService } from './../../../services/common/system-module.service';

import {
  PersonService, OwnershipService
} from '../../../services/api-services/index';
import { Facility, Person } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { UserTypeService } from '../../../services/common/user-type.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  userFormGroup: FormGroup;
  disableSaveBtn: boolean = false;
  showOwnerDropdown: boolean = false;
  selectedDropdown: String = '';

  owners: any = <any>[];
  user: any = <any>{};
  saveBtn: String = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';

  constructor(
    private _locker: CoolLocalStorage,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _fb: FormBuilder,
    private _personService: PersonService,
    private _ownershipService: OwnershipService,
    private _systemService: SystemModuleService,
    private _userTypeService:UserTypeService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New User');
    this._headerEventEmitter.setMinorRouteUrl('');
    this.user = this._locker.getObject('auth');
    console.log(this.user.user);

    this._getFacilities();

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

    this.userFormGroup.controls['userType'].setValue('own');
    this.userFormGroup.controls['gender'].setValue('male');

    this.userFormGroup.controls['userType'].valueChanges.subscribe(val => {
      console.log(val);
      if (val === 'own') {
        this.showOwnerDropdown = false;
      } else if (val === 'others') {
        this.showOwnerDropdown = true;
      }
    });

    this.userFormGroup.controls['platformOwner'].valueChanges.subscribe(val => {
      console.log(val);
      if (val === 'own') {
        this.showOwnerDropdown = false;
      } else if (val === 'others') {
        this.showOwnerDropdown = true;
      }
    });
  }


    onClickSaveNewUser(valid: boolean, value: any) {
      if (valid) {
        this.disableSaveBtn = true;
        this.saveBtn = 'Saving... <i class="fa fa-spinner fa-spin"></i>';
        const person = {
          lastName: value.lastName,
          firstName: value.firstName,
          otherNames: value.otherName,
          gender: value.gender,
          email: value.email,
          phoneNumber: value.phoneNumber,
          mothersMaidenName: value.mothersMaidenName,
          dateOfBirth: value.dob
        };

        this._personService.create(person).then((res: any) => {
          console.log(res);
          this.disableSaveBtn = false;
          this.saveBtn = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';
          this.userFormGroup.reset();
          this._toastr.success('User has been created successfully!', 'Success!');
        }).catch(err => {
          console.log(err);
        });
      }
    }

    private _getFacilities() {
      this._systemService.on();
      this._userTypeService.findAll().then((res: any) => {
        console.log(res);
        this._systemService.off();
        if (res.data.length > 0) {
          this.owners = res.data;
        }
      }).catch(err => {
        this._systemService.off();
      });
    }
}
