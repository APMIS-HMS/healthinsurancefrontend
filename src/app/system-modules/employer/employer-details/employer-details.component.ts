import { CurrentPlaformShortName } from './../../../services/globals/config';
import { CountryService } from './../../../services/common/country.service';
import { GenderService } from './../../../services/common/gender.service';
import { TitleService } from './../../../services/common/titles.service';
import { UploadService } from './../../../services/common/upload.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FacilityService, SystemModuleService } from './../../../services/index';
import { Facility, Employer, Address, BankDetail, Contact } from './../../../models/index';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-employer-details',
  templateUrl: './employer-details.component.html',
  styleUrls: ['./employer-details.component.scss']
})
export class EmployerDetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  searchHiaControl = new FormControl();
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');

  tab_details = true;
  tab_preauthorization = false;
  tab_hia = false;
  tab_plans = false;
  tab_beneficiaries = false;
  tab_employers = false;
  tab_payment = false;
  tab_claims = false;
  tab_complaints = false;
  tab_referals = false;
  facility: any = <any>{};
  addApproval: boolean = false;
  isUploading = false;
  approvalBtn: string = 'APPROVE &nbsp; <i class="fa fa-check-circle"></i>';
  intendingBeneficiaries: any[] = [];
  states: any[] = [];
  countries: any[] = [];
  cities: any[] = [];
  lgs: any[] = [];
  currentPlatform: any;
  selectedCountry: any;
  selectedState: any;

  constructor(
    private _router: Router,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private _titleService: TitleService,
    private _genderService: GenderService,
    private _countryService: CountryService,

  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Employer Details');
    this._headerEventEmitter.setMinorRouteUrl('Details page');

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this._getEmployerDetails(param.id);
      }
    });
  }

  private _getCurrentPlatform() {
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res:any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
      }
    }).catch(err => console.log(err));
  }

  _getCountries() {
    this._systemService.on();
    this._countryService.find({
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
    this._countryService.find({
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
    this._countryService.find({
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

  onClickApprove() {
    this.facility.isConfirmed = true;
    this._facilityService.update(this.facility).then(res => {
      console.log(res);
      this.facility = res;
      const status = this.facility.isConfirmed ? 'activated successfully' : 'deactivated successfully';
      const text = this.facility.name + ' has been ' + status;
      this._toastr.success(text, 'Confirmation!');
      setTimeout(e => {
        this.addApprovalClick();
      }, 1000);
    });
  }

  onClickDeactivate() {
    this.facility.isConfirmed = false;
    this._facilityService.update(this.facility).then(res => {
      console.log(res);
      this.facility = res;
      const status = this.facility.isConfirmed ? 'activated successfully' : 'deactivated successfully';
      const text = this.facility.name + ' has been ' + status;
      this._toastr.success(text, 'Confirmation!');
      setTimeout(e => {
        this.addApprovalClick();
      }, 1000);
    });
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
    this.isUploading = true;
  }

  excelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
  }

  public upload(e) {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("excelfile", fileBrowser.files[0]);
      formData.append("facilityId", this.facility._id);
      this._uploadService.uploadExcelFile(formData).then(result => {
        //console.log(result);
        let enrolleeList: any[] = [];
        var bodyObj = [];
        var principal = {};
        var beneficiaries = [];
        var policy = {};
        if (result.body !== undefined && result.error == false) {
          // res.body.data.Sheet1.forEach(row => {
          //   let rowObj: any = <any>{};
          //   rowObj.serial = row.A;
          //   rowObj.surname = row.B;
          //   rowObj.firstName = row.C;
          //   rowObj.gender = row.D;
          //   rowObj.filNo = row.E;
          //   rowObj.category = row.F;
          //   rowObj.sponsor = row.G;
          //   rowObj.plan = row.H;
          //   rowObj.type = row.I;
          //   // rowObj.date = this.excelDateToJSDate(row.J);
          //   enrolleeList.push(rowObj);
          // });
          console.log(result);
          result.body.Sheet1.forEach(function (item, index) {
            if (index > 0) {
              if (item.A != undefined && item.B != undefined && item.C != undefined
                && item.D != undefined && item.E != undefined && item.F != undefined && item.G != undefined
                && item.H != undefined && item.I != undefined
                && item.J != undefined && item.K != undefined && item.L != undefined && item.M != undefined
                && item.N != undefined && item.O != undefined && item.P != undefined && item.Q != undefined
                && item.R != undefined && item.S != undefined && item.AL != undefined && item.AM != undefined
                && item.AL != undefined && item.AM != undefined && item.AN != undefined && item.AO != undefined
                && item.AP != undefined && item.AQ != undefined) {
                console.log("A");
                beneficiaries = [];
                principal = {
                  "dateOfBirth": item.A,
                  "email": item.B,
                  "numberOfUnderAge": item.C,
                  "gender": item.D,
                  "homeAddress": {
                    "neighbourhood": item.E,
                    "state": item.F,
                    "lga": item.G,
                    "street": item.H
                  },
                  "lastName": item.I,
                  "firstName": item.J,
                  "lgaOfOrigin": item.K,
                  "maritalStatus": item.L,
                  "mothersMaidenName": item.M,
                  "otherNames": item.N,
                  "phoneNumber": item.O,
                  "platformOwnerId": item.P,
                  "stateOfOrigin": item.Q,
                  "title": item.S
                };
                policy = {
                  "platformOwnerId": item.AL,
                  "hiaId": item.AM,
                  "providerId": item.AN,
                  "planTypeId": item.AO,
                  "planId": item.AP,
                  "premiumCategoryId": item.AQ
                };
              }
              console.log(policy);
              if (item.S != undefined && item.T != undefined && item.U != undefined && item.V != undefined && item.W != undefined
                && item.X != undefined && item.Y != undefined && item.Z != undefined && item.AA != undefined && item.AB != undefined
                && item.AC != undefined && item.AD != undefined && item.AE != undefined && item.AF != undefined && item.AG != undefined) {
                beneficiaries.push({
                  "dateOfBirth": item.S,
                  "email": item.T,
                  "gender": item.U,
                  "lastName": item.V,
                  "firstName": item.W,
                  "lgaOfOrigin": item.X,
                  "numberOfUnderAge": item.Y,
                  "maritalStatus": item.Z,
                  "mothersMaidenName": item.AA,
                  "otherNames": item.AB,
                  "phoneNumber": item.AC,
                  "platformOwnerId": item.AD,
                  "stateOfOrigin": item.AE,
                  "relationship": item.AF,
                  "title": item.AG,
                  "homeAddress": {
                    "neighbourhood": item.AH,
                    "state": item.AI,
                    "lga": item.AJ,
                    "street": item.AK
                  }
                }); console.log("B");
              }
              let counter = index + 1;
              if (result.body.Sheet1.length == counter) {
                console.log("c");
                bodyObj.push({
                  "principal": principal,
                  "dependent": beneficiaries,
                  "policy": policy
                });
                console.log(bodyObj);
              } else {
                try {
                  if (result.body.Sheet1[counter].A != undefined
                    && result.body.Sheet1[counter].B != undefined
                    && result.body.Sheet1[counter].C != undefined
                    && result.body.Sheet1[counter].D != undefined
                    && result.body.Sheet1[counter].I != undefined
                    && result.body.Sheet1[counter].J != undefined) {
                    bodyObj.push({
                      "principal": principal,
                      "dependent": beneficiaries,
                      "policy": policy
                    });
                  }
                }
                catch (Exception) {

                }
              }
            }
          });
        }
      }).catch(err => {
        // this._notification('Error', "There was an error uploading the file");
      });
    }
  }

  addApprovalClick() {
    this.addApproval = !this.addApproval;
  }

  private _getEmployerDetails(routeId) {
    this._systemService.on();
    this._facilityService.get(routeId, {})
      .then((res: Facility) => {
        console.log(res);
        this._headerEventEmitter.setMinorRouteUrl(res.name);
        this._systemService.off();
        this.facility = res;
      }).catch(err => {
        this._systemService.off();
      });
  }

  navigateEmployers(url, id?) {
    this._systemService.on()
    if (!!id) {
      this._router.navigate([url + id]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    } else {
      this._router.navigate([url]).then(res => {
        this._systemService.off();
      }).catch(err => {
        this._systemService.off();
      });
    }
  }

  tabDetails_click() {
    this.tab_details = true;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_hia = false;
  }
  tabPreauthorization_click() {
    this.tab_details = false;
    this.tab_preauthorization = true;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_hia = false;
  }
  tabPlans_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = true;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_hia = false;
  }
  tabBeneficiaries_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = true;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_hia = false;
  }
  tabEmployers_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = true;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_hia = false;
  }
  tabPayment_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = true;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_hia = false;
  }
  tabClaims_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = true;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_hia = false;
  }
  tabComplaints_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = true;
    this.tab_referals = false;
    this.tab_hia = false;
  }
  tabReferals_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = true;
    this.tab_hia = false;
  }
  tabHia_click() {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tab_payment = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_hia = true;
  }

}
