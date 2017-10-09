import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthService } from './../../../auth/services/auth.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HiaTypeService } from './../../../services/hia/hia-type.service';
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
  hiaTypes: any[] = [];
  loading: boolean = true;

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private loadingService: LoadingBarService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private  _hiaTypeService:HiaTypeService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('HIA List');
    this._headerEventEmitter.setMinorRouteUrl('All HIAs');

    this._getUserTypes();
    this._getHiaTypes();

    this.filterTypeControl.valueChanges.subscribe(payload => {
      this._systemService.on();
      if (payload != undefined) {
        
        console.log(payload);
        this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((payload1: any) => {
          this.hias = payload1.data.filter(function (item) {
            return (item.hia.type.name.toLowerCase() == payload.toLowerCase())
          });
        });

        if (payload == "All") {
          this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((payload2: any) => {
            this.hias = payload2.data;
          });
        }
      }
      this._systemService.off();
    })

    this.listsearchControl.valueChanges
      .distinctUntilChanged()
      .debounceTime(200)
      .switchMap((term) => Observable.fromPromise(
        this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } })))
      .subscribe((payload: any) => {
        var strVal = this.listsearchControl.value;
        this.hias = payload.data.filter(function (item) {
          return (item.name.toLowerCase().includes(strVal.toLowerCase())
            || item.hia.type.name.toLowerCase().includes(strVal.toLowerCase())
            || item.itContact.lastName.toLowerCase().includes(strVal.toLowerCase())
            || item.itContact.firstName.toLowerCase().includes(strVal.toLowerCase())
            || item.itContact.phoneNumber.toLowerCase().includes(strVal.toLowerCase())
            || item.hia.grade.name.toLowerCase().includes(strVal.toLowerCase()))
        })
      });
  
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

  _getHiaTypes() {
    this._systemService.on();
    this._hiaTypeService.find({
      query: {
        $limit: 200
      }
    }).then((payload: any) => {
      this._systemService.off();
      this.hiaTypes = payload.data;
    }).catch(err => {
      this._systemService.off();
    })
  }

  onSelectedStatus(item: any) {
    this._systemService.on();
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, isTokenVerified: item, $limit: 200 } }).then((payload: any) => {
      this.hias = payload.data;
    });
    if (item == "All") {
      this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((payload2: any) => {
        this.hias = payload2.data;
      });
    }
    this._systemService.off();
  }

  onSelectedGrade(item: any) {
    this._systemService.on();
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, 'hia.grade.name': item, $limit: 200 } }).then((payload: any) => {
      this.hias = payload.data;
    });
    if (item == "All") {
      this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((payload2: any) => {
        this.hias = payload2.data;
      });
    }
    this._systemService.off();
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
