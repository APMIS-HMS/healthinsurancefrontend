import { FormControl } from '@angular/forms';
import { UploadService } from './../../../services/common/upload.service';
import { Observable } from 'rxjs/Observable';
import { PolicyService } from './../../../services/policy/policy.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { FacilityService, SystemModuleService, BeneficiaryService } from './../../../services/index';
import { Facility, Employer, Address, BankDetail, Contact } from './../../../models/index';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-new-checkin',
  templateUrl: './new-checkin.component.html',
  styleUrls: ['./new-checkin.component.scss']
})
export class NewCheckinComponent implements OnInit {

  listsearchControl = new FormControl();
  beneficiaries: any[] = [];

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private loadingService: LoadingBarService,
    private _beneficiaryService: BeneficiaryService,
    private _policyService: PolicyService,
    private _uploadService: UploadService
  ) { }

  ngOnInit() {
    this.listsearchControl.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(value => {
        this._systemService.on();
        console.log(value)
        this._searchBeneficiary(value);
      }, error => {
        this._systemService.off();
        console.log(error)
      })
  }

  _searchBeneficiary(value) {
    this._beneficiaryService.find({
      query: {
        $or: [
          // { platformOwnerNumber: { $regex: value, '$options': 'i' } },
          { 'personId.lastName': { $regex: value, '$options': 'i' } },
          { 'personId.firstName': { $regex: value, '$options': 'i' } },
        ]
      }
    }).then((payload: any) => {
      console.log(payload)
      this.beneficiaries = payload.data;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }
}
