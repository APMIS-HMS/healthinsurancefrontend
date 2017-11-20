import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName, TABLE_LIMIT_PER_VIEW } from './../../../services/globals/config';
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
  isPlatformOwner: boolean;
  currentPlatform: any;
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
  user: any;
  index:any = 0;
  totalData:any;
  showLoadMore:any = true;
  limit:number = TABLE_LIMIT_PER_VIEW;
  resetData:Boolean;

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _industryService: IndustryService,
    private _locker: CoolLocalStorage
  ) { }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._headerEventEmitter.setRouteUrl('Organisation List');
    this._headerEventEmitter.setMinorRouteUrl('All Organisations');
    this._getUserTypes();
    this._getIndustries();

    // this.filterTypeControl.valueChanges.subscribe(payload => {
    //   if (payload != undefined) {
    //     this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: this.limit } }).then((payload1: any) => {
    //       this.employers = payload1.data.filter(function (item) {
    //         return (item.employer.industry.name.toLowerCase().includes(payload.toLowerCase()))
    //       });
    //     });

    //     if (payload == "All") {
    //       this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: this.limit } }).then((payload2: any) => {
    //         this.employers = payload2.data;
    //       });
    //     }
    //   }
    // })
    this.filterTypeControl.valueChanges
      .distinctUntilChanged()
      .debounceTime(200)
      .switchMap((term) => Observable.fromPromise(
        this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: this.limit } }))).subscribe((payload1: any) => {
          this.employers = payload1.data.filter(function (item) {
            return (item.employer.industry.name.toLowerCase().includes(payload1.toLowerCase()))
          });
        });




    this.listsearchControl.valueChanges
      .distinctUntilChanged()
      .debounceTime(200)
      .switchMap((term) => Observable.fromPromise(
        this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: this.limit } })))
      .subscribe((payload: any) => {
        var strVal = this.listsearchControl.value;
        this.employers = payload.data.filter(function (item) {
          console.log(item);
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

  ngAfterViewInit(){
    
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
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, isTokenVerified: item, $limit: this.limit } }).then((payload: any) => {
      this.employers = payload.data;
    });
    if (item == "All") {
      this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: this.limit } }).then((payload2: any) => {
        this.employers = payload2.data;
      });
    }
  }


  private _getAllPolicies(query) {
    
    this._facilityService.find(query).then((res: any) => {
      this.loading = false;
      console.log(res.total);
      this.totalData = res.total;
      if (res.data.length > 0) {
        //this.employers = res.data;
        if(this.resetData !== true) { 
          this.employers.push(...res.data); 
        }else{ 
          this.resetData = false;
          this.employers = res.data 
        }
        this.local_employers = this.employers;
      }
      if(this.employers.length >= this.totalData){
        this.showLoadMore = false;
      }
      console.log(this.showLoadMore, this.totalData, this.employers.length);
    }).catch(err => console.log(err));

  }

  private _getEmployers() {
    if (this.user !== undefined && this.user.userType.name === 'Platform Owner') {
      this.isPlatformOwner = true;
      let query = { query: { 'platformOwnerId._id': this.currentPlatform._id, $limit: this.limit, $skip: this.index*this.limit ,'facilityType._id': this.selectedUserType._id, } };
      this._getAllPolicies(query)
    } else if (this.user !== undefined && this.user.userType.name === 'Health Insurance Agent') {
      console.log('agent');
      let query = 
        {
          query:
          {
            'facilityType._id': this.selectedUserType._id, 'platformOwnerId._id': this.currentPlatform._id,
            'employer.hias._id': this.user.facilityId._id, $limit: this.limit, $skip: this.index*this.limit 
          }
        };
        this._getAllPolicies(query);

        this.index++; 
    }
  }

  private _getCurrentPlatform() {
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
      }
    }).catch(err => console.log(err));
  }

  private _getUserTypes() {
    this._systemService.on();

    let userType$ = Observable.fromPromise(this._userTypeService.find({}));
    let platform$ = Observable.fromPromise(this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }));

    Observable.forkJoin([userType$, platform$]).subscribe((results: any) => {
      this._systemService.off();
      this.currentPlatform = results[1].data[0];
      if (results[0].data.length > 0) {
        const index = results[0].data.findIndex(x => x.name === 'Employer');
        if (index > -1) {
          this.selectedUserType = results[0].data[index];
          console.log(this.selectedUserType);
          this._getEmployers();
        } else {
          this.selectedUserType = undefined;
        }
      }
    });

    // this._userTypeService.find({}).then((payload: any) => {
    //   this._systemService.off();
    //   console.log(payload);

    // }, error => {
    //   this._systemService.off();
    // });
  }

  loadMore(){
    this._getEmployers();   

  }

  reset(){
    this.index = 0;
    this.resetData = true;
    this._getEmployers();
    this.showLoadMore = true;
  }

  navigateToDetails(id: string) {
    this._systemService.on();
    console.log(id);
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
