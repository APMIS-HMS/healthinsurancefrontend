import { RoleService } from './../../services/auth/role/role.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from './../../services/common/system-module.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { AuthService } from './../../auth/services/auth.service';
import { UploadService, FacilityService } from './../../services/index';
import { HeaderEventEmitterService } from './../../services/event-emitters/header-event-emitter.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  user: any;
  hasBeneficiary: boolean = false;
  hasProvider: boolean = false;
  hasOrganisation: boolean = false;
  hasHIA: boolean = false;
  hasPlan: boolean = false;
  hasCheckIn: boolean = false;
  hasPremiumPayment: boolean = false;
  hasClaim: boolean = false;
  hasClaimPayment: boolean = false;
  hasReferral: boolean = false;
  hasAuthorization: boolean = false;
  hasComplaint: boolean = false;
  hasFundManagement: boolean = false;
  hasAnalytics: boolean = false;
  hasPlatform: boolean = false;
  hasRoleManagement: boolean = false;
  hasAccessManagement: boolean = false;
  hasUserManagement: boolean = false;

  ready: boolean = true;

  constructor(
    private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private _router: Router,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private _roleService: RoleService,
    private _locker: CoolLocalStorage,
    private _facilityService: FacilityService
  ) {
    this.user = (<any>this._locker.getObject('auth')).user;
    // this._checkRole();
  }

  ngOnInit() {
    // console.log('am here')
    // this.user = (<any>this._locker.getObject('auth')).user;
    // this._systemService.loggedInUserAnnounced.subscribe(userObj => {
    //   console.log(userObj);
    // });
    // this._checkRole();
    this._bindRole();
  }

  setLoggedInUser(email: String, loggInState: boolean) {
    this._authService.find({ query: { email: email } })
      .then(payload => {
        let currentUser = payload.data[0];
        if (currentUser !== undefined) {
          currentUser.loggedInUserStatus = {
            'isLoggedIn': loggInState
          };

          this._authService.patch(currentUser._id, currentUser, {}).then(payload => {
            this._authService.checkAuth();
            this._router.navigate(['/auth/login']);
          });
        } else {
          this._authService.checkAuth();
          this._router.navigate(['/auth/login']);
        }
      });
  }
  private _bindRole() {
    const accessibilities = (<any>this._locker.getObject('accessibilities'));

    this.hasBeneficiary = true;
    this.hasProvider = true;
    this.hasOrganisation = true;
    this.hasPlatform = true;
    this.hasHIA = true;
    this.hasPremiumPayment = true;
    this.hasClaim = true;
    this.hasClaimPayment = true;
    this.hasCheckIn = true;
    this.hasUserManagement = true;
    this.hasPlan = true;
    this.hasAuthorization = true;
    this.hasAnalytics = true;
    this.hasFundManagement = true;
    this.hasComplaint = true;
    this.hasReferral = true;
    this.hasRoleManagement = true;
    this.hasPlatform = true;
    this.hasAccessManagement = true;

    // if(accessibilities !== null && accessibilities !== undefined){
    //   accessibilities.forEach(access => {
    //     if (!!access.module) {
    //       switch (access.module.name.toLowerCase()) {
    //         case 'beneficiary':
    //           this.hasBeneficiary = true;
    //           break;
    //         case 'care provider':
    //           this.hasProvider = true;
    //           break;
    //         case 'employer':
    //           this.hasOrganisation = true;
    //           break;
    //         case 'platform':
    //           this.hasPlatform = true;
    //           break;
    //         case 'health insurance agent':
    //           this.hasHIA = true;
    //           break;
    //         case 'premium payment':
    //           this.hasPremiumPayment = true;
    //           break;
    //         case 'claims':
    //           this.hasClaim = true;
    //           break;
    //         case 'claims (and capitation) payment':
    //           this.hasClaimPayment = true;
    //           break;
    //         case 'check-in':
    //           this.hasCheckIn = true;
    //           break;
    //         case 'user management':
    //           this.hasUserManagement = true;
    //           break;
    //         case 'health plan management':
    //           this.hasPlan = true;
    //           break;
    //         case 'pre-authorization':
    //           this.hasAuthorization = true;
    //           break;
    //         case 'analytics':
    //           this.hasAnalytics = true;
    //           break;
    //         case 'funds management':
    //           this.hasFundManagement = true;
    //           break;
    //         case 'complaints':
    //           this.hasComplaint = true;
    //           break;
    //         case 'referral':
    //           this.hasReferral = true;
    //           break;
    //         case 'roles':
    //           this.hasRoleManagement = true;
    //           break;
    //         case 'platform':
    //           this.hasPlatform = true;
    //           break;
    //         case 'access':
    //           this.hasAccessManagement = true;
    //           break;
    //       }
    //     }
    //   });
    // }

  }

  private _checkRole() {
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
          accessibilities.forEach(access => {
            if (!!access.module) {
              switch (access.module.name.toLowerCase()) {
                case 'beneficiary':
                  this.hasBeneficiary = true;
                  break;
                case 'care provider':
                  this.hasProvider = true;
                  break;
                case 'employer':
                  this.hasOrganisation = true;
                  break;
                case 'platform':
                  this.hasPlatform = true;
                  break;
                case 'health insurance agent':
                  this.hasHIA = true;
                  break;
                case 'premium payment':
                  this.hasPremiumPayment = true;
                  break;
                case 'claims':
                  this.hasClaim = true;
                  break;
                case 'claims (and capitation) payment':
                  this.hasClaimPayment = true;
                  break;
                case 'check-in':
                  this.hasCheckIn = true;
                  break;
                case 'user management':
                  this.hasUserManagement = true;
                  break;
                case 'health plan management':
                  this.hasPlan = true;
                  break;
                case 'pre-authorization':
                  this.hasAuthorization = true;
                  break;
                case 'analytics':
                  this.hasAnalytics = true;
                  break;
                case 'funds management':
                  this.hasFundManagement = true;
                  break;
                case 'complaints':
                  this.hasComplaint = true;
                  break;
                case 'referral':
                  this.hasReferral = true;
                  break;
                case 'roles':
                  this.hasRoleManagement = true;
                  break;
                case 'platform':
                  this.hasPlatform = true;
                  break;
                case 'access':
                  this.hasAccessManagement = true;
                  break;
              }
            }
          });
        }
      });
    })



  }

  close_onClick() {
    this.closeMenu.emit(true);
  }
  signOut() {
    this.setLoggedInUser(this.user.email, false);
  }
}