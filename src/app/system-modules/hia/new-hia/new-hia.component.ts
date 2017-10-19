import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { UploadService } from './../../../services/common/upload.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { LoadingBarService } from '@ngx-loading-bar/core';
import {
  SystemModuleService, CountryService, BankService, ContactPositionService, UserTypeService,
  FacilityService, HiaTypeService, HiaGradeService
} from './../../../services/index';
import { HIA } from './../../../models/organisation/hia';
import { Address, Facility, Gender, Title, MaritalStatus, Person, Beneficiary, Hia, Contact, BankDetail } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { CurrentPlaformShortName, FORM_VALIDATION_ERROR_MESSAGE } from '../../../services/globals/config';

// import { Contact, BankDetail } from '../../../models/index';
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;
@Component({
  selector: 'app-new-hia',
  templateUrl: './new-hia.component.html',
  styleUrls: ['./new-hia.component.scss']
})
export class NewHiaComponent implements OnInit {
  @ViewChild('logoInput') logoInput: ElementRef;
  @ViewChild('logoImage') logoImage: ElementRef;
  @ViewChild('bInput') bInput: ElementRef;
  @ViewChild('bImage') bImage: ElementRef;
  @ViewChild('itInput') itInput: ElementRef;
  @ViewChild('itImage') itImage: ElementRef;
  hiaFormGroup: FormGroup;
  hiaTypes: any = [];
  hiaGrades: any = [];
  hiaPlans: any = [];
  contactPositions: any = [];
  plans: any = [];
  userTypes: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  lgs: any[] = [];
  cities: any[] = [];
  banks: any[] = [];
  btnText: boolean = true;
  btnProcessing: boolean = false;
  updateBtnText: boolean = false;
  disableBtn: boolean = false;

