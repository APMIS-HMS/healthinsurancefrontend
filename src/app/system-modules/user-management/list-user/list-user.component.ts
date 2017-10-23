import { CurrentPlaformShortName } from './../../../services/globals/config';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { Router } from '@angular/router';
import { UserService } from './../../../services/common/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FacilityService } from '../../../services/common/facility.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

  listsearchControl = new FormControl();
  filterTypeControl = new FormControl();
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl();

  addRoleForm: FormGroup;
  users: any = <any>[];
  roles: any = <any>[];
  loading: Boolean = true;
  closeResult: String;
  selectedUser: any = <any>{};
  auth: any = <any>{};
  currentPlatform:any;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _userService: UserService,
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private loadingService: LoadingBarService,
    private _facilityService:FacilityService,
    private _locker: CoolLocalStorage
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('User List');
    this._headerEventEmitter.setMinorRouteUrl('List all all users');
    this.auth = (<any>this._locker.getObject('auth')).user;
    this._getCurrentPlatform();
  }
	private _getCurrentPlatform() {
		this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
			if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getUsers();
			}
		}).catch(err => console.log(err));
	}
  _getUsers() {
    this._systemService.on();
    if (this.auth.userType === undefined) {
      this._userService.find({}).then((payload: any) => {
        console.log(payload);
        this.loading = false;
        this.users = payload.data;
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else if (this.auth.userType.name === 'Platform Owner') {
      console.log(this.auth.userType);
      this._userService.find({ query: { 'platformOwnerId._id': this.currentPlatform._id } }).then((payload: any) => {
        console.log(payload);
        this.loading = false;
        this.users = payload.data;
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }


  }

  showDetails(user) {
    this._systemService.on();
    this._router.navigate(['/modules/user/users', user._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    });
  }

  navigate(url: string, id?: string) {
    if (!!id) {
      this.loadingService.startLoading();
      this._router.navigate([url + id]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    } else {
      this.loadingService.startLoading();
      this._router.navigate([url]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    }
  }

}
