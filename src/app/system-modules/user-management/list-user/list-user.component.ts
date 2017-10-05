import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { Router } from '@angular/router';
import { UserService } from './../../../services/common/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FacilityService } from '../../../services/common/facility.service';

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

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _userService: UserService,
    private _router: Router,
    private _systemService: SystemModuleService,
    private _locker: CoolLocalStorage
  ) { }

  ngOnInit() {
    this.auth = (<any>this._locker.getObject('auth')).user;
    this._getUsers();
  }

  _getUsers() {
    this._systemService.on();
    if (this.auth.userType === undefined) {
      this._userService.find({}).then((payload: any) => {
        this.users = payload.data;
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      })
    } else if (this.auth.userType.name === 'Platform Owner') {
      this._userService.find({ query: { 'facilityId._id': this.auth.facilityId._id } }).then((payload: any) => {
        this.users = payload.data;
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      })
    }


  }

  showDetails(user) {
    this._systemService.on();
    this._router.navigate(['/modules/user/users', user._id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }
}
