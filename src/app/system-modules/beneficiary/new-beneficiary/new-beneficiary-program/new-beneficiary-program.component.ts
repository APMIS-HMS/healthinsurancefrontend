import { UserService } from './../../../../services/common/user.service';
import { PolicyService } from './../../../../services/policy/policy.service';
import { PersonService } from './../../../../services/person/person.service';
import { Observable } from 'rxjs/Rx';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FORM_VALIDATION_ERROR_MESSAGE } from './../../../../services/globals/config';
import { BeneficiaryService } from './../../../../services/beneficiary/beneficiary.service';
import { PremiumTypeService } from './../../../../services/common/premium-type.service';
import { PlanService } from './../../../../services/plan/plan.service';
import { PlanTypeService } from './../../../../services/common/plan-type.service';
import { RelationshipService } from './../../../../services/common/relationship.service';
import { MaritalStatusService } from './../../../../services/common/marital-status.service';
import { TitleService } from './../../../../services/common/titles.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderEventEmitterService } from './../../../../services/event-emitters/header-event-emitter.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { GenderService } from './../../../../services/common/gender.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName, SPONSORSHIP, SPONSORSHIPTYPE } from '../../../../services/globals/config';
import {
  UserTypeService, BankService, CountryService, FacilityService, SystemModuleService, UploadService
} from '../../../../services/index';


const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;

@Component({
  selector: 'app-new-beneficiary-program',
  templateUrl: './new-beneficiary-program.component.html',
  styleUrls: ['./new-beneficiary-program.component.scss']
})
export class NewBeneficiaryProgramComponent implements OnInit {

