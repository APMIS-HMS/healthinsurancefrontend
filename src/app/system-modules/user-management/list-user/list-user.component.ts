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

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _userService: UserService
  ) { }

  ngOnInit() {
    this._getUsers();
  }

  _getUsers() {
    this._userService.find({}).then((payload: any) => {
      this.users = payload.data;
    }).catch(err => {

    })
  }
}
