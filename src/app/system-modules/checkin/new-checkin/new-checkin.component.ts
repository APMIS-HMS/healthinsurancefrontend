import { ToastsManager } from 'ng2-toastr';
import { CurrentPlaformShortName } from './../../../services/globals/config';
import { FormControl } from '@angular/forms';
import { UploadService } from './../../../services/common/upload.service';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { PolicyService } from './../../../services/policy/policy.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { FacilityService, SystemModuleService, BeneficiaryService } from './../../../services/index';
import { Facility, Employer, Address, BankDetail, Contact } from './../../../models/index';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-new-checkin',
  templateUrl: './new-checkin.component.html',
  styleUrls: ['./new-checkin.component.scss']
})
export class NewCheckinComponent implements OnInit {
  currentPlatform: any;

  listsearchControl = new FormControl();
  beneficiaries: any[] = [];

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
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Check In');
    this._headerEventEmitter.setMinorRouteUrl('Create new check in beneficiary');
    this.listsearchControl.valueChanges
      .debounceTime(350)
      .distinctUntilChanged()
      .subscribe(value => {
        this._getBeneficiariesFromPolicy(this.currentPlatform._id, value);
      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this._getCurrentPlatform();
  }

  _searchBeneficiary(value) {
    this._beneficiaryService.find({
      query: {
        $or: [
          { platformOwnerNumber: { $regex: value, '$options': 'i' } },
          { 'personId.lastName': { $regex: value, '$options': 'i' } },
          { 'personId.firstName': { $regex: value, '$options': 'i' } },
        ]
      }
    }).then((payload: any) => {
      console.log(payload)
      this.beneficiaries = payload.data;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  private _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
      }
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getBeneficiariesFromPolicy(platformId, search) {

    if (search.length > 2) {
      this._policyService.searchPolicy(search).then((payload: any) => {
        this.beneficiaries = [];
        if (payload.body.data.length > 0) {
          payload.body.data.forEach(policy => {
            console.log(policy._id);
            console.log('1')
            let principal = policy.principalBeneficiary;
            principal.isPrincipal = true;
            principal.hia = policy.hiaId;
            principal.policyId = policy._id;
            principal.policy = policy;
            principal.isActive = policy.isActive;
            principal.dependantCount = policy.dependantBeneficiaries.length;
            this.beneficiaries.push(principal);
            policy.dependantBeneficiaries.forEach(innerPolicy => {
              innerPolicy.beneficiary.person = innerPolicy.beneficiary.personId;
              innerPolicy.beneficiary.policyId = policy._id;
              innerPolicy.beneficiary.policy = policy;
              innerPolicy.beneficiary.isPrincipal = false;
              innerPolicy.beneficiary.hia = policy.hiaId;
              innerPolicy.beneficiary.isActive = policy.isActive;
              this.beneficiaries.push(innerPolicy.beneficiary);
            })
          })
          console.log(this.beneficiaries);
          this._systemService.off();
        } else {
          this._systemService.off();
        }
        this._systemService.off();
      }).catch(err => {

      })
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
    //             { 'principalBeneficiary.personId.lastName': { $regex: search, '$options': 'i' } },
    //             { 'principalBeneficiary.personId.firstName': { $regex: search, '$options': 'i' } },
    //             { 'dependantBeneficiaries.beneficiary.personId.firstName': { $regex: search, '$options': 'i' } },
    //             { 'dependantBeneficiaries.beneficiary.personId.lastName': { $regex: search, '$options': 'i' } }
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
    //           innerPolicy.beneficiary.person = innerPolicy.beneficiary.personId;
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
      this._toast.info("Premium payment not yet paid or policy not actived, contact your Health Insurance Agent", "Info")
    } else {
      this._locker.setObject('policyID', beneficiary.policyId);
      this._systemService.on();
      console.log('Beneficiary ID: '+ beneficiary._id);
      this._router.navigate(['/modules/beneficiary/beneficiaries/' + beneficiary._id + '/checkin-generate'])
        .then(payload => {
          console.log(payload);
          this._systemService.off();
        }).catch(err => {
          this._systemService.off();
        })
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
}
