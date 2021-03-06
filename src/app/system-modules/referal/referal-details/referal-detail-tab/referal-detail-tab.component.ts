import {Component, Input, OnInit} from '@angular/core';
import {CoolLocalStorage} from 'angular2-cool-storage';
import * as differenceInYears from 'date-fns/difference_in_years';

import {environment} from '../../../../../environments/environment';

import {PreAuthorizationDocument} from './../../../../models/authorization/authorization';
import {ReferralAuthorization} from './../../../../models/referral/referral';
import {SystemModuleService} from './../../../../services/common/system-module.service';
import {REQUEST_STATUS} from './../../../../services/globals/config';
import {ReferralService} from './../../../../services/referral/referral.service';

@Component({
  selector: 'app-referal-detail-tab',
  templateUrl: './referal-detail-tab.component.html',
  styleUrls: ['./referal-detail-tab.component.scss']
})
export class ReferalDetailTabComponent implements OnInit {
  // @ViewChild('child')
  // private child: NewPreauthTabsComponent;
  @Input() selectedAuthorization: ReferralAuthorization;

  modalApprove = false;
  modalReject = false;

  reply = false;
  lastI: number = 0;
  lastJ: number = 0;

  disableReject = true;
  disableApprove = true;

  user: any;
  selectedTransaction: PreAuthorizationDocument;
  requestStatus = REQUEST_STATUS;
  platformName: any;

  constructor(
      private _referralService: ReferralService,
      private _systemService: SystemModuleService,
      private _locker: CoolLocalStorage) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
  }
  _getAuthorizationDetails(id) {
    this._systemService.on();
    this._referralService.get(id, {})
        .then((payload: any) => {
          this._systemService.off();
          this.selectedAuthorization = payload;
          console.log(payload)
        })
        .catch(err => {
          this._systemService.off();
        })
  }
  getAge() {
    return differenceInYears(
        new Date(),
        this.selectedAuthorization.checkedInDetails.beneficiaryObject.personId
            .dateOfBirth);
  }
  approveReferal(transaction) {
    this.modalApprove = true;
    this.selectedTransaction = JSON.parse(JSON.stringify(transaction));
  }
  rejectReferal(transaction) {
    this.modalReject = true;
    this.selectedTransaction = JSON.parse(JSON.stringify(transaction));
  }
  getDestinationApprovalStatus() {
    if (this.selectedAuthorization !== undefined) {
      if (this.selectedAuthorization.documentation.length > 0) {
        let documentations = this.selectedAuthorization.documentation;
        // const index = documentations.findIndex(x =>x.destinationProvider._id
        // === this.user.facilityId._id);
        // (this.selectedAuthorization.documentation.filter(x =>
        // x.destinationProvider._id === this.user.facilityId._id))
        let doc =
            this.selectedAuthorization.documentation[documentations.length - 1];
        if (doc !== undefined) {
          return doc.approvedStatus.past;
        }
      } else {
        return 'Pending';
      }
    } else {
      return 'Pending';
    }
  }
  // isAmongDestinationProviders(transaction) {
  //   return (this.selectedAuthorization.documentation.filter(x =>
  //   x.destinationProvider._id === this.user.facilityId._id)).length > 0
  // }
  modal_close() {
    this.modalApprove = false;
    this.modalReject = false;
  }

  disableAll() {
    this.disableReject = true;
    this.disableApprove = true;
  }
  checkVisibility(transaction) {
    if (this.user.userType.name === 'Health Insurance Agent' &&
        this.selectedAuthorization !== undefined &&
        this.selectedAuthorization.hiaApproved !== undefined) {
      if (this.selectedAuthorization.hiaApproved.approvedStatus.id === 2) {
        return false;
      } else {
        return true;
      }

    } else if (
        this.user.userType.name === 'Provider' &&
        this.selectedAuthorization !== undefined) {
      if (this.user.facilityId._id ===
          this.selectedAuthorization.referingProvider._id) {
        return false;
      } else if (
          this.user.facilityId._id ===
          this.selectedAuthorization.destinationProvider._id) {
        if (transaction.response !== undefined) {
          return false;
        } else {
          return true;
        }

      } else if (this.isAmongDestinationProviders(transaction)) {
        if (transaction.response !== undefined) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }

    } else {
      return true;
    }
  }
  isAmongDestinationProviders(transaction) {
    return (this.selectedAuthorization.documentation.filter(
                x => x.destinationProvider._id === this.user.facilityId._id))
               .length > 0
  }
  canReply(transaction) {
    let hiaStatus =
        (this.selectedAuthorization.hiaApproved !== undefined &&
         this.selectedAuthorization.hiaApproved.approvedStatus.id === 3) ?
        false :
        true
    let providerStatus =
        transaction.response.approvedStatus.id === 3 ? false : true;
    if ((!hiaStatus || !providerStatus) &&
        this.user.facilityId._id ===
            this.selectedAuthorization.referingProvider._id &&
        !this.reply) {
      return true;
    }
    return false;
  }
  validateResponse(doc, cliDoc, transaction: PreAuthorizationDocument) {
    this.disableAll();
    let validDocs = transaction.document.filter(
        x => x.order === 4 || x.order === 5 || x.order === 6);
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
    }
    if (hasDecided === false) {
      // if (rejectedDocs.length > 0 || queriedDocs.length > 0 ||
      // approvedDocs.length > 0 || heldDocs.length > 0) {
      //   this.disableQuery = false;
      // }
    }
  }
  replyOk(selectedTransaction) {
    this.selectedTransaction = JSON.parse(JSON.stringify(selectedTransaction));
    this.reply = true;
  }
  sendReply() {
    // this.child.send();
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
  cancel() {
    this.disableAll();
    this._getAuthorizationDetails(this.selectedAuthorization._id);
  }
  orderDocuments(documents) {
    return documents.sort(function(a, b) {
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

  save_authorization() {}

  holdClaim() {}

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
}
