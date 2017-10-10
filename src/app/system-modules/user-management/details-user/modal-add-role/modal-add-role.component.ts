import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModuleService, SystemModuleService, RoleService } from '../../../../services/index';

@Component({
  selector: 'app-modal-add-role',
  templateUrl: './modal-add-role.component.html',
  styleUrls: ['./modal-add-role.component.scss']
})
export class ModalAddRoleComponent implements OnInit {

  modules: any[] = [];
  roles: any[] = [];
  auth: any;
  selectedRole: any = <any>{};
  checkedRoles: any[] = [];
  constructor(private _moduleService: ModuleService,
    private _systemService: SystemModuleService,
    private _roleService: RoleService,
    private _router: Router,
    private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this.auth = this._locker.getObject('auth');
    console.log(this.auth);
    this._getModules();
    this._getRoles();
  }

  _getModules() {
    this._systemService.on();
    this._moduleService.find({ query: { $sort: 'name', $limit: 100 } }).then((payload: any) => {
      this.modules = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getRoles() {
    this._systemService.on();
    this._roleService.find({ query: { 'facilityId._id': this.auth.user.facilityId._id } }).then((payload: any) => {
      this.roles = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  onSelectRole(role) {
    this.selectedRole = role;
    console.log(role);
  }
  roleChange($event, role) {
    const checked = $event.target.checked;
    if (checked) {
      this.checkedRoles.push(role._id);
    }
  }
  saveRole() {
    console.log(this.checkedRoles);
  }

}
