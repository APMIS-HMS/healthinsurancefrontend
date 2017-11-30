import { Router, ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';

import { AccessibilityModel } from './../../../models/organisation/accessibility-model';
import { RoleService } from './../../../services/auth/role/role.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { ModuleService } from './../../../services/common/module.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Role } from '../../../models/organisation/role';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {

  roleFormGroup: FormGroup;
  listsearchControl = new FormControl();

  modules: any[] = [];
  selectedModule: any;
  roles: any[] = [];
  accessibilities: AccessibilityModel[] = [];
  auth: any;
  selectedRole: any = <any>{};
  btnText = 'ADD';

  constructor(
    private _fb: FormBuilder,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _toastr: ToastsManager,
    private _moduleService: ModuleService,
    private _systemService: SystemModuleService,
    private _roleService: RoleService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _locker: CoolLocalStorage
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Role');
    this._headerEventEmitter.setMinorRouteUrl('Create new role');
    this.auth = this._locker.getObject('auth');
    console.log(this.auth);
    this.roleFormGroup = this._fb.group({
      roleName: ['', [<any>Validators.required]]
    });

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getRole(param.id);
        this.btnText = 'UPDATE';
      }
    });

    this._getModules();
  }

  _getRole(id) {
    this._roleService.get(id, {}).then((payload: any) => {
      if (payload !== undefined) {
        this.roleFormGroup.controls['roleName'].setValue(payload.name);
        this.selectedRole = payload;
        this.roles = payload.accessibilities;
      }
    }).catch(err => {

    })
  }

  _getModules() {
    this._systemService.on();
    this._moduleService.find({ query: { $sort: 'name', $limit: 100 } }).then((payload: any) => {
      this.modules = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }

  onSelectModule(selectedModule) {
    this.accessibilities = [];
    this.selectedModule = selectedModule;
    this.selectedModule.accessibilities.forEach(access => {
      let model: AccessibilityModel = <AccessibilityModel>{};
      model.accessibility = access;
      model.checked = this.checkForExistence(access);
      this.accessibilities.push(model);
    });
    this.roles.forEach(item => { })
  }

  checkForExistence(accessibility) {
    return this.roles.filter(x => x.accessibility._id === accessibility._id).length > 0;
  }
  accessbilityChange($event, access) {
    const checked = $event.target.checked;
    const isExisting = this.checkForExistence(access.accessibility);
    if (isExisting && !checked) {
      const index = this.roles.findIndex(x => x.accessibility.accessibility._id === access.accessibility._id);
      this.roles.splice(index, 1);
    } else if (!isExisting) {
      console.log(access)
      this.roles.push({ module: this.selectedModule, accessibility: access.accessibility });
    }
  }

  remove(accessibility) {
    const index = this.roles.findIndex(x => x.accessibility.accessibility._id === accessibility._id);
    this.roles.splice(index, 1);
    this.unCheckedAccessibility(accessibility);
  }
  unCheckedAccessibility(accessibility) {
    const index = this.accessibilities.findIndex(x => x.accessibility._id === accessibility._id);
    this.accessibilities[index].checked = false;
    this.onSelectModule(this.selectedModule);
  }

  onClickAddRole(valid, value) {
    if (valid) {
      this._systemService.on();
      if (this.selectedRole._id === undefined) {
        let newRole: Role = <Role>{};
        newRole.name = value.roleName;
        newRole.isActive = true;
        newRole.facilityId = this.auth.user.facilityId;
        newRole.accessibilities = [];

        this.roles.forEach(item => {
          if (item.module.accessibilities !== undefined) {
            delete item.module.accessibilities;
            newRole.accessibilities.push({
              accessibility: item.accessibility,
              module: item.module
            });
          }
        });
        this._roleService.create(newRole).then(payload => {
          this.roleFormGroup.reset();
          this.roles = [];
          this.accessibilities = [];
          this._getModules();
          this._toastr.success('Role has been created successfully!', 'Success!');
          this._router.navigate(['/modules/role/roles']).then(res => {
            this._systemService.off();
          }).catch(error => {
            this._systemService.off();
          });
        }).catch(err => {
          console.log(err);
          this._systemService.off();
        });
        console.log(newRole);
      } else {
        this.selectedRole.accessibilities = [];
        console.log(this.roles)
        this.roles.forEach(item => {
          if (item.module.accessibilities === undefined) {
            this.selectedRole.accessibilities.push({
              accessibility: item.accessibility,
              module: item.module
            });
          } else {
            delete item.module.accessibilities;
            this.selectedRole.accessibilities.push({
              accessibility: item.accessibility,
              module: item.module
            });
          }
        });
        console.log(this.roles);
        this._roleService.update(this.selectedRole).then(payload => {
          console.log(payload);
          this.roleFormGroup.reset();
          this.roles = [];
          this.accessibilities = [];
          this._getModules();

          this._router.navigate(['/modules/role/roles']).then(res => {
            this._systemService.off();
          }).catch(error => {
            this._systemService.off();
          })
        }).catch(err => {
          console.log(err);
          this._systemService.off();
        });
      }

    }

  }
}
