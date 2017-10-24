import { differenceInYears } from 'date-fns/difference_in_years';
import { Observable } from 'rxjs/Observable';
import { REQUEST_STATUS, DURATIONS } from './../../../services/globals/config';
import { InvestigationService } from './../../../services/common/investigation.service';
import { VisitTypeService } from './../../../services/common/visit-type.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { SystemModuleService, CheckInService, SymptomService, ProcedureService, DiagnosisService, DrugService, DiagnosisTypeService } from '../../../services/index';
import { DrugPackSizeService } from '../../../services/common/drug-pack-size.service';
import { PolicyService } from '../../../services/policy/policy.service';
import { ToastsManager } from 'ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { PreAuthorizationService } from '../../../services/pre-authorization/pre-authorization.service';

@Component({
  selector: 'app-new-referal',
  templateUrl: './new-referal.component.html',
  styleUrls: ['./new-referal.component.scss']
})
export class NewReferalComponent implements OnInit {

  newRef = true;
  newRefConfirm = false;

  referalFormGroup: FormGroup;

  symptomFormGroup: FormGroup;
  diagnosisFormGroup: FormGroup;
  procedureFormGroup: FormGroup;
  investigationFormGroup: FormGroup;
  drugFormGroup: FormGroup;

  searchResults = false;
  complaintSearchResult = false;
  diagnosisSearchResult = false;
  procedureSearchResult = false;
  investigationSearchResult = false;
  drugSearchResult = false;
  Disabled = false;

  public today: IMyDate;
  selectedPreAuthorization: any;
  selectedCheckIn: any;
  selectedComplain: any;
  selectedDiagnosis: any;
  selectedProcedure: any;
  selectedInvestigation: any;
  selectedDrug: any;
  selectedPolicy: any;
  user: any;

  complaintLists: any[] = [];
  diagnosisLists: any[] = [];
  investigationList: any[] = [];
  drugList: any = <any>[];
  procedureList: any[] = [];
  visitTypes: any[] = [];
  durations: any[] = [];
  symptomItems: any[] = [];
  procedureItems: any[] = [];
  diagnosisItems: any[] = [];
  investigationItems: any[] = [];
  drugItems: any[] = [];

