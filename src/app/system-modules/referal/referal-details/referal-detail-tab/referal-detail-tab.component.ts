import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-referal-detail-tab',
  templateUrl: './referal-detail-tab.component.html',
  styleUrls: ['./referal-detail-tab.component.scss']
})
export class ReferalDetailTabComponent implements OnInit {

  modalApprove = false;
  modalReject = false;

  constructor() { }

  ngOnInit() {
  }

  approveReferal(){
    this.modalApprove = true;
  }
  rejectReferal(){
    this.modalReject = true;
  }
  modal_close(){
    this.modalApprove = false;
    this.modalReject = false;
  }
  holdClaim(){
    
  }

}
