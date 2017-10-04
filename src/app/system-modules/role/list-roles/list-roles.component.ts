import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { RoleService } from '../../../services/auth/role/role.service';
import { ModuleService } from '../../../services/common/module.service';
import { Facility } from '../../../models/index';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {
  roleFormGroup: FormGroup;
  roles: any = <any>[];
  modules: any = <any>[];
  loading: Boolean = true;
  disableAddBtn: Boolean = false;
  closeResult: String;
  selectedRole: any = <any>{};
  selectedModule: any = <any>{};
  addBtnText: String = '<i class="fa fa-plus"></i> Add Role';

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _roleService: RoleService,
    private _moduleService: ModuleService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Manage Role');
    this._headerEventEmitter.setMinorRouteUrl('');

    this.roleFormGroup = this._fb.group({
      role: ['', [<any>Validators.required]],
      module: ['', [<any>Validators.required]]
    });

    this._getRoles();
    this._getModules();
  }

  createRole(valid: Boolean, value: any) {
    console.log(value);
    if (!valid) {
      this.disableAddBtn = true;
      // Create New
      if (this.selectedRole._id === undefined) {
        this.addBtnText = 'Adding Role... <i class="fa fa-spinner fa-spin"></i>';
        const role = {
          name: value.role,
          module: value.module
        };

        this._roleService.create(role).then((res: any) => {
          console.log(res);
          this.roleFormGroup.reset();
          this.closeResult = `Closed with: ${'result'}`;
          this.disableAddBtn = false;
          this.addBtnText = '<i class="fa fa-plus"></i> Add Role';
          this._getRoles();
          this._toastr.success('Role has been created successfully!', 'Success!');
        }).catch(err => console.log(err));
      } else {
        // Edit existing
        this.addBtnText = 'Editing Role... <i class="fa fa-spinner fa-spin"></i>';
        this.selectedRole.name = value.role;
        this.selectedRole.module = value.module;
        this._roleService.update(this.selectedRole).then((res: any) => {
          this.roleFormGroup.reset();
          this.closeResult = `Closed with: ${'result'}`;
          this.disableAddBtn = false;
          this.addBtnText = '<i class="fa fa-plus"></i> Add Role';
          this._getRoles();
          this._toastr.success('Role has been created successfully!', 'Success!');
        }).catch(err => console.log(err));
      }
    }
  }

  onClickActivate(role: any) {
    role.isActive = role.isActive ? false : true;

    this._roleService.update(role).then((res: any) => {
      this._getRoles();
      const isActive = role.isActive ? 'activated' : 'deactivated';
      const text = role.name + ' has been ' + isActive + ' successfully!';
      this._toastr.success(text, 'Success!');
    }).catch(err => this._toastr.error('There was a problem updating role. Please try again later!', 'Error!'));
  }

  private _getRoles() {
    this._roleService.findAll().then((res: any) => {
      this.loading = false;
      if (res.data.length > 0) {
        this.roles = res.data;
      }
    }).catch(err => console.log(err));
  }

  private _getModules() {
    this._moduleService.findAll().then((res: any) => {
      if (res.data.length > 0) {
        this.modules = res.data;
      }
    }).catch(err => console.log(err));
  }
}
