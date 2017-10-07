import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import 'rxjs/add/operator/filter';

import { LoadingBarService } from '@ngx-loading-bar/core';
import {
  SystemModuleService, UserTypeService, FacilityService
} from './../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-new-hia',
  templateUrl: './new-hia.component.html',
  styleUrls: ['./new-hia.component.scss']
})
export class NewHiaComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  hias: any = <any>[];
  loading: Boolean = true;
  employerFormGroup: FormGroup;
  states:any[]= [];
  lgs:any[] = [];
  cities:any[] = [];
  contactPositions:any[] = [];
  banks:any[] = [];
  industries:any[] = [];
  saveBtn ='';

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private loadingService: LoadingBarService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Health Insurance Agent List');
    this._headerEventEmitter.setMinorRouteUrl('All HIA');

    this._getHIAs();
  }

  private _getHIAs() {
    this._facilityService.find({}).then((res: any) => {
      this.loading = false;
      console.log(res);
      if (res.data > 0) {
        this.hias = res.data;
      }
    }).catch(err => console.log(err));
  }

  navigateNewHIA() {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/hia/new']).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }
  onClickSaveEmployer(value, valid) {

  }
  compareState(s1: any, s2: any) {
    return s1._id === s2._id;
  }
}
