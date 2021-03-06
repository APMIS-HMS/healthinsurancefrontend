import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CoolLocalStorage} from 'angular2-cool-storage';

import {environment} from '../../../../../environments/environment';

import {ClaimService} from './../../../../services/common/claim.service';
import {SystemModuleService} from './../../../../services/common/system-module.service';

@Component({
  selector: 'app-claims-others-tab',
  templateUrl: './claims-others-tab.component.html',
  styleUrls: ['./claims-others-tab.component.scss']
})
export class ClaimsOthersTabComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();
  listOfClaims: any = <any>[];
  loading: boolean = true;
  user: any;
  platformName: any;

  constructor(
      private _claimService: ClaimService, private _locker: CoolLocalStorage,
      private _systemService: SystemModuleService,
      private _route: ActivatedRoute) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        if (this.user !== undefined && this.user.userType.name === 'Provider') {
          this._claimService
              .find({
                query: {
                  providerFacilityId: this.user.facilityId._id,
                  '_id': param.id
                },
                $sort: {createdAt: -1}
              })
              .then((payload: any) => {
                payload.data.forEach(element => {
                  for (let i = element.documentations.length - 1; i >= 0; i--) {
                    if (element.documentations[i].response != undefined) {
                      if (element.documentations[i].response.isReject == true) {
                        element.status = 'Reject';
                      } else if (
                          element.documentations[i].response.isQuery == true) {
                        element.status = 'Query';
                      } else if (
                          element.documentations[i].response.isHold == true) {
                        element.status = 'Hold';
                      } else if (
                          element.documentations[i].response.isApprove ==
                          true) {
                        element.status = 'Approved';
                      }
                      break;
                    } else {
                      element.status = 'Pending';
                    }
                  }
                });
                this.loading = false;
                console.log(param._id);
                this.listOfClaims = payload.data;
                console.log(this.listOfClaims);
              });
        }
        if (this.user !== undefined &&
            this.user.userType.name === 'Health Insurance Agent') {
          this._getClaims(param);
        }
      }
    });
  }
  private _getClaims(param) {
    this._systemService.on();
    this._claimService
        .find({
          query: {
            'checkedinDetail.checkedInDetails.policyObject.hiaId._id':
                this.user.facilityId._id,
            '_id': param.id,
            $sort: {dateClaimCreated: -1}
          }
        })
        .then((payload: any) => {
          payload.data.forEach(element => {
            for (let i = element.documentations.length - 1; i >= 0; i--) {
              if (element.documentations[i].response != undefined) {
                if (element.documentations[i].response.isReject == true) {
                  element.status = 'Reject';
                } else if (element.documentations[i].response.isQuery == true) {
                  element.status = 'Query';
                } else if (element.documentations[i].response.isHold == true) {
                  element.status = 'Hold';
                } else if (
                    element.documentations[i].response.isApprove == true) {
                  element.status = 'Approved';
                }
                break;
              } else {
                element.status = 'Pending';
              }
            }
          });
          this.loading = false;
          this.listOfClaims = payload.data;
          this._systemService.off();
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this._systemService.off();
        })
  }
}
