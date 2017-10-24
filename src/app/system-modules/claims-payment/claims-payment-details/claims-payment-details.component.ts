import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SystemModuleService, ClaimService } from '../../../services/index';

@Component({
  selector: 'app-claims-payment-details',
  templateUrl: './claims-payment-details.component.html',
  styleUrls: ['./claims-payment-details.component.scss']
})
export class ClaimsPaymentDetailsComponent implements OnInit {
  selectedClaim: any;
  tab_details = true;
  tab_other = false;
  tab_treatment = false;
  tab_complaints = false;
  tab_referals = false;

  constructor(
    private _claimService: ClaimService,
    private _systemService: SystemModuleService,
    private _route: ActivatedRoute
  ) {
    this._route.params.subscribe(param => {
      if (!!param.id) {
        this._getClaimsDetails(param.id);
      }
    });
  }

  ngOnInit() {
    console.log('Ran');
  }

  private _getClaimsDetails(id) {
    this._systemService.on();
    this._claimService.get(id, {}).then(res => {
      console.log(res);
      this._systemService.off();
      this.selectedClaim = res;
      this.tab_details = true;
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    });
  }

  tabDetails_click() {
    this.tab_details = true;
    this.tab_other = false;
    this.tab_treatment = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabOther_click() {
    this.tab_details = false;
    this.tab_other = true;
    this.tab_treatment = false;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabTreatment_click() {
    this.tab_details = false;
    this.tab_other = false;
    this.tab_treatment = true;
    this.tab_complaints = false;
    this.tab_referals = false;
  }
  tabComplaints_click() {
    this.tab_details = false;
    this.tab_other = false;
    this.tab_treatment = false;
    this.tab_complaints = true;
    this.tab_referals = false;
  }
  tabReferals_click() {
    this.tab_details = false;
    this.tab_other = false;
    this.tab_treatment = false;
    this.tab_complaints = false;
    this.tab_referals = true;
  }

}
