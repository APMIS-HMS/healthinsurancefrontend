import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CoolLocalStorage } from "angular2-cool-storage";
import { IMyDate, IMyDpOptions } from "mydatepicker";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { Observable } from "rxjs/Rx";

import { environment } from "../../../../../environments/environment";
import {
  SPONSORSHIP,
  SPONSORSHIPTYPE
} from "../../../../services/globals/config";
import {
  BankService,
  CountryService,
  FacilityService,
  SystemModuleService,
  UploadService,
  UserTypeService
} from "../../../../services/index";

import { BeneficiaryService } from "./../../../../services/beneficiary/beneficiary.service";
import { GenderService } from "./../../../../services/common/gender.service";
import { MaritalStatusService } from "./../../../../services/common/marital-status.service";
import { PlanTypeService } from "./../../../../services/common/plan-type.service";
import { PremiumTypeService } from "./../../../../services/common/premium-type.service";
import { RelationshipService } from "./../../../../services/common/relationship.service";
import { TitleService } from "./../../../../services/common/titles.service";
import { UserService } from "./../../../../services/common/user.service";
import { HeaderEventEmitterService } from "./../../../../services/event-emitters/header-event-emitter.service";
import { FORM_VALIDATION_ERROR_MESSAGE } from "./../../../../services/globals/config";
import { PersonService } from "./../../../../services/person/person.service";
import { PlanService } from "./../../../../services/plan/plan.service";
import { PolicyService } from "./../../../../services/policy/policy.service";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;

@Component({
  selector: "app-new-beneficiary-program",
  templateUrl: "./new-beneficiary-program.component.html",
  styleUrls: ["./new-beneficiary-program.component.scss"]
})
export class NewBeneficiaryProgramComponent implements OnInit {
  @Input()
  selectedBeneficiary: any;
  @Input()
  dependants: any[] = [];
  frmProgram: FormGroup;
  currentPlatform: any;
  hias: any[] = [];
  providers: any[] = [];
  planTypes: any[] = [];
  plans: any[] = [];
  premiumTypes: any[] = [];
  premiumPackages: any[] = [];
  filteredPremiumPackages: any[] = [];
  sponsorships: any[] = SPONSORSHIP;
  sponsorshipTypes: any[] = SPONSORSHIPTYPE;
  organizations: any[] = [];
  isHIA: boolean = false;
  user: any;
  person: any;
  isEventBased = false;
  platformName: any;
  constructor(
    private _fb: FormBuilder,
    private _genderService: GenderService,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _userTypeService: UserTypeService,
    private _bankService: BankService,
    private _countriesService: CountryService,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private _titleService: TitleService,
    private _router: Router,
    private _maritalService: MaritalStatusService,
    private _relationshipService: RelationshipService,
    private _planTypeService: PlanTypeService,
    private _planService: PlanService,
    private _premiumTypeService: PremiumTypeService,
    private _beneficiaryService: BeneficiaryService,
    private _route: ActivatedRoute,
    private _locker: CoolLocalStorage,
    private _personService: PersonService,
    private _policyService: PolicyService,
    private _userService: UserService
  ) {
    this.platformName = environment.platform;
    this._systemService.beneficiaryTabAnnounced$.subscribe((value: any) => {
      this.selectedBeneficiary = value.beneficiary;
      if (value.beneficiary !== undefined) {
        this.dependants = value.dependants;
        this.isEventBased = true;
      }
    });
  }

