import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { RoleService } from '../../../services/auth/role/role.service';
import { ModuleService } from '../../../services/common/module.service';
import { Facility } from '../../../models/index';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent implements OnInit {
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
    private modalService: NgbModal,
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

  open(content, role: any) {
    console.log(role);
    if (!!role._id) {
      this.selectedRole = role;
      this.roleFormGroup.controls['role'].setValue(role.name);
      this.selectedModule = role.module;
      console.log(this.selectedModule);
      this.roleFormGroup.controls['module'].setValue(role.module);
      this.addBtnText = '<i class="fa fa-edit"></i> Edit Role';
    }

    // Open the modal
    this.modalService.open(content).result.then((result) => {
      console.log(result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.selectedRole = {};
      this.roleFormGroup.reset();
      console.log(reason);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
