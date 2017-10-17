import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ClaimService } from './../../../../services/common/claim.service';

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


  constructor(private _route: ActivatedRoute,
    private _locker: CoolLocalStorage,
  private _claimService:ClaimService ) { }

  ngOnInit() {
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

  _getSelectedClaimItem(id){

  }

}
