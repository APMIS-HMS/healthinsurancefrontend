import { CoolLocalStorage } from 'angular2-cool-storage';
import { UserService } from './../../../../services/common/user.service';
import { RoleService } from './../../../../services/auth/role/role.service';
import { Router } from '@angular/router';
import { PolicyService } from './../../../../services/policy/policy.service';
import { Observable } from 'rxjs/Rx';
import { JsonDataService } from './../../../../services/common/json-data.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-new-beneficiary-confirm',
  templateUrl: './new-beneficiary-confirm.component.html',
  styleUrls: ['./new-beneficiary-confirm.component.scss']
})
export class NewBeneficiaryConfirmComponent implements OnInit {
  @Input() policy: any;
  policyObject: any;
  roles: any[] = [];
  user: any;

  constructor(private _dataService: JsonDataService,
    private _policyService: PolicyService, private _router: Router,
    private _userService: UserService,
    private _locker: CoolLocalStorage,
    private _roleService: RoleService) { }

  ngOnInit() {
    console.log(this.policy);
    this.user = (<any>this._locker.getObject('auth')).user;
    // this.policyObject = this.policy;
    // this._dataService.getPolicy().subscribe((payload: any) => {
    //   this.policyObject = payload.policyObject;
    //   console.log(this.policyObject)
    // }, error => {
    //   console.log(error)
    // })
    this._getRoles();

    this._policyService.get(this.policy._id, {}).then(payload => {
      this.policyObject = payload;
    }).catch(err => {
      console.log(err);
    })
  }
  _getRoles() {
    this._roleService.find({}).then((payload: any) => {
      this.roles = payload.data;
    }).catch(err => {

    })
  }
  confirm() {
    let roles: any[] = [];
    let filteredRole = this.roles.filter(x => x.name = "Beneficiary");
    if (filteredRole.length > 0) {
      roles.push(filteredRole[0]);
      this._userService.patch(this.user._id, { roles: roles }, {}).then(payload => {
      }).catch(err => {
        this._router.navigate(['modules/beneficiary/beneficiaries']);
      })

     
    }

  }

}
