import { Component, OnInit } from '@angular/core';
import { HeaderEventEmitterService } from './../../services/event-emitters/header-event-emitter.service';
import { Router, NavigationEnd } from '@angular/router';
import { PolicyService } from './../../services/policy/policy.service';
import { NotificationService } from './../../services/common/notification.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  noUnReadAlert = 0;


  constructor(
    private _headerEventEmitter: HeaderEventEmitterService,
    private _policyService: PolicyService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('LASHMA');
    this._headerEventEmitter.setMinorRouteUrl('Welcome Page');

    this._policyService._listenerCreate.subscribe(payload => {
      let title = "New Policy - " + payload.policyId;
      let content = payload.principalBeneficiary.personId.firstName + " " + payload.principalBeneficiary.personId.firstName + " " + "added " + payload.dependantBeneficiaries.length + " dependant(s)";
      console.log(content + " broadcasting");
      this._notificationService.find({
        query: {
          'isRead': false
        }
      }).then((noOfUnReadNotice:any) => {
        this.noUnReadAlert = noOfUnReadNotice.data.length;
      })
    });

    this._policyService._listenerUpdate.subscribe(payload => {
      let title = "Policy updated - " + payload.policyId;
      let content = payload.principalBeneficiary.personId.firstName + " " + payload.principalBeneficiary.personId.firstName + " " + "added " + payload.dependantBeneficiaries.length + " dependant(s)";
    });
  }

}
