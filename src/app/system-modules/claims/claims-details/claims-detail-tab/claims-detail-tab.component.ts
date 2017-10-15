import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  approveClaim(){
    this.modalApprove = true;
  }
  rejectClaim(){
    this.modalReject = true;
  }
  holdClaim(){
    this.modalHold = true;
  }
  queryClaim(){
    this.modalQuery = true;
  }
  modal_close(){
    this.modalApprove = false;
    this.modalReject = false;
    this.modalQuery = false;
    this.modalHold = false;
  }

}
