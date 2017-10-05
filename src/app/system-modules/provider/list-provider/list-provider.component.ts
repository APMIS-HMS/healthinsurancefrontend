import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/filter';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { PlanTypeService } from './../../../services/common/plan-type.service';
import { UploadService } from './../../../services/common/upload.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { AuthService } from './../../../auth/services/auth.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { FacilityService } from './../../../services/common/facility.service';
import { UserTypeService } from '../../../services/common/user-type.service';

@Component({
  selector: 'app-list-provider',
  templateUrl: './list-provider.component.html',
  styleUrls: ['./list-provider.component.scss']
})
export class ListProviderComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  providers: any = <any>[];
  loading: boolean = false;
  selectedUserType: any;

  constructor(
    private _router: Router,
    private loadingService: LoadingBarService,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _systemService: SystemModuleService
  ) { }

  ngOnInit() {
  }

  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.findAll().then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        const index = payload.data.findIndex(x => x.name === 'Provider');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
          this._getAllProviders();
        } else {
          this.selectedUserType = undefined;
        }
      }
    }, error => {
      this._systemService.off();
    })
  }
  _getAllProviders() {
    this._systemService.on();
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id } }).then((res: any) => {
      this._systemService.off();
      if (res.data.length !== 0) {
        this.loading = false;
        this.providers = res.data;
      } else {
        this.loading = false;
        this.providers = [];
      }
    }).catch(err => {
      this._systemService.off();
    })
  }

  navigateNewPlatform() {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/provider/new']).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }

}
