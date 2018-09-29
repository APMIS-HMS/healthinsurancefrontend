import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { CoolLocalStorage } from "angular2-cool-storage";
import { ToastsManager } from "ng2-toastr";
import { Observable } from "rxjs/Observable";

import { environment } from "../../../../environments/environment";
import { HeaderEventEmitterService } from "../../../services/event-emitters/header-event-emitter.service";

import {
  Address,
  BankDetail,
  Contact,
  Employer,
  Facility
} from "./../../../models/index";
import { UploadService } from "./../../../services/common/upload.service";
import {
  BeneficiaryService,
  FacilityService,
  SystemModuleService
} from "./../../../services/index";
import { PolicyService } from "./../../../services/policy/policy.service";

@Component({
  selector: "app-new-checkin",
  templateUrl: "./new-checkin.component.html",
  styleUrls: ["./new-checkin.component.scss"]
})
export class NewCheckinComponent implements OnInit {
  currentPlatform: any;
  user: any;
  loading = false;
  listsearchControl = new FormControl();
  beneficiaries: any[] = [];
  platformName: any;

  constructor(
    private _router: Router,
    private _locker: CoolLocalStorage,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private _beneficiaryService: BeneficiaryService,
    private _policyService: PolicyService,
    private _uploadService: UploadService,
    private _toast: ToastsManager
  ) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl("New Check In");
    this._headerEventEmitter.setMinorRouteUrl(
      "Create new check in beneficiary"
    );

    this.listsearchControl.valueChanges
      .debounceTime(350)
      .distinctUntilChanged()
      .subscribe(
        value => {
          this.loading = true;
          this._getBeneficiariesFromPolicy(this.currentPlatform._id, value);
        },
        error => {
          this._systemService.off();
          console.log(error);
        }
      );

    this._getCurrentPlatform();
  }

  _searchBeneficiary(value) {
    this._beneficiaryService
      .find({
        query: {
          $or: [
            { platformOwnerNumber: { $regex: value, $options: "i" } },
            { "personId.lastName": { $regex: value, $options: "i" } },
            { "personId.firstName": { $regex: value, $options: "i" } }
          ]
        }
      })
      .then((payload: any) => {
        this.beneficiaries = payload.data;
        this._systemService.off();
      })
      .catch(err => {
        console.log(err);
        this._systemService.off();
      });
  }

  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService
      .find({ query: { shortName: this.platformName } })
      .then((res: any) => {
        if (res.data.length > 0) {
          this.currentPlatform = res.data[0];
        }
        this._systemService.off();
      })
      .catch(err => {
        this._systemService.off();
      });
  }

  _getBeneficiariesFromPolicy(platformId, search) {
    if (search.length > 2) {
      const query = {
        platformOwnerId: this.currentPlatform._id,
        search: search
      };
      this._policyService
        .searchPolicy(query)
        .then((payload: any) => {
          this.loading = false;
          console.log(payload);
          this.beneficiaries = [];
          if (payload.data.length > 0) {
            payload.data.forEach(policy => {
              let principal = policy.principalBeneficiary;
              principal.isPrincipal = true;
              principal.hia = policy.hiaId;
              principal.policyId = policy._id;
              principal.policy = policy;
              principal.isActive = policy.isActive;
              principal.dependantCount = policy.dependantBeneficiaries.length;
              this.beneficiaries.push(principal);
              policy.dependantBeneficiaries.forEach(innerPolicy => {
                innerPolicy.beneficiary.person =
                  innerPolicy.beneficiary.personId;
                innerPolicy.beneficiary.policyId = policy._id;
                innerPolicy.beneficiary.policy = policy;
                innerPolicy.beneficiary.isPrincipal = false;
                innerPolicy.beneficiary.hia = policy.hiaId;
                innerPolicy.beneficiary.isActive = policy.isActive;
                this.beneficiaries.push(innerPolicy.beneficiary);
              });
            });
            console.log(this.beneficiaries);
            this._systemService.off();
          } else {
            this._systemService.off();
          }
        })
        .catch(err => {});
    } else {
      this.beneficiaries = [];
      this._systemService.off();
    }

    // if (search.length > 2) {
    //   this._systemService.on();
    //   this._policyService.find({
    //     query: {
    //       $and: [
    //         { 'platformOwnerId._id': platformId },
    //         {
    //           $or: [
    //             { 'principalBeneficiary.personId.lastName': { $regex: search,
    //             '$options': 'i' } }, {
    //             'principalBeneficiary.personId.firstName': { $regex: search,
    //             '$options': 'i' } }, {
    //             'dependantBeneficiaries.beneficiary.personId.firstName': {
    //             $regex: search, '$options': 'i' } }, {
    //             'dependantBeneficiaries.beneficiary.personId.lastName': {
    //             $regex: search, '$options': 'i' } }
    //           ]
    //         }
    //       ]
    //     }
    //   }).then((res: any) => {
    //     this.beneficiaries = [];
    //     if (res.data.length > 0) {
    //       res.data.forEach(policy => {
    //         console.log(policy._id);
    //         let principal = policy.principalBeneficiary;
    //         principal.isPrincipal = true;
    //         principal.hia = policy.hiaId;
    //         principal.policyId = policy._id;
    //         principal.isActive = policy.isActive;
    //         principal.dependantCount = policy.dependantBeneficiaries.length;
    //         this.beneficiaries.push(principal);
    //         policy.dependantBeneficiaries.forEach(innerPolicy => {
    //           innerPolicy.beneficiary.person =
    //           innerPolicy.beneficiary.personId;
    //           innerPolicy.beneficiary.policyId = policy._id;
    //           innerPolicy.beneficiary.isPrincipal = false;
    //           innerPolicy.beneficiary.hia = policy.hiaId;
    //           innerPolicy.beneficiary.isActive = policy.isActive;
    //           this.beneficiaries.push(innerPolicy.beneficiary);
    //         })
    //       })
    //       console.log(this.beneficiaries);
    //       this._systemService.off();
    //     } else {
    //       this._systemService.off();
    //     }
    //     this._systemService.off();
    //   }).catch(err => {
    //     this._systemService.off();
    //     console.log(err);
    //   });
    // } else {
    //   this.beneficiaries = [];
    //   this._systemService.off();
    // }
  }

  routeBeneficiaryDetails(beneficiary) {
    if (!beneficiary.policy.isPaid || !beneficiary.policy.isActive) {
      this._toast.info(
        "Premium payment not yet paid or policy not actived, contact your Health Insurance Agent",
        "Info"
      );
    } else {
      this._locker.setObject("policyID", beneficiary.policyId);
      this._systemService.on();
      this._router
        .navigate([
          "/modules/beneficiary/beneficiaries/" +
            beneficiary._id +
            "/checkin-generate"
        ])
        .then(payload => {
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
    }
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
          this._systemService.off();
        });
    }
  }
}
