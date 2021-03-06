
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {environment} from '../../../../environments/environment';
import {HeaderEventEmitterService} from '../../../services/event-emitters/header-event-emitter.service';
import {FORM_VALIDATION_ERROR_MESSAGE} from '../../../services/globals/config';

import {Address, BankDetail, Contact, Employer, Facility} from './../../../models/index';
import {BankService, ContactPositionService, CountryService, FacilityService, IndustryService, SystemModuleService, UploadService, UserTypeService} from './../../../services/index';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX =
    /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;
@Component({
  selector: 'app-new-employer',
  templateUrl: './new-employer.component.html',
  styleUrls: ['./new-employer.component.scss']
})
export class NewEmployerComponent implements OnInit {
  @ViewChild('logoInput') logoInput: ElementRef;
  @ViewChild('logoImage') logoImage: ElementRef;
  @ViewChild('bInput') bInput: ElementRef;
  @ViewChild('bImage') bImage: ElementRef;
  @ViewChild('itInput') itInput: ElementRef;
  @ViewChild('itImage') itImage: ElementRef;

  employerFormGroup: FormGroup;
  countryId: string = '';
  stateId: string = '';
  industries: any = [];
  countries: any[] = [];
  states: any[] = [];
  lgs: any[] = [];
  cities: any[] = [];
  banks: any[] = [];
  userTypes: any[] = [];
  contactPositions: any[] = [];
  selectedFacilityId: string;
  selectedUserType: any;
  selectedCountry: any;
  selectedState: any;
  facility: any;
  currentPlatform: any;
  btnText: boolean = true;
  btnProcessing: boolean = false;
  disableBtn: boolean = false;
  platformName: any;

