import { ToastsManager } from 'ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { UserService } from './../../../../services/common/user.service';
import { RoleService } from './../../../../services/auth/role/role.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  isBeneficiary = false;

  constructor(private _dataService: JsonDataService,
    private _policyService: PolicyService, private _router: Router,
    private _userService: UserService,
    private _locker: CoolLocalStorage,
    private _route: ActivatedRoute,
    private _toastr: ToastsManager,
    private _roleService: RoleService) { }

  ngOnInit() {
    console.log(this.policy);
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getRoles();
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._policyService.get(param.id, {}).then(payload => {
          this.policyObject = payload;
        }).catch(err => {
          console.log(err);
        })
      }
    });
    if (this.user.userType.name === 'Beneficiary') {
      this.isBeneficiary = true;
    }
  }
  _getRoles() {
    let role$ = Observable.fromPromise(this._roleService.find({ query: { name: 'Beneficiary' } }));
    let user$ = Observable.fromPromise(this._userService.get(this.user._id, {}));

    Observable.forkJoin([role$, user$]).subscribe((results: any) => {
      this.roles = results[0].data;
      this.user = results[1];
    }, error => {

    })
  }
  private _checkRole() {
    try {
      const roles = this.user.roles;
      const roleIds: any[] = [];
      roles.forEach(x => {
        roleIds.push(x._id);
      })

      this._roleService.find({
        query: {
          _id: {
            $in: roleIds
          }
        }
      }).then((pays: any) => {
        pays.data.forEach(roleItem => {
          if (!!roleItem.accessibilities) {
            const accessibilities = roleItem.accessibilities;
            this._locker.setObject('accessibilities', accessibilities);
          }
          this._toastr.success('User acquired a new role successfully!', 'Success!');
        });
      }).catch(err => {

      })
    } catch (error) {

    }
  }
  confirmList() {
    if (this.user.userType.name !== "Beneficiary") {
      this._router.navigate(['modules/beneficiary/beneficiaries']).then(payload => {

      }).catch(err => {

      });
    } else {
      let roles: any[] = [];
      if (this.roles.length > 0) {
        roles.push(this.roles[0]);
        this._userService.patch(this.user._id, { roles: roles, completeRegistration: true }, {}).then(payload => {
          this._router.navigate(['modules/beneficiary/beneficiaries']);
        }).catch(err => {

        })
      }
    }
  }

  confirmDetails() {
    if (this.user.userType.name !== "Beneficiary") {
      this._router.navigate(['modules/beneficiary/beneficiaries']).then(payload => {

      }).catch(err => {

      });
    } else {
      let roles: any[] = [];
      if (this.roles.length > 0) {
        roles.push(this.roles[0]);
        this._userService.patch(this.user._id, { roles: roles, completeRegistration: true }, {}).then(payload => {
          this.user = payload;
          console.log(payload)
          this._checkRole();
          this._router.navigate(['/modules/beneficiary/beneficiaries', this.policyObject._id]).then(payload => {

          }).catch(err2 => {
            console.log(err2)
          });
        }).catch(err => {

        })
      }
    }
  }

  confirmPayments() {

  }

}
