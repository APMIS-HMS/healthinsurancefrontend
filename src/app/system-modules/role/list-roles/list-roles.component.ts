import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {

  listsearchControl = new FormControl();
  filterTypeControl = new FormControl();
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl();

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
  ) { }

  ngOnInit() {
    this.roleFormGroup = this._fb.group({
      role: ['', [<any>Validators.required]],
      module: ['', [<any>Validators.required]]
    });
  }

}
