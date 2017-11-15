import { CurrentPlaformShortName } from './../../../services/globals/config';
import { CountryService } from './../../../services/common/country.service';
import { GenderService } from './../../../services/common/gender.service';
import { TitleService } from './../../../services/common/titles.service';
import { UploadService } from './../../../services/common/upload.service';
import { PlanTypeService } from './../../../services/common/plan-type.service';
import { UserTypeService } from './../../../services/common/user-type.service';
import { PremiumTypeService } from './../../../services/common/premium-type.service';
import { PlanService } from './../../../services/plan/plan.service';
import { MaritalStatusService } from './../../../services/common/marital-status.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FacilityService, SystemModuleService } from './../../../services/index';
import { Facility, Employer, Address, BankDetail, Contact } from './../../../models/index';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-employer-details',
  templateUrl: './employer-details.component.html',
  styleUrls: ['./employer-details.component.scss']
})
export class EmployerDetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  orderExcelPolicies = [];
  totalExcelPrincipalItems = 0;
  titles = [];
  genders = [];
  maritalStatus = [];
  mStates = [];
  mLga = [];
  oStates = [];
  oLga = [];
  platforms = [];
  planTypes = [];
  userTypes = [];
  plans = [];
  packages = [];
  categories = [];
  SPONSORSHIP = [];


  searchHiaControl = new FormControl();
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');


  allitemsControl= new FormControl();
  nameControl = new FormControl();
  genderControl = new FormControl();
  titleControl = new FormControl();
  maritalStatusControl = new FormControl();
  stateControl = new FormControl();
  oStateControl = new FormControl();
  oLgaControl= new FormControl();
  lgaControl = new FormControl();
  hiaControl = new FormControl();
  platformControl = new FormControl();
  facilityTypeControl = new FormControl();
  planTypeControl = new FormControl();
  planControl = new FormControl();
  packageControl = new FormControl();
  sponsorshipControl = new FormControl();

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mmm-yyyy',
  };

  public today: IMyDate;

  tab_details = true;
  tab_preauthorization = false;
  tab_hia = false;
  tab_plans = false;
  tab_beneficiaries = false;
  tab_employers = false;
  tabPayment = false;
  tabPaymentHistory = false;
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
  hias: any[] = [];
  drugSearchResult = false;
  routeId: string;

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
    private _maritalStatusService: MaritalStatusService,
    private _planTypeService: PlanTypeService,
    private _userTypeService: UserTypeService,
    private _planService: PlanService,
    private _premiumTypeService: PremiumTypeService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Organisation Details');
    this._headerEventEmitter.setMinorRouteUrl('Details page');

    this.SPONSORSHIP = [
      { 'id': 1, 'name': 'Self' },
      { 'id': 2, 'name': 'Organization' }
    ];

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this.routeId = param.id;
        this._getEmployerDetails(param.id);
      }
    });
    this.searchHiaControl.valueChanges
      .debounceTime(350)
      .distinctUntilChanged()
      .subscribe(value => {
        this.drugSearchResult = false;
        this._facilityService.find({
          query: {
            'platformOwnerId._id': this.currentPlatform._id,
            name: { $regex: value, '$options': 'i' },
            'facilityType.name': 'Health Insurance Agent'
          }
        }).then((payload: any) => {
          this.hias = payload.data;
          this.drugSearchResult = true;
        });
      });
    this._getCurrentPlatform();
    this._getTitles();
    this._getGender();
    this._getMaritalStatus();
    this._getState();
    this._getOriginState();
    this._getPlatforms();
    this._getPlanTypes();
    this._getPremiumCategory();
    this._getFacilityTypes();
    this._getPlans();
  }

  _getTitles() {
    this._titleService.find({}).then((payload: any) => {
      this.titles = payload.data;
    });

    if (this._router.url.endsWith('payment')) {
      this.navigate('payment');
    } else if (this._router.url.endsWith('beneficiary')) {
      this.navigate('beneficiary');
    } else if (this._router.url.endsWith('hia')) {
      this.navigate('hia');
    } else if (this._router.url.endsWith('payment-history')) {
      this.navigate('payment-history');
    } else {
      this.navigate('details');
    }
  }

  _getGender() {
    this._genderService.find({}).then((payload: any) => {
      this.genders = payload.data;
    })
  }

  _getMaritalStatus() {
    this._maritalStatusService.find({}).then((payload: any) => {
      this.maritalStatus = payload.data;
    })
  }

  _getState() {
    this._countryService.find({
      query:
      {
        'name': 'Nigeria'
      }
    }).then((payload: any) => {
      if (payload.data[0] != undefined) {
        this.mStates = payload.data[0].states;
      }
    })
  }

  _getOriginState() {
    this._countryService.find({
      query:
      {
        'name': 'Nigeria'
      }
    }).then((payload: any) => {
      if (payload.data[0] != undefined) {
        this.oStates = payload.data[0].states;
      }
    })
  }

  _getPlatforms() {
    this._facilityService.find({}).then((payload: any) => {
      if (payload.data.length > 0) {
        this.platforms = payload.data;
      }
    })
  }

  _getPlanTypes() {
    this._planTypeService.find({}).then((payload: any) => {
      this.planTypes = payload.data;
    })
  }

  _getFacilityTypes() {
    this._userTypeService.find({}).then((payload: any) => {
      this.userTypes = payload.data;
    })
  }

  _getPlans() {
    this._planService.find({}).then((payload: any) => {
      this.plans = payload.data;
    })
  }

  _getPremiumCategory() {
    this._premiumTypeService.find({}).then((payload: any) => {
      this.categories = payload.data;
    })
  }
  

  checkValue(param, data, obj) {
    try {
      if (obj.toString().includes('.')) {
        let arObj = obj.toString().split('.');//Not expecting obj of an array more than two indexes
        let val1 = arObj[0];
        let val2 = arObj[1];
        let val = data.filter(function (x) {
          if (x[val1] != undefined) {
            if (x[val1][val2].toString().toLowerCase() == param.toString().toLowerCase()) {
              return true;
            }
            else {
              return false;
            }
          }
        });
        if (val.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        if (data.length > 0) {
          let val = data.filter(x => x[obj].toLowerCase() == param.toString().toLowerCase());
          if (val.length > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } catch (Exception) {
      return false;
    }
  }

  checkLocationValue(param, data) {
    let val = data.filter(x => x.name.toLowerCase() == param.toLowerCase());
    if (val.length > 0) {
      this.mLga = val[0].lgs;
      return true;
    } else {
      return false;
    }
  }

  checklocationValue2(param, data) {
    let val = data.filter(x => x.name.toLowerCase() == param.toLowerCase());
    if (val.length > 0) {
      this.oLga = val[0].lgs;
      return true;
    } else {
      return false;
    }
  }

  checkHiaValue(facilityType, hia, data) {
    if (facilityType != undefined && hia != undefined) {
      console.log(facilityType);
      console.log(hia);
      let val = data.filter(x => x.facilityType.name.toString().toLowerCase() == facilityType.toString().toLowerCase() && x.name.toLowerCase() == hia.toString().toLowerCase());
      console.log(val);
      if (val.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }

  checkPremiumValue(param, pPackage, data) {
    let val = data.filter(x => x.name.toLowerCase() == param.toLowerCase());
    if (val.length > 0) {
      this.packages = val[0].premiums;
      return true;
    } else {
      this.packages = [];
      return false;
    }
  }

  private _getCurrentPlatform() {
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
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
        $select: { 'states': 0 }
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
    });
  }

  _getStates(_id) {
    this._systemService.on();
    this._countryService.find({
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
      this._systemService.off();
    });
  }

  _getLgaAndCities(_id, state) {
    this._systemService.on();
    this._countryService.find({
      query: {
        _id: _id,
        'states.name': state.name,
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
    });
  }

  onSelectDrug(hia) {
    if (this.facility.employer.hias === undefined){
      this.facility.employer.hias = [];
    }
    this.facility.employer.hias.push(hia);
    this._facilityService.update(this.facility).then(payload => {
      this.facility = payload;
    }).catch(err => {

    });
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
    this.fileInput.nativeElement.click();
    this.isUploading = true;
  }

  excelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
  }

  public upload(e) {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append('excelfile', fileBrowser.files[0]);
      formData.append('facilityId', this.facility._id);
      this._uploadService.uploadExcelFile(formData).then(result => {
        result.body.forEach(element => {
          let principal = element.principal;
          principal.policy = element.policy;
          principal.isPrincipal = true;
          principal.isEdit = false;
          this.orderExcelPolicies.push(principal);
          element.dependent.forEach(item => {
            item.isPrincipal = false;
            item.isEdit = false;
            this.orderExcelPolicies.push(item);
          });
        });
        this.totalExcelPrincipalItems = this.orderExcelPolicies.filter(x => x.isPrincipal == true).length;
        console.log(this.orderExcelPolicies);
      }).catch(err => {
        // this._notification('Error', 'There was an error uploading the file');
      });
    }
  }

  addApprovalClick() {
    this.addApproval = !this.addApproval;
  }

  editRow(param) {
    if(this.orderExcelPolicies[param].isEdit == true){
      this.orderExcelPolicies[param].isEdit = false
    }else{
      this.orderExcelPolicies[param].isEdit = true
    }
    this.orderExcelPolicies = JSON.parse(JSON.stringify(this.orderExcelPolicies));
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
    this._systemService.on();
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

  navigateTo(route) {
    this._router.navigate([route]).then(res => {
      this._systemService.off();
    }).catch(err => {
      this._systemService.off();
    });
  }

  navigate(tabName) {
    this.tab_details = false;
    this.tab_preauthorization = false;
    this.tab_plans = false;
    this.tab_beneficiaries = false;
    this.tab_employers = false;
    this.tabPayment = false;
    this.tabPaymentHistory = false;
    this.tab_claims = false;
    this.tab_complaints = false;
    this.tab_referals = false;
    this.tab_hia = false;

    switch (tabName) {
      case 'details':
        this.tab_details = true;
        this.navigateTo('/modules/employer/employers/' + this.routeId);
        break;
      case 'beneficiary':
        this.tab_beneficiaries = true;
        this.navigateTo('/modules/employer/employers/' + this.routeId + '/beneficiary');
        break;
      case 'hia':
        this.tab_hia = true;
        this.navigateTo('/modules/employer/employers/' + this.routeId + '/hia');
        break;
      case 'payment':
        this.tabPayment = true;
        this.navigateTo('/modules/employer/employers/' + this.routeId + '/payment');
        break;
      case 'payment-history':
        this.tabPaymentHistory = true;
        this.navigateTo('/modules/employer/employers/' + this.routeId + '/payment-history');
        break;
    }
  }

}
