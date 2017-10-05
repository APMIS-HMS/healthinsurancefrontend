import { AccessibilityModel } from './../../../models/organisation/accessibility-model';
import { RoleService } from './../../../services/auth/role/role.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { ModuleService } from './../../../services/common/module.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {

  roleFormGroup: FormGroup;
  listsearchControl = new FormControl();

  modules: any[] = [];
  selectedModule:any;
  roles:any[] = [];
  accessibilities:AccessibilityModel[] = [];
  
  constructor(private _fb: FormBuilder,
    private _moduleService: ModuleService,
    private _systemService: SystemModuleService,
    private _roleService: RoleService) { }

  ngOnInit() {
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
    this.selectedModule.accessibilities.forEach(access =>{
      let model:AccessibilityModel =  <AccessibilityModel>{};
      model.accessibility = access;
      model.checked = false;
      this.accessibilities.push(model);
    })
    this.roles.forEach(item =>{})
  }
  accessbilityChange($event, access){
    console.log($event.target.checked);
    console.log(access)
    this.roles.push({module:this.selectedModule, accessibility: access});
  }
}
