import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { UserTypeService } from './../../../services/common/user-type.service';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
// import * from '../../../rxjs/rxjs.extentions';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-list-beneficiary',
  templateUrl: './list-beneficiary.component.html',
  styleUrls: ['./list-beneficiary.component.scss']
})
export class ListBeneficiaryComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  previousUrl: string = '';
  beneficiaries: any = <any>[];

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _userTypeService: UserTypeService
  ) {
    this._router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(e => {
      });
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Beneficiary List');
    this._headerEventEmitter.setMinorRouteUrl('All Beneficiaries');

    this._userTypeService.findAll().then(payload => {
        console.log(payload)
      })
  }


}
