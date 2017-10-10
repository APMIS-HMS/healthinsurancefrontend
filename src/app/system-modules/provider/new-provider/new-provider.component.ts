import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { SystemModuleService } from './../../../services/common/system-module.service';
import { Facility, CareProvider, Provider, BankDetail, Address, HIA, Contact } from './../../../models/index';
import {
  FacilityOwnershipService, FacilityCategoryService, UserTypeService, CountryService, BankService,
  ContactPositionService, FacilityService, ProviderGradesService, ProviderStatusesService, UploadService
} from './../../../services/index';
import { GRADES, HEFAMAA_STATUSES } from '../../../services/globals/config';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
// const PHONE_REGEX = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;

@Component({
  selector: 'app-new-provider',
  templateUrl: './new-provider.component.html',
  styleUrls: ['./new-provider.component.scss']
})
export class NewProviderComponent implements OnInit {
  providerFormGroup: FormGroup;
  positions: any = [];
  lgas: any = [];
  countryId: string = "";
  stateId: string = "";
  facilityCategories: any = [];
  grades: any = <any>[];
  ownerships: any = [];
  countries: any[] = [];
  states: any[] = [];
  lgs: any[] = [];
  cities: any[] = [];
  banks: any[] = [];
  userTypes: any[] = [];
  contactPositions: any[] = [];
  HEFAMAA_STATUSES: any = <any>[];
  saveBtn: string = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';
  selectedUserType: any;
  selectedCountry: any;
  facility: any;
  selectedFacilityId: string = '';
  selectedState: any;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _countryService: CountryService,
    // private _facilityTypeService: FacilityTypeService,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _userTypeService: UserTypeService,
    private _contactPositionService: ContactPositionService,
    private _facilityService: FacilityService,
    private _bankService: BankService,
    private _countriesService: CountryService,
    private _facilityCategoryService: FacilityCategoryService,
    private _facilityOwnershipService: FacilityOwnershipService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private _router: Router,
    private _route: ActivatedRoute,
    private loadingService: LoadingBarService,
    private _providerGradesService: ProviderGradesService,
    private _providerStatusesService: ProviderStatusesService
  ) { }

  ngAfterViewInit() {
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this.selectedFacilityId = param.id;
        this._getProviderDetails(param.id);
      } else {
        this._initialiseFormGroup();
      }
    });
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Provider');
    this._headerEventEmitter.setMinorRouteUrl('Create new provider');
    this._initialiseFormGroup();
    this._getContactPositions();
    this._getCountries();
    this._getBanks();
    this._getFacilityCategories();
    this._getFacilityOwnerships();
    this._getUserTypes();
    this._getGrades();
    this._getStatuses();
  }

  _initialiseFormGroup() {
    this.providerFormGroup = this._fb.group({
      providerName: [this.facility != null ? this.facility.name : '', [<any>Validators.required]],
      email: [this.facility != null ? this.facility.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      address: [this.facility != null ? this.facility.address.street : '', [<any>Validators.required]],
      state: [this.facility != null ? this.facility.address.state : '', [<any>Validators.required]],
      lga: [this.facility != null ? this.facility.address.lga : '', [<any>Validators.required]],
      city: [this.facility != null ? this.facility.address.city : '', [<any>Validators.required]],
      neighbourhood: [this.facility != null ? this.facility.address.neighbourhood : '', [<any>Validators.required]],
      phone: [this.facility != null ? this.facility.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      bc_lname: [this.facility != null ? this.facility.businessContact.lastName : '', [<any>Validators.required]],
      bc_fname: [this.facility != null ? this.facility.businessContact.firstName : '', [<any>Validators.required]],
      bc_phone: [this.facility != null ? this.facility.businessContact.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      bc_position: [this.facility != null ? this.facility.businessContact.position : '', [<any>Validators.required]],
      bc_email: [this.facility != null ? this.facility.businessContact.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      it_lname: [this.facility != null ? this.facility.itContact.lastName : '', [<any>Validators.required]],
      it_fname: [this.facility != null ? this.facility.itContact.firstName : '', [<any>Validators.required]],
      it_phone: [this.facility != null ? this.facility.itContact.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      it_position: [this.facility != null ? this.facility.itContact.position : '', [<any>Validators.required]],
      it_email: [this.facility != null ? this.facility.itContact.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      type: [this.facility != null ? this.facility.provider.facilityType : '', [<any>Validators.required]],
      lasrraId: [this.facility != null ? this.facility.provider.lasrraId : '', [<any>Validators.required]],
      hefeemaNumber: [this.facility != null ? this.facility.provider.hefeemaNumber : '', [<any>Validators.required]],
      hefeemaStatus: [this.facility != null ? this.facility.provider.hefeemaStatus : '', [<any>Validators.required]],
      bank: [this.facility != null ? this.facility.bankDetails.bank : '', [<any>Validators.required]],
      bankAccName: [this.facility != null ? this.facility.bankDetails.name : '', [<any>Validators.required]],
      bankAccNumber: [this.facility != null ? this.facility.bankDetails.accountNumber : '', [<any>Validators.required, <any>Validators.pattern(NUMERIC_REGEX)]],
      // cacNumber: [this.facility != null ? this.facility.employer.cacNumber : '', [<any>Validators.required]],
      classification: [this.facility != null ? this.facility.facilityClass : '', [<any>Validators.required]],
      grade: [this.facility != null ? this.facility.provider.facilityGrade : '', [<any>Validators.required]],
      ownership: [this.facility != null ? this.facility.provider.facilityOwnership : '', [<any>Validators.required]],
      comment: [this.facility != null ? this.facility.provider.comment : '', [<any>Validators.required]]
    });
    console.log(this.facility);

    this.providerFormGroup.controls['state'].valueChanges.subscribe(value => {
      console.log(this.selectedCountry);
      this.selectedState = value;
      if (value !== null && this.selectedCountry !== undefined) {
        this._getLgaAndCities(this.selectedCountry._id, value);
      }
    });

    if (this.facility !== undefined) {
      this.saveBtn = 'Update &nbsp; <i class="fa fa-edit"></i>';
      this.selectedState = this.facility.address.state;
      this.providerFormGroup.controls['classification'].setValue(this.facility.provider.facilityClass[0]);
    }
  }

  _getProviderDetails(routeId) {
    this._systemService.on();
    this._facilityService.get(routeId, {}).then((res: Facility) => {
        this._systemService.off();
        this.facility = res;
        this._initialiseFormGroup();
      }).catch(err => {
        this._systemService.off();
      });
  }

  compareState(s1: any, s2: any) {
    return s1._id === s2._id;
  }
  compareCity(c1: any, c2: any) {
    return c1._id === c2._id;
  }
  compareLGA(l1: any, l2: any) {
    return l1._id === l2._id;
  }
  compareBank(l1: any, l2: any) {
    return l1._id === l2._id;
  }
  compareCategory(l1: any, l2: any) {
    return l1._id === l2._id;
  }
  compare(l1: any, l2: any) {
    return l1._id === l2._id;
  }
  compareGrade(l1: any, l2: any) {
    return l1._id === l2._id;
  }
  compareStatus(l1: any, l2: any) {
    return l1._id === l2._id;
  }
  compareOwnership(l1: any, l2: any) {
    return l1._id === l2._id;
  }

  _getContactPositions() {
    this._systemService.on();
    this._contactPositionService.find({}).then((payload: any) => {
      this.contactPositions = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  private _getGrades() {
    this._systemService.on();
    this._providerGradesService.find({}).then((payload: any) => {
      this.grades = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  private _getStatuses() {
    this._systemService.on();
    this._providerStatusesService.find({}).then((payload: any) => {
      this.HEFAMAA_STATUSES = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  private _getUserTypes() {
    this._systemService.on();
    this._userTypeService.findAll().then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.userTypes = payload.data;
        const index = payload.data.findIndex(x => x.name === 'Provider');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
          this.providerFormGroup.controls['type'].setValue(this.selectedUserType);
        } else {
          this.selectedUserType = undefined;
          this.providerFormGroup.controls['type'].reset();
        }
      }
    }, error => {
      this._systemService.off();
    });
  }
  private _getCountries() {
    this._systemService.on();
    this._countriesService.find({
      query: {
        $limit: 200,
        $select: { 'states': 0 }
      }
    }).then((payload: any) => {
      this._systemService.off();
      this.countries = payload.data;
      const index = this.countries.findIndex(x => x.name === 'Nigeria');
      if (index > -1) {
        this.selectedCountry = this.countries[index];
        this._getStates(this.selectedCountry._id);
      }
    }).catch(err => {
      this._systemService.off();
    });
  }
  private _getStates(_id) {
    this._systemService.on();
    this._countriesService.find({
      query: {
        _id: _id,
        $limit: 200,
        $select: { 'states.cities': 0, 'states.lgs': 0 }
      }
    }).then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.states = payload.data[0].states;
      }

    }).catch(error => {
      this._systemService.off();
    });
  }

  _getLgaAndCities(_id, state) {
    this._systemService.on();
    this._countriesService.find({
      query: {
        _id: _id,
        'states.name': state.name,
        $select: { 'states.$': 1 }
      }
    }).then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        const states = payload.data[0].states;
        if (states.length > 0) {
          this.cities = states[0].cities;
          this.lgs = states[0].lgs;
        }
      }

    }).catch(error => {
      this._systemService.off();
    });
  }
  _getBanks() {
    this._systemService.on();
    this._bankService.find({
      query: {
        $limit: 200
      }
    }).then((payload: any) => {
      this._systemService.off();
      this.banks = payload.data;
    }).catch(err => {
      this._systemService.off();
    });
  }

  upload(image) {
    // this._systemService.on();
    // let fileBrowser = this.fileInput.nativeElement;
    if (image.files && image.files[0]) {
      const formData = new FormData();
      formData.append('provider', image.files[0]);
      return new Promise((resolve, reject) => {
        this._uploadService.upload(formData, this.selectedUserType._id).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err)
        });
      });
    }
  }

  _extractBusinessContact(businessContact?: Contact) {
    if (businessContact === undefined) {
      businessContact = <Contact>{};
    }
    businessContact.lastName = this.providerFormGroup.controls['bc_fname'].value;
    businessContact.firstName = this.providerFormGroup.controls['bc_lname'].value;
    businessContact.email = this.providerFormGroup.controls['bc_email'].value;
    businessContact.phoneNumber = this.providerFormGroup.controls['bc_phone'].value;
    businessContact.position = this.providerFormGroup.controls['bc_position'].value;
    return businessContact;
  }
  _extractITContact(itContact?: Contact) {
    if (itContact === undefined) {
      itContact = <Contact>{};
    }
    itContact.lastName = this.providerFormGroup.controls['it_fname'].value;
    itContact.firstName = this.providerFormGroup.controls['it_lname'].value;
    itContact.email = this.providerFormGroup.controls['it_email'].value;
    itContact.phoneNumber = this.providerFormGroup.controls['it_phone'].value;
    itContact.position = this.providerFormGroup.controls['it_position'].value;
    return itContact;
  }
  _extractBankDetail(bankDetail?: BankDetail) {
    if (bankDetail === undefined) {
      bankDetail = <BankDetail>{};
    }
    bankDetail.accountNumber = this.providerFormGroup.controls['bankAccNumber'].value;
    bankDetail.bank = this.providerFormGroup.controls['bank'].value;
    bankDetail.name = this.providerFormGroup.controls['bankAccName'].value;
    return bankDetail;
  }

  _extractAddress(address?: Address) {
    if (address === undefined) {
      address = <Address>{};
    }
    address.city = this.providerFormGroup.controls['city'].value;
    address.lga = this.providerFormGroup.controls['lga'].value;
    address.neighbourhood = this.providerFormGroup.controls['neighbourhood'].value;
    address.state = this.providerFormGroup.controls['state'].value;
    address.street = this.providerFormGroup.controls['address'].value;
    return address;
  }
  _extractProvider(provider?: Provider) {
    if (provider === undefined) {
      provider = <Provider>{};
    }

    provider.facilityOwnership = this.providerFormGroup.controls['ownership'].value;
    provider.facilityType = this.providerFormGroup.controls['type'].value;
    provider.facilityClass = this.providerFormGroup.controls['classification'].value;
    provider.facilityGrade = this.providerFormGroup.controls['grade'].value;
    provider.hefeemaNumber = this.providerFormGroup.controls['hefeemaNumber'].value;
    provider.hefeemaStatus = this.providerFormGroup.controls['hefeemaStatus'].value;
    provider.lasrraId = this.providerFormGroup.controls['lasrraId'].value;
    provider.comment = this.providerFormGroup.controls['comment'].value;
    return provider;
  }

  _extractFacility(facility?: Facility) {
    const businessContact = this._extractBusinessContact();
    const itContact = this._extractITContact();
    const bankDetails = this._extractBankDetail();
    const address = this._extractAddress();
    const provider = this._extractProvider();

    if (facility === undefined) {
      facility = <Facility>{};
    }
    facility.address = address;
    facility.bankDetails = bankDetails;
    facility.businessContact = businessContact;
    facility.itContact = itContact;
    facility.provider = provider;
    facility.email = this.providerFormGroup.controls['email'].value;
    facility.name = this.providerFormGroup.controls['providerName'].value;
    facility.phoneNumber = this.providerFormGroup.controls['phone'].value;
    facility.facilityType = this.selectedUserType;

    return facility;
  }

  _getFacilityCategories() {
    this._systemService.on();
    this._facilityCategoryService.find({}).then((payload: any) => {
      this.facilityCategories = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  _getFacilityOwnerships() {
    this._systemService.on();
    this._facilityOwnershipService.find({}).then((payload: any) => {
      this.ownerships = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }

  onClickSaveProvider(value: any, valid: boolean) {
    if (valid) {
      this._systemService.on();
      this.saveBtn = 'Please wait... &nbsp; <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';
      let facility = this._extractFacility();
      console.log(facility);
      if (!!this.facility) {
        // Edit Provider.
        facility._id = this.selectedFacilityId;
        this._facilityService.update(facility).then((payload: any) => {
          this._systemService.off();
          // this.providerFormGroup.reset();
          this._toastr.info('Navigating to provider details page...', 'Navigate!');
          setTimeout(e => {
            this.navigateProviders('/modules/provider/providers/', + payload._id);
          }, 2000);
          this.saveBtn = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';
          this._toastr.success('Care Provider has been updated successfully!', 'Success!');
          this.providerFormGroup.controls['classification'].setValue('primary');
        }).catch(err => {
          console.log(err);
          this._systemService.off();
          if (err == 'Error: This email already exist') {
            this._toastr.error('This email alreay exist!', 'Email exists!');
          } else {
            this._toastr.error('We could not save your data. Something went wrong!', 'Error!');
          }
        });
      } else {
        // Create Provider
        this._facilityService.create(facility).then(payload => {
          this._systemService.off();
          // this.providerFormGroup.reset();
          this.saveBtn = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';
          this._toastr.success('Care Provider has been created successfully!', 'Success!');
          this.providerFormGroup.controls['classification'].setValue('primary');
        }).catch(err => {
          console.log(err);
          this._systemService.off();
          if (err == 'Error: This email already exist') {
            this._toastr.error('This email alreay exist!', 'Email exists!');
          } else {
            this._toastr.error('We could not save your data. Something went wrong!', 'Error!');
          }
        });
      }
    } else {
      this._systemService.off();
      this._toastr.error('Some required fields are empty!', 'Form Validation Error!');
    }
  }

  navigateProviders(path, routeId) {
    if (!!routeId) {
      this.loadingService.startLoading();
      this._router.navigate([path + routeId]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    } else {
      this.loadingService.startLoading();
      this._router.navigate([path]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    }
  }
}
