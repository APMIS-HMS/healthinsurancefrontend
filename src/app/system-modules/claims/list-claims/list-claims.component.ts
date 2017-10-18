import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  constructor(private _claimService: ClaimService, private _locker: CoolLocalStorage,private _route: ActivatedRoute,) { }

  ngOnInit() {
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        //this._getBeneficiaryDetails(param.id);
      }
    });
  }

 // _getDetails
}
