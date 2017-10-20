import { Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HeaderEventEmitterService } from '../../services/event-emitters/header-event-emitter.service';
import { FacilityService } from '../../services/index';
import { CurrentPlaformShortName } from '../../services/globals/config';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  @Output() showMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  appsearchControl = new FormControl();
  pageInView: String = '';
  minorPageInView: String = '';
  currentPlatform: any;
  user: any;

  constructor(
    private _headerEventEmitter: HeaderEventEmitterService,
    private _facilityService: FacilityService,
    private _locker: CoolLocalStorage,
    private _router: Router
  ) { }

  ngOnInit() {
    try {
      this.user = (<any>this._locker.getObject('auth')).user;
      this._headerEventEmitter.announcedUrl.subscribe(url => {
        this.pageInView = url;
      });
      this._headerEventEmitter.announcedMinorUrl.subscribe(url => {
        this.minorPageInView = url;
      });
      this._getCurrentPlatform();
    } catch (error) {
      this._router.navigate(['auth/login']);
    }

  }

  _getCurrentPlatform() {
    this._facilityService.find({ query: { shortName: CurrentPlaformShortName } }).then((res: any) => {
      if (res.data.length > 0) {
        this.currentPlatform = res.data[0];
      }
    }, error => {
      console.log(error);
      this._router.navigate(['auth/login']);
    }).catch(err => {
      console.log(err);
    });
  }

  menu_show() {
    this.showMenu.emit(true);
  }


}
