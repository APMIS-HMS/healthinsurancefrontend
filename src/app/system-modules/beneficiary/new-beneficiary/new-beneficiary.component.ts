import { SystemModuleService } from './../../../services/common/system-module.service';
import { MaritalStatusService } from './../../../services/common/marital-status.service';
import { TitleService } from './../../../services/common/titles.service';
import { GenderService } from './../../../services/common/gender.service';
import { CountryService } from './../../../services/common/country.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Address, Facility, Gender, Title, MaritalStatus, Person, Beneficiary } from '../../../models/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { FacilityService } from '../../../services/common/facility.service';

@Component({
  selector: 'app-new-beneficiary',
  templateUrl: './new-beneficiary.component.html',
  styleUrls: ['./new-beneficiary.component.scss']
})
export class NewBeneficiaryComponent implements OnInit {

  @ViewChild('video') video: any;
  @ViewChild('snapshot') snapshot: ElementRef;
  public context: CanvasRenderingContext2D;
  stepOneView: Boolean = true;
  stepTwoView: Boolean = false;
  stepThreeView: Boolean = false;
  stepFourView: Boolean = false;
  stepOneFormGroup: FormGroup;
  frmDependants: FormGroup;
  frmProgram: FormGroup;

  tab_personalData = true;
  tab_dependants = false;
  tab_program = false;
  tab_confirm = false;

