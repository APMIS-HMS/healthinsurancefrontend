import { FORM_VALIDATION_ERROR_MESSAGE } from './../../../../services/globals/config';
import { PersonService } from './../../../../services/person/person.service';
import { Address } from './../../../../models/organisation/address';
import { BeneficiaryService } from './../../../../services/beneficiary/beneficiary.service';
import { Beneficiary } from './../../../../models/setup/beneficiary';
import { MaritalStatusService } from './../../../../services/common/marital-status.service';
import { TitleService } from './../../../../services/common/titles.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderEventEmitterService } from './../../../../services/event-emitters/header-event-emitter.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { GenderService } from './../../../../services/common/gender.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, AfterViewChecked } from '@angular/core';
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
export class NewBeneficiaryDataComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('video') video: any;
  @ViewChild('snapshot') snapshot: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('blah') blah: ElementRef;
  public context: CanvasRenderingContext2D;
  stepOneView: Boolean = true;
  stepTwoView: Boolean = false;
  stepThreeView: Boolean = false;
  stepFourView: Boolean = false;
  popCamera: Boolean = false;
  showPreview = false;

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
  selectedBeneficiary: any = <any>{ numberOfUnderAge: 0 };
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
    private _personService: PersonService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._initialiseFormGroup();

    this._getCurrentPlatform();
    this._getCountries();
    this._getGenders();
    this._getTitles();
    this._getMaritalStatus();
  }
  ngAfterViewInit() {
    if (this.video !== undefined) {
      this.context = this.snapshot.nativeElement.getContext("2d");
    }

    this._route.params.subscribe(param => {

      if (param.id !== undefined) {
        this._getBeneficiary(param.id);
      } else {
        this._initialiseFormGroup();
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.video !== undefined) {
      this._video = this.video.nativeElement;
    }

  }

  _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
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
    this._systemService.on();
    this._beneficiaryService.get(id, {}).then((payload: any) => {
      this.selectedBeneficiary = payload;
      console.log(this.selectedBeneficiary);
      this._initialiseFormGroup();
      this._systemService.off();
    }).catch(err => {
      console.log(err);
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
      lastName: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.lastName : '', [<any>Validators.required]],
      phonenumber: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.phoneNumber : '', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      secondaryPhone: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.secondaryPhoneNumber : '', [<any>Validators.pattern(PHONE_REGEX)]],
      email: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.email : '', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      dob: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.dateOfBirth : this.today, [<any>Validators.required]],
      lashmaId: [this.selectedBeneficiary != null ? this.selectedBeneficiary.platformOwnerNumber : '', []],
      lasrraId: [this.selectedBeneficiary != null ? this.selectedBeneficiary.stateID : '', []],
      stateOfOrigin: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.stateOfOrigin : '', [<any>Validators.required]],
      lgaOfOrigin: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.lgaOfOrigin : '', [<any>Validators.required]],
      maritalStatus: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.maritalStatus : '', [<any>Validators.required]],
      noOfChildrenU18: [this.selectedBeneficiary != null ? this.selectedBeneficiary.numberOfUnderAge : 0, [<any>Validators.required]],
      streetName: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.homeAddress.street : '', [<any>Validators.required]],
      lga: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.homeAddress.lga : '', [<any>Validators.required]],
      neighbourhood: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.homeAddress.neighbourhood : '', [<any>Validators.required]],
      mothermaidenname: [this.selectedBeneficiary.person != null ? this.selectedBeneficiary.person.mothersMaidenName : '', [<any>Validators.required]]
    });

    if (this.selectedBeneficiary._id !== undefined) {
      if (this.selectedBeneficiary.person.stateOfOrigin !== undefined) {
        this._getLgaAndCities(this.selectedBeneficiary.person.stateOfOrigin);
      }

      this.stepOneFormGroup.controls['gender'].setValue(this.selectedBeneficiary.person.gender);
      if (this.selectedBeneficiary.person.profileImageObject !== undefined) {
        this.blah.nativeElement.src = this._uploadService.transform(this.selectedBeneficiary.person.profileImageObject.thumbnail);
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
      this.popCamera = true;
      this.btnCamera = 'Stop Camera';
    } else {
      this.popCamera = false;
      this._video.src = null;
      var track = this.stream.getTracks()[0];
      track.stop();
      this.btnCamera = 'Use Camera';
    }

  }

  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1._id === l2._id;
    }
    return false;
  }
  changeGender($event, gender) {
    this.stepOneFormGroup.controls['gender'].setValue(gender);
  }
  upload() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("platform", fileBrowser.files[0]);
      return new Promise((resolve, reject) => {
        resolve(this._uploadService.upload(formData, this.selectedCountry._id));
      });
    }
  }
  onClickStepOne(value, valid) {
    if (valid) {
      if (this.selectedBeneficiary !== undefined && this.selectedBeneficiary._id !== undefined) {
        console.log(1)
        let person: Person = this.selectedBeneficiary.person;
        let address: Address = this.selectedBeneficiary.person.homeAddress;
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
        person.otherNames = value.otherNames;
        person.phoneNumber = value.phonenumber;
        person.platformOnwerId = this.currentPlatform._id;
        person.stateOfOrigin = value.stateOfOrigin;
        person.title = value.title;








        let fileBrowser = this.fileInput.nativeElement;
        this._systemService.on();
        if (person.profileImageObject === undefined) {
          console.log('1a')
          if (fileBrowser.files && fileBrowser.files[0]) {
            console.log('1b')
            this.upload().then((result: any) => {
              console.log('1c')
              if (result !== undefined && result.body !== undefined && result.body.length > 0) {
                console.log('1d')
                person.profileImageObject = result.body[0].file;

                this._personService.update(person).then(payload => {
                  console.log('1e')
                  this._getBeneficiary(this.selectedBeneficiary._id);
                  this._systemService.off();
                  this._systemService.announceBeneficiaryTabNotification({ tab: 'Two', beneficiary: this.selectedBeneficiary });
                }).catch(err => {
                  console.log(err);
                  this._systemService.off();
                })
              }
            }).catch(err => {
              this._systemService.off();
            })
          } else {
            this._personService.update(person).then(payload => {
              this._getBeneficiary(this.selectedBeneficiary._id);
              this._systemService.off();
              this._systemService.announceBeneficiaryTabNotification({ tab: 'Two', beneficiary: this.selectedBeneficiary });
            }).catch(err => {
              console.log(err);
              this._systemService.off();
            })
          }
        } else {
          this._personService.update(person).then(payload => {
            this._getBeneficiary(this.selectedBeneficiary._id);
            this._systemService.off();
            this._systemService.announceBeneficiaryTabNotification({ tab: 'Two', beneficiary: this.selectedBeneficiary });
          }).catch(err => {
            console.log(err);
            this._systemService.off();
          })
        }




      } else {
        console.log(2)
        let person: Person = <Person>{};
        let address: Address = <Address>{};
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
        person.otherNames = value.otherNames;
        person.phoneNumber = value.phonenumber;
        person.platformOnwerId = this.currentPlatform._id;
        person.stateOfOrigin = value.stateOfOrigin;
        person.title = value.title;

        let beneficiary: Beneficiary = <Beneficiary>{};
        beneficiary.numberOfUnderAge = value.noOfChildrenU18;
        beneficiary.platformOwnerId = this.currentPlatform;

        let policy: any = <any>{};





        let fileBrowser = this.fileInput.nativeElement;
        this._systemService.on();
        if (person.profileImageObject === undefined) {
          console.log('2a')
          if (fileBrowser.files && fileBrowser.files[0]) {
            console.log('2b')
            this.upload().then((result: any) => {
              console.log('2c')
              if (result !== undefined && result.body !== undefined && result.body.length > 0) {
                person.profileImageObject = result.body[0].file;
                console.log('2d')
                this._beneficiaryService.createWithMiddleWare({ person: person, beneficiary: beneficiary, policy: policy, platform: this.currentPlatform }).then(payload => {
                  console.log('2e')
                  // should be sending selectedbeneficiary to steptwo
                  console.log(payload)

                  if (payload.statusCode === 200 && payload.error === false) {
                    console.log('am here oo')
                    delete payload.body.beneficiary.personId;
                    payload.body.beneficiary.person = payload.body.person;
                    this.selectedBeneficiary = payload.body.beneficiary;
                    // this._systemService.announceBeneficiaryTabNotification('Two');
                    this._systemService.off();
                    this._systemService.announceBeneficiaryTabNotification({ tab: 'Two', beneficiary: this.selectedBeneficiary });
                  }
                }).catch(err => {
                  this._systemService.off();
                  console.log(err);
                })
              }
            }).catch(err => {
              console.log(err);
              this._systemService.off();
            })
          } else {
            this._beneficiaryService.createWithMiddleWare({ person: person, beneficiary: beneficiary, policy: policy, platform: this.currentPlatform }).then(payload => {

              if (payload.statusCode === 200 && payload.error === false) {
                this.selectedBeneficiary = payload.body.beneficiary;
                this._systemService.announceBeneficiaryTabNotification({ tab: 'Two', beneficiary: this.selectedBeneficiary });
                this._systemService.announceBeneficiaryTabNotification('Two');
              }
              this._systemService.off();
            }).catch(err => {
              console.log(err);
              this._systemService.off();
            })
          }
        } else {
          this._beneficiaryService.createWithMiddleWare({ person: person, beneficiary: beneficiary, policy: policy, platform: this.currentPlatform }).then(payload => {

            if (payload.statusCode === 200 && payload.error === false) {
              this.selectedBeneficiary = payload.body.beneficiary;
              this._systemService.announceBeneficiaryTabNotification({ tab: 'Two', beneficiary: this.selectedBeneficiary });
              this._systemService.announceBeneficiaryTabNotification('Two');
            }
            this._systemService.off();
          }).catch(err => {
            console.log(err);
            this._systemService.off();
          })
        }

      }
    } else {
      let counter = 0;
      this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
      Object.keys(this.stepOneFormGroup.controls).forEach((field, i) => { // {1}
        const control = this.stepOneFormGroup.get(field);
        if (!control.valid) {
          control.markAsDirty({ onlySelf: true });
          counter = counter + 1;
        }
      });
    }


  }

  makeSnapshot() {
    if (this._video) {
      // let patCanvas: any =  this.context;//document.querySelector('#snapshot');
      // if (!patCanvas) return;

      // patCanvas.width = this._video.width;
      // patCanvas.height = this._video.height;
      // var ctxPat = patCanvas.getContext('2d');



      var idata = this.getVideoData(this.patOpts.x, this.patOpts.y, this.patOpts.w, this.patOpts.h);

      this.context.putImageData(idata, 300, 300);
      // this.context.drawImage(idata, 0, 0, 400, 400);

      this.patData = idata;
    }
  };

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
        that.showPreview = true;
        that.blah.nativeElement.src = e.target.result;
        that._systemService.off();
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  getVideoData(x, y, w, h) {

    var hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = this._video.width;
    hiddenCanvas.height = this._video.height;
    var ctx = hiddenCanvas.getContext('2d');
    ctx.drawImage(this._video, 0, 0, this._video.width, this._video.height);

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
