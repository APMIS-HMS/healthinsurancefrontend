import { Component, OnInit } from '@angular/core';
import { HeaderEventEmitterService } from './../../services/event-emitters/header-event-emitter.service';
import { Router, NavigationEnd } from '@angular/router';
import { PolicyService } from './../../services/policy/policy.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private _headerEventEmitter: HeaderEventEmitterService,
    private _policyService: PolicyService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('LASHMA');
    this._headerEventEmitter.setMinorRouteUrl('Welcome Page');

    this._policyService._listenerCreate.subscribe(payload => {
			let title= "New Policy - "+payload.policyId;
			let content = payload.principalBeneficiary.personId.firstName + " "+ payload.principalBeneficiary.personId.firstName + " "+ "added "+ payload.dependantBeneficiaries.length + " dependant(s)";
			console.log(content + " broadcasting");
		});

		this._policyService._listenerUpdate.subscribe(payload => {
			let title= "Policy updated - "+payload.policyId;
			let content = payload.principalBeneficiary.personId.firstName + " "+ payload.principalBeneficiary.personId.firstName + " "+ "added "+ payload.dependantBeneficiaries.length + " dependant(s)";
		});
  }

}
