import { SystemModuleService } from './../../../services/common/system-module.service';
import { UserService } from './../../../services/common/user.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.scss']
})
export class DetailsUserComponent implements OnInit {

  listsearchControl = new FormControl();
  premiumsearchControl = new FormControl();
  isActive = new FormControl();

  tab_hias = true;
  selectedUser: any;
  addRole = false;

  constructor(private _route: ActivatedRoute, private _userService: UserService,
    private _systemService: SystemModuleService, private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('User Details');
    this._headerEventEmitter.setMinorRouteUrl('User details page');
    this._route.params.subscribe(value => {
      if (!!value.id) {
        this._getUser(value.id);
      }
    });
    this.isActive.valueChanges.subscribe(value => {
      console.log(value);
      this._updateUser(value);
    });
  }

  _updateUser(value) {
    this._systemService.on();
    this.selectedUser.isActive = value.target.checked;
    this._userService.patch(this.selectedUser._id, this.selectedUser, {}).then((payload: any) => {
      this.selectedUser = payload;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getUser(id) {
    this._systemService.on();
    this._userService.get(id, {}).then((res: any) => {
      console.log(res);
      this.selectedUser = res;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    });
  }

  routeAddRole() {
    
  }

  tabHia_click() {
    this.tab_hias = true;
  }
  modal_close() {
    this.addRole = false;
  }
  addRole_click() {
    this.addRole = true;
  }

}
