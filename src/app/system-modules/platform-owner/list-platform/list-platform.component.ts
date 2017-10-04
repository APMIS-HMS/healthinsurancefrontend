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
  selector: 'app-list-platform',
  templateUrl: './list-platform.component.html',
  styleUrls: ['./list-platform.component.scss']
})
export class ListPlatformComponent implements OnInit {
  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');

  constructor(
    private _router: Router,
    private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private loadingService: LoadingBarService,
    private _systemService: SystemModuleService,
  ) { }

  ngOnInit() {
  }

  navigateNewPlatform() {
    this.loadingService.startLoading();
    this._router.navigate(['/modules/platform/new']).then(res => {
      this.loadingService.endLoading();
    }).catch(err => {
      this.loadingService.endLoading();
    });
  }
}
