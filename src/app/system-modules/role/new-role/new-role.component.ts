import { Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';

import { AccessibilityModel } from './../../../models/organisation/accessibility-model';
import { RoleService } from './../../../services/auth/role/role.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { ModuleService } from './../../../services/common/module.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Role } from '../../../models/organisation/role';

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

  constructor(private _fb: FormBuilder,
    private _moduleService: ModuleService,
    private _systemService: SystemModuleService,
    private _roleService: RoleService,
    private _router:Router,
    private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this.auth = this._locker.getObject('auth');
    console.log(this.auth);
    this.roleFormGroup = this._fb.group({
      roleName: ['', [<any>Validators.required]]
    });
    this._getModules();
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
    })
    this.roles.forEach(item => { })
  }
  checkForExistence(accessibility) {
    return this.roles.filter(x => x.accessibility.accessibility._id === accessibility._id).length > 0;
  }
  accessbilityChange($event, access) {
    const checked = $event.target.checked;
    const isExisting = this.checkForExistence(access.accessibility);
    if (isExisting && !checked) {
      const index = this.roles.findIndex(x => x.accessibility.accessibility._id === access.accessibility._id);
      this.roles.splice(index, 1);
    } else if (!isExisting) {
      this.roles.push({ module: this.selectedModule, accessibility: access });
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

  onClickAddPremium(valid, value) {
    if (valid) {
      this._systemService.on();
      let newRole: Role = <Role>{};
      newRole.name = value.roleName;
      newRole.isActive = true;
      newRole.facilityId = this.auth.user.facilityId;
      newRole.accessibilities = [];

      this.roles.forEach(item => {
        delete item.module.accessibilities;
        newRole.accessibilities.push({
          accessibility: item.accessibility.accessibility,
          module: item.module
        });
      });
      this._roleService.create(newRole).then(payload => {
        this.roleFormGroup.reset();
        this.roles = [];
        this.accessibilities = [];
        this._getModules();
        
        this._router.navigate(['/modules/role/roles']).then(res =>{
          this._systemService.off();
        }).catch(error =>{
          this._systemService.off();
        })
      }).catch(err => {
        console.log(err);
        this._systemService.off();
      })
      console.log(newRole);
    }

  }
}
