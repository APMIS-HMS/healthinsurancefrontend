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

  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');

	tab_details = true;
	tab_preauthorization = false;
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
  intendingBeneficiaries:any[] = [];
  states:any[] = [];
  countries:any[] = [];
  cities:any[] = [];
  lgs:any[] = [];
  currentPlatform:any;
  selectedCountry:any;
  selectedState:any;

	constructor(
    private _router: Router,
    private _toastr: ToastsManager,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _route: ActivatedRoute,
    private _facilityService: FacilityService,
    private _systemService: SystemModuleService,
    private loadingService: LoadingBarService,
    private _uploadService:UploadService,
    private _titleService:TitleService,
    private _genderService:GenderService,
    private _countryService:CountryService,

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
		this._facilityService.findWithOutAuth({ query: { shortName: CurrentPlaformShortName } }).then(res => {
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
      this._uploadService.upload(formData, this.facility._id).then(res => {
        console.log(res.body.data.Sheet1)
        let enrolleeList: any[] = [];
        if (res.body !== undefined && res.body.error_code === 0) {
          res.body.data.Sheet1.forEach(row => {
            let rowObj: any = <any>{};
            rowObj.serial = row.A;
            rowObj.surname = row.B;
            rowObj.firstName = row.C;
            rowObj.gender = row.D;
            rowObj.filNo = row.E;
            rowObj.category = row.F;
            rowObj.sponsor = row.G;
            rowObj.plan = row.H;
            rowObj.type = row.I;
            // rowObj.date = this.excelDateToJSDate(row.J);
            enrolleeList.push(rowObj);
          });
          // const index = this.loginHMOListObject.hmos.findIndex(x => x._id === hmo._id);
          // let facHmo = this.loginHMOListObject.hmos[index];
          // let enrolleeItem = {
          //   month: new Date().getMonth() + 1,
          //   year: new Date().getFullYear(),
          //   enrollees: enrolleeList
          // }
          // console.log(enrolleeItem);

          // facHmo.enrolleeList.push(enrolleeItem);
          // console.log(facHmo);
          // this.loginHMOListObject.hmos[index] = facHmo;


          // console.log(this.loginHMOListObject);
          // this.hmoService.update(this.loginHMOListObject).then(pay => {
          //   console.log(pay);
          //   this.getLoginHMOList();
          // })
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

  navigateEmployers(url, id) {
    this.loadingService.startLoading();
    if (!!id) {
      this._router.navigate([url + id]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
      });
    } else {
      this._router.navigate([url]).then(res => {
        this.loadingService.endLoading();
      }).catch(err => {
        this.loadingService.endLoading();
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
  }

}
