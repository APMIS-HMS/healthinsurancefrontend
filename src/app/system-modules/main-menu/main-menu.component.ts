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
  ) {}

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user);
    this._systemService.loggedInUserAnnounced.subscribe(userObj => {
      console.log(userObj);
    });
  }

  setLoggedInUser(email: String, loggInState: boolean) {
    this._authService.find({ query: { email: email } })
      .then(payload => {
        let currentUser = payload.data[0];
        currentUser.loggedInUserStatus = {
          "isLoggedIn": loggInState
        };

        this._authService.patch(currentUser._id,currentUser,{}).then(payload=>{
          this._authService.checkAuth();
          this._router.navigate(['/auth']);
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