  @Input() selectedBeneficiary: any;
  @Input() dependants: any[] = [];
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
    this._systemService.beneficiaryTabAnnounced$.subscribe((value: any) => {
      console.log(value)
      this.selectedBeneficiary = value.beneficiary;
      if (value.beneficiary !== undefined) {
        console.log(value);
        console.log(value.dependants);
        this.dependants = value.dependants;
        this.isEventBased = true;
      }
    });
  }

  ngOnInit() {
    console.log(this.selectedBeneficiary);
    this.frmProgram = this._fb.group({
      hiaName: [''],
      programType: ['', [<any>Validators.required]],
      premiumCategory: ['', [<any>Validators.required]],
      programName: ['', [<any>Validators.required]],
      providerName: ['', [<any>Validators.required]],
      premiumPackage: ['', [<any>Validators.required]],
      sponsorship: ['', [<any>Validators.required]],
      organization: ['', []],
      sponsorshipType: ['', []],
    });
    this.user = (<any>this._locker.getObject('auth')).user;
    console.log(this.user);
    if (!!this.user.userType && this.user.userType.name === 'Health Insurance Agent') {
      this.isHIA = true;
      this.frmProgram.controls.sponsorship.setValue(this.sponsorships[1])
    } else if (!!this.user.userType && this.user.userType.name === 'Beneficiary') {
      this.frmProgram.controls.sponsorship.setValue(this.sponsorships[0])
    } else if (!!this.user.userType && this.user.userType.name === 'Employer') {
      this.frmProgram.controls.sponsorship.setValue(this.sponsorships[0])
    }

    this.frmProgram.controls['programType'].valueChanges.subscribe(value => {
      console.log(value);
      this._getPlanByType(value._id);
    });

    this.frmProgram.controls['programName'].valueChanges.subscribe(value => {
      console.log(value);
      this.premiumPackages = value.premiums;
      this.filteredPremiumPackages = value.premiums;
    });

    this.frmProgram.controls['premiumCategory'].valueChanges.subscribe(value => {
      if (this.filteredPremiumPackages.length > 0) {
        this.premiumPackages = this.filteredPremiumPackages.filter(e => e.category.name.toLowerCase() === value.name.toLowerCase());
      }
    });

    this.frmProgram.controls['sponsorship'].valueChanges.subscribe(value => {
      if (value === 'Self') {

      }
    });
    this._getCurrentPlatform();
    this._getPlanTypes();
    this._getPremiumTypes();
    console.log(this.dependants);
    this._route.params.subscribe(param => {
      console.log(param)
      if (param.id !== undefined) {
        this._getBeneficiary(param.id);
      }
    })
  }

  _getUser() {
    this._userService.get(this.user._id, {}).then((payload: any) => {
    }).catch(err => {
      console.log(err)
    })
  }

  _getPerson() {
    if (this.user.userType.name === "Beneficiary") {
      let person$ = Observable.fromPromise(this._personService.find({
        query: {
          email: this.user.email
        }
      }));
      let beneficiary$ = Observable.fromPromise(this._beneficiaryService.find({
        query: {
          'personId.email': this.user.email
        }
      }));
      Observable.forkJoin([person$, beneficiary$]).subscribe((results: any) => {
        console.log(results);
        if (results[0].data.length > 0) {
          this.person = results[0].data[0];
        }
        if (results[1].data.length > 0) {
          console.log('redirect to last page');
          console.log(results[1].data[0]._id)
          this._policyService.find({
            query: {
              principalBeneficiary: results[1].data[0]._id
            }
          }).then((policies: any) => {
            console.log(policies)
            if (policies.data.length > 0) {
              console.log('policy')
            } else {
              this.selectedBeneficiary = results[1].data[0];
              console.log(this.selectedBeneficiary)
              if (!this.isEventBased) {
                this._router.navigate(['/modules/beneficiary/new/principal', this.selectedBeneficiary._id]).then(payload => {

                }).catch(err => {
                  console.log(err)
                });
              }

            }
          }).catch(errin => {
            console.log(errin)
          })
        }
      }, error => {
        console.log(error);
      })
    } else {
      let person$ = Observable.fromPromise(this._personService.find({
        query: {
          _id: this.selectedBeneficiary.personId._id
        }
      }));

      Observable.forkJoin([person$]).subscribe((results: any) => {
        console.log(results);
        if (results[0].data.length > 0) {
          this.person = results[0].data[0];
        }
        if (this.selectedBeneficiary !== undefined) {
          console.log('redirect to last page');

          this._policyService.find({
            query: {
              principalBeneficiary: this.selectedBeneficiary._id
            }
          }).then((policies: any) => {
            console.log(policies)
            if (policies.data.length > 0) {
              console.log('policy')
            }
          }).catch(errin => {
            console.log(errin)
          })
        }
      }, error => {
        console.log(error);
      })
    }

  }

  _getBeneficiary(id) {
    this._systemService.on();
    this._beneficiaryService.get(id, {}).then((payload: any) => {
      console.log(payload)
      this.selectedBeneficiary = payload;



      this._getPerson();







      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  _getPlanByType(id) {
    this._systemService.on();
    this._planService.find({ query: { 'planType._id': id } }).then((res: any) => {
      this._systemService.off();
      console.log(res.data);
      this.plans = res.data;
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getPremiumTypes() {
    this._systemService.on();
    this._premiumTypeService.find({}).then((res: any) => {
      this._systemService.off();
      this.premiumTypes = res.data;
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getCurrentPlatform() {
    this._systemService.on();
    this._facilityService.find({
      query: { shortName: CurrentPlaformShortName, $select: ['name', 'shortName', 'address.state'] }
    }).then((res: any) => {
      this._systemService.off();
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getHIAs(this.currentPlatform._id);
        this._getProviders(this.currentPlatform._id);
        this._getOrganizations(this.currentPlatform._id);
      }
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }

  _getHIAs(platformOwnerId) {
    this._systemService.on();
    this._facilityService.find({
      query: {
        'facilityType.name': 'Health Insurance Agent', 'platformOwnerId._id': platformOwnerId,
        $select: ['name', 'hia']
      }
    }).then((res: any) => {
      this._systemService.off();
      this.hias = res.data;
      if (this.user.userType.name === 'Health Insurance Agent') {
        this.isHIA = true;
        let index = this.hias.findIndex(x => x._id === this.user.facilityId._id);
        if(index > -1){
          this.frmProgram.controls.hiaName.setValue(this.hias[index]);
        }
      }
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }

  _getProviders(platformOwnerId) {
    this._systemService.on();
    this._facilityService.find({
      query: {
        'facilityType.name': 'Provider', 'platformOwnerId._id': platformOwnerId,
        $select: ['name', 'provider']
      }
    }).then((res: any) => {
      this._systemService.off();
      this.providers = res.data;
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }

  _getPlanTypes() {
    this._systemService.on();
    this._planTypeService.find({}).then((res: any) => {
      this._systemService.off();
      this.planTypes = res.data;
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }

  _getOrganizations(platformOwnerId) {
    this._systemService.on();
    this._facilityService.find({
      query: {
        'facilityType.name': 'Employer', 'platformOwnerId._id': platformOwnerId,
        // $select: ['name', 'Employer.providerId']
      }
    }).then((res: any) => {
      this._systemService.off();
      console.log(res);
      this.organizations = res.data;
    }).catch(err => {
      this._systemService.off();
      console.log(err);
    });
  }

  onClickStepFour(value, valid) {
    console.log(value);
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
        console.log('am in')
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
      console.log(body);

      this._beneficiaryService.updateWithMiddleWare(body).then(payload => {
        this._router.navigate(['/modules/beneficiary/new/complete', payload.body.policyObject._id]).then(payload => {

        }).catch(err => {
          console.log(err)
        });
        this._toastr.success("Your Policy item has been generated!", "Success");
      }).catch(err => {
        console.log(err);
      });
    } else {
      let counter = 0;
      this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
      Object.keys(this.frmProgram.controls).forEach((field, i) => { // {1}
        const control = this.frmProgram.get(field);
        if (!control.valid) {
          control.markAsDirty({ onlySelf: true });
          counter = counter + 1;
        }
      });
    }

  }
}
