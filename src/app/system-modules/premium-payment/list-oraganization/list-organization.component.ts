
import { IMyDpOptions, IMyDate } from 'mydatepicker';


import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName } from './../../../services/globals/config';
import { SystemModuleService, UserTypeService, FacilityService, ClaimsPaymentService } from '../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';


@Component({
  selector: 'app-list-organization',
  templateUrl: './list-organization.component.html',
  styleUrls: ['./list-organization.component.scss']
})
export class ListOrganizationComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  pastDueDate = new FormControl();
  organization = new FormControl();
  dateRange = new FormControl();
  ffsTabActive: boolean = true;
  cTabActive: boolean = false;
  user: any;
  currentPlatform: any;


  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;


  constructor(
    private _router: Router,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _locker: CoolLocalStorage
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('PREMIUM PAYMENT ');
    this._headerEventEmitter.setMinorRouteUrl('- Current Organization Payments');
    this.user = (<any>this._locker.getObject('auth')).user;
  }



  onClickTab(tabName: string) {
    if (tabName === 'individualPaymentHistory') {
      this.ffsTabActive = true;
      this.cTabActive = false;
    } else {
      this.ffsTabActive = false;
      this.cTabActive = true;
    }
  }


  navigate(url: string, id: string) {
    if (!!id) {
      this._systemService.on();
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._systemService.on();
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }
}