  constructor(
      private _fb: FormBuilder, private _router: Router,
      private _toastr: ToastsManager,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _industryService: IndustryService,
      private _userTypeService: UserTypeService,
      private _contactPositionService: ContactPositionService,
      private _facilityService: FacilityService,
      private _bankService: BankService,
      private _countriesService: CountryService, private _route: ActivatedRoute,
      private _systemService: SystemModuleService,
      private _uploadService: UploadService) {
    this.platformName = environment.platform;
  }
  ngAfterViewInit() {
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this.selectedFacilityId = param.id;
        this._getEmployerDetails(param.id);
      } else {
        this._initialiseFormGroup();
      }
    });
  }
  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Employer');
    this._headerEventEmitter.setMinorRouteUrl('Create new employer');
    this._getCurrentPlatform();
    this._initialiseFormGroup();
    this._getIndustries();

    this._getContactPositions();
    this._getCountries();
    this._getBanks();
    this._getUserTypes();
  }

  _initialiseFormGroup() {
    this.employerFormGroup = this._fb.group({
      employerName: [
        this.facility != null ? this.facility.name : '',
        [<any>Validators.required]
      ],
      address: [
        this.facility != null ? this.facility.address.street : '',
        [<any>Validators.required]
      ],
      email: [
        this.facility != null ? this.facility.email : '',
        [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]
      ],
      state: [
        this.facility != null ? this.facility.address.state : '',
        [<any>Validators.required]
      ],
      city: [
        this.facility != null ? this.facility.address.city : '',
        [<any>Validators.required]
      ],
      lga: [
        this.facility != null ? this.facility.address.lga : '',
        [<any>Validators.required]
      ],
      neighbourhood: [
        this.facility != null ? this.facility.address.neighbourhood : '',
        [<any>Validators.required]
      ],
      phone: [
        this.facility != null ? this.facility.phoneNumber : '',
        [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]
      ],
      bc_lname: [
        this.facility != null ? this.facility.businessContact.lastName : '',
        [<any>Validators.required]
      ],
      bc_fname: [
        this.facility != null ? this.facility.businessContact.firstName : '',
        [<any>Validators.required]
      ],
      bc_phone: [
        this.facility != null ? this.facility.businessContact.phoneNumber : '',
        [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]
      ],
      bc_position: [
        this.facility != null ? this.facility.businessContact.position : '',
        [<any>Validators.required]
      ],
      bc_email: [
        this.facility != null ? this.facility.businessContact.email : '',
        [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]
      ],
      it_lname: [
        this.facility != null ? this.facility.itContact.lastName : '',
        [<any>Validators.required]
      ],
      it_fname: [
        this.facility != null ? this.facility.itContact.firstName : '',
        [<any>Validators.required]
      ],
      it_phone: [
        this.facility != null ? this.facility.itContact.phoneNumber : '',
        [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]
      ],
      it_position: [
        this.facility != null ? this.facility.itContact.position : '',
        [<any>Validators.required]
      ],
      it_email: [
        this.facility != null ? this.facility.itContact.email : '',
        [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]
      ],
      type: [
        this.facility != null ? this.facility.employer.industry : '',
        [<any>Validators.required]
      ],
      // bank: [this.facility != null ? this.facility.bankDetails.bank : '',
      // [<any>Validators.required]], bankAccName: [this.facility != null ?
      // this.facility.bankDetails.name : '', [<any>Validators.required]],
      // bankAccNumber: [this.facility != null ?
      // this.facility.bankDetails.accountNumber : '',
      // [<any>Validators.required, <any>Validators.pattern(NUMERIC_REGEX)]],
      cacNumber: [
        this.facility != null ? this.facility.employer.cacNumber : '',
        [<any>Validators.required]
      ]
    });

    this.employerFormGroup.controls['state'].valueChanges.subscribe(value => {
      this.selectedState = value;
      if (value !== null && this.selectedCountry !== undefined) {
        this._getLgaAndCities(this.selectedCountry._id, value);
      }
    });
    if (this.facility !== undefined) {
      this.selectedState = this.facility.address.state;
      this.employerFormGroup.controls['type'].setValue(
          this.facility.employer.industry);
    }
  }

  _getCurrentPlatform() {
    this._facilityService.find({query: {shortName: this.platformName}})
        .then((res: any) => {
          if (res.data.length > 0) {
            this.currentPlatform = res.data[0];
          }
        })
        .catch(err => {});
  }

  _getEmployerDetails(routeId) {
    this._systemService.on();
    this._facilityService.get(routeId, {})
        .then((res: Facility) => {
          this._systemService.off();
          this.facility = res;
          this._initialiseFormGroup();
          this._initImages(res);
        })
        .catch(err => {
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
  compareIndustry(l1: any, l2: any) {
    return l1._id === l2._id;
  }
  compare(l1: any, l2: any) {
    return l1._id === l2._id;
  }
  _getContactPositions() {
    this._systemService.on();
    this._contactPositionService.find({})
        .then((payload: any) => {
          this._systemService.off();
          this.contactPositions = payload.data;
          if (this.facility !== undefined) {
            this.employerFormGroup.controls['bc_position'].setValue(
                this.facility.businessContact.position);
            this.employerFormGroup.controls['it_position'].setValue(
                this.facility.itContact.position);
          }
        })
        .catch(err => {
          this._systemService.off();
        })
  }
  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.findAll().then(
        (payload: any) => {
          this._systemService.off();
          if (payload.data.length > 0) {
            this.userTypes = payload.data;
            const index = payload.data.findIndex(x => x.name === 'Employer');
            if (index > -1) {
              this.selectedUserType = payload.data[index];
              // this.employerFormGroup.controls['type'].setValue(this.selectedUserType);
            } else {
              this.selectedUserType = undefined;
              // this.employerFormGroup.controls['type'].reset();
            }
          }
        },
        error => {
          this._systemService.off();
        })
  }
  _getCountries() {
    this._systemService.on();
    this._countriesService.find({query: {$limit: 200, $select: {'states': 0}}})
        .then((payload: any) => {
          this._systemService.off();
          this.countries = payload.data;
          const index = this.countries.findIndex(x => x.name === 'Nigeria');
          if (index > -1) {
            this.selectedCountry = this.countries[index];
            this._getStates(this.selectedCountry._id);
            if (this.selectedState !== undefined) {
              this._getLgaAndCities(
                  this.selectedCountry._id, this.selectedState);
            }
          }
        })
        .catch(err => {
          this._systemService.off();
        })
  }
  _getStates(_id) {
    this._systemService.on();
    this._countriesService
        .find({
          query: {
            _id: _id,
            $limit: 200,
            $select: {'states.cities': 0, 'states.lgs': 0}
          }
        })
        .then((payload: any) => {
          this._systemService.off();
          if (payload.data.length > 0) {
            this.states = payload.data[0].states;
          }
        })
        .catch(error => {
          this._systemService.off();
        })
  }

  _getLgaAndCities(_id, state) {
    this._systemService.on();
    this._countriesService
        .find({
          query:
              {_id: _id, 'states.name': state.name, $select: {'states.$': 1}}
        })
        .then((payload: any) => {
          this._systemService.off();
          if (payload.data.length > 0) {
            const states = payload.data[0].states;
            if (states.length > 0) {
              this.cities = states[0].cities;
              this.lgs = states[0].lgs;
            }
          }
        })
        .catch(error => {
          this._systemService.off();
        })
  }
  _getBanks() {
    this._systemService.on();
    this._bankService.find({query: {$limit: 200}})
        .then((payload: any) => {
          this._systemService.off();
          this.banks = payload.data;
        })
        .catch(err => {
          this._systemService.off();
        })
  }

  _extractBusinessContact(businessContact?: Contact) {
    if (businessContact === undefined) {
      businessContact = <Contact>{};
    }
    businessContact.lastName =
        this.employerFormGroup.controls['bc_fname'].value;
    businessContact.firstName =
        this.employerFormGroup.controls['bc_lname'].value;
    businessContact.email = this.employerFormGroup.controls['bc_email'].value;
    businessContact.phoneNumber =
        this.employerFormGroup.controls['bc_phone'].value;
    businessContact.position =
        this.employerFormGroup.controls['bc_position'].value;
    return businessContact;
  }
  _extractITContact(itContact?: Contact) {
    if (itContact === undefined) {
      itContact = <Contact>{};
    }
    itContact.lastName = this.employerFormGroup.controls['it_fname'].value;
    itContact.firstName = this.employerFormGroup.controls['it_lname'].value;
    itContact.email = this.employerFormGroup.controls['it_email'].value;
    itContact.phoneNumber = this.employerFormGroup.controls['it_phone'].value;
    itContact.position = this.employerFormGroup.controls['it_position'].value;
    return itContact;
  }
  // _extractBankDetail(bankDetail?: BankDetail) {
  //   if (bankDetail === undefined) {
  //     bankDetail = <BankDetail>{};
  //   }
  //   bankDetail.accountNumber =
  //   this.employerFormGroup.controls['bankAccNumber'].value; bankDetail.bank =
  //   this.employerFormGroup.controls['bank'].value; bankDetail.name =
  //   this.employerFormGroup.controls['bankAccName'].value; return bankDetail;
  // }

  _extractAddress(address?: Address) {
    if (address === undefined) {
      address = <Address>{};
    }
    address.city = this.employerFormGroup.controls['city'].value;
    address.lga = this.employerFormGroup.controls['lga'].value;
    address.neighbourhood =
        this.employerFormGroup.controls['neighbourhood'].value;
    address.state = this.employerFormGroup.controls['state'].value;
    address.street = this.employerFormGroup.controls['address'].value;
    return address;
  }
  _extractEmployer(employer?: Employer) {
    if (employer === undefined) {
      employer = <Employer>{};
    }

    employer.industry = this.employerFormGroup.controls['type'].value;
    // employer.cin = this.employerFormGroup.controls['cinNumber'].value;
    employer.cacNumber = this.employerFormGroup.controls['cacNumber'].value;
    return employer;
  }

  _extractFacility(facility?: Facility) {
    const businessContact = this._extractBusinessContact();
    const itContact = this._extractITContact();
    // const bankDetails = this._extractBankDetail();
    const address = this._extractAddress();
    const employer = this._extractEmployer();

    if (facility === undefined) {
      facility = <Facility>{};
    }
    facility.address = address;
    // facility.bankDetails = bankDetails;
    facility.businessContact = businessContact;
    facility.itContact = itContact;
    facility.employer = employer;
    facility.email = this.employerFormGroup.controls['email'].value;
    facility.name = this.employerFormGroup.controls['employerName'].value;
    facility.phoneNumber = this.employerFormGroup.controls['phone'].value;
    facility.facilityType = this.selectedUserType;
    facility.platformOwnerId = this.currentPlatform;

    return facility;
  }

  onClickSaveEmployer(value: any, valid: boolean) {
    if (valid) {
      this._systemService.on();
      this.btnText = false;
      this.btnProcessing = true;
      this.disableBtn = true;

      let facility = this._extractFacility();
      if (!!this.selectedFacilityId) {
        // Edit Employer.
        Promise
            .all([
              this.uploadLogo(), this.uploadBContact(), this.uploadItContact()
            ])
            .then((allResult: any) => {
              if (allResult[0] !== undefined &&
                  allResult[0].body[0] !== undefined &&
                  allResult[0].body.length > 0) {
                facility.logo = allResult[0].body[0].file;
              }
              // Business Contact Image
              if (allResult[1] !== undefined &&
                  allResult[1].body[0] !== undefined &&
                  allResult[1].body.length > 0) {
                facility.businessContact.image = allResult[1].body[0].file;
              }
              // IT Contact Image.
              if (allResult[2] !== undefined &&
                  allResult[2].body[0] !== undefined &&
                  allResult[2].body.length > 0) {
                facility.itContact.image = allResult[2].body[0].file;
              }

              facility._id = this.selectedFacilityId;
              facility.employer.cin = this.facility.employer.cin;
              this._facilityService.update(facility)
                  .then((payload: any) => {
                    this._systemService.off();
                    // this.employerFormGroup.reset();
                    this.navigateEmployers(
                        '/modules/employer/employers/' + payload._id);
                    this._toastr.success(
                        'Employer has been updated successfully!', 'Success!');
                    this.btnText = true;
                    this.btnProcessing = false;
                    this.disableBtn = false;
                  })
                  .catch(err => {
                    this.btnText = true;
                    this.btnProcessing = false;
                    this.disableBtn = false;
                    this._systemService.off();
                  });
            });
      } else {
        // Create Employer.
        Promise
            .all([
              this.uploadLogo(), this.uploadBContact(), this.uploadItContact()
            ])
            .then((allResult: any) => {
              if (allResult[0] !== undefined &&
                  allResult[0].body[0] !== undefined &&
                  allResult[0].body.length > 0) {
                facility.logo = allResult[0].body[0].file;
              }
              // Business Contact Image
              if (allResult[1] !== undefined &&
                  allResult[1].body[0] !== undefined &&
                  allResult[1].body.length > 0) {
                facility.businessContact.image = allResult[1].body[0].file;
              }
              // IT Contact Image.
              if (allResult[2] !== undefined &&
                  allResult[2].body[0] !== undefined &&
                  allResult[2].body.length > 0) {
                facility.itContact.image = allResult[2].body[0].file;
              }

              this._facilityService.create(facility)
                  .then(payload => {
                    // this.employerFormGroup.reset();
                    this._systemService.off();
                    this._toastr.success(
                        'Employer has been created successfully!', 'Success!');
                    this.navigateEmployers('/modules/employer/employers');
                    this.btnText = true;
                    this.btnProcessing = false;
                    this.disableBtn = false;
                  })
                  .catch(err => {
                    this.btnText = true;
                    this.btnProcessing = false;
                    this.disableBtn = false;
                    this._systemService.off();
                  });
            });
      }
    } else {
      let counter = 0;
      this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
      Object.keys(this.employerFormGroup.controls).forEach((field, i) => {
        const control = this.employerFormGroup.get(field);
        if (!control.valid) {
          control.markAsDirty({onlySelf: true});
          counter = counter + 1;
        }
      });
    }
  }

  _getIndustries() {
    this._systemService.on();
    this._industryService.find({})
        .then((payload: any) => {
          this._systemService.off();
          this.industries = payload.data;
          if (this.facility !== undefined) {
            this.employerFormGroup.controls['type'].setValue(
                this.facility.employer.industry);
          }
        })
        .catch(err => {
          this._systemService.off();
        })
  }

  showImageBrowseDlg(context) {
    switch (context) {
      case 'b-contact':
        this.bInput.nativeElement.click();
        break;
      case 'it-contact':
        this.itInput.nativeElement.click();
        break;
      case 'logo':
        this.logoInput.nativeElement.click();
        break;
    }
  }

  readURL(input) {
    this._systemService.on();
    switch (input) {
      case 'b-contact':
        input = this.bInput.nativeElement;
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          let that = this;
          reader.onload = function(e: any) {
            that.bImage.nativeElement.src = e.target.result;
            that._systemService.off();
          };

          reader.readAsDataURL(input.files[0]);
        }
        break;
      case 'it-contact':
        input = this.itInput.nativeElement;
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          let that = this;
          reader.onload = function(e: any) {
            that.itImage.nativeElement.src = e.target.result;
            that._systemService.off();
          };

          reader.readAsDataURL(input.files[0]);
        }
        break;
      case 'logo':
        input = this.logoInput.nativeElement;
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          let that = this;
          reader.onload = function(e: any) {
            that.logoImage.nativeElement.src = e.target.result;
            that._systemService.off();
          };

          reader.readAsDataURL(input.files[0]);
        }
        break;
    }
  }

  uploadLogo() {
    let logoBrowser = this.logoInput.nativeElement;
    if (logoBrowser.files && logoBrowser.files[0]) {
      const formData = new FormData();
      formData.append('platform', logoBrowser.files[0]);
      return new Promise((resolve, reject) => {
        resolve(
            this._uploadService.upload(formData, this.selectedUserType._id));
      });
    }
  }

  uploadItContact() {
    let itBrowser = this.itInput.nativeElement;
    if (itBrowser.files && itBrowser.files[0]) {
      const formData = new FormData();
      formData.append('platform', itBrowser.files[0]);
      return new Promise((resolve, reject) => {
        resolve(
            this._uploadService.upload(formData, this.selectedUserType._id));
      });
    }
  }

  uploadBContact() {
    let bBrowser = this.bInput.nativeElement;
    if (bBrowser.files && bBrowser.files[0]) {
      const formData = new FormData();
      formData.append('platform', bBrowser.files[0]);
      return new Promise((resolve, reject) => {
        resolve(
            this._uploadService.upload(formData, this.selectedUserType._id));
      });
    }
  }

  private _initImages(facility: Facility) {
    if (!!facility.logo) {
      this.logoImage.nativeElement.src = facility.logo;
    }
    if (!!facility.businessContact.image) {
      this.bImage.nativeElement.src = facility.businessContact.image;
    }
    if (!!facility.itContact.image) {
      this.itImage.nativeElement.src = facility.itContact.image;
    }
  }

  navigateEmployers(url) {
    this._systemService.on();
    this._router.navigate([url])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        });
  }
}
