import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthService } from './../../../auth/services/auth.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SystemModuleService, UserTypeService, FacilityService } from '../../../services/index';

@Component({
  selector: 'app-list-hia',
  templateUrl: './list-hia.component.html',
  styleUrls: ['./list-hia.component.scss']
})
export class ListHiaComponent implements OnInit {

  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');

  selectedUserType: any;
  hias: any[] = [];
  loading: boolean = true;

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private loadingService: LoadingBarService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('HIA List');
    this._headerEventEmitter.setMinorRouteUrl('All HIAs');

    this._getUserTypes();
  }

  _getHIAs() {
    this._systemService.on();
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((payload: any) => {
      this.loading = false;
      console.log(payload);
      this.hias = payload.data;
      this._systemService.off();
    }).catch(error => {
      console.log(error);
      this._systemService.off();
    })
  }

  private _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then((payload: any) => {
      this._systemService.off();
      console.log(payload);
      if (payload.data.length > 0) {
        const index = payload.data.findIndex(x => x.name === 'Health Insurance Agent');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
          this._getHIAs();
        } else {
          this.selectedUserType = undefined;
        }
      }
    }, error => {
      this._systemService.off();
    })
  }

  navigateNewHIA() {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/hia/new']).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }


  navigateEditHIA(hia) {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/hia/new', hia._id]).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      console.log(err)
      this.loadingService.endLoading();
    });
  }

  navigateViewHIADetail(hia) {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/hia/hias', hia._id]).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      console.log(err)
      this.loadingService.endLoading();
    });
  }
}
