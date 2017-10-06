import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';
import { RoleService } from './../../../services/auth/role/role.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Role } from '../../../models/organisation/role';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {

  roleFormGroup: FormGroup;
  listsearchControl = new FormControl();
  auth: any;
  roles: Role[] = [];

  constructor(private _fb: FormBuilder,
    private _systemService: SystemModuleService,
    private _router: Router,
    private _locker: CoolLocalStorage,
    private _roleService: RoleService) { }

  ngOnInit() {
    this.auth = this._locker.getObject('auth');
    this.roleFormGroup = this._fb.group({
      roleName: ['', [<any>Validators.required]]
    });
    this._getRoles();
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

  routeRole(role){
    this._systemService.on();
    this._router.navigate(['/modules/role/new',role._id]).then(res =>{
      this._systemService.off();
    }).catch(err =>{
      console.log(err);
      this._systemService.off();
    })
  }

}
