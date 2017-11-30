import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName } from '../../../services/globals/config';
import { SystemModuleService, FacilityService, CapitationFeeService, PolicyService } from '../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-capitation-payment',
  templateUrl: './capitation-payment.component.html',
  styleUrls: ['./capitation-payment.component.scss']
})
export class CapitationPaymentComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();
  currentPlatform: any;
  capitations: any = <any>[];
  loading: boolean = true;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _systemService: SystemModuleService,
    private _facilityService: FacilityService,
    private _locker: CoolLocalStorage,
    private _capitationFeeService: CapitationFeeService,
    private _policyService: PolicyService
  ) {}

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Capitation Payment');
    this._headerEventEmitter.setMinorRouteUrl('Capitation list');

    this._route.params.subscribe(param => {
      console.log(param);
      if (!!param.id) {
        // this._getPolicy(param.id);
        this._getCurrentPlatform(param.id);
      }
    });
  }

  onCheckAllQueue(policy) {
    console.log(policy);
  }

  onCheckQueue(policy) {
    console.log(policy);
  }

  private _getPolicy(id) {
    this._policyService
      .find({
        query: {
          'platformOwnerId._id': this.currentPlatform._id,
          isActive: true,
          isPaid: true,
          'providerId._id': id
        }
      }).then((res: any) => {
        console.log(res);
        this.loading = false;
        this._systemService.off();
      })
      .catch(error => {
        console.log(error);
        this._systemService.off();
      });
  }

  // _getCurrentPlatform() {
  //   this._facilityService
  //     .find({ query: { shortName: CurrentPlaformShortName } })
  //     .then((res: any) => {
  //       if (res.data.length > 0) {
  //         console.log(res);
  //         this.currentPlatform = res.data[0];
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  private _getCurrentPlatform(providerId) {
    this._facilityService
      .find({
        query: {
          shortName: CurrentPlaformShortName,
          $select: ['name', 'shortName', 'address.state']
        }
      })
      .then((res: any) => {
        if (res.data.length > 0) {
          if (res.data.length > 0) {
            console.log(res);
            this.currentPlatform = res.data[0];
            this._getPolicy(providerId);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  navigate(url: string, id?: string) {
    if (!!id) {
      this._systemService.on();
      this._router
        .navigate([url + id])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
          console.log(err);
          this._systemService.off();
        });
    } else {
      this._systemService.on();
      this._router
        .navigate([url])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
          console.log(err);
          this._systemService.off();
        });
    }
  }
}