  diagnosisTypes: any[] = [];
  packSizes: any[] = [];
  requestStatus = REQUEST_STATUS;


  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };


  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _visitTypeService: VisitTypeService,
    private _systemService: SystemModuleService,
    private _checkInService: CheckInService,
    private _route: ActivatedRoute,
    private _symptomService: SymptomService,
    private _procedureService: ProcedureService,
    private _diagnosisService: DiagnosisService,
    private _drugService: DrugService,
    private _investigationService: InvestigationService,
    private _diagnosisTypeService: DiagnosisTypeService,
    private _drugPackSizeService: DrugPackSizeService,
    private _policyService: PolicyService,
    private _toastr: ToastsManager,
    private _locker: CoolLocalStorage,
    private _preAuthorizationService:PreAuthorizationService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Referral');
    this._headerEventEmitter.setMinorRouteUrl('Create New Referral');

    // this.referalFormGroup = this._fb.group({
    //   patientName: ['', [<any>Validators.required]],
    //   gender: ['', [<any>Validators.required]],
    //   age: ['', [<any>Validators.required]],
    //   address: ['', [<any>Validators.required]],
    //   referingHospital: ['', [<any>Validators.required]],
    //   destinationHospital: ['', [<any>Validators.required]],
    //   visitClass: ['', [<any>Validators.required]],
    //   hiaResponsible: ['', [<any>Validators.required]],
    //   referalName: ['', [<any>Validators.required]],
    //   referingLashmaId: ['', [<any>Validators.required]],
    //   referalDate: ['', [<any>Validators.required]],
    //   outPatient: ['', [<any>Validators.required]],
    //   inPatient: ['', [<any>Validators.required]],
    //   admissionDate: ['', [<any>Validators.required]],
    //   dischargeDate: ['', [<any>Validators.required]],
    //   visitDate: ['', [<any>Validators.required]],
    //   complaint: ['', [<any>Validators.required]],
    //   complaintDuration: ['', [<any>Validators.required]],
    //   complaintUnit: ['', [<any>Validators.required]],
    //   diagnosis: ['', [<any>Validators.required]],
    //   procedure: ['', [<any>Validators.required]],
    //   drug: ['', [<any>Validators.required]],
    //   drugQty: ['', [<any>Validators.required]],
    //   drugUnit: ['', [<any>Validators.required]],
    //   reason: ['', [<any>Validators.required]],
    //   doctor: ['', [<any>Validators.required]],
    //   unit: ['', [<any>Validators.required]],
    //   clinicalNote: ['', [<any>Validators.required]]
    // });

    this.user = (<any>this._locker.getObject('auth')).user;

    this.durations = DURATIONS;
    this._getVisitTypes();
    this._getDiagnosisTypes();
    this._getDrugPackSizes();
   

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getCheckedIn(param.id);
        this._initializeFormGroup();
      }
    })
  }

  
  _getDiagnosisTypes() {
    this._systemService.on();
    this._diagnosisTypeService.find({}).then((payload: any) => {
      this.diagnosisTypes = payload.data;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }
  _initializeFormGroup() {
    if (this.selectedPreAuthorization !== undefined && this.selectedPreAuthorization._id !== undefined) {
      this.today = {
        year: new Date(this.selectedPreAuthorization.encounterDateTime).getFullYear(),
        month: new Date(this.selectedPreAuthorization.encounterDateTime).getMonth() + 1,
        day: new Date(this.selectedPreAuthorization.encounterDateTime).getDate()
      }
    } else {
      this.today = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    }
    this.referalFormGroup = this._fb.group({
      patientName: [this.selectedCheckIn != null ? this.selectedCheckIn.beneficiaryObject.personId.lastName : '', [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      age: ['', [<any>Validators.required]],
      address: ['', [<any>Validators.required]],
      referingHospital: ['', [<any>Validators.required]],
      destinationHospital: ['', [<any>Validators.required]],
      visitClass: ['', [<any>Validators.required]],
      hiaResponsible: ['', [<any>Validators.required]],
      referalName: ['', [<any>Validators.required]],
      referingLashmaId: ['', [<any>Validators.required]],
      referalDate: ['', [<any>Validators.required]],
      outPatient: ['', [<any>Validators.required]],
      inPatient: ['', [<any>Validators.required]],
      admissionDate: ['', [<any>Validators.required]],
      dischargeDate: ['', [<any>Validators.required]],
      visitDate: ['', [<any>Validators.required]],
      complaint: ['', [<any>Validators.required]],
      complaintDuration: ['', [<any>Validators.required]],
      complaintUnit: ['', [<any>Validators.required]],
      diagnosis: ['', [<any>Validators.required]],
      procedure: ['', [<any>Validators.required]],
      drug: ['', [<any>Validators.required]],
      drugQty: ['', [<any>Validators.required]],
      drugUnit: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      doctor: ['', [<any>Validators.required]],
      unit: ['', [<any>Validators.required]],
      clinicalNote: ['', [<any>Validators.required]]
    });
    console.log(this.referalFormGroup.controls.patientName);
    console.log(this.selectedCheckIn );

    this.symptomFormGroup = this._fb.group({
      presentingComplaints: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      complaintsDuration: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : 1, [<any>Validators.required]],
      complaintsUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.diagnosisFormGroup = this._fb.group({
      diagnosis: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      diagnosisType: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.procedureFormGroup = this._fb.group({
      procedures: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.investigationFormGroup = this._fb.group({
      services: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.drugFormGroup = this._fb.group({
      drug: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      drugQty: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : 1, [<any>Validators.required]],
      drugUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.drugFormGroup.controls.drug.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        if (!(this.drugItems.filter(x => x.name === value).length > 0)) {
          this.selectedDrug = undefined;
          this._getDrugs(value);
        }
      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.symptomFormGroup.controls.presentingComplaints.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        if (!(this.symptomItems.filter(x => x.name === value).length > 0)) {
          this.selectedComplain = undefined;
          this._getSymptoms(value);
        }

      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.diagnosisFormGroup.controls.diagnosis.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        if (!(this.diagnosisItems.filter(x => x.name === value).length > 0)) {
          this.selectedDiagnosis = undefined;
          this._getDiagnosises(value);
        }
      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.procedureFormGroup.controls.procedures.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        if (!(this.procedureItems.filter(x => x.name === value).length > 0)) {
          this.selectedProcedure = undefined;
          this._getProcedures(value);
        }
      }, error => {
        this._systemService.off();
        console.log(error)
      });

    this.investigationFormGroup.controls.services.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(value => {
        if (!(this.investigationItems.filter(x => x.name === value).length > 0)) {
          this.selectedInvestigation = undefined;
          this._getInvestigations(value);
        }
      }, error => {
        this._systemService.off();
        console.log(error)
      });

  }


  _getSymptoms(value) {
    if (value && value.length > 1) {
      this._symptomService.find({
        query: {
          'name': { $regex: value, '$options': 'i' },
        }
      }).then((payload: any) => {
        if (payload.data.length > 0) {
          this.complaintSearchResult = true;
          this.symptomItems = payload.data
        }

      })
    }

  }

  _getProcedures(value) {
    if (value && value.length > 1) {
      this._procedureService.find({
        query: {
          'name': { $regex: value, '$options': 'i' },
        }
      }).then((payload: any) => {
        if (payload.data.length > 0) {
          this.procedureSearchResult = true;
          this.procedureItems = payload.data
        }

      })
    }
  }

  _getDrugs(value) {
    if (value && value.length > 1) {
      this._drugService.find({
        query: {
          'name': { $regex: value, '$options': 'i' },
        }
      }).then((payload: any) => {
        if (payload.data.length > 0) {
          this.drugSearchResult = true;
          this.drugItems = payload.data;
        }
      })
    }
  }

  _getDiagnosises(value) {
    if (value && value.length > 1) {
      this._diagnosisService.find({
        query: {
          'name': { $regex: value, '$options': 'i' },
        }
      }).then((payload: any) => {
        if (payload.data.length > 0) {
          this.diagnosisSearchResult = true;
          this.diagnosisItems = payload.data;
        }
      })
    }
  }

  _getInvestigations(value) {
    if (value && value.length > 1) {
      this._investigationService.find({
        query: {
          'name': { $regex: value, '$options': 'i' },
        }
      }).then((payload: any) => {
        if (payload.data.length > 0) {
          this.investigationSearchResult = true;
          this.investigationItems = payload.data;
        }

      })
    }
  }
  _getCheckedIn(id) {
    this._systemService.on();
    this._checkInService.get(id, {}).then((payload: any) => {
      this.selectedCheckIn = payload;
      console.log('call be')
      this._initializeFormGroup();
      console.log('call')
      this._getPolicy();
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    })
  }

  _getPolicy() {
    this._systemService.on();
    let policy$ = Observable.fromPromise(this._policyService.find(
      {
        query: {
          $and: [
            { isActive: true },
            {
              $or: [
                { 'principalBeneficiary._id': this.selectedCheckIn.beneficiaryId },
                { 'dependantBeneficiaries.beneficiary._id': this.selectedCheckIn.beneficiaryId }
              ]
            }
          ]
        }
      }
    ));


    Observable.forkJoin([policy$]).subscribe((results: any) => {
      let policyResult = results[0];
      if (policyResult.data.length > 0) {
        this.selectedPolicy = policyResult.data[0];
        this.referalFormGroup.controls.hiaResponsible.setValue(this.selectedPolicy.hiaId.name);
      }

      this._systemService.off();
    }, error => {
      console.log(error)
    })
  }


  _getAge() {
    return differenceInYears(
      new Date(),
      this.selectedCheckIn.beneficiaryObject.personId.dateOfBirth
    )
  }
  _getAddress() {
    return this.selectedCheckIn.beneficiaryObject.personId.homeAddress.street + ', ' +
      this.selectedCheckIn.beneficiaryObject.personId.homeAddress.neighbourhood + ', ' +
      this.selectedCheckIn.beneficiaryObject.personId.homeAddress.lga.name + ', ' +
      this.selectedCheckIn.beneficiaryObject.personId.homeAddress.state.name
  }

  _getDrugPackSizes() {
    this._systemService.on();
    this._drugPackSizeService.find({}).then((payload: any) => {
      this.packSizes = payload.data;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  _getVisitTypes() {
    this._systemService.on();
    this._visitTypeService.find({}).then((payload: any) => {
      this.visitTypes = payload.data;
      this._systemService.off();
    }).catch(err => {
      console.log(err);
      this._systemService.off();
    })
  }

  navigate(url: string, id: string) {
    if (!!id) {
      this._systemService.on();
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._systemService.on();
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }

  newRef_click(){
    this.newRef = true;
    this.newRefConfirm = false;
  }
  newRefConfirm_click(){
    this.newRef = false;
    this.newRefConfirm = true;
  }

}
