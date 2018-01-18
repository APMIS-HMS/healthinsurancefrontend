import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { CheckIn } from './../../../models/check-in/check-in';
import { TABLE_LIMIT_PER_VIEW } from './../../../services/globals/config';
import { UploadService } from './../../../services/common/upload.service';
import { CheckInService } from './../../../services/common/check-in.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { LoadingBarService } from '@ngx-loading-bar/core';
import * as differenceInYears from 'date-fns/difference_in_years';

@Component({
  selector: 'app-checkedin',
  templateUrl: './checkedin.component.html',
  styleUrls: ['./checkedin.component.scss']
})
export class CheckedinComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.checkInSubscription.unsubscribe();
  }

  listsearchControl = new FormControl();
  filterTypeControl = new FormControl();
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl();

  checkedIns: CheckIn[] = [];
  loading: boolean = false;
  user: any;
  checkInSubscription:Subscription;
  totalEntries:number;
  showLoadMore:any = true;
  limit:number = TABLE_LIMIT_PER_VIEW;
  resetData:Boolean;
  index:number = 0;

  constructor(
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _checkInService: CheckInService,
    private _uploadService: UploadService,
    private _locker: CoolLocalStorage,
    private _router: Router
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Check In');
    this._headerEventEmitter.setMinorRouteUrl('Check In Beneficiaries');
    this.user = (<any>this._locker.getObject('auth')).user;
    this._getCheckedIn(); 

    this.checkInSubscription = this._checkInService.listner.subscribe(payload =>{
      console.log(payload);
    })
  }

  _getCheckedIn() {
    this._systemService.on();
    this._checkInService.find({
      query: {
        'providerFacilityId._id': this.user.facilityId._id,
        'isCheckedOut': false,
        $limit: this.limit,
        $skip: this.index*this.limit,
        // $client: {
        //   checkedInToday: true
        // },
        $sort: { createdAt: -1 }
      }
    }).then((payload: any) => {
      this.loading = false;
      //this.checkedIns = payload.data;
      this.totalEntries = payload.total;
      if(this.resetData !== true) { 
        this.checkedIns.push(...payload.data) 
      }else{ 
        this.resetData = false;
        this.checkedIns = payload.data 
      }
      if(this.checkedIns.length >= this.totalEntries){
        this.showLoadMore = false;
      }
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }

  // routeBeneficiary(check){
  //   this._systemService.on();
  //   this._router.navigate(['/modules/beneficiary/beneficiaries',check.beneficiaryId]).then(payload =>{
  //     this._systemService.off();
  //   }).catch(err =>{
  //     this._systemService.off();
  //   })
  // }


  routeBeneficiaryDetails(check) {
    console.log(check)
    if(check.otp.isVerified){
      this._systemService.on();
      this._router.navigate(['/modules/beneficiary/beneficiaries/' + check.beneficiaryId + '/checkin'])
        .then(payload => {
          this._systemService.off();
        }).catch(err => {
          console.log(err)
          this._systemService.off();
        });
    }else{
      this._systemService.on();
      this._router.navigate(['/modules/beneficiary/beneficiaries/' + check.beneficiaryId + '/checkin-generate'])
        .then(payload => {
          this._systemService.off();
        }).catch(err => {
          console.log(err)
          this._systemService.off();
        });
    }
  }

  navigate(url: string, id?: string) {
    if (!!id) {
      this._systemService.on()
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._systemService.on()
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }


  loadMore(){
    this._getCheckedIn();
  }

  reset(){
    this.index = 0;
    this.resetData = true;
    this._getCheckedIn();
    this.showLoadMore = true;
  }

}
