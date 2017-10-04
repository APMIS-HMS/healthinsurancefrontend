import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
  ) { }

  ngOnInit() {
  }

}