  ngOnInit() {
    this.frmProgram = this._fb.group({
      hiaName: [""],
      programType: ["", [<any>Validators.required]],
      premiumCategory: ["", [<any>Validators.required]],
      programName: ["", [<any>Validators.required]],
      providerName: ["", [<any>Validators.required]],
      premiumPackage: ["", [<any>Validators.required]],
      sponsorship: ["", [<any>Validators.required]],
      organization: ["", []],
      sponsorshipType: ["", []]
    });
    this.user = (<any>this._locker.getObject("auth")).user;
    if (
      !!this.user.userType &&
      this.user.userType.name === "Health Insurance Agent"
    ) {
      this.isHIA = true;
      this.frmProgram.controls.sponsorship.setValue(this.sponsorships[1]);
      let index = this.hias.findIndex(x => x._id === this.user.facilityId._id);
      if (index > -1) {
        this.frmProgram.controls.hiaName.setValue(this.hias[index]);
        const hia = this.frmProgram.controls.hiaName.value;
        this._getOrganizations(this.currentPlatform._id, hia._id);
      }
    } else if (
      !!this.user.userType &&
      this.user.userType.name === "Beneficiary"
    ) {
      this.frmProgram.controls.sponsorship.setValue(this.sponsorships[0]);
    } else if (!!this.user.userType && this.user.userType.name === "Employer") {
      this.frmProgram.controls.sponsorship.setValue(this.sponsorships[1]);
    }

    this.frmProgram.controls["programType"].valueChanges.subscribe(value => {
      this._getPlanByType(value._id);
    });

    this.frmProgram.controls["programName"].valueChanges.subscribe(value => {
      this.premiumPackages = value.premiums;
      this.filteredPremiumPackages = value.premiums;
    });

    this.frmProgram.controls["premiumCategory"].valueChanges.subscribe(
      value => {
        if (this.filteredPremiumPackages.length > 0) {
          this.premiumPackages = this.filteredPremiumPackages.filter(
            e => e.category.name.toLowerCase() === value.name.toLowerCase()
          );
        }
      }
    );

    this.frmProgram.controls["sponsorship"].valueChanges.subscribe(value => {
      if (value.name === "Self") {
        this.isHIA = false;
      } else {
        this.isHIA = true;
      }
    });
    this._getCurrentPlatform();
    this._getPlanTypes();
    this._getPremiumTypes();
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getBeneficiary(param.id);
      }
    });
  }

  _getUser() {
    this._userService
      .get(this.user._id, {})
      .then((payload: any) => {})
      .catch(err => {});
  }

  _getPerson() {
    if (this.user.userType.name === "Beneficiary") {
      let person$ = Observable.fromPromise(
        this._personService.find({
          query: {
            email: this.user.email
          }
        })
      );
      let beneficiary$ = Observable.fromPromise(
        this._beneficiaryService.find({
          query: {
            "personId.email": this.user.email
          }
        })
      );
      Observable.forkJoin([person$, beneficiary$]).subscribe(
        (results: any) => {
          if (results[0].data.length > 0) {
            this.person = results[0].data[0];
          }
          if (results[1].data.length > 0) {
            this._policyService
              .find({
                query: {
                  principalBeneficiary: results[1].data[0]._id
                }
              })
              .then((policies: any) => {
                if (policies.data.length > 0) {
                } else {
                  this.selectedBeneficiary = results[1].data[0];
                  // if (!this.isEventBased) {
                  //   this._router.navigate(['/modules/beneficiary/new/principal', this.selectedBeneficiary._id]).then(payload => {

                  //   }).catch(err => {});
                  // }
                }
              })
              .catch(errin => {});
          }
        },
        error => {}
      );
    } else {
      let person$ = Observable.fromPromise(
        this._personService.find({
          query: { _id: this.selectedBeneficiary.personId._id }
        })
      );

      Observable.forkJoin([person$]).subscribe(
        (results: any) => {
          if (results[0].data.length > 0) {
            this.person = results[0].data[0];
          }
          if (this.selectedBeneficiary !== undefined) {
            this._policyService
              .find({
                query: {
                  principalBeneficiary: this.selectedBeneficiary._id
                }
              })
              .then((policies: any) => {
                if (policies.data.length > 0) {
                }
              })
              .catch(errin => {});
          }
        },
        error => {}
      );
    }
  }

  _getBeneficiary(id) {
    this._systemService.on();
    this._beneficiaryService
      .get(id, {})
      .then((payload: any) => {
        this.selectedBeneficiary = payload;
        this._getPerson();
        this._systemService.off();
      })
      .catch(err => {
        this._systemService.off();
      });
  }

  _getPlanByType(id) {
    this._systemService.on();
    this._planService
      .find({ query: { "planType._id": id } })
      .then((res: any) => {
        this._systemService.off();
        this.plans = res.data;
      })
      .catch(err => {
        this._systemService.off();
      });
  }

  _getPremiumTypes() {
    this._systemService.on();
    this._premiumTypeService
      .find({})
      .then((res: any) => {
        this._systemService.off();
        this.premiumTypes = res.data;
      })
      .catch(err => {
        this._systemService.off();
      });
  }

  _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService
      .find({
        query: {
          shortName: this.platformName,
          $select: ["name", "shortName", "address.state"]
        }
      })
      .then((res: any) => {
        this._systemService.off();
        if (res.data.length > 0) {
          this.currentPlatform = res.data[0];
          this._getHIAs(this.currentPlatform._id);
          this._getProviders(this.currentPlatform._id);
          // this._getOrganizations(this.currentPlatform._id);
        }
      })
      .catch(err => {
        this._systemService.off();
      });
  }

  _getHIAs(platformOwnerId) {
    this._systemService.on();
    this._facilityService
      .find({
        query: {
          "facilityType.name": "Health Insurance Agent",
          "platformOwnerId._id": platformOwnerId,
          $select: ["name", "hia"]
        }
      })
      .then((res: any) => {
        this._systemService.off();
        this.hias = res.data;
        if (
          !!this.user.userType &&
          this.user.userType.name === "Health Insurance Agent"
        ) {
          this.isHIA = true;
          let index = this.hias.findIndex(
            x => x._id === this.user.facilityId._id
          );
          if (index > -1) {
            this.frmProgram.controls.hiaName.setValue(this.hias[index]);
            const hia = this.frmProgram.controls.hiaName.value;
            this._getOrganizations(platformOwnerId, hia._id);
          }
        }
      })
      .catch(err => {
        this._systemService.off();
      });
  }

  _getProviders(platformOwnerId) {
    this._systemService.on();
    this._facilityService
      .find({
        query: {
          "facilityType.name": "Provider",
          "provider.facilityClass": "primary",
          "platformOwnerId._id": platformOwnerId,
          $select: ["name", "provider"]
        }
      })
      .then((res: any) => {
        this._systemService.off();
        this.providers = res.data;
      })
      .catch(err => {
        this._systemService.off();
      });
  }

  _getPlanTypes() {
    this._systemService.on();
    this._planTypeService
      .find({})
      .then((res: any) => {
        this._systemService.off();
        this.planTypes = res.data;
      })
      .catch(err => {
        this._systemService.off();
      });
  }

  _getOrganizations(platformOwnerId, hiaId) {
    this._systemService.on();
    this._facilityService
      .find({
        query: {
          "facilityType.name": "Employer",
          "platformOwnerId._id": platformOwnerId,
          "employer.hias._id": hiaId
          // $select: ['name', 'Employer.providerId']
        }
      })
      .then((res: any) => {
        this._systemService.off();
        this.organizations = res.data;
      })
      .catch(err => {
        this._systemService.off();
      });
  }

  onClickStepFour(value, valid) {
    if (valid) {
      let policy: any = <any>{};
      policy.platformOwnerId = this.selectedBeneficiary.platformOwnerId;
      policy.principalBeneficiary = this.selectedBeneficiary._id;
      policy.hiaId = value.hiaName;
      policy.providerId = value.providerName;
      policy.planTypeId = value.programType;
      policy.planId = value.programName._id;
      policy.premiumCategoryId = value.premiumCategory;
      policy.premiumPackageId = value.premiumPackage;
      policy.sponsorshipId = value.sponsorship;
      if (policy.sponsorshipId.id === 2) {
        if (this.user.userType.name === "Employer") {
          policy.sponsor = this.user.facilityId;
        } else if (this.user.userType.name === "Health Insurance Agent") {
          policy.sponsor = value.organization;
          policy.sponsorshipType = value.sponsorshipType;
          // sponsorship: ['', [<any>Validators.required]],
          // organization: ['', []],
          // sponsorshipType: ['', []],
        }
      }

      let body = {
        principal: this.selectedBeneficiary,
        persons: this.dependants,
        policy: policy,
        platform: this.selectedBeneficiary.platformOwnerId
      };
      this._beneficiaryService
        .updateWithMiddleWare(body)
        .then(payload => {
          this._router
            .navigate([
              "/modules/beneficiary/new/complete",
              payload.body.policyObject._id
            ])
            .then(payload => {})
            .catch(err => {});
          this._systemService.announceSweetProxy(
            "Your Policy item has been generated!",
            "success"
          );
          // this._toastr.success('Your Policy item has been generated!', 'Success');
        })
        .catch(err => {});
    } else {
      let counter = 0;
      // this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
      this._systemService.announceSweetProxy(
        FORM_VALIDATION_ERROR_MESSAGE,
        "error"
      );
      Object.keys(this.frmProgram.controls).forEach((field, i) => {
        // {1}
        const control = this.frmProgram.get(field);
        if (!control.valid) {
          control.markAsDirty({ onlySelf: true });
          counter = counter + 1;
        }
      });
    }
  }

  onSelectChange(event) {}
}
