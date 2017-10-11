import { Address } from './../../../../models/organisation/address';
import { BeneficiaryService } from './../../../../services/beneficiary/beneficiary.service';
import { Beneficiary } from './../../../../models/setup/beneficiary';
import { MaritalStatusService } from './../../../../services/common/marital-status.service';
import { TitleService } from './../../../../services/common/titles.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderEventEmitterService } from './../../../../services/event-emitters/header-event-emitter.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { GenderService } from './../../../../services/common/gender.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { CurrentPlaformShortName } from '../../../../services/globals/config';
import { UserTypeService, BankService, CountryService, FacilityService, SystemModuleService, UploadService } from '../../../../services/index';
import { Person } from '../../../../models/index';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX = /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;

@Component({
  selector: 'app-new-beneficiary-data',
  templateUrl: './new-beneficiary-data.component.html',
  styleUrls: ['./new-beneficiary-data.component.scss']
})
export class NewBeneficiaryDataComponent implements OnInit {

  @ViewChild('video') video: any;
  @ViewChild('snapshot') snapshot: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('blah') blah: ElementRef;
  public context: CanvasRenderingContext2D;
  stepOneView: Boolean = true;
  stepTwoView: Boolean = false;
  stepThreeView: Boolean = false;
  stepFourView: Boolean = false;

  banks: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  lgs: any[] = [];
  residenceLgs: any[] = [];
  cities: any[] = [];
  genders: any[] = [];
  titles: any[] = [];
  maritalStatuses: any[] = [];

  _video: any;
  patCanvas: any;
  patData: any;
  patOpts = { x: 0, y: 0, w: 25, h: 25 };

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  stepOneFormGroup: FormGroup;
  selectedBeneficiary: any = <any>{};
  selectedCountry: any;
  currentPlatform: any;
  selectedState: any;
  stream: any;
  btnCamera = 'Use Camera';

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
    private _beneficiaryService: BeneficiaryService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._initialiseFormGroup();


    this._route.params.subscribe(param => {

      if (param.id !== undefined) {
        this._getBeneficiary(param.id);
      } else {
        this._initialiseFormGroup();
      }
    });

