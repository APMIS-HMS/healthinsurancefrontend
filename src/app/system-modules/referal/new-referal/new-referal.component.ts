import { authModulesRoutes } from './../../../auth/auth.route';
import { ReferralAuthorization } from './../../../models/referral/referral';
import { ReferralService } from './../../../services/referral/referral.service';
import { PreAuthorizationDocument, Document } from './../../../models/authorization/authorization';
import differenceInYears from 'date-fns/difference_in_years';
import { Observable } from 'rxjs/Observable';
import { REQUEST_STATUS, DURATIONS, CurrentPlaformShortName, FORM_VALIDATION_ERROR_MESSAGE } from './../../../services/globals/config';
import { InvestigationService } from './../../../services/common/investigation.service';
import { VisitTypeService } from './../../../services/common/visit-type.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { SystemModuleService, CheckInService, SymptomService, ProcedureService, DiagnosisService, DrugService, DiagnosisTypeService, FacilityService } from '../../../services/index';
import { DrugPackSizeService } from '../../../services/common/drug-pack-size.service';
import { PolicyService } from '../../../services/policy/policy.service';
import { ToastsManager } from 'ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { PreAuthorizationService } from '../../../services/pre-authorization/pre-authorization.service';
import * as moment from 'moment';

@Component({
  selector: 'app-new-referal',
  templateUrl: './new-referal.component.html',
  styleUrls: ['./new-referal.component.scss']
})
export class NewReferalComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
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

  tab_complaints = true;
  tab_upload = false;
  tab_notes = false;
  tab_clinicalNotes = false;
  tab_diagnosis = false;
  tab_treatment = false;
  tab_drug = false;
  tab_procedures = false;
  tab_services = false;

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
  currentPlatform: any;

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
  destinationFacilities: any[] = [];

  diagnosisTypes: any[] = [];
  packSizes: any[] = [];
  requestStatus = REQUEST_STATUS;
  referral: any;

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
    private _facilityService: FacilityService,
    private _referralService: ReferralService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('New Referral');
    this._headerEventEmitter.setMinorRouteUrl('Create New Referral');

    this.user = (<any>this._locker.getObject('auth')).user;

    this.durations = DURATIONS;
    this._getUserFacility();
    this._getCurrentPlatform();
    this._getVisitTypes();
    this._getDiagnosisTypes();
    this._getDrugPackSizes();


    this._initializeFormGroup();
    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        console.log(param.id)
        this._getCheckedIn(param.id);
      } else if (param.refid !== undefined) {
        this._getReferral(param.refid);
      }
    })
  }
  private _getUserFacility() {
    this._facilityService.get(this.user.facilityId._id, {}).then(payload => {
      this.user.facilityId = payload;
    }).catch(err => {

    })
  }
  private _getReferral(id) {
    this._referralService.get(id, {}).then(payload => {
      this.referral = payload;
      this.selectedCheckIn = this.referral.checkedInDetails;
      console.log(this.selectedCheckIn);
      this.selectedPolicy = this.referral.policyId;
      this._initializeFormGroup();
      this.referalFormGroup.controls.hiaResponsible.setValue(this.selectedPolicy.hiaId.name);
      this.referalFormGroup.controls.visitClass.setValue(this.referral.visityClassId);







      // let symptomObj = this.referral.documentation[0].document[0];
      // let clinicalNoteObj = this.referral.documentation[0].document[1];
      // let diagnosisObj = this.referral.documentation[0].document[2];
      // let investigationObj = this.referral.documentation[0].document[3];
      // let drugObj = this.referral.documentation[0].document[4];
      // let procedureObj = this.referral.documentation[0].document[5];
      // let reasonObj = this.referral.documentation[0].document[6];
      // let preAuthObj = this.referral.documentation[0].document[7];
  
      // this.referalFormGroup = this._fb.group({
      //   destinationHospital: ['', [<any>Validators.required]],
      //   reason: ['', [<any>Validators.required]],
      //   doctor: [this.referral !== undefined ? this.referral.medicalPersonelName : ''],
      //   unit: [this.referral !== undefined ? this.referral.medicalPersonelUnit : ''],
      //   clinicalNote: ['', [<any>Validators.required]]
      // });
  
      // this.referalFormGroup.controls.doctor.disable();
      // this.referalFormGroup.controls.unit.disable();
  
      // this.referalFormGroup.controls.destinationHospital.valueChanges.subscribe(value => {
      //   if (value !== null && value._id === this.user.facilityId._id) {
      //     this.referalFormGroup.controls.destinationHospital.reset();
      //     this.referalFormGroup.controls.destinationHospital.setErrors({ 'invalid': true });
      //   }
      // })
  
      // this.symptomFormGroup = this._fb.group({
      //   complaint: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      //   complaintDuration: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : 1, [<any>Validators.required]],
      //   complaintUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      // });
      // this.complaintLists = symptomObj.clinicalDocumentation;
  
      // this.diagnosisFormGroup = this._fb.group({
      //   diagnosis: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      //   diagnosisType: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      // });
      // this.diagnosisLists = diagnosisObj.clinicalDocumentation;
  
      // this.procedureFormGroup = this._fb.group({
      //   procedure: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      // });
      // this.procedureList = procedureObj.clinicalDocumentation;
  
      // this.investigationFormGroup = this._fb.group({
      //   services: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      // });
      // this.investigationList = investigationObj.clinicalDocumentation;
  
      // this.drugFormGroup = this._fb.group({
      //   drug: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      //   drugQty: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : 1, [<any>Validators.required]],
      //   drugUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      // });
      // this.drugList = drugObj.clinicalDocumentation;
















      





    })
  }
  private _getCurrentPlatform() {
    this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
        this._getProviders();
      }
    }).catch(err => console.log(err));
  }
  _getProviders() {
    this._facilityService.find({
      query: {
        'facilityType.name': 'Provider',
        'platformOwnerId._id': this.currentPlatform._id
      }
    }).then((payload: any) => {
      this.destinationFacilities = payload.data;
    }).catch(err => {

    });
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
    console.log(this.user)
    // console.log(this.selectedCheckIn.beneficiaryObject.personId.lastName)
    this.referalFormGroup = this._fb.group({
      patientName: [this.selectedCheckIn != undefined ? this.selectedCheckIn.beneficiaryObject.personId.lastName : '', [<any>Validators.required]],
      gender: [this.selectedCheckIn != null ? this.selectedCheckIn.beneficiaryObject.personId.gender.name : '', [<any>Validators.required]],
      age: [this.selectedCheckIn != undefined ? this._getAge() : 0, [<any>Validators.required]],
      referingHospital: [this.selectedCheckIn != null ? this.user.facilityId.name : '', [<any>Validators.required]],
      destinationHospital: [this.referral != undefined ? this.referral.destinationProvider : '', [<any>Validators.required]],
      visitClass: ['', [<any>Validators.required]],
      hiaResponsible: ['', [<any>Validators.required]],
      referingLashmaId: [this.selectedCheckIn != null ? this.user.facilityId.provider.providerId : '', [<any>Validators.required]],
      admissionDate: ['', [<any>Validators.required]],
      dischargeDate: ['', [<any>Validators.required]],
      visitDate: ['', [<any>Validators.required]],
      reason: ['', [<any>Validators.required]],
      doctor: ['', [<any>Validators.required]],
      unit: ['', [<any>Validators.required]],
      clinicalNote: ['', [<any>Validators.required]]
    });

    this.referalFormGroup.controls.destinationHospital.valueChanges.subscribe(value => {
      if (value !== null && value._id === this.user.facilityId._id) {
        this.referalFormGroup.controls.destinationHospital.reset();
        this.referalFormGroup.controls.destinationHospital.setErrors({ 'invalid': true });
      }
    })

    this.symptomFormGroup = this._fb.group({
      complaint: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      complaintDuration: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : 1, [<any>Validators.required]],
      complaintUnit: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.diagnosisFormGroup = this._fb.group({
      diagnosis: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
      diagnosisType: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
    });

    this.procedureFormGroup = this._fb.group({
      procedure: [this.selectedPreAuthorization != null ? this.selectedPreAuthorization.encounterType : '', [<any>Validators.required]],
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

    this.symptomFormGroup.controls.complaint.valueChanges
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

    this.procedureFormGroup.controls.procedure.valueChanges
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
    console.log(id)
    this._checkInService.get(id, {}).then((payload: any) => {
      console.log(payload);
      this.selectedCheckIn = payload;
      console.log(this.selectedCheckIn)
      this._initializeFormGroup();
      this._getPolicy2();
      this._systemService.off();
    }).catch(err => {
      console.log(err)
      this._systemService.off();
    })
  }

  _getPolicy2() {
    console.log('policy 2')
    this._systemService.on();
    this._policyService.find(
      {
        query: {
          $and: [
            { isActive: true },
            {
              $or: [
                { 'principalBeneficiary': this.selectedCheckIn.beneficiaryId },
                { 'dependantBeneficiaries.beneficiary._id': this.selectedCheckIn.beneficiaryId }
              ]
            }
          ]
        }
      }
    ).then((results: any) => {
      console.log(results);
      // let policyResult = results[0];
      // console.log(policyResult);
      if (results.data.length > 0) {
        this.selectedPolicy = results.data[0];
        this.referalFormGroup.controls.hiaResponsible.setValue(this.selectedPolicy.hiaId.name);
        console.log(this.selectedPolicy)
      }

      this._systemService.off();
    }, error => {
      console.log(error)
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


  getDateDiff(date1, date2) {
    var b = moment(date1),
      a = moment(date2),
      intervals: any = ['years', 'months', 'weeks', 'days'],
      out = [];

    for (var i = 0; i < intervals.length; i++) {
      var diff = a.diff(b, intervals[i]);
      b.add(diff, intervals[i]);
      out.push(diff + ' ' + intervals[i]);
    }
    return out.join(', ');
  };

  _getAge() {
    return this.getDateDiff(this.selectedCheckIn.beneficiaryObject.personId.dateOfBirth, new Date());
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


  removeComplain(complain, i) {
    this.complaintLists.splice(i);
  }

  removeDiagnosis(diagnosis, i) {
    this.diagnosisLists.splice(i);
  }
  removeProcedure(i) {
    this.procedureList.splice(i);
  }
  removeInvestigation(i) {
    this.investigationList.splice(i);
  }
  removeDrug(i) {
    this.drugList.splice(i);
  }

  onSelectComplain(complain) {
    this.symptomFormGroup.controls.complaint.setValue(complain.name);
    this.complaintSearchResult = false;
    this.selectedComplain = complain;
  }
  onSelectDiagnosis(diagnosis) {
    this.diagnosisFormGroup.controls.diagnosis.setValue(diagnosis.name);
    this.diagnosisSearchResult = false;
    this.selectedDiagnosis = diagnosis;
  }
  onSelectProcedure(procedure) {
    this.procedureFormGroup.controls.procedure.setValue(procedure.name);
    this.procedureSearchResult = false;
    this.selectedProcedure = procedure;
  }
  onSelectInvestigation(investigation) {
    this.investigationFormGroup.controls.services.setValue(investigation.name);
    this.investigationSearchResult = false;
    this.selectedInvestigation = investigation;
  }
  onSelectDrug(drug) {
    this.drugFormGroup.controls.drug.setValue(drug.name);
    this.drugSearchResult = false;
    this.selectedDrug = drug;
  }
  onAddDrug() {
    let name = this.drugFormGroup.controls.drug;
    let unit = this.drugFormGroup.controls.drugUnit;
    let quantity = this.drugFormGroup.controls.drugQty;
    let retObj = this.checkProviderAuthorization(this.selectedCheckIn.providerFacilityId.provider.facilityClass[0], this.selectedDrug);
    if (name.valid && unit.valid && quantity.valid && typeof (this.selectedDrug) === 'object') {
      this.drugList.push({
        "drug": retObj.investigation,
        "unit": unit.value,
        "quantity": quantity.value,
        "checked": retObj.checked,
        "approvedStatus": retObj.approvedStatus
      });
      this.drugFormGroup.controls.drug.reset();
      unit.reset();
      quantity.reset(1);
    } else {
      name.markAsDirty({ onlySelf: true });
      unit.markAsDirty({ onlySelf: true });
      quantity.markAsDirty({ onlySelf: true });
    }
  }
  checkProviderAuthorization(fc, resource) {
    console.log(fc);
    console.log(resource)
    if (fc === 'primary') {
      if (resource.P.toLowerCase().trim() == "p") {
        console.log(1)
        if (resource.PA.toLowerCase().trim() == "n") {
          console.log(2)
          // its approved
          let copyInvestigation = resource;
          delete copyInvestigation.Amount;
          return {
            'investigation': copyInvestigation,
            'approvedStatus': this.requestStatus[1],
            'checked': false
          }
        } else {
          if (resource.Prefered.toLowerCase().trim() == 'c') {
            console.log(3)
            // cover by capitation, dont put amount
            //requires authorization
            let copyInvestigation = resource;
            delete copyInvestigation.Amount;
            return {
              'investigation': copyInvestigation,
              'approvedStatus': this.requestStatus[0],
              'checked': true
            }
          } else {
            console.log(4)
            //set to approve and look for amount
            //requires authorization
            let copyInvestigation = resource;
            return {
              'investigation': copyInvestigation,
              'approvedStatus': this.requestStatus[0],
              'checked': true
            }
          }

        }
      } else if (resource.P.toLowerCase().trim() == "e") {
        let copyInvestigation = resource;
        delete copyInvestigation.Amount;
        return {
          'investigation': copyInvestigation,
          'approvedStatus': this.requestStatus[1],
          'checked': false
        }
      }
    } else if (fc === 'secondary') {
      console.log(5)
      // get authorization, check amount
      let copyInvestigation = resource;
      return {
        'investigation': copyInvestigation,
        'approvedStatus': this.requestStatus[0],
        'checked': true
      }
    }
  }
  compare(l1: any, l2: any) {
    if (l1 !== null && l2 !== null) {
      return l1._id === l2._id;
    }
    return false;
  }
  onAddInvestigation() {
    let name = this.investigationFormGroup.controls.services;
    let retObj = this.checkProviderAuthorization(this.selectedCheckIn.providerFacilityId.provider.facilityClass[0], this.selectedInvestigation);
    if (name.valid) {
      this.investigationList.push({
        "investigation": retObj.investigation,
        "checked": retObj.checked,
        "approvedStatus": retObj.approvedStatus
      });
      this.investigationFormGroup.controls.services.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }
  }
  onAddProcedure() {
    let name = this.procedureFormGroup.controls.procedure;
    let retObj = this.checkProviderAuthorization(this.selectedCheckIn.providerFacilityId.provider.facilityClass[0], this.selectedProcedure);
    if (name.valid) {
      this.procedureList.push({
        "procedure": retObj.investigation,
        "checked": retObj.checked,
        "approvedStatus": this.requestStatus[0]
      });
      this.procedureFormGroup.controls.procedure.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
    }

  }
  onAddDiagnosis() {
    let name = this.diagnosisFormGroup.controls.diagnosis;
    let diagnosisType = this.diagnosisFormGroup.controls.diagnosisType;
    if (name.valid && diagnosisType.valid) {
      this.diagnosisLists.push({
        "diagnosis": typeof (this.selectedDiagnosis) === 'object' ? this.selectedDiagnosis : name.value,
        "diagnosisType": diagnosisType.value,
        "checked": false,
        "approvedStatus": this.requestStatus[0]
      });
      this.diagnosisFormGroup.controls.diagnosis.reset();
      diagnosisType.reset();
    } else {
      name.markAsDirty({ onlySelf: true });
      diagnosisType.markAsDirty({ onlySelf: true })
    }

  }
  onAddComplaint() {
    let name = this.symptomFormGroup.controls.complaint;
    let duration = this.symptomFormGroup.controls.complaintDuration;
    let unit = this.symptomFormGroup.controls.complaintUnit;
    if (name.valid && duration.valid && unit.valid) {
      this.complaintLists.push({
        "symptom": typeof (this.selectedComplain) === 'object' ? this.selectedComplain : name.value,
        "duration": duration.value,
        "unit": unit.value,
        "checked": false,
        "approvedStatus": this.requestStatus[0]
      });
      name.reset();
      duration.reset(1);
      unit.reset(this.durations[0]);
    } else {
      console.log('here')
      name.markAsDirty({ onlySelf: true });
      duration.markAsDirty({ onlySelf: true });
      unit.markAsDirty({ onlySelf: true });
    }

  }

  needAuthorization(procedure) {
    if (procedure.procedure.PA === ' Y ') {
      return true;
    } else {
      return false;
    }
  }

  send() {
    console.log(this.referalFormGroup.valid);
    console.log(this.referalFormGroup);
    let counter = 0;
    try {
      this._systemService.on();
      if (this.referalFormGroup.valid) {
        console.log(this.complaintLists);
        console.log(this.procedureList);


        let preAuthDoc: PreAuthorizationDocument = <PreAuthorizationDocument>{};
        preAuthDoc.approvedStatus = this.requestStatus[0];
        preAuthDoc.destinationProvider = this.referalFormGroup.controls.destinationHospital.value;
        preAuthDoc.document = [];
        //note start here
        preAuthDoc.document.push(
          <Document>{
            type: "Clinical Findings",
            clinicalDocumentation: this.referalFormGroup.controls.clinicalNote.value,
            approvedStatus: this.requestStatus[0],
            order: 2
          }
        );
        preAuthDoc.document.push(
          <Document>{
            type: "Reason for Request",
            clinicalDocumentation: this.referalFormGroup.controls.reason.value,
            approvedStatus: this.requestStatus[0],
            order: 7
          }
        );

        // preAuthDoc.document.push(
        //   <Document>{
        //     type: "Pre Authorization Note",
        //     clinicalDocumentation: this.referalFormGroup.controls.preAuthorizationNote.value,
        //     approvedStatus:this.requestStatus[0],
        //     order:8
        //   }
        // )

        //note ends here
        //others

        if (this.complaintLists.length > 0) {
          preAuthDoc.document.push(
            <Document>{
              type: "Symptoms",
              clinicalDocumentation: this.complaintLists,
              approvedStatus: this.requestStatus[0],
              order: 1
            }
          );
        }

        if (this.procedureList.length > 0) {
          preAuthDoc.document.push(
            <Document>{
              type: "Procedures",
              clinicalDocumentation: this.procedureList,
              approvedStatus: this.requestStatus[0],
              order: 6
            }
          );
        }

        if (this.investigationList.length > 0) {
          preAuthDoc.document.push(
            <Document>{
              type: "Investigations",
              clinicalDocumentation: this.investigationList,
              approvedStatus: this.requestStatus[0],
              order: 4
            }
          );
        }

        if (this.diagnosisLists.length > 0) {
          preAuthDoc.document.push(
            <Document>{
              type: "Diagnosis",
              clinicalDocumentation: this.diagnosisLists,
              approvedStatus: this.requestStatus[0],
              order: 3
            }
          );
        }

        if (this.drugList.length > 0) {
          preAuthDoc.document.push(
            <Document>{
              type: "Drugs",
              clinicalDocumentation: this.drugList,
              approvedStatus: this.requestStatus[0],
              order: 5
            }
          );
        }



        let authorizationObject = <ReferralAuthorization>{};
        authorizationObject.checkedInDetails = this.selectedCheckIn;
        authorizationObject.dateOfRequest = this.referalFormGroup.controls.visitDate.value.jsdate;
        authorizationObject.documentation = [];
        authorizationObject.documentation.push(preAuthDoc);
        authorizationObject.policyId = this.selectedPolicy;

        // authorizationObject.isEmergency = this.referalFormGroup.controls.emergency.value;
        authorizationObject.medicalPersonelName = this.referalFormGroup.controls.doctor.value;
        authorizationObject.medicalPersonelUnit = this.referalFormGroup.controls.unit.value;
        authorizationObject.providerFacilityId = this.user.facilityId;
        authorizationObject.visityClassId = this.referalFormGroup.controls.visitClass.value;
        authorizationObject.approvedStatus = this.requestStatus[0];
        authorizationObject.referingProvider = this.user.facilityId;
        authorizationObject.destinationProvider = this.referalFormGroup.controls.destinationHospital.value;

        console.log(authorizationObject);
        this._referralService.create(authorizationObject).then(payload => {
          console.log(payload);
          this._router.navigate(['/modules/referal/referals']);
          this._systemService.off();
        }).catch(err => {
          this._systemService.off();
          console.log(err);
        })


      } else {
        this._systemService.off();
        this._toastr.error(FORM_VALIDATION_ERROR_MESSAGE);
        Object.keys(this.referalFormGroup.controls).forEach((field, i) => { // {1}
          const control = this.referalFormGroup.get(field);
          if (!control.valid) {
            control.markAsDirty({ onlySelf: true });
            counter = counter + 1;
          }
        });
      }
    } catch (error) {
      this._systemService.off();
      console.log(error)
    }
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

  newRef_click() {
    this.newRef = true;
    this.newRefConfirm = false;
  }
  newRefConfirm_click() {
    this.newRef = false;
    this.newRefConfirm = true;
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
        // that.showPreview = true;
        // that.blah.nativeElement.src = e.target.result;
        console.log(e)
        that._systemService.off();
      };

      reader.readAsDataURL(input.files[0]);
    }
  }
  tabComplaints_click() {
    this.tab_complaints = true;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = false;
  }
  tabUpload_click() {
    this.tab_complaints = false;
    this.tab_upload = true;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = false;
  }
  tabNotes_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = true;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = false;
  }

  tabClinicalNotes_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = true;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = false;
  }
  tabDiagnosiss_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = true;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = false;
  }
  tabTreatment_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = true;
    this.tab_drug = false;
    this.tab_services = false;
  }
  tabDrug_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = true;
    this.tab_services = false;
  }

  tabServices_click() {
    this.tab_complaints = false;
    this.tab_upload = false;
    this.tab_notes = false;
    this.tab_clinicalNotes = false;
    this.tab_diagnosis = false;
    this.tab_treatment = false;
    this.tab_drug = false;
    this.tab_services = true;
  }

}
