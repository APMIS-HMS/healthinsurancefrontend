import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {Role} from '../../../models/organisation/role';
import {HeaderEventEmitterService} from '../../../services/event-emitters/header-event-emitter.service';

import {RoleService} from './../../../services/auth/role/role.service';
import {SystemModuleService} from './../../../services/common/system-module.service';

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
  loading: boolean = true;

  constructor(
      private _fb: FormBuilder, private _systemService: SystemModuleService,
      private _router: Router,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _locker: CoolLocalStorage, private _roleService: RoleService) {}

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Role List');
    this._headerEventEmitter.setMinorRouteUrl('List of all roles');
    this.auth = this._locker.getObject('auth');
    this.roleFormGroup =
        this._fb.group({roleName: ['', [<any>Validators.required]]});

    this.listsearchControl.valueChanges.debounceTime(300)
        .distinctUntilChanged()
        .subscribe(value => {
          this._roleService
              .find({
                query: {
                  $or: [
                    {name: {$regex: value, '$options': 'i'}},
                    {
                      'accessibilities.accessibility.name':
                          {$regex: value, '$options': 'i'}
                    },
                    {
                      'accessibilities.module.name':
                          {$regex: value, '$options': 'i'}
                    },
                  ]
                }
              })
              .then((payload: any) => {
                this.roles = payload.data;
              })
              .catch(
                  err => {

                  });
        });
    this._getRoles();
  }

  _getRoles() {
    if (this.auth.user.facilityId !== undefined) {
      this._systemService.on();
      this._roleService
          .find({query: {'facilityId._id': this.auth.user.facilityId._id}})
          .then((payload: any) => {
            this.loading = false;
            this.roles = payload.data;
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    } else {
      this._systemService.on();
      this._roleService.find({})
          .then((payload: any) => {
            this.loading = false;
            this.roles = payload.data;
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    }
  }

  routeRole(role) {
    this._systemService.on();
    this._router.navigate(['/modules/role/new', role._id])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        })
  }
}
