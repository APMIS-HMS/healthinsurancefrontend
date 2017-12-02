import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { CurrentPlaformShortName, FLUTTERWAVE_PUBLIC_KEY } from '../../../services/globals/config';
import { SystemModuleService, FacilityService, CapitationFeeService, PolicyService } from '../../../services/index';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: "app-capitation-payment",
  templateUrl: "./capitation-payment.component.html",
  styleUrls: ["./capitation-payment.component.scss"]
})
export class CapitationPaymentComponent implements OnInit {
  listsearchControl = new FormControl();
  filterHiaControl = new FormControl("All");
  hospitalControl = new FormControl();
  planControl = new FormControl();
  flutterwaveClientKey: string = FLUTTERWAVE_PUBLIC_KEY;
  currentPlatform: any;
  capitations: any = <any>[];
  selectedCapitations: any = <any>[];
  loading: boolean = true;
  totalCost: number = 0;
  totalQuantity: number = 0;
  cBtnText: boolean = true;
  cBtnProcessing: boolean = false;
  cDisableBtn: boolean = false;
  user: any;
  refKey: string;

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
    this._headerEventEmitter.setRouteUrl("Capitation Payment");
    this._headerEventEmitter.setMinorRouteUrl("Capitation list");

    this.user = (<any>this._locker.getObject("auth")).user;
    console.log(this.user);

    this._route.params.subscribe(param => {
      console.log(param);
      if (!!param.id) {
        // this._getPolicy(param.id);
        this._getCurrentPlatform(param.id);
      }
    });

    this.refKey = (this.user ? this.user._id.substr(20) : '') + new Date().getTime();
  }

  onCheckAllQueue(isChecked) {
    console.log(isChecked);
    let counter = 0;
    this.capitations.forEach(policy => {
      counter++;
      policy.isChecked = isChecked;

      if (policy.isChecked) {
        this.totalQuantity++;
        this.totalCost += policy.premiumPackageId.amount;
        this.selectedCapitations.push(policy);
      } else {
        this.totalQuantity--;
        this.totalCost -= policy.premiumPackageId.amount;
      }
    });

    if (counter === this.capitations.length && !isChecked) {
      this.selectedCapitations = [];
    }

    // } else {
    //   // Remove from the selected Claim
    //   console.log(index);
    //   policy.isChecked = false;
    //   this.selectedOrganizationPolicies = this.selectedOrganizationPolicies.filter(x => x._id !== policy._id);
    // }
  }

  onCheckQueue(index, policy) {
    console.log(policy);
    if (policy.isChecked === undefined) {
      policy.isChecked = true;
      this.selectedCapitations.push(policy);
    } else if (!policy.isChecked) {
      console.log(policy.isChecked);

      let found: boolean = false;
      policy.isChecked = true;
      this.selectedCapitations = this.selectedCapitations.filter(
        x => x._id !== policy._id
      );
      // let cLength = this.selectedCapitations.length;

      // if (cLength > 0) {
      //   while (cLength--) {
      //     console.log(this.selectedCapitations[cLength]);
      //   }
      // } else {
      //   this.selectedCapitations.push(policy);
      // }
      // this.selectedCapitations.forEach(e => {
      //   if (e => e._id === policy._id) {
      //     found = true;
      //   } else {
      //     found = false;
      //   }
      // });

      // if (!found) {
      //   this.selectedCapitations.push(policy);
      // }
    } else {
      policy.isChecked = false;
      this.selectedCapitations = this.selectedCapitations.filter(
        x => x._id !== policy._id
      );
    }
    console.log(this.selectedCapitations);
  }

  onClickPayItemsSelected() {
    console.log("Ready to pay");
  }

  paymentDone() {
    console.log("Done");
  }

  paymentCancel() {
    console.log("cancelled");
  }

  private _getPolicy(id) {
    this._policyService
      .find({
        query: {
          "platformOwnerId._id": this.currentPlatform._id,
          isActive: true,
          isPaid: true,
          "providerId._id": id
        }
      })
      .then((res: any) => {
        console.log(res);
        this.loading = false;
        this._systemService.off();
        if (res.data.length > 0) {
          this._headerEventEmitter.setMinorRouteUrl(
            res.data[0].providerId.name
          );
          this.capitations = res.data;
        }
      })
      .catch(error => {
        console.log(error);
        this._systemService.off();
      });
  }

  private _getCurrentPlatform(providerId) {
    this._facilityService
      .find({
        query: {
          shortName: CurrentPlaformShortName,
          $select: ["name", "shortName", "address.state"]
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
