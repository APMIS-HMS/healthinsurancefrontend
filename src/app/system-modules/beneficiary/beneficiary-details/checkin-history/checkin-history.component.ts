import { ActivatedRoute } from '@angular/router';
import { CheckInService } from './../../../../services/common/check-in.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkin-history',
  templateUrl: './checkin-history.component.html',
  styleUrls: ['./checkin-history.component.scss']
})
export class CheckinHistoryComponent implements OnInit {

  checkins:any[] = [];
  constructor(private _checkInService:CheckInService, private _route:ActivatedRoute) { }

  ngOnInit() {
    this._route.parent.params.subscribe(params => {
      this._getCheckIn(params.id);
    });
  }

  _getCheckIn(routeId){
    this._checkInService.find({query:{beneficiaryId:routeId}}).then((payload:any) =>{
      this.checkins = payload.data;
      console.log(this.checkins)
    })
  }
}
