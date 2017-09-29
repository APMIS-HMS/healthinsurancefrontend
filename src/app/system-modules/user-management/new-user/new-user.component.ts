import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SystemModuleService } from './../../../services/common/system-module.service';

import {
  PersonService
} from '../../../services/api-services/index';
import { Facility, Person } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  userFormGroup: FormGroup;
  disableSaveBtn: Boolean = false;
  saveBtn: String = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';

  constructor(
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _fb: FormBuilder,
    private _personService: PersonService,
    private _systemService: SystemModuleService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New User');
    this._headerEventEmitter.setMinorRouteUrl('');

    this.userFormGroup = this._fb.group({
      gender: ['', [<any>Validators.required]],
      lastName: ['', [<any>Validators.required]],
      firstName: ['', [<any>Validators.required]],
      otherName: [''],
      email: ['', [<any>Validators.required]],
      phoneNumber: ['', [<any>Validators.required]],
      mothersMaidenName: ['', [<any>Validators.required]],
      dob: ['', [<any>Validators.required]],
    });
  }


    onClickSaveNewUser(valid: Boolean, value: any) {
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
}
