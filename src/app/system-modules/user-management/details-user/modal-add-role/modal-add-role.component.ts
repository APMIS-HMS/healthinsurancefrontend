import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core'; 
import { UserService } from './../../../../services/common/user.service';
import { ModuleService, SystemModuleService, RoleService } from '../../../../services/index';

@Component({
  selector: 'app-modal-add-role',
  templateUrl: './modal-add-role.component.html',
  styleUrls: ['./modal-add-role.component.scss']
})
export class ModalAddRoleComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() selectedUser;
  modules: any[] = [];
  roles: any[] = [];
  auth: any;
  selectedRole: any = <any>{};
  checkedRoles: any[] = [];
  constructor(private _moduleService: ModuleService,
    private _systemService: SystemModuleService,
    private _roleService: RoleService,
    private _router: Router,
    private _userService: UserService,
    private _locker: CoolLocalStorage) { }

  ngOnInit() {
    console.log(this.selectedUser)
    this.auth = this._locker.getObject('auth');
    console.log(this.auth);
    this._getModules();
    this._getRoles();
  }

  _getModules() {
    this._systemService.on();
    this._moduleService.find({ query: { $sort: 'name', $limit: 100 } }).then((payload: any) => {
      this.modules = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
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

  onSelectRole(role) {
    this.selectedRole = role;
    console.log(role);
  }
  roleChange($event, role) {
    const checked = $event.target.checked;
    if (checked) {
      this.checkedRoles.push(role);
    }
  }
  confirmAndPush() {
    const existingRoles = this.selectedUser.roles;
    this.checkedRoles.forEach(item => {
      const index = existingRoles.findIndex(x => x._id === item._id);
      if (index === -1) {
        this.selectedUser.roles.push(item);
      }
    })
  }
  saveRole() {
    this._systemService.on();
    this.confirmAndPush();
    this._userService.patch(this.selectedUser._id, this.selectedUser, {}).then(payload => {
      console.log(payload)
      this.modalClose_event();
      this._router.navigate(['/modules/user/users/', this.selectedUser._id]).then(pay => {
        this._systemService.off();
      }).catch(er => {
        console.log(er)
        this._systemService.off();
      });
    }).catch(err => {
      console.log(err);
      this._systemService.off()
    })
    // console.log(this.checkedRoles)
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

}
