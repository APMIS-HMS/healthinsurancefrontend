import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/filter';

import { LoadingBarService } from '@ngx-loading-bar/core';
import {
  SystemModuleService, UserTypeService, BeneficiaryService, PlanTypeService, UploadService, FacilityService
} from './../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-beneficiary',
  templateUrl: './list-beneficiary.component.html',
  styleUrls: ['./list-beneficiary.component.scss']
})
export class ListBeneficiaryComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  beneficiaries: any = <any>[];
  loading: Boolean = true;

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    // private _authService: AuthService,
    private loadingService: LoadingBarService,
    private _systemService: SystemModuleService,
    // private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _beneficiaryService: BeneficiaryService
  ) {
    this._router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(e => {
      });
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Beneficiary List');
    this._headerEventEmitter.setMinorRouteUrl('All Beneficiaries');

    this._userTypeService.find({}).then(payload => {
      console.log(payload);
    });

    this._getBeneficiaries();
  }

  private _getBeneficiaries() {
    this._beneficiaryService.find({}).then((res: any) => {
      this.loading = false;
      console.log(res);
      if (res.data > 0) {
        this.beneficiaries = res.data;
      }
    }).catch(err => console.log(err));
  }

  navigateNewPlatform() {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/beneficiary/new']).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }


}
