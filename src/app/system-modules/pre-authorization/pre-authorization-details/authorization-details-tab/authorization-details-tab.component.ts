import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authorization-details-tab',
  templateUrl: './authorization-details-tab.component.html',
  styleUrls: ['./authorization-details-tab.component.scss']
})
export class AuthorizationDetailsTabComponent implements OnInit {


  modalApprove = false;
  modalReject = false;
  modalHold = false;
  modalQuery = false;

  constructor() { }

  ngOnInit() {
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

}
