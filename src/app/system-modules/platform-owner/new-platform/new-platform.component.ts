import { IMyDpOptions, IMyDate, IMyDateModel } from 'mydatepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {
  UploadService, SystemModuleService, CountryService, BankService, UserTypeService, FacilityService,
  ContactPositionService, PlatformOwnerService
} from './../../../services/index';
import { Address, Facility, BankDetail, Contact } from './../../../models/index';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
// const PHONE_REGEX = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;

@Component({
  selector: 'app-new-platform',
  templateUrl: './new-platform.component.html',
  styleUrls: ['./new-platform.component.scss']
})
export class NewPlatformComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('blah') blah: ElementRef;
  saveBtn: String = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';
  platformFormGroup: FormGroup;
  hiaPlans: any[] = [];
  contactPositions: any[] = [];
  banks: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  lgs: any[] = [];
  cities: any[] = [];

  selectedUserType: any;
  selectedCountry: any;
  canAddImage = true;
  selectedFacility: any = <any>{};
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _contactPositionService: ContactPositionService,
    private _platformOwnerService: PlatformOwnerService,
    private _userTypeService: UserTypeService,
    private _bankService: BankService,
    private _countriesService: CountryService,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Platform');
    this._headerEventEmitter.setMinorRouteUrl('Create New Platform');
    this._initialiseFormGroup();
    this._getContactPositions();
    this._getUserTypes();
    this._getBanks();
    this._getCountries();
  }

  ngAfterViewInit() {
    this._route.params.subscribe(param => {

      if (param.id !== undefined) {
        this._getPlatform(param.id);
      } else {
        this._initialiseFormGroup();
      }
    })
  }

  _initialiseFormGroup() {
    let date = new Date(this.selectedFacility.createdAt);
    if (this.selectedFacility.createdAt !== undefined) {
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


    this.platformFormGroup = this._fb.group({
      platformName: [this.selectedFacility != null ? this.selectedFacility.name : '', [<any>Validators.required]],
      email: [this.selectedFacility != null ? this.selectedFacility.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      website: [this.selectedFacility != null ? this.selectedFacility.website : '', [<any>Validators.required, <any>Validators.pattern(WEBSITE_REGEX)]],
      address: [this.selectedFacility.address != null ? this.selectedFacility.address.street : '', [<any>Validators.required]],
      shortName: [this.selectedFacility != null ? this.selectedFacility.shortName : '', [<any>Validators.required]],
      state: [this.selectedFacility.address != null ? this.selectedFacility.address.state : '', [<any>Validators.required]],
      lga: [this.selectedFacility.address != null ? this.selectedFacility.address.lga : '', [<any>Validators.required]],
      city: [this.selectedFacility.address != null ? this.selectedFacility.address.city : '', [<any>Validators.required]],
      neighbourhood: [this.selectedFacility.address != null ? this.selectedFacility.address.neighbourhood : '', [<any>Validators.required]],
      bank: [this.selectedFacility.address != null ? this.selectedFacility.bankDetails.bank : '', [<any>Validators.required]],
      bankAccName: [this.selectedFacility.bankDetails != null ? this.selectedFacility.bankDetails.name : '', [<any>Validators.required]],
      bankAccNumber: [this.selectedFacility.bankDetails != null ? this.selectedFacility.bankDetails.accountNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      bc_fname: [this.selectedFacility.businessContact != null ? this.selectedFacility.businessContact.firstName : '', [<any>Validators.required]],
      bc_lname: [this.selectedFacility.businessContact != null ? this.selectedFacility.businessContact.lastName : '', [<any>Validators.required]],
      bc_email: [this.selectedFacility.businessContact != null ? this.selectedFacility.businessContact.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      bc_phone: [this.selectedFacility.businessContact != null ? this.selectedFacility.businessContact.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      bc_position: [this.selectedFacility.businessContact != null ? this.selectedFacility.businessContact.position : '', [<any>Validators.required]],
      it_fname: [this.selectedFacility.itContact != null ? this.selectedFacility.itContact.firstName : '', [<any>Validators.required]],
      it_lname: [this.selectedFacility.itContact != null ? this.selectedFacility.itContact.lastName : '', [<any>Validators.required]],
      it_position: [this.selectedFacility.itContact != null ? this.selectedFacility.itContact.position : '', [<any>Validators.required]],
      it_email: [this.selectedFacility.itContact != null ? this.selectedFacility.itContact.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      it_phone: [this.selectedFacility.itContact != null ? this.selectedFacility.itContact.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      registrationDate: [this.selectedFacility.createdAt != null ? this.selectedFacility.createdAt : this.today, [<any>Validators.required]]
    });
    console.log(this.selectedFacility);

    if (this.selectedFacility.name !== undefined) {
      this._getLgaAndCities(this.selectedFacility.address.state);
      if(this.selectedFacility.logo !== undefined){
        this.blah.nativeElement.src = this._uploadService.transform(this.selectedFacility.logo.thumbnail);
      }
    }

    this.platformFormGroup.controls['state'].valueChanges.subscribe(value => {
      if (value !== null) {
        this._getLgaAndCities(value, this.selectedCountry._id, );
      }
    });
  }

  _getPlatform(id) {
    this._systemService.on();
    this._facilityService.get(id, {}).then((payload: any) => {
      this.selectedFacility = payload;
      this._initialiseFormGroup();
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    })
  }

  _getCountries() {
    this._systemService.on();
    this._countriesService.find({
      query: {
        $limit: 200,
        $select: { 'states': 0 }
      }
    }).then((payload: any) => {
      this.countries = payload.data;
      this._systemService.off();
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
    console.log('call states')
    console.log(_id);
    this._systemService.on();
    this._countriesService.find({
      query: {
        _id: _id,
        $limit: 200,
        $select: { 'states.cities': 0, 'states.lgs': 0 }
      }
    }).then((payload: any) => {
      console.log(payload)
      this._systemService.off();
      if (payload.data.length > 0) {
        this.states = payload.data[0].states;
        console.log(this.states)
      }

    }).catch(error => {
      console.log(error)
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
      this.banks = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }
  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then((payload: any) => {
      if (payload.data.length > 0) {
        const index = payload.data.findIndex(x => x.name === 'Platform Owner');
        if (index > -1) {
          this.selectedUserType = payload.data[index];
        } else {
          this.selectedUserType = undefined;
        }
        this._systemService.off();
      }
    }, error => {
      this._systemService.off();
    })
  }

  _getContactPositions() {
    this._systemService.on();
    this._contactPositionService.find({}).then((payload: any) => {
      this.contactPositions = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }
  _extractBusinessContact(businessContact?: Contact) {
    if (businessContact === undefined) {
      businessContact = <Contact>{};
    }
    businessContact.lastName = this.platformFormGroup.controls['bc_fname'].value;
    businessContact.firstName = this.platformFormGroup.controls['bc_lname'].value;
    businessContact.email = this.platformFormGroup.controls['bc_email'].value;
    businessContact.phoneNumber = this.platformFormGroup.controls['bc_phone'].value;
    businessContact.position = this.platformFormGroup.controls['bc_position'].value;
    return businessContact;
  }
  _extractITContact(itContact?: Contact) {
    if (itContact === undefined) {
      itContact = <Contact>{};
    }
    itContact.lastName = this.platformFormGroup.controls['it_fname'].value;
    itContact.firstName = this.platformFormGroup.controls['it_lname'].value;
    itContact.email = this.platformFormGroup.controls['it_email'].value;
    itContact.phoneNumber = this.platformFormGroup.controls['it_phone'].value;
    itContact.position = this.platformFormGroup.controls['it_position'].value;
    return itContact;
  }
  _extractBankDetail(bankDetail?: BankDetail) {
    if (bankDetail === undefined) {
      bankDetail = <BankDetail>{};
    }
    bankDetail.accountNumber = this.platformFormGroup.controls['bankAccNumber'].value;
    bankDetail.bank = this.platformFormGroup.controls['bank'].value;
    bankDetail.name = this.platformFormGroup.controls['bankAccName'].value;
    return bankDetail;
  }

  _extractAddress(address?: Address) {
    if (address === undefined) {
      address = <Address>{};
    }
    address.city = this.platformFormGroup.controls['city'].value;
    address.lga = this.platformFormGroup.controls['lga'].value;
    address.neighbourhood = this.platformFormGroup.controls['neighbourhood'].value;
    address.state = this.platformFormGroup.controls['state'].value;
    address.street = this.platformFormGroup.controls['address'].value;
    return address;
  }

  _extractFacility(facility?: Facility) {
    const businessContact = this._extractBusinessContact();
    const itContact = this._extractITContact();
    const bankDetails = this._extractBankDetail();
    const address = this._extractAddress();

    if (facility === undefined) {
      facility = <Facility>{};
    }
    facility.address = address;
    facility.bankDetails = bankDetails;
    facility.businessContact = businessContact;
    facility.itContact = itContact;
    facility.email = this.platformFormGroup.controls['email'].value;
    facility.website = this.platformFormGroup.controls['website'].value;
    facility.shortName = this.platformFormGroup.controls['shortName'].value;
    facility.name = this.platformFormGroup.controls['platformName'].value;
    facility.phoneNumber = businessContact.phoneNumber;
    facility.facilityType = this.selectedUserType;

    return facility;
  }

  compare(l1: any, l2: any) {
    return l1._id === l2._id;
  }

  save(valid, value, image) {
    if (valid) {
      if (image.files && image.files[0]) {
        this._systemService.on();
        this.saveBtn = 'Please wait... &nbsp; <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';
        let facility = this._extractFacility();
  
        if (!!facility._id) {
          // Save image to the DB before going to save facility.
          this.upload(image).then((result: any) => {
            console.log(result);
            if (result !== undefined && result.body !== undefined && result.body.length > 0) {
              console.log(result.body[0].file)
              facility.logo = result.body[0].file;
              this._facilityService.update(facility).then((payload: Facility) => {
                this._systemService.off();
                this.saveBtn = 'SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';
                this._toastr.success('Platform has been created successfully!', 'Success!');
                this.platformFormGroup.reset();
                this._router.navigate(['/modules/platform/platforms', payload._id]);
              }).catch(err => {
                this._systemService.off();
              });
            }
          }).catch(err => {
            console.log(err);
            this._systemService.off();
          });
        } else {
          this.upload(image).then((result: any) => {
            console.log(result);
            if (result !== undefined && result.body !== undefined && result.body.length > 0) {
              console.log(result.body[0].file)
              facility.logo = result.body[0].file;
              this._facilityService.create(facility).then((payload: Facility) => {
                this._systemService.off();
                this.platformFormGroup.reset();
                this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
                this._toastr.success('Platform has been created successfully!', 'Success!');
                this._router.navigate(['/modules/platform/platforms', payload._id]);
              }).catch(err => {
                this._systemService.off();
              });
            }
          }).catch(err => {
            console.log(err);
            this._systemService.off();
          });
        }
      } else {
        this._systemService.off();
        this._toastr.error('Please select an image!', 'Form Validation Error!');
      }
    } else {
      this._systemService.off();
      this._toastr.error('Some required fields are empty!', 'Form Validation Error!');
    }
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  readURL(input) {
    this._systemService.on();
    input = this.fileInput.nativeElement;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      let that = this;
      reader.onload = function (e: any) {
        that.blah.nativeElement.src = e.target.result;
        that._systemService.off();
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  upload(image) {
    // this._systemService.on();
    // let fileBrowser = this.fileInput.nativeElement;
    if (image.files && image.files[0]) {
      const formData = new FormData();
      formData.append('platform', image.files[0]);
      // return new Promise((resolve, reject) => {
      //   resolve(this._uploadService.upload(formData, this.selectedUserType._id));
      // });
      return new Promise((resolve, reject) => {
        this._uploadService.upload(formData, this.selectedUserType._id).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });




      // this._systemService.upload(formData, this.selectedUserType._id).then(res => {
      //   this._systemService.off();
      //   console.log(res);
      //   let enrolleeList: any[] = [];
      //   if (res.body !== undefined && res.body.error_code === 0) {
      //   }
      // }).catch(err => {
      //   this._systemService.off();
      // })
    }
  }
  // onDateChanged(event: IMyDateModel) {
  //   //this.renewalDate = event.formatted;
  //   this.platformFormGroup.patchValue({
  //     registrationDate: this.today
  //   })
  // }

  setDate(): void {
    this.platformFormGroup.patchValue({
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
    this.platformFormGroup.patchValue({ registrationDate: null });
  }
}
