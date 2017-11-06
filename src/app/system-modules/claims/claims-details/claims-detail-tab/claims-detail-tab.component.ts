import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ClaimService } from './../../../../services/common/claim.service';
import differenceInYears from 'date-fns/difference_in_years';
import { HeaderEventEmitterService } from '../../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-claims-detail-tab',
  templateUrl: './claims-detail-tab.component.html',
  styleUrls: ['./claims-detail-tab.component.scss']
})
export class ClaimsDetailTabComponent implements OnInit {
  
  modalApprove = false;
  modalReject = false;
  modalHold = false;
  modalQuery = false;
  selectedClaim: any = <any>{};
  displayAge:number;
  isReply = false;


  constructor(private _route: ActivatedRoute,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _locker: CoolLocalStorage,
    private _claimService: ClaimService) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Claims Details');
    this._headerEventEmitter.setMinorRouteUrl('Claims details reply and response page.');
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getSelectedClaimItem(param.id);
      }
    });
  }

  approveClaim() {
    this.modalApprove = true;
  }
  rejectClaim() {
    this.modalReject = true;
  }
  holdClaim() {
    this.modalHold = true;
  }
  queryClaim() {
    this.modalQuery = true;
  }
  modal_close() {
    this.modalApprove = false;
    this.modalReject = false;
    this.modalQuery = false;
    this.modalHold = false;
  }

  onReply(){
    if(this.selectedClaim.documentations[this.selectedClaim.documentations.length -1].response != undefined){
      this.selectedClaim.documentations[this.selectedClaim.documentations.length -1].response.isReply = true;
      console.log(this.selectedClaim.documentations[this.selectedClaim.documentations.length -1].response);
    }else{
      this.selectedClaim.documentations[this.selectedClaim.documentations.length -1].response.isReply = true;
    }
  }

  
  _getSelectedClaimItem(id) {
    this._claimService.get(id, {}).then((payload: any) => {
      this.selectedClaim = payload;
      console.log(this.selectedClaim);
      this.displayAge = differenceInYears(new Date(), this.selectedClaim.checkedinDetail.checkedInDetails.personObject.dateOfBirth);
    });
  }

}
