import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {environment} from '../../../../../environments/environment';

import {CheckInService} from './../../../../services/common/check-in.service';

@Component({
  selector: 'app-checkin-history',
  templateUrl: './checkin-history.component.html',
  styleUrls: ['./checkin-history.component.scss']
})
export class CheckinHistoryComponent implements OnInit {
  checkins: any[] = [];
  platformName: string;
  constructor(
      private _checkInService: CheckInService, private _route: ActivatedRoute) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this._route.parent.params.subscribe(params => {
      this._getCheckIn(params.id);
    });
  }

  _getCheckIn(routeId) {
    this._checkInService.find({query: {beneficiaryId: routeId}})
        .then((payload: any) => {
          this.checkins = payload.data;
        })
  }
}