    this._getCurrentPlatform();
    this._getCountries();
    this._getGenders();
    this._getTitles();
    this._getMaritalStatus();
  }
  ngAfterViewInit() {
    this._video = this.video.nativeElement;
    this.context = this.snapshot.nativeElement.getContext("2d");
  }

  _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      console.log(res);
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getLga(this.currentPlatform.address.state);
      }
    }).catch(err => {
      console.log(err);
    });
  }
  _getMaritalStatus() {
    this._systemService.on();
    this._maritalService.find({}).then((payload: any) => {
      this.maritalStatuses = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }
  _getTitles() {
    this._systemService.on();
    this._titleService.find({}).then((payload: any) => {
      this.titles = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }
  _getGenders() {
    this._systemService.on();
    this._genderService.find({}).then((payload: any) => {
      this.genders = payload.data;
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }
  _getBeneficiary(id) {

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

  _initialiseFormGroup() {
    let date = this.selectedBeneficiary.person === undefined ? new Date() : new Date(this.selectedBeneficiary.person.dateOfBirth);
    if (this.selectedBeneficiary.person !== undefined) {
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

    this.stepOneFormGroup = this._fb.group({
      gender: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.gender : '', [<any>Validators.required]],
      title: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.title : '', [<any>Validators.required]],
      firstName: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.firstName : '', [<any>Validators.required]],
      otherNames: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.otherNames : '', []],
      lastName: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.shortName : '', [<any>Validators.required]],
      phonenumber: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      secondaryPhone: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.secondaryPhoneNumber : '', [<any>Validators.pattern(PHONE_REGEX)]],
      email: [this.selectedBeneficiary.address != null ? this.selectedBeneficiary.address.city : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      dob: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.dateOfBirth : this.today, [<any>Validators.required]],
      lashmaId: [this.selectedBeneficiary.address != null ? this.selectedBeneficiary.bankDetails.bank : '', []],
      lasrraId: [this.selectedBeneficiary.address != null ? this.selectedBeneficiary.bankDetails.bank : '', [<any>Validators.required]],
      stateOfOrigin: [this.selectedBeneficiary.bankDetails != null ? this.selectedBeneficiary.bankDetails.name : '', [<any>Validators.required]],
      lgaOfOrigin: [this.selectedBeneficiary.bankDetails != null ? this.selectedBeneficiary.bankDetails.accountNumber : '', [<any>Validators.required]],
      maritalStatus: [this.selectedBeneficiary.businessContact != null ? this.selectedBeneficiary.businessContact.firstName : '', [<any>Validators.required]],
      noOfChildrenU18: [this.selectedBeneficiary.businessContact != null ? this.selectedBeneficiary.businessContact.lastName : '', [<any>Validators.required]],
      streetName: [this.selectedBeneficiary.businessContact != null ? this.selectedBeneficiary.businessContact.email : '', [<any>Validators.required]],
      lga: [this.selectedBeneficiary.businessContact != null ? this.selectedBeneficiary.businessContact.phoneNumber : '', [<any>Validators.required]],
      neighbourhood: [this.selectedBeneficiary.businessContact != null ? this.selectedBeneficiary.businessContact.position : '', [<any>Validators.required]],
      mothermaidenname: [this.selectedBeneficiary.itContact != null ? this.selectedBeneficiary.itContact.firstName : '', [<any>Validators.required]]
    });
    console.log(this.selectedBeneficiary);

    if (this.selectedBeneficiary.name !== undefined) {
      this._getLgaAndCities(this.selectedBeneficiary.address.state);
      if (this.selectedBeneficiary.logo !== undefined) {
        this.blah.nativeElement.src = this._uploadService.transform(this.selectedBeneficiary.logo.thumbnail);
      }
    }

    this.stepOneFormGroup.controls['stateOfOrigin'].valueChanges.subscribe(value => {
      console.log(value);
      if (value !== null) {
        this._getLgaAndCities(value, this.selectedCountry._id, );
      }
    });
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

  _getLga(state) {
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
          this.residenceLgs = states[0].lgs;
          this.selectedState = states[0];
        }
      }

    }).catch(error => {
      this._systemService.off();
    })
  }

  startCamera() {
    if (this.btnCamera === 'Use Camera') {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            this.stream = stream;
            this._video.src = window.URL.createObjectURL(stream);
            this._video.play();
          })
      }
      this.btnCamera = 'Stop Camera';
    } else {
      this._video.src = null;
      var track = this.stream.getTracks()[0];
      track.stop();
      this.btnCamera = 'Use Camera';
    }

  }

  changeGender($event, gender) {
    this.stepOneFormGroup.controls['gender'].setValue(gender);
  }
  onClickStepOne(value, valid) {
    console.log(valid)
    console.log(value);
    let person: Person = <Person>{};
    let address: Address = <Address>{};
    // address.city
    address.lga = value.lga;
    address.neighbourhood = value.neighbourhood;
    address.state = this.selectedState;
    address.street = value.streetName;

    person.dateOfBirth = value.dob.jsdate;
    person.email = value.email;
    person.firstName = value.firstName;
    person.gender = value.gender;
    person.homeAddress = address;
    person.lastName = value.lastName;
    person.lgaOfOrigin = value.lgaOfOrigin;
    person.maritalStatus = value.maritalStatus;
    person.mothersMaidenName = value.mothermaidenname;
    // person.nationality = this.
    person.otherNames = value.otherNames;
    person.phoneNumber = value.phonenumber;
    person.platformOnwerId = this.currentPlatform._id;
    person.stateOfOrigin = value.stateOfOrigin;
    person.title = value.title;
    console.log(person);

    let beneficiary: Beneficiary = <Beneficiary>{};
    beneficiary.numberOfUnderAge = value.noOfChildrenU18;
    beneficiary.platformOwnerId = this.currentPlatform;

    let policy: any = <any>{};


    this._beneficiaryService.createWithMiddleWare({ person: person, beneficiary: beneficiary, policy: policy, platform: this.currentPlatform }).then(payload => {
      console.log(payload);
      if (payload.statusCode === 200 && payload.error === false) {
        this._systemService.announceBeneficiaryTabNotification('Two');
      }
    }).catch(err => {
      console.log(err);
    })

  }

  makeSnapshot() {
    console.log(1)
    if (this._video) {
      console.log(2)
      // let patCanvas: any =  this.context;//document.querySelector('#snapshot');
      // if (!patCanvas) return;

      // patCanvas.width = this._video.width;
      // patCanvas.height = this._video.height;
      // var ctxPat = patCanvas.getContext('2d');

      console.log(this.context);

      var idata = this.getVideoData(this.patOpts.x, this.patOpts.y, this.patOpts.w, this.patOpts.h);
      console.log(idata)
      this.context.putImageData(idata, 300, 300);
      // this.context.drawImage(idata, 0, 0, 400, 400);
      console.log(3)
      this.patData = idata;
    }
  };

  getVideoData(x, y, w, h) {
    console.log('2a')
    var hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = this._video.width;
    hiddenCanvas.height = this._video.height;
    var ctx = hiddenCanvas.getContext('2d');
    ctx.drawImage(this._video, 0, 0, this._video.width, this._video.height);
    console.log('2b')
    return ctx.getImageData(x, y, w, h);
  };

  setDate(): void {
    this.stepOneFormGroup.patchValue({
      dob: {
        date: {
          year: this.today.year,
          month: this.today.month,
          day: this.today.day
        }
      }
    });
  }
  clearDate(): void {
    this.stepOneFormGroup.patchValue({ dob: null });
  }
}