  selectedFacility: any[] = [];
  states: any[] = [];
  titles: Title[] = [];
  genders: Gender[] = [];
  cities: any[] = [];
  lgs: any[] = [];
  countries: any[] = [];
  selectedLgas: any[] = [];
  selectedStateId: String = '';
  maritalStatuses: MaritalStatus[] = [];
  providers: any[] = [];
  hias: any[] = [];
  beneficiary: any = <Beneficiary>{};
  countryId: String = '';
  stateId: String = '';
  saveBtn: String = '&nbsp;&nbsp; SAVE &nbsp; <i class="fa fa-check" aria-hidden="true"></i>';
  selectedCountry: any;
  selectedState: any;
  _video: any;
  patCanvas: any;
  patData: any;
  patOpts = { x: 0, y: 0, w: 25, h: 25 };
  constructor(
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _fb: FormBuilder,
    private _countriesService: CountryService,
    private _genderService: GenderService,
    private _titleService: TitleService,
    private _maritalStatusService: MaritalStatusService,
    private _systemService: SystemModuleService,
    // private _personService: PersonService,
    private _facilityService: FacilityService,
    // private _hiaService: HiaService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Beneficiary');
    this._headerEventEmitter.setMinorRouteUrl('');

    // this.getAllProviders();
    // this.getAllHias();

    this._getCountries();
    this._getTitles();
    this._getGender();
    this._getMaritalStatus();

    this.stepOneFormGroup = this._fb.group({
      gender: [''],
      title: ['', [<any>Validators.required]],
      firstName: ['', [<any>Validators.required]],
      middleName: [''],
      lastName: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      dob: ['', [<any>Validators.required]],
      lasrraId: [''],
      stateOfOrigin: ['', [<any>Validators.required]],
      lgaOfOrigin: ['', [<any>Validators.required]],
      maritalStatus: ['', [<any>Validators.required]],
      noOfChildrenU18: ['', [<any>Validators.required]],
      noOfDependents: ['', [<any>Validators.required]],
      streetName: ['', [<any>Validators.required]],
      lga: ['', [<any>Validators.required]],
      neighbourhood: ['', [<any>Validators.required]],
      phonenumber: ['', [<any>Validators.required]],
      secondaryPhone: [''],
    });
    this.frmDependants = this._fb.group({
      firstName: ['', [<any>Validators.required]],
      middleName: [''],
      lastName: ['', [<any>Validators.required]],
      dob: ['', [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      relationship: ['', [<any>Validators.required]],
      lasrraId: ['', [<any>Validators.required]]
    });
    this.frmProgram = this._fb.group({
      hiaName: [''],
      programType: ['', [<any>Validators.required]],
      programName: ['', [<any>Validators.required]],
      providerName: ['', [<any>Validators.required]]
    });
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
  _getGender() {
    this._genderService.find({}).then((payload: any) => {
      this.genders = payload.data;
    }).catch(err => {

    })
  }

  _getTitles() {
    this._titleService.find({}).then((payload: any) => {
      this.titles = payload.data;
    })
  }

  _getMaritalStatus() {
    this._maritalStatusService.find({}).then((payload: any) => {
      this.maritalStatuses = payload.data;
    }).catch(err => {

    })
  }

  _getCountries() {
    this._systemService.on();
    this._countriesService.find({
      query: {
        $limit: 200,
        $select: { "states": 0 }
      }
    }).then((payload: any) => {
      this._systemService.off();
      this.countries = payload.data;
      const index = this.countries.findIndex(x => x.name === 'Nigeria');
      if (index > -1) {
        this.selectedCountry = this.countries[index];
        this._getStates(this.selectedCountry._id);
        if (this.selectedState !== undefined) {
          this._getLgaAndCities(this.selectedCountry._id, this.selectedState);
        }
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
        $select: { "states.cities": 0, "states.lgs": 0 }
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

  _getLgaAndCities(_id, state) {
    this._systemService.on();
    this._countriesService.find({
      query: {
        _id: _id,
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

  tabConfirm_click() {
    this.tab_personalData = false;
    this.tab_dependants = false;
    this.tab_program = false;
    this.tab_confirm = true;
  }
  tabProgram_click() {
    this.tab_personalData = false;
    this.tab_dependants = false;
    this.tab_program = true;
    this.tab_confirm = false;
  }
  tabDependants_click() {
    this.tab_personalData = false;
    this.tab_dependants = true;
    this.tab_program = false;
    this.tab_confirm = false;
  }
  tabPersonalData_click() {
    this.tab_personalData = true;
    this.tab_dependants = false;
    this.tab_program = false;
    this.tab_confirm = false;
  }

  populateStepFour() {
    this.beneficiary.fullName = this.stepOneFormGroup.controls['title'].value.name
      + " " + this.stepOneFormGroup.get('firstName').value
      + " " + this.stepOneFormGroup.get('middleName').value
      + " " + this.stepOneFormGroup.get('lastName').value;
    this.beneficiary.phonenumber = this.stepOneFormGroup.get('phonenumber').value;
    this.beneficiary.dob = this.stepOneFormGroup.get('dob').value;
    this.beneficiary.lga = this.stepOneFormGroup.get('lga').value.name;
    this.beneficiary.gender = this.stepOneFormGroup.get('gender').value;
    this.beneficiary.lasrraId = this.stepOneFormGroup.get('lasrraId').value;

    this.beneficiary.spouseFullName = this.frmDependants.get('spouseFirstName').value
      + " " + this.frmDependants.get('spouseMiddleName').value
      + " " + this.frmDependants.get('spouseLastName').value;
    this.beneficiary.spouseDob = this.frmDependants.get('spouseDob').value;
    this.beneficiary.spouseLassraId = this.frmDependants.get('spouseLassraId').value;

    this.beneficiary.child_1_gender = this.frmDependants.get('child_1_gender').value;
    this.beneficiary.child_1_fullName = this.frmDependants.get('child_1_firstName').value
      + " " + this.frmDependants.get('child_1_middleName').value
      + " " + this.frmDependants.get('child_1_lastName').value;
    this.beneficiary.child_1_dob = this.frmDependants.get('child_1_dob').value;

    this.beneficiary.child_2_gender = this.frmDependants.get('child_2_gender').value;
    this.beneficiary.child_2_fullName = this.frmDependants.get('child_2_firstName').value
      + " " + this.frmDependants.get('child_2_middleName').value
      + " " + this.frmDependants.get('child_2_lastName').value;
    this.beneficiary.child_2_dob = this.frmDependants.get('child_2_dob').value;

    this.beneficiary.dependant_1_gender = this.frmDependants.get('dependant_1_gender').value;
    this.beneficiary.dependant_1_fullName = this.frmDependants.get('dependant_1_firstName').value
      + " " + this.frmDependants.get('dependant_1_middleName').value
      + " " + this.frmDependants.get('dependant_1_lastName').value;
    this.beneficiary.dependant_1_dob = this.frmDependants.get('dependant_1_dob').value;
    this.beneficiary.dependant_1_lassraId = this.frmDependants.get('dependant_1_lassraId').value;
    this.beneficiary.dependant_1_relationship = this.frmDependants.get('dependant_1_relationship').value;

    this.beneficiary.hiaName = this.frmProgram.get('hiaName').value;
    this.beneficiary.programType = this.frmProgram.get('programType').value;
    this.beneficiary.programName = this.frmProgram.get('programName').value;
    this.beneficiary.providerName = this.frmProgram.get('providerName').value;

    console.log(this.beneficiary);
    console.log(this.stepOneFormGroup.get('title'));
  }

  onClickConfirm() {
    // let person = <Person>{
    // 	titleId: this.stepOneFormGroup.controls['title'].value._id,
    // 	firstName: this.stepOneFormGroup.controls['firstName'].value,
    // 	lastName: this.stepOneFormGroup.controls['lastName'].value,
    // 	genderId: this.stepOneFormGroup.controls['gender'].value,
    // 	homeAddress: <Address> {
    // 		street: this.stepOneFormGroup.controls['streetName'].value,
    // 		lga: this.stepOneFormGroup.controls['lga'].value,
    // 		city:'',
    // 		neighbourhood:'',
    // 		state: this.stateId,
    // 		country: this.countryId,
    // 	},
    // 	phoneNumber: this.stepOneFormGroup.controls['phonenumber'].value,
    // 	lgaOfOriginId: this.stepOneFormGroup.controls['lgaOfOrigin'].value,
    // 	nationalityId: this.countryId,
    // 	stateOfOriginId: this.stepOneFormGroup.controls['stateOfOrigin'].value,
    // 	email: this.stepOneFormGroup.controls['email'].value,
    // 	maritalStatusId: this.stepOneFormGroup.controls['maritalStatus'].value
    // };

    let patient = {
      personId: "personId",
      facilityId: this.frmProgram.get('providerName').value,
      isActive: false,
      orders: [],
      tags: []
    }

    let beneficiary = {
      facilityId: this.frmProgram.get('providerName').value,
      patientId: "patientId",
      lasrraId: this.frmProgram.get('lasrraId').value,
      noOfChildrenUnder18: this.stepOneFormGroup.get('noOfChildrenU18').value,
      spouse: {
        // 	spouseFirstName: ['', [<any>Validators.required]],
        // spouseMiddleName: [''],
        // spouseLastName: ['', [<any>Validators.required]],
        // spouseDob: ['', [<any>Validators.required]],
        // spouseLassraId: [''],
        // patientId: ,
        // relationshipId: ,
        // lasrraId:  ,
      },
      hiaId: this.frmProgram.get('hiaName').value,
      hiaProgramTypeId: this.frmProgram.get('programType').value,
      hiaNameId: this.frmProgram.get('programName').value,
      phcpId: this.frmProgram.get('providerName').value,
      dependants: [
        // {
        // 	patientId: ,
        // 	relationshipId: ,
        // 	lasrraId:  ,
        // },
        // {
        // 	patientId: ,
        // 	relationshipId: ,
        // 	lasrraId:  ,
        // }
      ],
    }

    // console.log(person);
    console.log(patient);
    console.log(beneficiary);

    // this._personService.create(person).then((res) => {
    // 	console.log(res);

    // 	let patient = {
    // 		personId: res._id,
    // 		facilityId: this.stepThreeFormGroup.get('providerName').value,
    // 		isActive:{ type: Boolean, 'default': false },
    // 		orders:[{type: String, required: false}],
    // 		tags:[{type: String, required: false}]
    // 	}
    // 	if(res) {

    // 	}
    // 	this.stepOneFormGroup.reset();
    // 	this.stepTwoFormGroup.reset();
    // 	this.stepThreeFormGroup.reset();
    // 	this.saveBtn = "SAVE &nbsp; <i class='fa fa-check' aria-hidden='true'></i>";
    // 	this._toastr.success('Beneficiary has been created successfully!', 'Success!');
    // });
  }

  getCountries() {
    this._countriesService.find({}).then((payload: any) => {
      for (let i = 0; i < payload.data.length; i++) {
        let country = payload.data[i];
        if (country.name === "Nigeria") {
          this.countryId = country._id;
          this.states = country.states;
          for (let j = 0; j < country.states.length; j++) {
            let state = country.states[j];
            if (state.name === "Lagos") {
              this.stateId = state._id;
              this.lgs = state.lgs;
              return;
            }
          }
          return;
        }
      }
    });
  }
  getGenders() {
    this._genderService.find({}).then((payload: any) => {
      this.genders = payload.data;
    })
  }

  getTitles() {
    this._titleService.find({}).then((payload: any) => {
      this.titles = payload.data;
    })
  }

  getMaritalStatus() {
    this._maritalStatusService.find({}).then((payload: any) => {
      this.maritalStatuses = payload.data;
    })
  }

  getAllProviders() {
    this._facilityService.find({}).then((payload: any) => {
      console.log(payload);
      this.providers = payload.data;
    });
  }

  onChangeStateOfOrigin(value: any) {
    this._countriesService.find({}).then((payload: any) => {
      for (let i = 0; i < payload.data.length; i++) {
        let country = payload.data[i];
        if (country.name === "Nigeria") {
          for (let j = 0; j < country.states.length; j++) {
            let state = country.states[j];
            if (state._id === value) {
              this.selectedStateId = state._id;
              this.selectedLgas = state.lgs;
              return;
            }
          }
          return;
        }
      }
    });
  }

  onClickStepOne(value, valid) {

  }
}
