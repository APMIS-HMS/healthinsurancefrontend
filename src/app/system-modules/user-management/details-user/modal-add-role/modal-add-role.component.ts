import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {CoolLocalStorage} from 'angular2-cool-storage';

import {ModuleService, RoleService, SystemModuleService} from '../../../../services/index';

import {UserService} from './../../../../services/common/user.service';

@Component({
  selector: 'app-modal-add-role',
  templateUrl: './modal-add-role.component.html',
  styleUrls: ['./modal-add-role.component.scss']
})
export class ModalAddRoleComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedUser;
  modules: any[] = [];
  roles: any[] = [];
  auth: any;
  selectedRole: any = <any>{};
  checkedRoles: any[] = [];
  constructor(
      private _moduleService: ModuleService,
      private _systemService: SystemModuleService,
      private _roleService: RoleService, private _router: Router,
      private _userService: UserService, private _locker: CoolLocalStorage) {}

  ngOnInit() {
    this.auth = this._locker.getObject('auth');
    this._getModules();
    this._getRoles();
  }

  _getModules() {
    this._systemService.on();
    this._moduleService.find({query: {$sort: 'name', $limit: 100}})
        .then((payload: any) => {
          this.modules = payload.data;
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
  }

  _getRoles() {
    if (this.auth.user.facilityId !== undefined) {
      this._systemService.on();
      this._roleService
          .find({query: {'facilityId._id': this.auth.user.facilityId._id}})
          .then((payload: any) => {
            this.roles = payload.data;
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    } else {
      this._systemService.on();
      this._roleService.find({})
          .then((payload: any) => {
            this.roles = payload.data;
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    }
  }

  onSelectRole(role) {
    this.selectedRole = role;
  }
  roleChange($event, role) {
    const checked = $event.target.checked;
    if (checked) {
      this.checkedRoles.push(role);
    }
  }
  confirmAndPush() {
    const existingRoles = this.selectedUser.roles;
    this.checkedRoles.forEach(item => {
      const index = existingRoles.findIndex(x => x._id === item._id);
      if (index === -1) {
        // let copyRole = JSON.parse(item);
        delete item.accessibilities;
        this.selectedUser.roles.push(item);
      }
    })
  }
  saveRole() {
    this._systemService.on();
    this.confirmAndPush();
    this._userService.patch(this.selectedUser._id, this.selectedUser, {})
        .then(payload => {
          this.modalClose_event();
          this._router.navigate(['/modules/user/users/', this.selectedUser._id])
              .then(pay => {
                this._systemService.off();
              })
              .catch(er => {
                this._systemService.off();
              });
        })
        .catch(err => {this._systemService.off()})
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }
}
