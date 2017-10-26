import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/filter';
import { Observable, Subscription } from 'rxjs/Rx';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { PlanTypeService } from './../../../services/common/plan-type.service';
import { UploadService } from './../../../services/common/upload.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { AuthService } from './../../../auth/services/auth.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { FacilityService } from './../../../services/common/facility.service';
import { UserTypeService } from '../../../services/common/user-type.service';

@Component({
  selector: 'app-list-platform',
  templateUrl: './list-platform.component.html',
  styleUrls: ['./list-platform.component.scss']
})
export class ListPlatformComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');

  previousUrl: String = '';
  selectedUserType: any;
  owners: any[] = [];
  loading: boolean = true;
  planTypes:any[] = [];

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
  ) {
    this._router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(e => {
      });
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Platform List');
    this._headerEventEmitter.setMinorRouteUrl('All Platforms');

    this._getUserTypes();

    this.listsearchControl.valueChanges
      .distinctUntilChanged()
      .debounceTime(200)
      .switchMap((term) => Observable.fromPromise(this._facilityService.find({
        query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 }
      })))
      .subscribe((payload: any) => {
        console.log(this.listsearchControl.value);
        var strVal = this.listsearchControl.value;
        this.owners = payload.data.filter(function (item) {
          return( item.name.toLowerCase().includes(strVal.toLowerCase())
          || item.shortName.toLowerCase() == strVal.toLowerCase()
          || item.email.toLowerCase().includes(strVal.toLowerCase())
          || item.businessContact.lastName.toLowerCase().includes(strVal.toLowerCase())
          || item.businessContact.firstName.toLowerCase().includes(strVal.toLowerCase())
          || item.businessContact.phoneNumber.includes(strVal.toLowerCase())
          || item.businessContact.email.includes(strVal.toLowerCase()))
        })
      });
      
  }
  _getPlatformOwners() {
    this._systemService.on();
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((payload: any) => {
      this.loading = false;
      console.log(payload);
      this.owners = payload.data;
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    })
  }

  onSelectedStatus(item) {
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id,isTokenVerified:item, $limit: 200 } }).then((payload: any) => {
      this.owners = payload.data;
    });
    if(item=="All"){
      this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((payload: any) => {
        this.owners = payload.data;
      });
    }
  }

  private _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then((payload: any) => {
      this._systemService.off();
      console.log(payload);
      if (payload.data.length > 0) {
        const index = payload.data.findIndex(x => x.name === 'Platform Owner');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
          this._getPlatformOwners();
        } else {
          this.selectedUserType = undefined;
        }
      }
    }, error => {
      this._systemService.off();
    })
  }

  navigateNewPlatform() {
   this._systemService.on()
    this._router.navigate(['/modules/platform/new']).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }


  navigateEditPlatform(platform) {
   this._systemService.on()
    this._router.navigate(['/modules/platform/new', platform._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }
}
