import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ClaimService } from './../../../services/common/claim.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-claims',
  templateUrl: './list-claims.component.html',
  styleUrls: ['./list-claims.component.scss']
})
export class ListClaimsComponent implements OnInit {

  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();
  listOfClaims: any = <any>[];
  loading: boolean = true;
  user: any;

  constructor(private _claimService: ClaimService,
    private _locker: CoolLocalStorage,
    private _headerEventEmitter: HeaderEventEmitterService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Claim List');
    this._headerEventEmitter.setMinorRouteUrl('List of all claims');
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user._id);
    this._claimService.find({
      query: {
        providerFacilityId: this.user.facilityId._id
      }
    }).then((payload: any) => {

      payload.data.forEach(element => {
        for (var i = element.documentations.length - 1; i >= 0; i--) {
          if (element.documentations[i].response != undefined) {
            if (element.documentations[i].response.isReject == true) {
              element.status = "Reject";
            }
            else if (element.documentations[i].response.isQuery == true) {
              element.status = "Query";
            }
            else if (element.documentations[i].response.isHold == true) {
              element.status = "Hold";
            }
            else if (element.documentations[i].response.isApprove == true) {
              element.status = "Approved";
            }
            break;
          }
        }

      });
      this.loading = false;
      this.listOfClaims = payload.data;
      console.log(this.listOfClaims);
    });
  }

}
