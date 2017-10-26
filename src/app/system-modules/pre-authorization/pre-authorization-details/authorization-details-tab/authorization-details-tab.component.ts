import { SystemModuleService } from './../../../../services/common/system-module.service';
import { PreAuthorizationService } from './../../../../services/pre-authorization/pre-authorization.service';
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

  disableReject = true;
  disableHold = true;
  disableQuery = true;
  disableApprove = true;

  selectedTransaction: PreAuthorizationDocument;
  reply = false;
  lastI: number = 0;
  lastJ: number = 0;

  
  constructor(private _preAuthorizationService: PreAuthorizationService,
    private _systemService: SystemModuleService) { }

  ngOnInit() {
    console.log(this.selectedAuthorization)
   }

  _getAuthorizationDetails(id) {
    this._systemService.on();
    this._preAuthorizationService.get(id, {}).then(payload => {
      this._systemService.off();
      this.selectedAuthorization = payload;  
    }).catch(err => {
      this._systemService.off();
    })
  }

  getAge() {
    return differenceInYears(
      new Date(),
      this.selectedAuthorization.checkedInDetails.beneficiaryObject.personId.dateOfBirth
    )
  }
  disableAll() {
    this.disableReject = true;
    this.disableHold = true;
    this.disableQuery = true;
    this.disableApprove = true;
  }
  validateResponse(doc, cliDoc, transaction: PreAuthorizationDocument) {
    this.disableAll();
    let validDocs = transaction.document.filter(x => x.order === 4 || x.order === 5 || x.order === 6);
    let pendingDocs: any[] = [];
    let approvedDocs: any[] = [];
    let rejectedDocs: any[] = [];
    let queriedDocs: any[] = [];
    let heldDocs: any[] = [];

    let counter = 0;
    validDocs.forEach(doc => {
      doc.clinicalDocumentation.forEach(cliDoc => {
        counter = counter + 1;
        if (cliDoc.approvedStatus.id === 1) {
          pendingDocs.push(cliDoc);
        } else if (cliDoc.approvedStatus.id === 2) {
          approvedDocs.push(cliDoc);
        } else if (cliDoc.approvedStatus.id === 3) {
          rejectedDocs.push(cliDoc);
        } else if (cliDoc.approvedStatus.id === 4) {
          queriedDocs.push(cliDoc);
        } else if (cliDoc.approvedStatus.id === 5) {
          heldDocs.push(cliDoc);
        }
      });
    });
    let hasDecided = false;
    if (approvedDocs.length === counter) {
      this.disableApprove = false;
      hasDecided = true;
    } else if (rejectedDocs.length === counter) {
      this.disableReject = false;
      hasDecided = true;
    } else if (queriedDocs.length === counter) {
      this.disableQuery = false;
      hasDecided = true;
    } else if (heldDocs.length === counter) {
      this.disableHold = false;
      hasDecided = true;
    }
    if (hasDecided === false) {

      if (rejectedDocs.length > 0 || queriedDocs.length > 0 || approvedDocs.length > 0 || heldDocs.length > 0) {
        this.disableQuery = false;
      }
    }
  }
  replyOk(selectedTransaction) {
    this.selectedTransaction = JSON.parse(JSON.stringify(selectedTransaction));
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
  cancel(){
    this.disableAll();
    this._getAuthorizationDetails(this.selectedAuthorization._id);
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
