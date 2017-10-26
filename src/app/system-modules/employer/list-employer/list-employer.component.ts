import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/filter';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import {
  SystemModuleService, UserTypeService, FacilityService, IndustryService
} from './../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-employer',
  templateUrl: './list-employer.component.html',
  styleUrls: ['./list-employer.component.scss']
})
export class ListEmployerComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  employers: any = <any>[];
  local_employers: any = <any>[];
  industries: any = <any>[];
  loading: Boolean = true;
  planTypes: any[] = [];
  selectedUserType: any = <any>{};

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _industryService: IndustryService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Organisation List');
    this._headerEventEmitter.setMinorRouteUrl('All Organisations');

    this._getUserTypes();
    this._getIndustries();

    // this.filterTypeControl.valueChanges.subscribe(payload => {
    //   if (payload != undefined) {
    //     this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((payload1: any) => {
    //       this.employers = payload1.data.filter(function (item) {
    //         return (item.employer.industry.name.toLowerCase().includes(payload.toLowerCase()))
    //       });
    //     });

    //     if (payload == "All") {
    //       this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((payload2: any) => {
    //         this.employers = payload2.data;
    //       });
    //     }
    //   }
    // })
    this.filterTypeControl.valueChanges
    .distinctUntilChanged()
    .debounceTime(200)
    .switchMap((term) => Observable.fromPromise(
      this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }))).subscribe((payload1: any) => {
        this.employers = payload1.data.filter(function (item) {
          return (item.employer.industry.name.toLowerCase().includes(payload1.toLowerCase()))
        });
      });




    this.listsearchControl.valueChanges
      .distinctUntilChanged()
      .debounceTime(200)
      .switchMap((term) => Observable.fromPromise(
        this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } })))
      .subscribe((payload: any) => {
        var strVal = this.listsearchControl.value;
        this.employers = payload.data.filter(function (item) {
          return (item.name.toLowerCase().includes(strVal.toLowerCase())
            || item.email.toLowerCase().includes(strVal.toLowerCase())
            || item.employer.industry.name.toLowerCase().includes(strVal.toLowerCase())
            || item.employer.cacNumber.toLowerCase().includes(strVal.toLowerCase())
            || item.employer.cin.toLowerCase().includes(strVal.toLowerCase())
            || item.businessContact.lastName.toLowerCase().includes(strVal.toLowerCase())
            || item.businessContact.firstName.toLowerCase().includes(strVal.toLowerCase())
            || item.businessContact.phoneNumber.includes(strVal.toLowerCase()))
        })
      });
  }

  onClickEdit(employer) {
    console.log(employer);
  }

  _getIndustries() {
    this._industryService.find({}).then((res: any) => {
      if (res.data.length > 0) {
        this.industries = res.data;
      }
    }).catch(err => console.log(err));
  }

  onSelectedIndustry(item) {
    console.log(item.name);
  }

  onSelectedStatus(item: any) {
    this.employers = this.local_employers;
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, isTokenVerified: item, $limit: 200 } }).then((payload: any) => {
      this.employers = payload.data;
    });
    if (item == "All") {
      this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((payload2: any) => {
        this.employers = payload2.data;
      });
    }
  }

  private _getEmployers() {
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: 200 } }).then((res: any) => {
      this.loading = false;
      console.log(res);
      if (res.data.length > 0) {
        this.employers = res.data;
        this.local_employers = this.employers;
      }
    }).catch(err => console.log(err));
  }

  private _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then((payload: any) => {
      this._systemService.off();
      console.log(payload);
      if (payload.data.length > 0) {
        const index = payload.data.findIndex(x => x.name === 'Employer');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
          console.log(this.selectedUserType);
          this._getEmployers();
        } else {
          this.selectedUserType = undefined;
        }
      }
    }, error => {
      this._systemService.off();
    });
  }

  navigateToDetails(id: string) {
   this._systemService.on()
    console.log(id)
    this._router.navigate(['/modules/employer/employers/' + id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    });
  }

  navigateNewEmployer() {
   this._systemService.on()
    this._router.navigate(['/modules/employer/new']).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }
}
