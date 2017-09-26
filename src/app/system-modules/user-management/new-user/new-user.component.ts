import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
  CountriesService, FacilityTypesService, FacilitiesService
} from '../../../services/api-services/index';
import { Facility } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  userFormGroup: FormGroup;
  saveBtn: String = '&nbsp;&nbsp; SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';
  constructor(
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _fb: FormBuilder,
    private _facilityService: FacilitiesService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New User');
    this._headerEventEmitter.setMinorRouteUrl('');

    this.userFormGroup = this._fb.group({
      role: ['', [<any>Validators.required]]
    });
  }

    // tslint:disable-next-line:indent
    onClickSaveNewUser(valid: Boolean, value: any) {
      console.log(value);
    }

}
