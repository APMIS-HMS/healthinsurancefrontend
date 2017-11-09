import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DURATIONS } from '../../../../services/globals/config';
import { UploadService, SystemModuleService, FacilityService } from '../../../../services/index';
import { Facility } from '../../../../models/organisation/facility';
import { HeaderEventEmitterService } from '../../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  approvalFormGroup: FormGroup;
  selectedFacility: Facility = <Facility>{};

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('HIA Details');
    this._headerEventEmitter.setMinorRouteUrl('Hia Details');
    this._route.params.subscribe(param => {
      if (!!param.id) {
        this._getHIADetails(param.id);
      }
    });

    this.approvalFormGroup = this._fb.group({
      duration: [1, [<any>Validators.required]],
      unit: ['', [<any>Validators.required]]
    });
  }

  _getHIADetails(id) {
    this._systemService.on();
    this._facilityService.get(id, {}).then((res: any) => {
      console.log(res);
      this.selectedFacility = res;
      this._headerEventEmitter.setMinorRouteUrl(this.selectedFacility.name);
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  navigateEditHIA(hia) {
    this._systemService.on();
    this._router.navigate(['/modules/hia/new', hia._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    });
  }

}