  selectedUserType: any;
  selectedCountry: any;
  selectedFacility: any = <any>{};

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy', 
  };

  public today: IMyDate;
  currentPlatform: Facility = <Facility>{};

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _userTypeService: UserTypeService,
    private _contactPositionService: ContactPositionService,
    private _facilityService: FacilityService,
    private _bankService: BankService,
    private _countriesService: CountryService,
    private _systemService: SystemModuleService,
    private _route: ActivatedRoute,
    private _uploadService: UploadService,
    private _router: Router,
    private _hiaTypeService: HiaTypeService,
    private _hiaGradeService: HiaGradeService
  ) { }
  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New HIA');
    this._headerEventEmitter.setMinorRouteUrl('Create New Health Insurance Agent');
    this._initialiseFormGroup();

    this._getContactPositions();
    this._getUserTypes();
    this._getBanks();
    this._getCountries();
    this._getCurrentPlatform();
    this._getHiaGrades();
    this._getHiaTypes();

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this.updateBtnText = true;
        this.btnProcessing = false;
        this.btnText = false;

        this._getHIA(param.id);
      } else {
        this._initialiseFormGroup();
      }
    })

  }
  
  _getHiaTypes() {
    this._systemService.on();
    this._hiaTypeService.find({
      query: {
        $limit: 200
      }
    }).then((payload: any) => {
      this._systemService.off();
      this.hiaTypes = payload.data;
    }).catch(err => {
      this._systemService.off();
    })
  }

  _getHiaGrades() {
    this._systemService.on();
    this._hiaGradeService.find({
      query: {
        $limit: 200
      }
    }).then((payload: any) => {
      this._systemService.off();
      this.hiaGrades = payload.data;
    }).catch(err => {
      this._systemService.off();
    })
  }
  _getHIA(id) {
    this._systemService.on();
    this._facilityService.get(id, {}).then((payload: any) => {
      this.selectedFacility = payload;
      console.log(this.selectedFacility)
      this._initialiseFormGroup();
      this._initImages(payload);
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    })
  }


  _initialiseFormGroup() {
    let date = this.selectedFacility.hia === undefined ? new Date() : new Date(this.selectedFacility.hia.registrationDate);
    if (this.selectedFacility.hia !== undefined) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.today = {
        year: year,
        month: month,
        day: day
      }
    } else {
      this.today = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    }


    this.hiaFormGroup = this._fb.group({
      agentName: [this.selectedFacility != null ? this.selectedFacility.name : '', [<any>Validators.required]],
      email: [this.selectedFacility != null ? this.selectedFacility.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      address: [this.selectedFacility.address != null ? this.selectedFacility.address.street : '', [<any>Validators.required]],
      state: [this.selectedFacility.address != null ? this.selectedFacility.address.state : '', [<any>Validators.required]],
      lga: [this.selectedFacility.address != null ? this.selectedFacility.address.lga : '', [<any>Validators.required]],
      city: [this.selectedFacility.address != null ? this.selectedFacility.address.city : '', [<any>Validators.required]],
      neighbourhood: [this.selectedFacility.address != null ? this.selectedFacility.address.neighbourhood : '', [<any>Validators.required]],
      phone: [this.selectedFacility != null ? this.selectedFacility.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],

      businessContactFirstName: [this.selectedFacility.businessContact != null ? this.selectedFacility.businessContact.firstName : '', [<any>Validators.required]],
      businessContactName: [this.selectedFacility.businessContact != null ? this.selectedFacility.businessContact.lastName : '', [<any>Validators.required]],
      businessContactEmail: [this.selectedFacility.businessContact != null ? this.selectedFacility.businessContact.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      businessContactNumber: [this.selectedFacility.businessContact != null ? this.selectedFacility.businessContact.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      businessContactPosition: [this.selectedFacility.businessContact != null ? this.selectedFacility.businessContact.position : '', [<any>Validators.required]],
      iTContactFirstName: [this.selectedFacility.itContact != null ? this.selectedFacility.itContact.firstName : '', [<any>Validators.required]],
      iTContactName: [this.selectedFacility.itContact != null ? this.selectedFacility.itContact.lastName : '', [<any>Validators.required]],
      iTContactPosition: [this.selectedFacility.itContact != null ? this.selectedFacility.itContact.position : '', [<any>Validators.required]],
      iTContactEmail: [this.selectedFacility.itContact != null ? this.selectedFacility.itContact.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      iTContactNumber: [this.selectedFacility.itContact != null ? this.selectedFacility.itContact.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      type: [this.selectedFacility.hia != null ? this.selectedFacility.hia.type : '', [<any>Validators.required]],
      grade: [this.selectedFacility.hia != null ? this.selectedFacility.hia.grade : '', [<any>Validators.required]],
      facilityType: [this.selectedFacility != null ? this.selectedFacility.facilityType : '', [<any>Validators.required]],
      bank: [this.selectedFacility.address != null ? this.selectedFacility.bankDetails.bank : '', [<any>Validators.required]],
      bankAccName: [this.selectedFacility.bankDetails != null ? this.selectedFacility.bankDetails.name : '', [<any>Validators.required]],
      bankAccNumber: [this.selectedFacility.bankDetails != null ? this.selectedFacility.bankDetails.accountNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      nhisNumber: [this.selectedFacility.hia != null ? this.selectedFacility.hia.nhisNumber : '', [<any>Validators.required]],
      // cinNumber: [this.selectedFacility.hia != null ? this.selectedFacility.hia.cin : '', [<any>Validators.required]],
      registrationDate: [this.selectedFacility.hia != null ? this.selectedFacility.hia.registrationDate : this.today, [<any>Validators.required]]
    });
    console.log(this.selectedFacility);



    if (this.selectedFacility.name !== undefined) {
      this._getLgaAndCities(this.selectedFacility.address.state);
      // if (this.selectedFacility.logo !== undefined) {
      //   this.blah.nativeElement.src = this._uploadService.transform(this.selectedFacility.logo.thumbnail);
      // }
    }

    this.hiaFormGroup.controls['state'].valueChanges.subscribe(value => {
      if (value !== null) {
        this._getLgaAndCities(value, this.selectedCountry._id, );
      }
    });
  }

  _getCountries() {
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
    })
  }
  _getStates(_id) {
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
    })
  }

  _getLgaAndCities(state, _id?) {
    this._systemService.on();
    this._countriesService.find({
      query: {
        "states.name": state.name,
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
    })
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
    })
  }

  _extractBusinessContact(businessContact?: Contact) {
    if (businessContact === undefined) {
      businessContact = <Contact>{};
    }
    businessContact.lastName = this.hiaFormGroup.controls['businessContactName'].value;
    businessContact.firstName = this.hiaFormGroup.controls['businessContactFirstName'].value;
    businessContact.email = this.hiaFormGroup.controls['businessContactEmail'].value;
    businessContact.phoneNumber = this.hiaFormGroup.controls['businessContactNumber'].value;
    businessContact.position = this.hiaFormGroup.controls['businessContactPosition'].value;
    return businessContact;
  }
  _extractITContact(itContact?: Contact) {
    if (itContact === undefined) {
      itContact = <Contact>{};
    }
    itContact.lastName = this.hiaFormGroup.controls['iTContactName'].value;
    itContact.firstName = this.hiaFormGroup.controls['iTContactFirstName'].value;
    itContact.email = this.hiaFormGroup.controls['iTContactEmail'].value;
    itContact.phoneNumber = this.hiaFormGroup.controls['iTContactNumber'].value;
    itContact.position = this.hiaFormGroup.controls['iTContactPosition'].value;
    return itContact;
  }
  _extractBankDetail(bankDetail?: BankDetail) {
    if (bankDetail === undefined) {
      bankDetail = <BankDetail>{};
    }
    bankDetail.accountNumber = this.hiaFormGroup.controls['bankAccNumber'].value;
    bankDetail.bank = this.hiaFormGroup.controls['bank'].value;
    bankDetail.name = this.hiaFormGroup.controls['bankAccName'].value;
    return bankDetail;
  }

  _extractAddress(address?: Address) {
    if (address === undefined) {
      address = <Address>{};
    }
    address.city = this.hiaFormGroup.controls['city'].value;
    address.lga = this.hiaFormGroup.controls['lga'].value;
    address.neighbourhood = this.hiaFormGroup.controls['neighbourhood'].value;
    address.state = this.hiaFormGroup.controls['state'].value;
    address.street = this.hiaFormGroup.controls['address'].value;
    return address;
  }
  _extractHIA(hia?: HIA) {
    if (hia === undefined) {
      hia = <HIA>{};
    }
    hia.nhisNumber = this.hiaFormGroup.controls['nhisNumber'].value;
    // hia.cin = this.hiaFormGroup.controls['cinNumber'].value;
    hia.type = this.hiaFormGroup.controls['type'].value;
    hia.grade = this.hiaFormGroup.controls['grade'].value;
    hia.registrationDate = this.hiaFormGroup.controls['registrationDate'].value.jsdate;
    return hia;
  }

  _extractFacility(facility?: Facility) {


    if (facility === undefined) {
      facility = <Facility>{};
      const businessContact = this._extractBusinessContact();
      const itContact = this._extractITContact();
      const bankDetails = this._extractBankDetail();
      const address = this._extractAddress();
      const hia = this._extractHIA();
      facility.address = address;
      facility.bankDetails = bankDetails;
      facility.businessContact = businessContact;
      facility.itContact = itContact;
      facility.hia = hia;
    } else {
      const businessContact = this._extractBusinessContact(facility.businessContact);
      const itContact = this._extractITContact(facility.itContact);
      const bankDetails = this._extractBankDetail(facility.bankDetails);
      const address = this._extractAddress(facility.address);
      const hia = this._extractHIA(facility.hia);
      facility.address = address;
      facility.bankDetails = bankDetails;
      facility.businessContact = businessContact;
      facility.itContact = itContact;
      facility.hia = hia;
    }

    facility.email = this.hiaFormGroup.controls['email'].value;
    facility.name = this.hiaFormGroup.controls['agentName'].value;
    facility.phoneNumber = this.hiaFormGroup.controls['phone'].value;
    facility.facilityType = this.selectedUserType;
    facility.platformOwnerId = this.currentPlatform;

    return facility;
  }

  _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      console.log(res);
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        console.log(this.currentPlatform);
      }
    }).catch(err => {
      console.log(err);
    });
  }
  save(valid, value) {
    if (valid) {
      this._systemService.on();
      this.btnText = false;
      this.updateBtnText = false;
      this.btnProcessing = true;
      this.disableBtn = true;

      let facility = this.selectedFacility._id === undefined ? this._extractFacility() : this._extractFacility(this.selectedFacility)
      if (facility._id === undefined) {
        Promise.all([this.uploadLogo(), this.uploadBContact(), this.uploadItContact()]).then((allResult: any) => {
          console.log(allResult);
          if (allResult[0] !== undefined && allResult[0].body[0] !== undefined && allResult[0].body.length > 0) {
            facility.logo = allResult[0].body[0].file;
          }
          // Business Contact Image
          if (allResult[1] !== undefined && allResult[1].body[0] !== undefined && allResult[1].body.length > 0) {
            facility.businessContact.image = allResult[1].body[0].file;
          }
          // IT Contact Image.
          if (allResult[2] !== undefined && allResult[2].body[0] !== undefined && allResult[2].body.length > 0) {
            facility.itContact.image = allResult[2].body[0].file;
          }
          // facility.hia.cin = this.selectedFacility.hia.cin;
          this._facilityService.create(facility).then((payload: Facility) => {
            this._systemService.off();
            this._toastr.success('Health Insurance Agent has been created successfully!', 'Success!');
            this.hiaFormGroup.reset();
            this._router.navigate(['/modules/hia/hias']);
          }).catch(err => {
            console.log(err);
            this.btnText = true;
            this.updateBtnText = false;
            this.btnProcessing = false;
            this.disableBtn = false;
            this._systemService.off();
          });
        });
        // } else {
        //   console.log(4)
        //   this._facilityService.create(facility).then((payload: Facility) => {
        //     this._systemService.off();
        //     // this.hiaFormGroup.reset();
        //     this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
        //     this._toastr.success('Health Insurance Agent has been created successfully!', 'Success!');
        //     this._router.navigate(['/modules/hia/hias']);
        //   }).catch(err => {
        //     console.log(err)
        //     this._systemService.off();
        //   });
        // }
      } else {
        Promise.all([this.uploadLogo(), this.uploadBContact(), this.uploadItContact()]).then((allResult: any) => {
          console.log(allResult);
          if (allResult[0] !== undefined && allResult[0].body[0] !== undefined && allResult[0].body.length > 0) {
            facility.logo = allResult[0].body[0].file;
          }
          // Business Contact Image
          if (allResult[1] !== undefined && allResult[1].body[0] !== undefined && allResult[1].body.length > 0) {
            facility.businessContact.image = allResult[1].body[0].file;
          }
          // IT Contact Image.
          if (allResult[2] !== undefined && allResult[2].body[0] !== undefined && allResult[2].body.length > 0) {
            facility.itContact.image = allResult[2].body[0].file;
          }

          facility.hia.cin = this.selectedFacility.hia.cin;
          this._facilityService.update(facility).then((payload: Facility) => {
            this._systemService.off();
            this._toastr.success('Health Insurance Agent has been created successfully!', 'Success!');
            this.hiaFormGroup.reset();
            this._router.navigate(['/modules/hia/hias']);
          }).catch(err => {
            console.log(err);
            this.btnText = false;
            this.updateBtnText = true;
            this.btnProcessing = false;
            this.disableBtn = false;
            this._systemService.off();
          });
        });

        // } else {
        //   console.log(6)
        //   this._facilityService.update(facility).then((payload: Facility) => {
        //     this._systemService.off();
        //     // this.hiaFormGroup.reset();
        //     this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
        //     this._toastr.success('Health Insurance Agent has been created successfully!', 'Success!');
        //     this._router.navigate(['/modules/hia/hias']);
        //   }).catch(err => {
        //     this._systemService.off();
        //   });
        // }
      }
    } else {
      this._systemService.off();
      let counter = 0;
      this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
      Object.keys(this.hiaFormGroup.controls).forEach((field, i) => {
        const control = this.hiaFormGroup.get(field);
        if (!control.valid) {
          control.markAsDirty({ onlySelf: true });
          counter = counter + 1;
        }
      });
    }
  }

  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.findAll().then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.userTypes = payload.data;
        const index = payload.data.findIndex(x => x.name === 'Health Insurance Agent');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
          this.hiaFormGroup.controls['facilityType'].setValue(this.selectedUserType);
        } else {
          this.selectedUserType = undefined;
          this.hiaFormGroup.controls['facilityType'].reset();
        }
      }
    }, error => {
      this._systemService.off();
    })
  }

  _getContactPositions() {
    this._systemService.on();
    this._contactPositionService.find({}).then((payload: any) => {
      this._systemService.off();
      this.contactPositions = payload.data;
    }).catch(err => {
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
          reader.onload = function (e: any) {
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
          reader.onload = function (e: any) {
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
          reader.onload = function (e: any) {
            console.log(e);
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
      formData.append("platform", logoBrowser.files[0]);
      return new Promise((resolve, reject) => {
        resolve(this._uploadService.upload(formData, this.selectedUserType._id));
      });
    }
  }

  uploadItContact() {
    let itBrowser = this.itInput.nativeElement;
    if (itBrowser.files && itBrowser.files[0]) {
      const formData = new FormData();
      formData.append("platform", itBrowser.files[0]);
      return new Promise((resolve, reject) => {
        resolve(this._uploadService.upload(formData, this.selectedUserType._id));
      });
    }
  }

  uploadBContact() {
    let bBrowser = this.bInput.nativeElement;
    if (bBrowser.files && bBrowser.files[0]) {
      const formData = new FormData();
      formData.append("platform", bBrowser.files[0]);
      return new Promise((resolve, reject) => {
        resolve(this._uploadService.upload(formData, this.selectedUserType._id));
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


  compareState(s1: any, s2: any) {
    return s1._id === s2._id;
  }

  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1._id === l2._id;
    }
    return false;
  }

  setDate(): void {
    this.hiaFormGroup.patchValue({
      registrationDate: {
        date: {
          year: this.today.year,
          month: this.today.month,
          day: this.today.day
        }
      }
    });
  }
  clearDate(): void {
    this.hiaFormGroup.patchValue({ registrationDate: null });
  }
}
