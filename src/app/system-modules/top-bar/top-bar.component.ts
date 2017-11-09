import { Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HeaderEventEmitterService } from '../../services/event-emitters/header-event-emitter.service';
import { FacilityService } from '../../services/index';
import { CurrentPlaformShortName } from '../../services/globals/config';
import { NotificationService } from './../../services/common/notification.service';
import { PolicyService } from './../../services/policy/policy.service';

import { SystemModuleService } from './../../services/index';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {


  notifier = false;
  @Output() showMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  appsearchControl = new FormControl();
  pageInView: String = '';
  minorPageInView: String = '';
  currentPlatform: any;
  user: any;
  alerts: any[] = [];
  user_menu = false;
  changePass = false;
  noUnReadAlert = 0;
  notificationMessage="";

  constructor(
    private _headerEventEmitter: HeaderEventEmitterService,
    private _facilityService: FacilityService,
    private _locker: CoolLocalStorage,
    private _router: Router,
    private _systemService: SystemModuleService,
    private _notificationService: NotificationService,
    private _policyService: PolicyService
  ) { }

  ngOnInit() {
    try {
      this.user = (<any>this._locker.getObject('auth')).user;
      this._headerEventEmitter.announcedUrl.subscribe(url => {
        this.pageInView = url;
      });
      this._headerEventEmitter.announcedMinorUrl.subscribe(url => {
        this.minorPageInView = url;
      });
      this._getCurrentPlatform();
    } catch (error) {
      this._router.navigate(['auth/login']);
    }

    var userUserType = (<any>this._locker.getObject('auth')).user;
    // console.log(userUserType.userType._id);

    this._policyService._listenerCreate.subscribe(payload => {
      // let title = "New Policy - " + payload.policyId;
      // let content = payload.principalBeneficiary.personId.firstName + " " + payload.principalBeneficiary.personId.firstName + " " + "added " + payload.dependantBeneficiaries.length + " dependant(s)";
      console.log("-----broadcast create object-------");
      this._notificationService.find({
        query: {
          'userType._id': userUserType.userType._id
        }
      }).then((noOfUnReads: any) => {
        let unReadItems = noOfUnReads.data.filter(x => x.isRead == false);
        this.noUnReadAlert = unReadItems.length;
        this.alerts = noOfUnReads.data;
        this.notificationMessage = this.alerts[this.alerts.length-1];
        console.log(this.alerts);
      });
    });

    this._policyService._listenerUpdate.subscribe(payload => {
      this._notificationService.find({
        query: {
          'userType._id': userUserType.userType._id
        }
      }).then((noOfUnReads: any) => {
        let unReadItems = noOfUnReads.data.filter(x => x.isRead == false);
        this.noUnReadAlert = unReadItems.length;
        this.alerts = noOfUnReads.data;
        this.notificationMessage = this.alerts[this.alerts.length-1];
        console.log(this.alerts);
      });

    });


    this._notificationService.find({
      query: {
        'userType._id': userUserType.userType._id
      }
    }).then((noOfUnReads: any) => {
      let unReadItems = noOfUnReads.data.filter(x => x.isRead == false);
      this.noUnReadAlert = unReadItems.length;
      this.alerts = noOfUnReads.data;
      console.log(this.alerts);

    })
  }

  _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
      }
    }, error => {
      console.log(error);
      this._router.navigate(['auth/login']);
    }).catch(err => {
      console.log(err);
    });
  }

  navigateDetailBeneficiary(item) {
    this._systemService.on();
    item.isRead = true;
    this._notificationService.update(item).then(payload => {
      this._router.navigate(['/modules/beneficiary/beneficiaries', item.policyId]).then(res => {
        this.modal_close();
        this._systemService.off();
      }).catch(err => {
        this.modal_close();
        this._systemService.off();
      });
    })
  }

  menu_show() {
    this.showMenu.emit(true);
  }
  notifier_toggle() {
    this.notifier = !this.notifier;
  }
  notifier_hide() {
    this.notifier = false;
  }
  userMenu_show() {
    this.notifier_hide();
    this.user_menu = !this.user_menu;
  }
  userMenu_hide() {
    this.notifier_hide();
    this.user_menu = false;
  }
  modal_close() {
    this.changePass = false;
  }
  showPass_show() {
    this.changePass = true;
  }

}
