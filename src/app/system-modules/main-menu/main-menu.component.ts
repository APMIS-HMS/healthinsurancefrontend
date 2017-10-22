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

  constructor(
    private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private _router: Router,
    private loadingService: LoadingBarService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private _locker: CoolLocalStorage,
    private _facilityService: FacilityService
  ) {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._checkRole();
   }

  ngOnInit() {
    // this.user = (<any>this._locker.getObject('auth')).user;
    // this._systemService.loggedInUserAnnounced.subscribe(userObj => {
    //   console.log(userObj);
    // });
    // this._checkRole();
  }

  setLoggedInUser(email: String, loggInState: boolean) {
    this._authService.find({ query: { email: email } })
      .then(payload => {
        let currentUser = payload.data[0];
        if(currentUser !== undefined){
          currentUser.loggedInUserStatus = {
            "isLoggedIn": loggInState
          };
  
          this._authService.patch(currentUser._id, currentUser, {}).then(payload => {
            this._authService.checkAuth();
            this._router.navigate(['/auth']);
          });
        }else{
          this._authService.checkAuth();
          this._router.navigate(['/auth']);
        }

      })
  }

  private _checkRole() {
    const role = this.user.roles;
    role.forEach(roleItem => {
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

  }

  close_onClick() {
    this.closeMenu.emit(true);
  }
  signOut() {
    this.setLoggedInUser(this.user.email, false);
  }
}
