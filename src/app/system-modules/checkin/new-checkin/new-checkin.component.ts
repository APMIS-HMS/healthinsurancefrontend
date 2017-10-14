import { CurrentPlaformShortName } from './../../../services/globals/config';
import { FormControl } from '@angular/forms';
import { UploadService } from './../../../services/common/upload.service';
import { Observable } from 'rxjs/Observable';
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
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private loadingService: LoadingBarService,
    private _beneficiaryService: BeneficiaryService,
    private _policyService: PolicyService,
    private _uploadService: UploadService
  ) { }

  ngOnInit() {
    this.listsearchControl.valueChanges
      .debounceTime(250)
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
    if (search.length > 3) {
      this._systemService.on();
      this._policyService.find({
        query: {
          $and: [
            { 'platformOwnerId._id': platformId },
            {
              $or: [
                { 'principalBeneficiary.person.lastName': { $regex: search, '$options': 'i' } },
                { 'principalBeneficiary.person.firstName': { $regex: search, '$options': 'i' } },
                { 'dependantBeneficiaries.beneficiary.personId.firstName': { $regex: search, '$options': 'i' } },
                { 'dependantBeneficiaries.beneficiary.personId.lastName': { $regex: search, '$options': 'i' } }
              ]
            }
          ]
        }
      }).then((res: any) => {
        this.beneficiaries = [];
        if (res.data.length > 0) {
          res.data.forEach(policy => {
            let principal = policy.principalBeneficiary;
            principal.isPrincipal = true;
            principal.hia = policy.hiaId;
            principal.isActive = policy.isActive;
            principal.dependantCount = policy.dependantBeneficiaries.length;
            this.beneficiaries.push(principal);
            policy.dependantBeneficiaries.forEach(innerPolicy => {
              innerPolicy.beneficiary.person = innerPolicy.beneficiary.personId;
              innerPolicy.beneficiary.isPrincipal = false;
              innerPolicy.beneficiary.hia = policy.hiaId;
              innerPolicy.beneficiary.isActive = policy.isActive;
              this.beneficiaries.push(innerPolicy.beneficiary);
            })
          })
          this._systemService.off();
        } else {
          this._systemService.off();
        }
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
        console.log(err);
      });
    } else {
      this.beneficiaries = [];
      this._systemService.off();
    }

  }

  routeBeneficiaryDetails(beneficiary) {
    this._systemService.on();
    this._router.navigate(['/modules/beneficiary/check-in', beneficiary._id])
      .then(payload => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      })
  }
}
