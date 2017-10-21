import { PreAuthorizationDocument } from './../../../../models/authorization/authorization';
import { NewPreauthTabsComponent } from './../../pre-authorization-new/new-preauth-tabs/new-preauth-tabs.component';
import { REQUEST_STATUS } from './../../../../services/globals/config';
import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import differenceInYears from 'date-fns/difference_in_years';
@Component({
  selector: 'app-authorization-details-tab',
  templateUrl: './authorization-details-tab.component.html',
  styleUrls: ['./authorization-details-tab.component.scss']
})
export class AuthorizationDetailsTabComponent implements OnInit {
  @ViewChild('child')
  private child: NewPreauthTabsComponent;
  @Input() selectedAuthorization: any;

  modalApprove = false;
  modalReject = false;
  modalHold = false;
  modalQuery = false;
  requestStatus = REQUEST_STATUS;

  selectedTransaction: PreAuthorizationDocument;
  reply = false;
  lastI: number = 0;
  lastJ: number = 0;

  constructor() { }

  ngOnInit() { }

  getAge() {
    return differenceInYears(
      new Date(),
      this.selectedAuthorization.checkedInDetails.beneficiaryObject.personId.dateOfBirth
    )
  }
  replyOk(selectedTransaction) {
    this.selectedTransaction = selectedTransaction;
    console.log(this.selectedTransaction.document);
    this.reply = true;
  }
  sendReply() {
    this.child.send();
  }
  cancelReply() {
    this.reply = false;
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
  approveClaim(transaction) {
    this.selectedTransaction = transaction;
    this.modalApprove = true;
  }
  rejectClaim(transaction) {
    this.selectedTransaction = transaction;
    this.modalReject = true;
  }
  holdClaim(transaction) {
    this.selectedTransaction = transaction;
    this.modalHold = true;
  }
  queryClaim(transaction) {
    this.selectedTransaction = transaction;
    this.modalQuery = true;
  }
  save_authorization() {

  }
  isOdd(num) {
    return num % 2;
  }
  getCount(i: number, isSecond = false) {

    if (i === 0) {
      if (isSecond === false) {
        this.lastI = i + 1;
        let k = i + 1;
        return k;
      } else {
        this.lastJ = i + 2;
        return i + 2;
      }

    } else {
      if (isSecond === false) {
        this.lastI = i + 1;
        return this.lastI + i;
      } else {
        this.lastJ = this.lastJ + 2;
        return this.lastJ;
      }
    }

  }
  modal_close() {
    this.modalApprove = false;
    this.modalReject = false;
    this.modalQuery = false;
    this.modalHold = false;
  }

}
