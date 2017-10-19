import { REQUEST_STATUS } from './../../../../services/globals/config';
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
  requestStatus = REQUEST_STATUS;

  selectedTransaction: any;
  reply = false;

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
  replyOk(selectedTransaction) {
    this.selectedTransaction = selectedTransaction;
    this.reply = true;
    console.log(this.reply)
  }
  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1.id === l2.id;
    }
    return false;
  }
  orderDocuments(documents) {
    return documents.sort(function (a, b) {
      return parseFloat(a.order) - parseFloat(b.order);
    });
  }

  isObject(doc) {
    return typeof (doc.clinicalDocumentation) === 'object';
  }
  approveClaim() {
    this.modalApprove = true;
  }
  rejectClaim(transaction) {
    this.selectedTransaction = transaction;
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
