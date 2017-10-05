import { CoolLocalStorage } from 'angular2-cool-storage';
import { UploadService } from './../../services/common/upload.service';
import { SystemModuleService } from './../../services/common/system-module.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { AuthService } from './../../auth/services/auth.service';
import { HeaderEventEmitterService } from './../../services/event-emitters/header-event-emitter.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

  user: any;

  constructor(private _headerEventEmitter: HeaderEventEmitterService,
    private _authService: AuthService,
    private _router: Router,
    private loadingService: LoadingBarService,
    private _systemService: SystemModuleService,
    private _uploadService: UploadService,
    private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this.user = (<any>this._locker.getObject('auth')).user;
  }

  close_onClick() {
    this.closeMenu.emit(true);
  }
  signOut() {
    this._authService.checkAuth();
    this._router.navigate(['/auth']);
  }
}