import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Response} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {IMyDate, IMyDpOptions} from 'mydatepicker';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {Observable} from 'rxjs/Observable';

import {environment} from '../../../../../environments/environment';
import {Person} from '../../../../models/index';
import AsyncValidator from '../../../../services/common/async-validator';
import {BankService, CountryService, FacilityService, SystemModuleService, UploadService, UserTypeService} from '../../../../services/index';

import {AuthService} from './../../../../auth/services/auth.service';
import {Address} from './../../../../models/organisation/address';
import {Beneficiary} from './../../../../models/setup/beneficiary';
import {BeneficiaryService} from './../../../../services/beneficiary/beneficiary.service';
import {GenderService} from './../../../../services/common/gender.service';
import {MaritalStatusService} from './../../../../services/common/marital-status.service';
import {TitleService} from './../../../../services/common/titles.service';
import {UserService} from './../../../../services/common/user.service';
import {HeaderEventEmitterService} from './../../../../services/event-emitters/header-event-emitter.service';
import {FORM_VALIDATION_ERROR_MESSAGE, MAXIMUM_NUMBER_OF_DEPENDANTS} from './../../../../services/globals/config';
import {PersonService} from './../../../../services/person/person.service';
import {PolicyService} from './../../../../services/policy/policy.service';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const WEBSITE_REGEX = /^(ftp|http|https):\/\/[^ "]*(\.\w{2,3})+$/;
const PHONE_REGEX =
    /^\+?([0-9]+)\)?[-. ]?([0-9]+)\)?[-. ]?([0-9]+)[-. ]?([0-9]+)$/;
const NUMERIC_REGEX = /^[0-9]+$/;

