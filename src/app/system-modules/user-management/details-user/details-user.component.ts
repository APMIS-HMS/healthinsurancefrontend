import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {SystemModuleService} from './../../../services/common/system-module.service';
import {UserService} from './../../../services/common/user.service';
import {HeaderEventEmitterService} from './../../../services/event-emitters/header-event-emitter.service';

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

  constructor(
      private _route: ActivatedRoute, private _userService: UserService,
      private _systemService: SystemModuleService, private _router: Router,
      private _headerEventEmitter: HeaderEventEmitterService) {}

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('User Details');
    this._headerEventEmitter.setMinorRouteUrl('User details page');
    this._route.params.subscribe(value => {
      if (!!value.id) {
        this._getUser(value.id);
      }
    });
    this.isActive.valueChanges.subscribe(value => {
      this._updateUser(value);
    });
  }

  _updateUser(value) {
    this._systemService.on();
    this.selectedUser.isActive = value.target.checked;
    this._userService.patch(this.selectedUser._id, this.selectedUser, {})
        .then((payload: any) => {
          this.selectedUser = payload;
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
  }

  _getUser(id) {
    this._systemService.on();
    this._userService.get(id, {})
        .then((res: any) => {
          this.selectedUser = res;
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
  }

  onClickDeleteRole(role) {
    role.userId = this.selectedUser._id;
    this._systemService.announceSweetProxy('Are you sure you want to delete this role?', 'question', this, null, null, role);
  }

  sweetAlertCallback(result, role) {
    if (result.value) {
      this._systemService.on();
      this._userService.crudRole(role).then(res => {
        this.selectedUser = res;
        const msg = `${role.name} role has been deleted successfully.`;
        this._systemService.announceSweetProxy(msg, 'success');
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
        console.log(err);
      });
    }
  }

  routeAddRole() {}

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
