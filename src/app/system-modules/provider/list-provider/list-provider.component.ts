import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/filter';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import {
  SystemModuleService, UserTypeService, FacilityService, FacilityCategoryService
} from './../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-list-provider',
  templateUrl: './list-provider.component.html',
  styleUrls: ['./list-provider.component.scss']
})
export class ListProviderComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');
  providers: any = <any>[];
  categories: any = <any>[];
  loading: boolean = true;
  selectedUserType: any = <any>{};
  limit:number = 2;
  index:number = 0;
  totalEntries:number;
  showLoadMore:Boolean = true;

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _userTypeService: UserTypeService,
    private _facilityCategoryService: FacilityCategoryService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Provider List');
    this._headerEventEmitter.setMinorRouteUrl('All providers');
    this._getUserTypes();
    this._getFacilityCategories();
    this.filterTypeControl.valueChanges.subscribe(payload => {
      this._systemService.on();
      if (payload != undefined) {
       
        this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: this.limit, $skip: this.index*this.limit } }).then((payload1: any) => {
          this.providers = payload1.data.filter(function (item) {
            return (item.provider.facilityType.name.toLowerCase().includes(payload.toLowerCase()))
          })
        });
        
        if (payload === "All") {
          this._systemService.on();
          this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: this.limit, $skip: this.index*this.limit } }).then((payload2: any) => {
            this.providers = payload2.data;
          });
        }
      }
      this._systemService.off();
    })

    this.listsearchControl.valueChanges
      .distinctUntilChanged()
      .debounceTime(200)
      .switchMap((term) => Observable.fromPromise(
        this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: this.limit, $skip: this.index*this.limit } })))
      .subscribe((payload: any) => {
        console.log(this.listsearchControl.value);
        var strVal = this.listsearchControl.value;
        console.log(payload.data);
        this.providers = payload.data.filter(function (item) {
          try {
            return (item.name.toLowerCase().includes(strVal.toLowerCase())
              || item.email.toLowerCase().includes(strVal.toLowerCase())
              || item.provider.facilityType.name.toLowerCase().includes(strVal.toLowerCase())
              || item.provider.facilityClass.toLowerCase().includes(strVal.toLowerCase())
              || item.businessContact.lastName.toLowerCase().includes(strVal.toLowerCase())
              || item.provider.facilityType.name.toLowerCase().includes(strVal.toLowerCase())
              || item.businessContact.phoneNumber.includes(strVal.toLowerCase()))
          } catch (Exception) {
            return
          }

        })
      });
  }

  private _getFacilityCategories() {
    this._facilityCategoryService.find({}).then((payload: any) => {
      this.categories = payload.data;
    })
  }

  private _getProviders() {
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: this.limit, $skip: this.index*this.limit } }).then((res: any) => {
      this.loading = false;
      console.log(res);
      if (res.data.length > 0) {
        this.providers.push(...res.data);
        this.totalEntries = res.total;
        if(this.providers.length >= this.totalEntries){
          this.showLoadMore = false;
        }

      }
    }).catch(err => console.log(err));

    this.index++;
  }

  onSelectedStatus(item) {
    console.log(item);
    this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id,isTokenVerified:item, $limit: this.limit, $skip: this.index*this.limit } }).then((payload: any) => {
      this.providers = payload.data;
    });
    if(item=="All"){
      this._facilityService.find({ query: { 'facilityType._id': this.selectedUserType._id, $limit: this.limit, $skip: this.index*this.limit } }).then((payload: any) => {
        this.providers = payload.data;
      });
    }
  }

  private _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then((payload: any) => {
      this._systemService.off();
      console.log(payload);
      if (payload.data.length > 0) {
        const index = payload.data.findIndex(x => x.name === 'Provider');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
          console.log(this.selectedUserType);
          this._getProviders();
        } else {
          this.selectedUserType = undefined;
        }
      }
    }, error => {
      this._systemService.off();
    });
  
  }

  navigateNewProvider() {
   this._systemService.on()
    this._router.navigate(['/modules/provider/new']).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  navigateToDetails(id: string) {
   this._systemService.on()
    this._router.navigate(['/modules/provider/providers/' + id]).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  loadMore(){
    this._getUserTypes();

    console.log(this.providers);
  }

}
