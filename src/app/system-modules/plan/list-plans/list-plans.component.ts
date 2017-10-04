import { PlanTypeService } from './../../../services/common/plan-type.service';

import { UploadService } from './../../../services/common/upload.service';
import { SystemModuleService } from './../../../services/common/system-module.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthService } from './../../../auth/services/auth.service';
import { HeaderEventEmitterService } from './../../../services/event-emitters/header-event-emitter.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserTypeService } from '../../../services/common/user-type.service';

@Component({
  selector: 'app-list-plans',
  templateUrl: './list-plans.component.html',
  styleUrls: ['./list-plans.component.scss']
})
export class ListPlansComponent implements OnInit {

  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');

  userTypes: any[] = [];
  planTypes: any[] = [];
  constructor(private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private loadingService: LoadingBarService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService, private _userTypeService: UserTypeService, private _planTypeService: PlanTypeService) { }

  ngOnInit() {
    this._getPlanTypes();
  }

  navigateNewPlan() {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/plan/new']).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }

  _getUserTypes() {
    this._systemService.on();
    this._userTypeService.find({}).then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.userTypes = payload.data;
      }
    }, error => {
      this._systemService.off();
    });
  }

  _getPlanTypes() {
    this._systemService.on();
    this._planTypeService.findAll().then((payload: any) => {
      this._systemService.off();
      if (payload.data.length > 0) {
        this.planTypes = payload.data;
      }
    }, error => {
      this._systemService.off();
    });
  }
}
