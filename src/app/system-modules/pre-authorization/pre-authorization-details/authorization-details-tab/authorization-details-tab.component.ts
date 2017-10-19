import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import differenceInYears from 'date-fns/difference_in_years';
@Component({
  selector: 'app-authorization-details-tab',
  templateUrl: './authorization-details-tab.component.html',
  styleUrls: ['./authorization-details-tab.component.scss']
})
export class AuthorizationDetailsTabComponent implements OnInit {

  @Input() selectedAuthorization: any;

  modalApprove = false;
  modalReject = false;
  modalHold = false;
  modalQuery = false;

  constructor() { }

  ngOnInit() {
    console.log(this.selectedAuthorization);
  }

  getAge() {
    return differenceInYears(
      new Date(),
      this.selectedAuthorization.checkedInDetails.beneficiaryObject.personId.dateOfBirth
    )
  }

  isObject(doc){
    return typeof(doc.clinicalDocumentation) === 'object';
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
