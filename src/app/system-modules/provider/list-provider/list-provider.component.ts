import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/filter';

import { LoadingBarService } from '@ngx-loading-bar/core';
import {
  SystemModuleService, UserTypeService, FacilityService
} from './../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

import 'rxjs/add/operator/filter';

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
  loading: boolean = true;
  selectedUserType: any = <any>{};

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private loadingService: LoadingBarService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService
  ) { }

  ngOnInit() {
    this._getUserTypes();
  }

  private _getProviders() {
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((res: any) => {
      this.loading = false;
      console.log(res);
      if (res.data.length > 0) {
        this.providers = res.data;
      }
    }).catch(err => console.log(err));
  }

  private _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then((payload: any) => {
      this._systemService.off();
      console.log(payload);
      if (payload.data.length > 0) {
        const index = payload.data.findIndex(x => x.name === 'Provider');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
          console.log(this.selectedUserType);
          this._getProviders();
        } else {
          this.selectedUserType = undefined;
        }
      }
    }, error => {
      this._systemService.off();
    });
  }

  navigateNewProvider() {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/provider/new']).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }

  navigateToDetails(id: string) {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/provider/providers/' + id]).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }

}
