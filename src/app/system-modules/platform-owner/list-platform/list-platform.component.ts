import { SystemModuleService } from './../../../services/common/system-module.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import * from '../../../rxjs/rxjs.extentions';
import 'rxjs/add/operator/filter';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { FacilityService } from './../../../services/common/facility.service';
import { UserTypeService } from '../../../services/common/user-type.service';

@Component({
  selector: 'app-list-platform',
  templateUrl: './list-platform.component.html',
  styleUrls: ['./list-platform.component.scss']
})
export class ListPlatformComponent implements OnInit {
  previousUrl: String = '';
  selectedUserType: any;
  owners: any[] = [];
  loading: Boolean = true;

  constructor(
    private _router: Router,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService
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

  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.findAll().then((payload: any) => {
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
}