@Component({
  selector: 'app-new-beneficiary-data',
  templateUrl: './new-beneficiary-data.component.html',
  styleUrls: ['./new-beneficiary-data.component.scss']
})
export class NewBeneficiaryDataComponent implements OnInit, AfterViewInit,
                                                    AfterViewChecked {
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
  maxNumberOfDependant: number = MAXIMUM_NUMBER_OF_DEPENDANTS
  _video: any;
  patCanvas: any;
  patData: any;
  patOpts = {x: 0, y: 0, w: 25, h: 25};

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  stepOneFormGroup: FormGroup;
  selectedBeneficiary: any = <any>{numberOfUnderAge: 0};
  selectedCountry: any;
  currentPlatform: any;
  selectedState: any;
  stream: any;
  btnCamera = 'Use Camera';
  user: any;
  person: any;
  isCompleteRegistration = true;
  platformName: string;

  constructor(
      private _fb: FormBuilder, private _genderService: GenderService,
      private _toastr: ToastsManager,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _userTypeService: UserTypeService,
      private _bankService: BankService,
      private _countriesService: CountryService,
      private _facilityService: FacilityService,
      private _systemService: SystemModuleService,
      private _uploadService: UploadService,
      private _titleService: TitleService, private _router: Router,
      private _maritalService: MaritalStatusService,
      private _beneficiaryService: BeneficiaryService,
      private _personService: PersonService, private _route: ActivatedRoute,
      private _locker: CoolLocalStorage, private _userService: UserService,
      private _authService: AuthService,
      private _policyService: PolicyService) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
    this._initialiseFormGroup();

    this._getCurrentPlatform();
    this._getCountries();
    this._getGenders();
    this._getTitles();
    this._getMaritalStatus();
    if (!this.user.completeRegistration && !!this.user.userType &&
        this.user.userType.name === 'Beneficiary') {
      this.isCompleteRegistration = false;
      this._getUser();
      this._getPerson();
    } else if (
        !!this.user.userType && this.user.userType.name === 'Beneficiary') {
      this._getPerson();
    }
    this.stepOneFormGroup.controls.stateOfOrigin.valueChanges.subscribe(
        value => {
          this._getLgaAndCities(value);
        });
  }
  getMax(e) {
    if ((<number>e.target.value) > this.maxNumberOfDependant) {
      return e.target.value = this.maxNumberOfDependant;
    }
  }
  ngAfterViewInit() {
    if (this.video !== undefined) {
      this.context = this.snapshot.nativeElement.getContext('2d');
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
  _getUser() {
    this._userService.get(this.user._id, {})
        .then((payload: any) => {
          this.stepOneFormGroup.controls.firstName.setValue(payload.firstName);
          this.stepOneFormGroup.controls.lastName.setValue(payload.lastName);
          this.stepOneFormGroup.controls.phonenumber.setValue(
              payload.phoneNumber);
          this.stepOneFormGroup.controls.email.setValue(payload.email);
        })
        .catch(err => {})
  }

  _getPerson() {
    let person$ = Observable.fromPromise(
        this._personService.find({query: {email: this.user.email}}));
    let beneficiary$ = Observable.fromPromise(this._beneficiaryService.find(
        {query: {'personId.email': this.user.email}}));
    Observable.forkJoin([person$, beneficiary$]).subscribe((results: any) => {
      if (results[0].data.length > 0) {
        this.person = results[0].data[0];
        this.stepOneFormGroup.controls.mothermaidenname.setValue(
            this.person.mothersMaidenName);
      }
      if (results[1].data.length > 0) {
        this._policyService
            .find({query: {principalBeneficiary: results[1].data[0]._id}})
            .then((policies: any) => {
              if (policies.data.length > 0) {
                this.selectedBeneficiary = results[1].data[0];
                this._router
                    .navigate([
                      '/modules/beneficiary/beneficiaries',
                      this.selectedBeneficiary._id
                    ])
                    .then(
                        payload => {
                            // this._systemService.announceBeneficiaryTabNotification({
                            // tab: 'Two', beneficiary: paym });
                        })
                    .catch(err => {});
              } else {
                this.selectedBeneficiary = results[1].data[0];
                this._initialiseFormGroup();
              }
            })
            .catch(errin => {})
      }
    }, error => {})
    // this._personService.find({
    //   query: {
    //     email: this.user.email
    //   }
    // }).then((payload: any) => {
    //   if (payload.data.length > 0) {
    //     this._beneficiaryService.find({query:{
    //       'personId.email':this.user.email
    //     }})
    //     this.person = payload.data[0];
    //     this.stepOneFormGroup.controls.mothermaidenname.setValue(this.person.mothersMaidenName);
    //   }
    // }).catch(err => {
    //   console.log(err)
    // })
  }

  _getCurrentPlatform() {
    this._facilityService
        .find({
          query: {
            shortName: this.platformName,
            $select: ['name', 'shortName', 'address.state']
          }
        })
        .then((res: any) => {
          if (res.data.length > 0) {
            this.currentPlatform = res.data[0];
            if (this.currentPlatform.address !== undefined) {
              this._getLga(this.currentPlatform.address.state);
              this.stepOneFormGroup.controls.stateOfOrigin.setValue(
                  this.currentPlatform.address.state);
              this.stepOneFormGroup.controls.gender.setValue(this.genders[0]);
            }
          }
        })
        .catch(err => {});
  }
  _getMaritalStatus() {
    this._systemService.on();
    this._maritalService.find({})
        .then((payload: any) => {
          this.maritalStatuses = payload.data;
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        })
  }
  _getTitles() {
    this._systemService.on();
    this._titleService.find({})
        .then((payload: any) => {
          this.titles = payload.data;
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        })
  }
  _getGenders() {
    this._systemService.on();
    this._genderService.find({})
        .then((payload: any) => {
          this.genders = payload.data;
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        })
  }
  _getBeneficiary(id) {
    this._systemService.on();
    this._beneficiaryService.get(id, {})
        .then((payload: any) => {
          this.selectedBeneficiary = payload;
          this._initialiseFormGroup();
          this._systemService.off();
        })
        .catch(err => {
          this._systemService.off();
        })
  }

  _getCountries() {
    this._systemService.on();
    this._countriesService.find({query: {$limit: 200, $select: {'states': 0}}})
        .then((payload: any) => {
          this.countries = payload.data;
          this._systemService.off();
          const index = this.countries.findIndex(x => x.name === 'Nigeria');
          if (index > -1) {
            this.selectedCountry = this.countries[index];
            this._getStates(this.selectedCountry._id);
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

  _initialiseFormGroup() {
    let date = ((this.selectedBeneficiary.personId === undefined ||
                 this.selectedBeneficiary.personId === null) ||
                (this.selectedBeneficiary.personId !== undefined &&
                 this.selectedBeneficiary.personId.dateOfBirth === undefined)) ?
        new Date() :
        new Date(this.selectedBeneficiary.personId.dateOfBirth);
    if (this.selectedBeneficiary.personId !== undefined) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      this.today = { year: year, month: month, day: day }
    } else {
      this.today = {
        year: new Date().getFullYear() - 18,
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    }


    this.stepOneFormGroup = this._fb.group({
      gender: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.gender :
            '',
        [<any>Validators.required]
      ],
      title: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.title :
            '',
        [<any>Validators.required]
      ],
      firstName: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.firstName :
            '',
        [<any>Validators.required]
      ],
      otherNames: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.otherNames :
            '',
        []
      ],
      lastName: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.lastName :
            '',
        [<any>Validators.required]
      ],
      phonenumber: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.phoneNumber :
            '',
        [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]
      ],
      secondaryPhone: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.secondaryPhoneNumber :
            '',
        [<any>Validators.pattern(PHONE_REGEX)]
      ],
      email: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.email :
            '',
        [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]
      ],
      dob: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.dateOfBirth :
            this.today,
        [<any>Validators.required], this.validateAgaintUnderAge.bind(this)
      ],
      lashmaId: [
        this.selectedBeneficiary != null ?
            this.selectedBeneficiary.platformOwnerNumber :
            '',
        []
      ],
      lasrraId: [
        this.selectedBeneficiary != null ? this.selectedBeneficiary.stateID :
                                           '',
        []
      ],
      stateOfOrigin: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.stateOfOrigin :
            '',
        [<any>Validators.required]
      ],
      lgaOfOrigin: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.lgaOfOrigin :
            '',
        [<any>Validators.required]
      ],
      maritalStatus: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.maritalStatus :
            '',
        [<any>Validators.required]
      ],
      noOfChildrenU18: [
        this.selectedBeneficiary != null ?
            this.selectedBeneficiary.numberOfUnderAge :
            0,
        [<any>Validators.required]
      ],
      streetName: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.homeAddress.street :
            '',
        [<any>Validators.required]
      ],
      lga: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.homeAddress.lga :
            '',
        [<any>Validators.required]
      ],
      neighbourhood: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.homeAddress.neighbourhood :
            '',
        [<any>Validators.required]
      ],
      mothermaidenname: [
        this.selectedBeneficiary.personId != null ?
            this.selectedBeneficiary.personId.mothersMaidenName :
            '',
        []
      ]
    });

    if (this.selectedBeneficiary._id !== undefined) {
      if (this.selectedBeneficiary.personId !== null &&
          this.selectedBeneficiary.personId !== undefined) {
        this._getLgaAndCities(this.selectedBeneficiary.personId.stateOfOrigin);
        this.stepOneFormGroup.controls['gender'].setValue(
            this.selectedBeneficiary.personId.gender);
        if (this.selectedBeneficiary.personId.profileImageObject !==
            undefined) {
          this.blah.nativeElement.src = this._uploadService.transform(
              this.selectedBeneficiary.personId.profileImageObject.thumbnail);
        }
      }
    }

    this.stepOneFormGroup.controls['stateOfOrigin'].valueChanges.subscribe(
        value => {
          if (value !== null) {
            this._getLgaAndCities(value);
          }
        });
  }

  validateAgaintUnderAge(control: AbstractControl) {
    if (control.value !== undefined && control.value.jsdate !== undefined) {
      return this._beneficiaryService.validateAge(control.value).then(res => {
        return res.body.response >= 18 ? null : {underage: true};
      });
    } else {
      return Observable.of(null);
    }
  }

  _getLgaAndCities(state, _id?) {
    this._systemService.on();
    this._countriesService
        .find({query: {'states.name': state.name, $select: {'states.$': 1}}})
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

  _getLga(state) {
    this._systemService.on();
    this._countriesService
        .find({query: {'states.name': state.name, $select: {'states.$': 1}}})
        .then((payload: any) => {
          this._systemService.off();
          if (payload.data.length > 0) {
            const states = payload.data[0].states;
            if (states.length > 0) {
              this.residenceLgs = states[0].lgs;
              this.selectedState = states[0];
            }
          }
        })
        .catch(error => {
          this._systemService.off();
        })
  }

  startCamera() {
    if (this.btnCamera === 'Use Camera') {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
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
      formData.append('platform', fileBrowser.files[0]);
      return new Promise((resolve, reject) => {
        resolve(this._uploadService.upload(formData, this.selectedCountry._id));
      });
    }
  }
  onClickStepOne(value, valid) {
    if (valid) {
      if (!this.user.completeRegistration && !!this.user.userType &&
          this.user.userType.name === 'Beneficiary') {
        let address: Address = <Address>{};
        address.lga = value.lga;
        address.neighbourhood = value.neighbourhood;
        address.state = this.selectedState;
        delete address.state.cities;
        delete address.state.lgs;
        address.street = value.streetName;

        this.person.dateOfBirth = value.dob.jsdate;
        this.person.email = value.email;
        this.person.firstName = value.firstName;
        this.person.gender = value.gender;
        this.person.homeAddress = address;
        this.person.lastName = value.lastName;
        this.person.lgaOfOrigin = value.lgaOfOrigin;
        this.person.maritalStatus = value.maritalStatus;
        this.person.mothersMaidenName = value.mothermaidenname;
        this.person.otherNames = value.otherNames;
        this.person.phoneNumber = value.phonenumber;
        this.person.platformOnwerId = this.currentPlatform._id;
        this.person.stateOfOrigin = value.stateOfOrigin;
        this.person.title = value.title;



        let fileBrowser = this.fileInput.nativeElement;
        this._systemService.on();
        if (this.person.profileImageObject === undefined) {
          if (fileBrowser.files && fileBrowser.files[0]) {
            this.upload()
                .then((result: any) => {
                  if (result !== undefined && result.body !== undefined &&
                      result.body.length > 0) {
                    this.person.profileImageObject = result.body[0].file;
                    let person$ = Observable.fromPromise(
                        this._personService.update(this.person));

                    Observable.forkJoin([person$]).subscribe(
                        (results: any) => {
                          // this._getBeneficiary(this.selectedBeneficiary._id);
                          // this._systemService.off();
                          // this._router.navigate(['/modules/beneficiary/new/dependants',
                          // this.selectedBeneficiary._id]).then(payload => {
                          // }).catch(err => {
                          //   console.log(err)
                          // });


                          if (results[0] !== undefined) {
                            let beneficiary: Beneficiary =
                                this.selectedBeneficiary ?
                                this.selectedBeneficiary :
                                <Beneficiary>{};
                            beneficiary.numberOfUnderAge =
                                value.noOfChildrenU18;
                            beneficiary.platformOwnerId = this.currentPlatform;
                            beneficiary.stateID = value.lasrraId;
                            beneficiary.personId = results[0];

                            if (this.selectedBeneficiary._id !== undefined) {
                              this._beneficiaryService.update(beneficiary)
                                  .then((paym: any) => {
                                    this._systemService.off();
                                    if (value.noOfChildrenU18 > 0) {
                                      this._router
                                          .navigate([
                                            '/modules/beneficiary/new/dependants',
                                            paym._id
                                          ])
                                          .then(payload => {})
                                          .catch(err => {});
                                    } else {
                                      this._router
                                          .navigate([
                                            '/modules/beneficiary/new/next-of-kin',
                                            paym._id
                                          ])
                                          .then(payload => {})
                                          .catch(err => {});
                                    }
                                  })
                                  .catch(erm => {})
                            } else {
                              this._beneficiaryService.create(beneficiary)
                                  .then((paym: any) => {
                                    this._systemService.off();
                                    this._router
                                        .navigate([
                                          '/modules/beneficiary/new/dependants',
                                          paym._id
                                        ])
                                        .then(payload => {})
                                        .catch(err => {});
                                  })
                                  .catch(
                                      erm => {

                                      })
                            }

                          } else {
                          }
                        },
                        error => {
                          this._systemService.off();
                        })
                  }
                })
                .catch(err => {
                  this._systemService.off();
                })
          } else {
            let person$ =
                Observable.fromPromise(this._personService.update(this.person));
            Observable.forkJoin([person$]).subscribe(
                (results: any) => {
                  if (results[0] !== undefined) {
                    let beneficiary: Beneficiary = this.selectedBeneficiary ?
                        this.selectedBeneficiary :
                        <Beneficiary>{};
                    beneficiary.numberOfUnderAge = value.noOfChildrenU18;
                    beneficiary.platformOwnerId = this.currentPlatform;
                    beneficiary.stateID = value.lasrraId;
                    beneficiary.personId = results[0];

                    if (this.selectedBeneficiary._id !== undefined) {
                      this._beneficiaryService.update(beneficiary)
                          .then((paym: any) => {
                            this._systemService.off();
                            this._router
                                .navigate([
                                  '/modules/beneficiary/new/dependants',
                                  paym._id
                                ])
                                .then(payload => {})
                                .catch(err => {});
                          })
                          .catch(erm => {})
                    } else {
                      this._beneficiaryService.create(beneficiary)
                          .then((paym: any) => {
                            this._systemService.off();
                            this._router
                                .navigate([
                                  '/modules/beneficiary/new/dependants',
                                  paym._id
                                ])
                                .then(payload => {})
                                .catch(err => {});
                          })
                          .catch(erm => {})
                    }

                  } else {
                  }
                },
                error => {
                  this._systemService.off();
                })
          }
        } else {
          this._personService.update(this.person)
              .then((payload: any) => {
                // this._getBeneficiary(this.selectedBeneficiary._id);
                // this._systemService.off();
                // this._systemService.announceBeneficiaryTabNotification({ tab:
                // 'Two', beneficiary: this.selectedBeneficiary });



                if (payload !== undefined) {
                  let beneficiary: Beneficiary = this.selectedBeneficiary ?
                      this.selectedBeneficiary :
                      <Beneficiary>{};
                  beneficiary.numberOfUnderAge = value.noOfChildrenU18;
                  beneficiary.platformOwnerId = this.currentPlatform;
                  beneficiary.stateID = value.lasrraId;
                  beneficiary.personId = payload;

                  if (this.selectedBeneficiary._id !== undefined) {
                    this._beneficiaryService.update(beneficiary)
                        .then((paym: any) => {
                          this._systemService.off();
                          this._router
                              .navigate([
                                '/modules/beneficiary/new/dependants', paym._id
                              ])
                              .then(payload => {})
                              .catch(err => {});
                        })
                        .catch(erm => {})
                  } else {
                    this._beneficiaryService.create(beneficiary)
                        .then((paym: any) => {
                          this._systemService.off();
                          this._router
                              .navigate([
                                '/modules/beneficiary/new/dependants', paym._id
                              ])
                              .then(payload => {})
                              .catch(err => {});
                        })
                        .catch(erm => {})
                  }

                } else {
                }
              })
              .catch(err => {
                this._systemService.off();
              })
        }

      } else {
        if (this.selectedBeneficiary !== undefined &&
            this.selectedBeneficiary._id !== undefined) {
          let personId: Person = this.selectedBeneficiary.personId;
          let address: Address = this.selectedBeneficiary.personId.homeAddress;
          address.lga = value.lga;
          address.neighbourhood = value.neighbourhood;
          address.state = this.selectedState;
          delete address.state.cities;
          delete address.state.lgs;
          address.street = value.streetName;

          personId.dateOfBirth = value.dob.jsdate;
          personId.email = value.email;
          personId.firstName = value.firstName;
          personId.gender = value.gender;
          personId.homeAddress = address;
          personId.lastName = value.lastName;
          personId.lgaOfOrigin = value.lgaOfOrigin;
          personId.maritalStatus = value.maritalStatus;
          personId.mothersMaidenName = value.mothermaidenname;
          personId.otherNames = value.otherNames;
          personId.phoneNumber = value.phonenumber;
          personId.platformOnwerId = this.currentPlatform._id;
          personId.stateOfOrigin = value.stateOfOrigin;
          personId.title = value.title;



          let fileBrowser = this.fileInput.nativeElement;
          this._systemService.on();
          if (personId.profileImageObject === undefined) {
            if (fileBrowser.files && fileBrowser.files[0]) {
              this.upload()
                  .then((result: any) => {
                    if (result !== undefined && result.body !== undefined &&
                        result.body.length > 0) {
                      personId.profileImageObject = result.body[0].file;

                      this._personService.update(personId)
                          .then((payload: any) => {
                            if (payload !== undefined) {
                              let beneficiary: Beneficiary =
                                  this.selectedBeneficiary ?
                                  this.selectedBeneficiary :
                                  <Beneficiary>{};
                              beneficiary.numberOfUnderAge =
                                  value.noOfChildrenU18;
                              beneficiary.platformOwnerId =
                                  this.currentPlatform;
                              beneficiary.stateID = value.lasrraId;
                              beneficiary.personId = payload;

                              if (this.selectedBeneficiary._id !== undefined) {
                                this._beneficiaryService.update(beneficiary)
                                    .then((paym: any) => {
                                      this._systemService.off();
                                      if (value.noOfChildrenU18 > 0) {
                                        this._router
                                            .navigate([
                                              '/modules/beneficiary/new/dependants',
                                              paym._id
                                            ])
                                            .then(payload => {})
                                            .catch(err => {});
                                      } else {
                                        this._router
                                            .navigate([
                                              '/modules/beneficiary/new/next-of-kin',
                                              paym._id
                                            ])
                                            .then(payload => {})
                                            .catch(err => {});
                                      }
                                    })
                                    .catch(erm => {})
                              } else {
                                this._beneficiaryService.create(beneficiary)
                                    .then((paym: any) => {
                                      this._systemService.off();
                                      this._router
                                          .navigate([
                                            '/modules/beneficiary/new/dependants',
                                            paym._id
                                          ])
                                          .then(payload => {})
                                          .catch(err => {});
                                    })
                                    .catch(erm => {})
                              }

                            } else {
                            }



                            // console.log('1e')
                            // this._getBeneficiary(this.selectedBeneficiary._id);
                            // this._systemService.off();
                            // this._router.navigate(['/modules/beneficiary/new/dependants',
                            // this.selectedBeneficiary._id]).then(payload => {
                            //   //
                            //   this._systemService.announceBeneficiaryTabNotification({
                            //   tab: 'Two', beneficiary: paym });
                            // }).catch(err => {
                            //   console.log(err)
                            // });
                            // //
                            // this._systemService.announceBeneficiaryTabNotification({
                            // tab: 'Two', beneficiary: this.selectedBeneficiary
                            // });
                          })
                          .catch(err => {
                            this._systemService.off();
                          })
                    }
                  })
                  .catch(err => {
                    this._systemService.off();
                  })
            } else {
              this._personService.update(personId)
                  .then((payload: any) => {
                    if (payload !== undefined) {
                      let beneficiary: Beneficiary = this.selectedBeneficiary ?
                          this.selectedBeneficiary :
                          <Beneficiary>{};
                      beneficiary.numberOfUnderAge = value.noOfChildrenU18;
                      beneficiary.platformOwnerId = this.currentPlatform;
                      beneficiary.stateID = value.lasrraId;
                      beneficiary.personId = payload

                      if (this.selectedBeneficiary._id !== undefined) {
                        this._beneficiaryService.update(beneficiary)
                            .then((paym: any) => {
                              this._systemService.off();
                              this._router
                                  .navigate([
                                    '/modules/beneficiary/new/dependants',
                                    paym._id
                                  ])
                                  .then(payload => {})
                                  .catch(err => {});
                            })
                            .catch(erm => {})
                      }
                      else {
                        this._beneficiaryService.create(beneficiary)
                            .then((paym: any) => {
                              this._systemService.off();
                              this._router
                                  .navigate([
                                    '/modules/beneficiary/new/dependants',
                                    paym._id
                                  ])
                                  .then(payload => {})
                                  .catch(err => {});
                            })
                            .catch(erm => {})
                      }

                    } else {
                    }



                    // this._getBeneficiary(this.selectedBeneficiary._id);
                    // this._systemService.off();
                    // this._router.navigate(['/modules/beneficiary/new/dependants',
                    // this.selectedBeneficiary._id]).then(payload => {
                    //   //
                    //   this._systemService.announceBeneficiaryTabNotification({
                    //   tab: 'Two', beneficiary: paym });
                    // }).catch(err => {
                    //   console.log(err)
                    // });
                    // //
                    // this._systemService.announceBeneficiaryTabNotification({
                    // tab: 'Two', beneficiary: this.selectedBeneficiary });
                  })
                  .catch(err => {
                    this._systemService.off();
                  })
            }
          } else {
            this._personService.update(personId)
                .then((payload: any) => {
                  if (payload !== undefined) {
                    let beneficiary: Beneficiary = this.selectedBeneficiary ?
                        this.selectedBeneficiary :
                        <Beneficiary>{};
                    beneficiary.numberOfUnderAge = value.noOfChildrenU18;
                    beneficiary.platformOwnerId = this.currentPlatform;
                    beneficiary.stateID = value.lasrraId;
                    beneficiary.personId = payload;

                    if (this.selectedBeneficiary._id !== undefined) {
                      this._beneficiaryService.update(beneficiary)
                          .then((paym: any) => {
                            this._systemService.off();
                            this._router
                                .navigate([
                                  '/modules/beneficiary/new/dependants',
                                  paym._id
                                ])
                                .then(payload => {})
                                .catch(err => {});
                          })
                          .catch(erm => {})
                    } else {
                      this._beneficiaryService.create(beneficiary)
                          .then((paym: any) => {
                            this._systemService.off();
                            this._router
                                .navigate([
                                  '/modules/beneficiary/new/dependants',
                                  paym._id
                                ])
                                .then(payload => {})
                                .catch(err => {});
                          })
                          .catch(erm => {})
                    }

                  } else {
                  }



                  // this._getBeneficiary(this.selectedBeneficiary._id);
                  // this._systemService.off();
                  // this._router.navigate(['/modules/beneficiary/new/dependants',
                  // this.selectedBeneficiary._id]).then(payload => {
                  //   //
                  //   this._systemService.announceBeneficiaryTabNotification({
                  //   tab: 'Two', beneficiary: paym });
                  // }).catch(err => {
                  //   console.log(err)
                  // });
                  // // this._systemService.announceBeneficiaryTabNotification({
                  // tab: 'Two', beneficiary: this.selectedBeneficiary });
                })
                .catch(err => {
                  this._systemService.off();
                })
          }



        } else {
          let personId: Person = <Person>{};
          let address: Address = <Address>{};
          address.lga = value.lga;
          address.neighbourhood = value.neighbourhood;
          address.state = this.selectedState;
          delete address.state.cities;
          delete address.state.lgs;
          address.street = value.streetName;

          personId.dateOfBirth = value.dob.jsdate;
          personId.email = value.email;
          personId.firstName = value.firstName;
          personId.gender = value.gender;
          personId.homeAddress = address;
          personId.lastName = value.lastName;
          personId.lgaOfOrigin = value.lgaOfOrigin;
          personId.maritalStatus = value.maritalStatus;
          personId.mothersMaidenName = value.mothermaidenname;
          personId.otherNames = value.otherNames;
          personId.phoneNumber = value.phonenumber;
          personId.platformOnwerId = this.currentPlatform._id;
          personId.stateOfOrigin = value.stateOfOrigin;
          personId.title = value.title;

          let beneficiary: Beneficiary = <Beneficiary>{};
          beneficiary.numberOfUnderAge = value.noOfChildrenU18;
          beneficiary.platformOwnerId = this.currentPlatform;

          let policy: any = <any>{};



          let fileBrowser = this.fileInput.nativeElement;
          this._systemService.on();
          if (personId.profileImageObject === undefined) {
            if (fileBrowser.files && fileBrowser.files[0]) {
              this.upload()
                  .then((result: any) => {
                    if (result !== undefined && result.body !== undefined &&
                        result.body.length > 0) {
                      personId.profileImageObject = result.body[0].file;
                      this._beneficiaryService
                          .createWithMiddleWare({
                            person: personId,
                            beneficiary: beneficiary,
                            policy: policy,
                            platform: this.currentPlatform
                          })
                          .then(payload => {
                            // should be sending selectedbeneficiary to steptwo

                            if (payload.statusCode === 200 &&
                                payload.error === false) {
                              delete payload.body.beneficiary.personId;
                              payload.body.beneficiary.personId =
                                  payload.body.person;
                              this.selectedBeneficiary =
                                  payload.body.beneficiary;
                              // this._systemService.announceBeneficiaryTabNotification('Two');
                              this._systemService.off();


                              if (value.noOfChildrenU18 > 0) {
                                this._router
                                    .navigate([
                                      '/modules/beneficiary/new/dependants',
                                      this.selectedBeneficiary._id
                                    ])
                                    .then(
                                        payload => {
                                            // this._systemService.announceBeneficiaryTabNotification({
                                            // tab: 'Two', beneficiary: paym });
                                        })
                                    .catch(err => {});
                              } else {
                                this._router
                                    .navigate([
                                      '/modules/beneficiary/new/next-of-kin',
                                      this.selectedBeneficiary._id
                                    ])
                                    .then(payload => {})
                                    .catch(err => {});
                              }



                              // this._systemService.announceBeneficiaryTabNotification({
                              // tab: 'Two', beneficiary:
                              // this.selectedBeneficiary });
                            }
                          })
                          .catch(err => {
                            this._systemService.off();
                          })
                    }
                  })
                  .catch(err => {
                    this._systemService.off();
                  })
            } else {
              this._beneficiaryService
                  .createWithMiddleWare({
                    person: personId,
                    beneficiary: beneficiary,
                    policy: policy,
                    platform: this.currentPlatform
                  })
                  .then(payload => {
                    if (payload.statusCode === 200 && payload.error === false) {
                      payload.body.beneficiary.personId = payload.body.personId;
                      this.selectedBeneficiary = payload.body.beneficiary;
                      this.selectedBeneficiary.personId = payload.body.personId;

                      if (value.noOfChildrenU18 > 0) {
                        this._router
                            .navigate([
                              '/modules/beneficiary/new/dependants',
                              this.selectedBeneficiary._id
                            ])
                            .then(
                                payload => {
                                    // this._systemService.announceBeneficiaryTabNotification({
                                    // tab: 'Two', beneficiary: paym });
                                })
                            .catch(err => {});
                      } else {
                        this._router
                            .navigate([
                              '/modules/beneficiary/new/next-of-kin',
                              this.selectedBeneficiary._id
                            ])
                            .then(payload => {})
                            .catch(err => {});
                      }
                    }
                    this._systemService.off();
                  })
                  .catch(err => {
                    this._systemService.off();
                  })
            }
          } else {
            this._beneficiaryService
                .createWithMiddleWare({
                  person: personId,
                  beneficiary: beneficiary,
                  policy: policy,
                  platform: this.currentPlatform
                })
                .then(payload => {
                  if (payload.statusCode === 200 && payload.error === false) {
                    payload.body.beneficiary.personId = payload.body.personId;
                    this.selectedBeneficiary = payload.body.beneficiary;
                    this._router
                        .navigate([
                          '/modules/beneficiary/new/dependants',
                          this.selectedBeneficiary._id
                        ])
                        .then(
                            payload => {
                                // this._systemService.announceBeneficiaryTabNotification({
                                // tab: 'Two', beneficiary: paym });
                            })
                        .catch(err => {});
                    // this._systemService.announceBeneficiaryTabNotification({
                    // tab: 'Two', beneficiary: this.selectedBeneficiary });
                  }
                  this._systemService.off();
                })
                .catch(err => {
                  this._systemService.off();
                })
          }
        }
      }

    } else {
      let counter = 0;
      this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
      Object.keys(this.stepOneFormGroup.controls)
          .forEach((field, i) => {  // {1}
            const control = this.stepOneFormGroup.get(field);
            if (!control.valid) {
              control.markAsDirty({onlySelf: true});
              counter = counter + 1;
            }
          });
      if (this.user.platformOwnerId !== undefined &&
          this.user.platformOwnerId._id === undefined) {
        // this.stepOneFormGroup.controls.firstName.setErrors(null);
        // this.stepOneFormGroup.controls.lastName.setErrors(null);
        // this.stepOneFormGroup.controls.phonenumber.setErrors(null);
        // this.stepOneFormGroup.controls.email.setErrors(null);
        this.stepOneFormGroup.controls.email.markAsUntouched()
        // this.stepOneFormGroup.controls.email.mar()
      }
    }
  }

  makeSnapshot() {
    if (this._video) {
      // let patCanvas: any =
      // this.context;//document.querySelector('#snapshot'); if (!patCanvas)
      // return;

      // patCanvas.width = this._video.width;
      // patCanvas.height = this._video.height;
      // var ctxPat = patCanvas.getContext('2d');



      var idata = this.getVideoData(
          this.patOpts.x, this.patOpts.y, this.patOpts.w, this.patOpts.h);

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
      reader.onload = function(e: any) {
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
    this.stepOneFormGroup.patchValue({dob: null});
  }
}
