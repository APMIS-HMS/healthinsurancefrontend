import { TitleService } from './../../../../services/common/titles.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderEventEmitterService } from './../../../../services/event-emitters/header-event-emitter.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { GenderService } from './../../../../services/common/gender.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { UserTypeService, BankService, CountryService, FacilityService, SystemModuleService, UploadService } from '../../../../services/index';

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
  cities: any[] = [];
  genders: any[] = [];
  titles: any[] = [];

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
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._initialiseFormGroup();
    // this.stepOneFormGroup = this._fb.group({
    //   gender: [''],
    //   title: ['', [<any>Validators.required]],
    //   firstName: ['', [<any>Validators.required]],
    //   middleName: [''],
    //   lastName: ['', [<any>Validators.required]],
    //   phonenumber: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
    //   secondaryPhone: ['', [<any>Validators.pattern(PHONE_REGEX)]],
    //   email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
    //   dob: ['', [<any>Validators.required]],
    //   lasrraId: [''],
    //   stateOfOrigin: ['', [<any>Validators.required]],
    //   lgaOfOrigin: ['', [<any>Validators.required]],
    //   maritalStatus: ['', [<any>Validators.required]],
    //   noOfChildrenU18: ['', [<any>Validators.required]],
    //   streetName: ['', [<any>Validators.required]],
    //   lga: ['', [<any>Validators.required]],
    //   neighbourhood: ['', [<any>Validators.required]],
    //   mothermaidenname: ['']
    // });

    this._route.params.subscribe(param => {

      if (param.id !== undefined) {
        this._getBeneficiary(param.id);
      } else {
        this._initialiseFormGroup();
      }
    });
    this._getGenders();
    this._getTitles();
  }
  ngAfterViewInit() {
    this._video = this.video.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this._video.src = window.URL.createObjectURL(stream);
          this._video.play();
        })
    }
    this.context = this.snapshot.nativeElement.getContext("2d");
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
    let date = new Date();
    if (this.selectedBeneficiary.createdAt !== undefined) {
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

    // gender: [''],
    // title: ['', [<any>Validators.required]],
    // firstName: ['', [<any>Validators.required]],
    // middleName: [''],
    // lastName: ['', [<any>Validators.required]],
    // phonenumber: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
    // secondaryPhone: ['', [<any>Validators.pattern(PHONE_REGEX)]],
    // email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
    // dob: ['', [<any>Validators.required]],
    // lasrraId: [''],
    // stateOfOrigin: ['', [<any>Validators.required]],
    // lgaOfOrigin: ['', [<any>Validators.required]],
    // maritalStatus: ['', [<any>Validators.required]],
    // noOfChildrenU18: ['', [<any>Validators.required]],
    // streetName: ['', [<any>Validators.required]],
    // lga: ['', [<any>Validators.required]],
    // neighbourhood: ['', [<any>Validators.required]],
    // mothermaidenname: ['']


    this.stepOneFormGroup = this._fb.group({
      gender: [this.selectedBeneficiary != null ? this.selectedBeneficiary.name : '', [<any>Validators.required]],
      title: [this.selectedBeneficiary != null ? this.selectedBeneficiary.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      firstName: [this.selectedBeneficiary != null ? this.selectedBeneficiary.website : '', [<any>Validators.required, <any>Validators.pattern(WEBSITE_REGEX)]],
      middleName: [this.selectedBeneficiary.address != null ? this.selectedBeneficiary.address.street : '', [<any>Validators.required]],
      lastName: [this.selectedBeneficiary != null ? this.selectedBeneficiary.shortName : '', [<any>Validators.required]],
      phonenumber: [this.selectedBeneficiary.address != null ? this.selectedBeneficiary.address.state : '', [<any>Validators.required]],
      secondaryPhone: [this.selectedBeneficiary.address != null ? this.selectedBeneficiary.address.lga : '', [<any>Validators.required]],
      email: [this.selectedBeneficiary.address != null ? this.selectedBeneficiary.address.city : '', [<any>Validators.required]],
      dob: [this.selectedBeneficiary.address != null ? this.selectedBeneficiary.address.neighbourhood : '', [<any>Validators.required]],
      lasrraId: [this.selectedBeneficiary.address != null ? this.selectedBeneficiary.bankDetails.bank : '', [<any>Validators.required]],
      stateOfOrigin: [this.selectedBeneficiary.bankDetails != null ? this.selectedBeneficiary.bankDetails.name : '', [<any>Validators.required]],
      lgaOfOrigin: [this.selectedBeneficiary.bankDetails != null ? this.selectedBeneficiary.bankDetails.accountNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      maritalStatus: [this.selectedBeneficiary.businessContact != null ? this.selectedBeneficiary.businessContact.firstName : '', [<any>Validators.required]],
      noOfChildrenU18: [this.selectedBeneficiary.businessContact != null ? this.selectedBeneficiary.businessContact.lastName : '', [<any>Validators.required]],
      streetName: [this.selectedBeneficiary.businessContact != null ? this.selectedBeneficiary.businessContact.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      lga: [this.selectedBeneficiary.businessContact != null ? this.selectedBeneficiary.businessContact.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
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

}
