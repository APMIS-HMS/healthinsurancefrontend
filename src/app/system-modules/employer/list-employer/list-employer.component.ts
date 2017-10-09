import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/filter';

import { LoadingBarService } from '@ngx-loading-bar/core';
import {
  SystemModuleService, UserTypeService, FacilityService
} from './../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-employer',
  templateUrl: './list-employer.component.html',
  styleUrls: ['./list-employer.component.scss']
})
export class ListEmployerComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  employers: any = <any>[];
  loading: Boolean = true;
  planTypes:any[] = [];
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
    this._headerEventEmitter.setRouteUrl('Employer List');
    this._headerEventEmitter.setMinorRouteUrl('All employers');

    this._getUserTypes();
  }

  onClickEdit(employer) {
    console.log(employer);
  }

  private _getEmployers() {
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((res: any) => {
      this.loading = false;
      console.log(res);
      if (res.data.length > 0) {
        this.employers = res.data;
      }
    }).catch(err => console.log(err));
  }

  private _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then((payload: any) => {
      this._systemService.off();
      console.log(payload);
      if (payload.data.length > 0) {
        const index = payload.data.findIndex(x => x.name === 'Employer');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
          console.log(this.selectedUserType);
          this._getEmployers();
        } else {
          this.selectedUserType = undefined;
        }
      }
    }, error => {
      this._systemService.off();
    });
  }

  navigateToDetails(id: string) {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/employer/employers/' + id]).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }

  navigateNewEmployer() {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/employer/new']).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }
}
