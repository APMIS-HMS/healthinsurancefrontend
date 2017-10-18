import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ClaimService } from './../../../services/common/claim.service';

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
  user: any;

  constructor(private _claimService: ClaimService, private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._claimService.find({
      query: {
        providerFacilityId: this.user.facilityId._id
      }
    }).then((payload: any) => {
      this.listOfClaims = payload.data;
      console.log(this.listOfClaims);
    });
  }

}
