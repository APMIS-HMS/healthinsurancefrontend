import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CoolLocalStorage} from 'angular2-cool-storage';
import * as differenceInYears from 'date-fns/difference_in_years';

import {environment} from '../../../../../environments/environment';
import {HeaderEventEmitterService} from '../../../../services/event-emitters/header-event-emitter.service';

import {ClaimService} from './../../../../services/common/claim.service';
import {FacilityService} from './../../../../services/common/facility.service';

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
  displayAge: number;
  isReply = false;
  isReject = false;
  isQuery = false;
  isHold = false;
  isApproved = false;
  status = '';
  statusCheck = false;
  isAuthCreateClaim = false;
  opProviderId = '';
  platformName: string;

  constructor(
      private _route: ActivatedRoute,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _locker: CoolLocalStorage, private _claimService: ClaimService,
      private _facilityService: FacilityService) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Claims Details');
    this._headerEventEmitter.setMinorRouteUrl(
        'Claims details reply and response page.');
    this.getAuthforClaimCreate();
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getSelectedClaimItem(param.id);
      }
    });
  }

  getAuthforClaimCreate() {
    var userUserType = (<any>this._locker.getObject('auth')).user;
    if (userUserType.userType.name == 'Health Insurance Agent') {
      this.isAuthCreateClaim = true;
    }
  }

  handleClaimUpdated(claim) {
    this.selectedClaim = claim;
    console.log(this.selectedClaim);
    this.selectedClaim.documentations.forEach(element => {
      if (element.response != undefined) {
        if (element.response.isReject == true) {
          this.status = 'Reject';
          this.isReject = true;
        } else if (element.response.isQuery == true) {
          this.isQuery = true;
          this.status = 'Query';
        } else if (element.response.isHold == true) {
          this.isHold = true;
          this.status = 'Hold';
        } else if (element.response.isApprove == true) {
          this.isApproved = true;
          this.status = 'Approved';
        }
      } else {
        this.status = 'Pending';
      }
    });
    this.selectedClaim = JSON.parse(JSON.stringify(this.selectedClaim));
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

  onReply() {
    if (this.selectedClaim
            .documentations[this.selectedClaim.documentations.length - 1]
            .response != undefined) {
      this.selectedClaim
          .documentations[this.selectedClaim.documentations.length - 1]
          .response.isReply = true;
      console.log(
          this.selectedClaim
              .documentations[this.selectedClaim.documentations.length - 1]
              .response);
    } else {
      this.selectedClaim
          .documentations[this.selectedClaim.documentations.length - 1]
          .response.isReply = true;
    }
  }


  _getSelectedClaimItem(id) {
    try {
      this._claimService.get(id, {}).then((payload: any) => {
        this.selectedClaim = payload;
        console.log(this.selectedClaim);
        this.selectedClaim.documentations.forEach(element => {
          if (element.response != undefined) {
            if (element.response.isReject == true) {
              this.status = 'Reject';
              this.isReject = true;
            } else if (element.response.isQuery == true) {
              this.isQuery = true;
              this.status = 'Query';
            } else if (element.response.isHold == true) {
              this.isHold = true;
              this.status = 'Hold';
            } else if (element.response.isApprove == true) {
              this.isApproved = true;
              this.status = 'Approved';
            }
          } else {
            this.status = 'Pending';
          }
        });

        if (this.selectedClaim.checkedinDetail.checkedInDetails
                .providerFacilityId == undefined) {
          this._facilityService
              .get(
                  this.selectedClaim.checkedinDetail.providerFacility.providerId
                      ._id,
                  {$select: ['provider.providerId']})
              .then((payload2: any) => {
                console.log(payload2);
                this.opProviderId = payload2.provider.providerId;
              })
        }
        console.log(new Date);
        this.displayAge = differenceInYears(
            new Date(),
            this.selectedClaim.checkedinDetail.checkedInDetails
                .beneficiaryObject.personId.dateOfBirth);
        console.log(this.displayAge);
      }, error => {});
    } catch (Exception) {
      window.location.reload();
    }
  }
}
