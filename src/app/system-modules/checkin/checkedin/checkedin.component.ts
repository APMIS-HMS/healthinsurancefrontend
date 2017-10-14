import { Router } from '@angular/router';
import { CheckIn } from './../../../models/check-in/check-in';
import { UploadService } from './../../../services/common/upload.service';
import { CheckInService } from './../../../services/common/check-in.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import differenceInYears from 'date-fns/difference_in_years';

@Component({
  selector: 'app-checkedin',
  templateUrl: './checkedin.component.html',
  styleUrls: ['./checkedin.component.scss']
})
export class CheckedinComponent implements OnInit {

  listsearchControl = new FormControl();
  filterTypeControl = new FormControl();
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl();

  checkedIns: CheckIn[] = [];
  user: any;

  constructor(
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _checkInService: CheckInService,
    private _uploadService: UploadService,
    private _locker: CoolLocalStorage,
    private _router:Router
  ) { }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getCheckedIn();
  }

  _getCheckedIn() {
    this._systemService.on();
    this._checkInService.find({
      query: {
        'providerFacilityId._id': this.user.facilityId._id,
        $client: {
          checkedInToday: true
        }
      }
    }).then((payload: any) => {
      this.checkedIns = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  routeBeneficiary(check){
    this._systemService.on();
    this._router.navigate(['/modules/beneficiary/beneficiaries',check.beneficiaryId]).then(payload =>{
      this._systemService.off();
    }).catch(err =>{
      this._systemService.off();
    })
  }

}
