import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { RoleService } from '../../../services/auth/role/role.service';
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
  loading: Boolean = true;
  closeResult: String;
  addBtnText: String = '<i class="fa fa-plus"></i> Add Role';

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private modalService: NgbModal,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _roleService: RoleService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Manage Role');
    this._headerEventEmitter.setMinorRouteUrl('');

    this.roleFormGroup = this._fb.group({
      role: ['', [<any>Validators.required]]
    });

    this._getRoles();
  }

  open(content) {
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

  createRole(valid: Boolean, value: any) {
    console.log(value);
  }

  private _getRoles() {
    this._roleService.findAll().then((res: any) => {
      console.log(res);
      this.roles = res.data;
    }).catch(err => console.log(err));
  }

}
