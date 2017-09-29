import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { PersonService, RoleService } from '../../../services/index';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  addRoleForm: FormGroup;
  users: any = <any>[];
  roles: any = <any>[];
  loading: Boolean = true;
  closeResult: String;
  selectedUser: any = <any>{};

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private modalService: NgbModal,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _personService: PersonService,
    private _roleService: RoleService,
    private _systemService: SystemModuleService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('List Users');
    // this._toastr.success('Beneficiary has been created successfully!', 'Success!');

    this.addRoleForm = this._fb.group({
      role: this._fb.array([])
    });

    this._getRoles();
    this._getPersons();
  }

  onClickActivate(user: any) {
    console.log(user);
    user.isActive = user.isActive ? false : true;

    this._personService.update(user).then((res: any) => {
      this._getPersons();
      const isActive = user.isActive ? 'activated' : 'deactivated';
      const text = user.firstName + ' ' + user.lastName + ' has been ' + isActive + ' successfully!';
      this._toastr.success(text, 'Success!');
    }).catch(err => this._toastr.error('There was a problem updating user. Please try again later!', 'Error!'));
  }

  onChangeRole(role: any, isChecked: Boolean) {
    const roleFormArray = <FormArray>this.addRoleForm.controls.role;

    if (isChecked) {
      console.log(isChecked);
      // emailFormArray.push(new FormControl(email));
    } else {
      // let index = emailFormArray.controls.findIndex(x => x.value == email)
      // emailFormArray.removeAt(index);
    }
  }

  onClickAddRole() {
    console.log(this.selectedUser);
  }
  

  private _getPersons() {
    this._systemService.on();
    this._personService.findAll().then((res: any) => {
      this._systemService.off();
      if (res.data.length > 0) {
        console.log(res);
        this.users = res.data;
      }
    }).catch(err => {
      this._systemService.off();
    });
  }
  
  
  private _getRoles() {
    this._systemService.on();
    this._roleService.findAll().then((res: any) => {
      console.log(res);
      this._systemService.off();
      if (res.data.length > 0) {
        console.log(res);
        this.roles = res.data;
      }
    }).catch(err => {
      this._systemService.off();
    });
  }

  open(content, user) {
    this.selectedUser = user;
    // this.modalService.open('Hi tehre!');
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
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
