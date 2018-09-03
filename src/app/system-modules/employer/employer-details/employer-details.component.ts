
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {IMyDate, IMyDpOptions} from 'mydatepicker';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {environment} from '../../../../environments/environment';
import {HeaderEventEmitterService} from '../../../services/event-emitters/header-event-emitter.service';

import {Address, BankDetail, Contact, Employer, Facility} from './../../../models/index';
import {BulkBeneficiaryUploadService} from './../../../services/common/bulk-beneficiary-upload.service';
import {CountryService} from './../../../services/common/country.service';
import {GenderService} from './../../../services/common/gender.service';
import {MaritalStatusService} from './../../../services/common/marital-status.service';
import {PlanTypeService} from './../../../services/common/plan-type.service';
import {PremiumTypeService} from './../../../services/common/premium-type.service';
import {RelationshipService} from './../../../services/common/relationship.service';
import {TitleService} from './../../../services/common/titles.service';
import {UploadService} from './../../../services/common/upload.service';
import {UserTypeService} from './../../../services/common/user-type.service';
import {FacilityService, SystemModuleService} from './../../../services/index';
import {PlanService} from './../../../services/plan/plan.service';

@Component({
  selector: 'app-employer-details',
  templateUrl: './employer-details.component.html',
  styleUrls: ['./employer-details.component.scss']
})
export class EmployerDetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;


  globalItemIndex = 0;
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
  beneficiaries = [];
  relationhips = [];
  nSuccess = 0;
  nFailed = 0;
  isProcessing = false;


  searchHiaControl = new FormControl();
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');


  itemCheckBox = new FormControl();
  nameControl = new FormControl();
  genderControl = new FormControl();
  titleControl = new FormControl();
  maritalStatusControl = new FormControl();
  stateControl = new FormControl();
  oStateControl = new FormControl();
  oLgaControl = new FormControl();
  lgaControl = new FormControl();
  hiaControl = new FormControl();
  providerControl = new FormControl();
  platformControl = new FormControl();
  facilityTypeControl = new FormControl();
  planTypeControl = new FormControl();
  planControl = new FormControl();
  packageControl = new FormControl();
  categoryControl = new FormControl();
  sponsorshipControl = new FormControl();
  relationshipControl = new FormControl();

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
  canApprove: boolean = false;
  user: any;
  platformName: string;

  constructor(
      private _locker: CoolLocalStorage, private _router: Router,
      private _toastr: ToastsManager,
      private _headerEventEmitter: HeaderEventEmitterService,
      private _route: ActivatedRoute, private _facilityService: FacilityService,
      private _systemService: SystemModuleService,
      private _uploadService: UploadService,
      private _titleService: TitleService,
      private _genderService: GenderService,
      private _countryService: CountryService,
      private _maritalStatusService: MaritalStatusService,
      private _planTypeService: PlanTypeService,
      private _userTypeService: UserTypeService,
      private _planService: PlanService,
      private _premiumTypeService: PremiumTypeService,
      private _relationshipService: RelationshipService,
      public _bulkBeneficiaryUploadService: BulkBeneficiaryUploadService) {
    this.platformName = environment.platform;
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('Organisation Details');
    this._headerEventEmitter.setMinorRouteUrl('Details page');
    this.user = (<any>this._locker.getObject('auth')).user;

    if (!!this.user.userType &&
        (this.user.userType.name === 'Platform Owner')) {
      this.canApprove = true;
    }

    this.SPONSORSHIP =
        [{'id': 1, 'name': 'Self'}, {'id': 2, 'name': 'Organization'}];

    this._route.params.subscribe(param => {
      if (param.id !== undefined) {
        this.routeId = param.id;
        this._getEmployerDetails(param.id);
      }
    });
    this.searchHiaControl.valueChanges.debounceTime(350)
        .distinctUntilChanged()
        .subscribe(value => {
          this.drugSearchResult = false;
          this._facilityService
              .find({
                query: {
                  'platformOwnerId._id': this.currentPlatform._id,
                  name: {$regex: value, '$options': 'i'},
                  'facilityType.name': 'Health Insurance Agent'
                }
              })
              .then((payload: any) => {
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
    this._getRelationship();

    this.stateControl.valueChanges.subscribe(value => {
      if (this.stateControl.valid) {
        var filteredState =
            this.mStates.filter(x => x.name === this.stateControl.value);
        this.mLga = filteredState[0].lgs;
      }
    });

    this.oStateControl.valueChanges.subscribe(value => {
      if (this.oStateControl.valid) {
        var filteredState =
            this.oStates.filter(x => x.name === this.oStateControl.value);
        this.oLga = filteredState[0].lgs;
      }
    });

    // this.platformControl.valueChanges
    //   .debounceTime(350)
    //   .distinctUntilChanged()
    //   .subscribe(value => {
    //     this.drugSearchResult = false;
    // this._facilityService.find({
    //   query: {
    //     'platformOwnerId.name': value,
    //     $limit: 1
    //   }
    // }).then((payload: any) => {
    //   if (payload.data.length > 0) {

    //   }
    // });
    //});
  }

  _getTitles() {
    this._titleService.find({}).then((payload: any) => {
      this.titles = payload.data;
    });

    // _gets() {
    //   this._titleService.find({}).then((payload: any) => {
    //     this.titles = payload.data;
    //   });

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
    this._countryService.find({query: {'name': 'Nigeria'}})
        .then((payload: any) => {
          if (payload.data[0] != undefined) {
            this.mStates = payload.data[0].states;
          }
        })
  }

  _getOriginState() {
    this._countryService.find({query: {'name': 'Nigeria'}})
        .then((payload: any) => {
          if (payload.data[0] != undefined) {
            this.oStates = payload.data[0].states;
          }
        })
  }

  _getPlatforms() {
    this._facilityService
        .find({
          query: {
            $select: ['name', 'provider', 'facilityType', 'platformOwnerId']
          }
        })
        .then((payload: any) => {
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

  _getRelationship() {
    this._relationshipService.find({}).then((payload: any) => {
      this.relationhips = payload.data;
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

  propertyValueChange(param, i, prop) {
    this.orderExcelPolicies
  }


  checkValue(param, data, obj) {
    try {
      if (obj.toString().includes('.')) {
        let arObj = obj.toString().split(
            '.');  // Not expecting obj of an array more than two indexes
        let val1 = arObj[0];
        let val2 = arObj[1];
        let val = data.filter(function(x) {
          if (x[val1] != undefined) {
            if (x[val1][val2].toString().toLowerCase() ==
                param.toString().toLowerCase()) {
              return true;
            } else {
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
          let val =
              data.filter(x => x[obj].toLowerCase() == param.toLowerCase());
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

  checkPlanType(data, obj, param) {
    if (data.length > 0) {
      let val = data.filter(
          x => x[obj].toLowerCase() == param.toString().toLowerCase());
      if (val.length > 0) {
        console.log(true)
        return true;
      } else {
        console.log(false)
        return false;
      }
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
      let val = data.filter(
          x => x.facilityType.name.toString().toLowerCase() ==
                  facilityType.toString().toLowerCase() &&
              x.name.toLowerCase() == hia.toString().toLowerCase());
      if (val.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkProviderValue(providerId, data) {
    let val = data.filter(function(x) {
      if (x.provider != undefined) {
        if (x.provider.providerId != undefined) {
          if (x.provider.providerId.toString().toLowerCase() ==
              providerId.toString().toLowerCase()) {
            return true;
          } else {
            return false;
          }
        }
      }
    });
    if (val.length > 0) {
      console.log('True');
      return true;
    } else {
      console.log('false');
      return false;
    }
  }

  checkPremiumValue(param, data) {
    let val = data.filter(x => x.name == param);
    if (val.length > 0) {
      this.packages = val[0].premiums;
      return true;
    } else {
      return false;
    }
  }

  onTitle(event, index) {
    this.orderExcelPolicies[index].title = this.titleControl.value;
  }

  onName(event, index) {
    this.orderExcelPolicies[index].name = this.nameControl.value;
  }

  onGender(event, index) {
    this.orderExcelPolicies[index].gender = this.genderControl.value;
  }

  onStatus(event, index) {
    this.orderExcelPolicies[index].maritalStatus =
        this.maritalStatusControl.value;
  }


  onRstate(event, index) {
    var filteredState =
        this.mStates.filter(x => x.name == this.stateControl.value);
    this.mLga = filteredState[0].lgs;
    this.orderExcelPolicies[index].homeAddress.state = this.stateControl.value;
    this.orderExcelPolicies[index].homeAddress.lga = this.mLga[0].name;
  }

  onRlga(event, index) {
    this.orderExcelPolicies[index].homeAddress.lga = this.lgaControl.value;
  }


  onOstate(event, index) {
    var filteredState =
        this.oStates.filter(x => x.name == this.oStateControl.value);
    this.oLga = filteredState[0].lgs;
    this.orderExcelPolicies[index].stateOfOrigin = this.oStateControl.value;
    this.orderExcelPolicies[index].lgaOfOrigin = this.oLga[0].name;
  }

  onOlga(event, index) {
    this.orderExcelPolicies[index].lgaOfOrigin = this.oLgaControl.value;
  }

  onPlatform(event, index) {
    this.orderExcelPolicies[index].platformOwner = this.platformControl.value;
  }

  onfacilityType(event, index) {
    this.orderExcelPolicies[index].policy.facilityType =
        this.facilityTypeControl.value;
  }

  onRelationship(event, index) {
    this.orderExcelPolicies[index].relationship =
        this.relationshipControl.value;
  }

  onHia(event, index) {
    this.orderExcelPolicies[index].policy.hia = this.hiaControl.value;
  }

  onProvider(event, index) {
    this.orderExcelPolicies[index].policy.providerId =
        this.providerControl.value;
  }

  onPlanTypes(event, index) {
    this.orderExcelPolicies[index].policy.planType = this.planTypeControl.value;
  }

  onPlan(event, index) {
    this.orderExcelPolicies[index].policy.plan = this.planControl.value;
  }

  onPackage(event, index) {
    this.orderExcelPolicies[index].policy.premiumPackage =
        this.packageControl.value;
  }

  onCategory(event, index) {
    this.orderExcelPolicies[index].policy.premiumCategory =
        this.categoryControl.value;
  }

  onSponsor(event, index) {
    this.orderExcelPolicies[index].policy.sponsorship =
        this.sponsorshipControl.value;
    if (this.sponsorshipControl.value.toString().toLowerCase() != 'self') {
      this.orderExcelPolicies[index].policy.sponsor = this.facility;
    }
  }

  private _getCurrentPlatform() {
    this._facilityService.find({query: {shortName: this.platformName}})
        .then((res: any) => {
          if (res.data.length > 0) {
            this.currentPlatform = res.data[0];
          }
        })
        .catch(err => console.log(err));
  }

  _getCountries() {
    this._systemService.on();
    this._countryService.find({query: {$limit: 200, $select: {'states': 0}}})
        .then((payload: any) => {
          this._systemService.off();
          this.countries = payload.data;
          const index = this.countries.findIndex(x => x.name === 'Nigeria');
          if (index > -1) {
            this.selectedCountry = this.countries[index];
            this._getStates(this.selectedCountry._id);
            if (this.selectedState !== undefined) {
              this._getLgaAndCities(
                  this.selectedCountry._id, this.selectedState);
            }
          }
        })
        .catch(err => {
          this._systemService.off();
        });
  }

  _getStates(_id) {
    this._systemService.on();
    this._countryService
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
        });
  }

  _getLgaAndCities(_id, state) {
    this._systemService.on();
    this._countryService
        .find({
          query:
              {_id: _id, 'states.name': state.name, $select: {'states.$': 1}}
        })
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
        });
  }

  onSelectDrug(hia) {
    if (this.facility.employer.hias === undefined) {
      this.facility.employer.hias = [];
    }
    this.facility.employer.hias.push(hia);
    this._facilityService.update(this.facility)
        .then(payload => {
          this.facility = payload;
        })
        .catch(
            err => {

            });
  }

  onClickApprove() {
    this.facility.isConfirmed = true;
    this._facilityService.update(this.facility).then(res => {
      console.log(res);
      this.facility = res;
      const status = this.facility.isConfirmed ? 'activated successfully' :
                                                 'deactivated successfully';
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
      const status = this.facility.isConfirmed ? 'activated successfully' :
                                                 'deactivated successfully';
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

  handleChange(e) {
    var isChecked = e.target.checked;
    if (isChecked) {
      this.orderExcelPolicies.forEach(function(item) {
        item.isCheck = true;
      })
    } else {
      this.orderExcelPolicies.forEach(function(item) {
        item.isCheck = false;
      })
    }
    this.orderExcelPolicies =
        JSON.parse(JSON.stringify(this.orderExcelPolicies));
  }

  onSelectPrincipal(e, index) {
    var isChecked = e.target.checked;
    if (isChecked == true) {
      this.orderExcelPolicies[index].isCheck = true;
    } else {
      this.orderExcelPolicies[index].isCheck = false;
    }
  }

  checkItemChecked() {
    var filterItem = this.orderExcelPolicies.filter(x => x.isCheck == true);
    if (filterItem.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  public upload(e) {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append('excelfile', fileBrowser.files[0]);
      formData.append('facilityId', this.facility._id);
      this._uploadService.uploadExcelFile(formData)
          .then(result => {
            result.body.forEach((element, index) => {
              let principal = element.principal;
              principal.policy = element.policy;
              principal.isPrincipal = true;
              principal.isEdit = false;
              principal.isCheck = false;
              principal.principalIndex = index;
              this.orderExcelPolicies.push(principal);
              element.dependent.forEach(item => {
                item.isPrincipal = false;
                item.isEdit = false;
                item.isCheck = false;
                item.principalIndex = index;
                this.orderExcelPolicies.push(item);
              });
            });
            console.log(this.orderExcelPolicies);
            this.totalExcelPrincipalItems =
                this.orderExcelPolicies.filter(x => x.isPrincipal == true)
                    .length;
          })
          .catch(
              err => {
                  // this._notification('Error', 'There was an error uploading
                  // the file');
              });
    }
  }

  downloadExcelTemplate() {
    this._bulkBeneficiaryUploadService.download();
  }

  save() {
    var badUpload = [];
    var retainedOrderExcelPolicies =
        JSON.parse(JSON.stringify(this.orderExcelPolicies));
    var checkOrderExcelPolicies =
        this.orderExcelPolicies.filter(x => x.isCheck == true);

    this.orderExcelPolicies = retainedOrderExcelPolicies;
    var groups = {};
    var bObj = {};
    for (var i = 0; i < checkOrderExcelPolicies.length; i++) {
      var groupName = checkOrderExcelPolicies[i].principalIndex;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(checkOrderExcelPolicies[i]);
    };


    for (groupName in groups) {
      var val: any = <any>{};
      val.dependent = [];
      groups[groupName].forEach(element => {
        if (element.isPrincipal == true) {
          val.policy = element.policy;
          let p = element;
          p = delete element.policy;
          val.principal = element;
        } else {
          val.dependent.push(element);
        }
      });
      this.beneficiaries.push(val);
    }
    console.log(this.beneficiaries);
    this.isProcessing = true
    var replicaBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
    this.beneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
    this.beneficiaries.forEach(
        (uploadItem,
         index) => {this._bulkBeneficiaryUploadService.create(uploadItem)
                        .then(
                            payload => {
                              if (payload.body.policyObject == undefined) {
                                const text = payload.body;
                                this._toastr.error(text.Details, 'Failed!');
                                badUpload.push(replicaBeneficiaries[index])
                              }
                              if (index == this.beneficiaries.length - 1) {
                                let counter = this.beneficiaries.length -
                                    badUpload.length;
                                let content = counter.toString() + '/' +
                                    this.beneficiaries.length + 'was uploaded';
                                this._toastr.success(content, 'Success!');
                                this.isProcessing = false;
                                this.orderExcelPolicies = [];
                                if (badUpload.length > 0) {
                                  badUpload.forEach((element, index) => {
                                    let principal = element.principal;
                                    principal.policy = element.policy;
                                    principal.isPrincipal = true;
                                    principal.isEdit = false;
                                    principal.isCheck = false;
                                    principal.principalIndex = index;
                                    this.orderExcelPolicies.push(principal);
                                    element.dependent.forEach(item => {
                                      item.isPrincipal = false;
                                      item.isEdit = false;
                                      item.isCheck = false;
                                      item.principalIndex = index;
                                      this.orderExcelPolicies.push(item);
                                    });
                                  });
                                }
                              }
                              console.log(payload);
                            },
                            error => {
                              console.log(error);
                              this.isProcessing = false;
                            })});
  }

  addApprovalClick() {
    this.addApproval = !this.addApproval;
  }

  editRow(param) {
    if (this.orderExcelPolicies[param].isEdit == true) {
      this.orderExcelPolicies[param].isEdit = false
    } else {
      this.orderExcelPolicies[param].isEdit = true
    }
    this.orderExcelPolicies =
        JSON.parse(JSON.stringify(this.orderExcelPolicies));
  }


  private _getEmployerDetails(routeId) {
    this._systemService.on();
    this._facilityService.get(routeId, {})
        .then((res: Facility) => {
          console.log(res);
          this._headerEventEmitter.setMinorRouteUrl(res.name);
          this._systemService.off();
          this.facility = res;
        })
        .catch(err => {
          this._systemService.off();
        });
  }

  navigateEmployers(url, id?) {
    this._systemService.on();
    if (!!id) {
      this._router.navigate([url + id])
          .then(res => {
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    } else {
      this._router.navigate([url])
          .then(res => {
            this._systemService.off();
          })
          .catch(err => {
            this._systemService.off();
          });
    }
  }

  navigateTo(route) {
    this._router.navigate([route])
        .then(res => {
          this._systemService.off();
        })
        .catch(err => {
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
        this.navigateTo(
            '/modules/employer/employers/' + this.routeId + '/beneficiary');
        break;
      case 'hia':
        this.tab_hia = true;
        this.navigateTo('/modules/employer/employers/' + this.routeId + '/hia');
        break;
      case 'payment':
        this.tabPayment = true;
        this.navigateTo(
            '/modules/employer/employers/' + this.routeId + '/payment');
        break;
      case 'payment-history':
        this.tabPaymentHistory = true;
        this.navigateTo(
            '/modules/employer/employers/' + this.routeId + '/payment-history');
        break;
    }
  }
}
