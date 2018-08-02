import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SocketService, RestService } from './../../feathers/feathers.service';
const request = require('superagent');

@Injectable()
export class SystemModuleService {

  private notificationAnnouncedSource = new Subject<Object>();
  notificationAnnounced$ = this.notificationAnnouncedSource.asObservable();

  private readonly sweetAnnouncedSource = new Subject<Object>();
  sweetAnnounced$ = this.sweetAnnouncedSource.asObservable();

  private beneficiaryTabAnnouncedSource = new Subject<Object>();
  beneficiaryTabAnnounced$ = this.beneficiaryTabAnnouncedSource.asObservable();

  private broadCastOnlineSource = new Subject<Object>();
  broadCastOnlineSource$ = this.broadCastOnlineSource.asObservable();

  private loggedInUserAnnouncedSource = new Subject<Object>();
  loggedInUserAnnounced = this.loggedInUserAnnouncedSource.asObservable();

  constructor(private locker: CoolLocalStorage) {
  }
  announceNotification(notification: Object) {
    this.notificationAnnouncedSource.next(notification);
  }

  announceBeneficiaryTabNotification(notification: Object) {
    this.beneficiaryTabAnnouncedSource.next(notification);
  }

  announceSweet(notification: Object) {
    this.sweetAnnouncedSource.next(notification);
  }

  announceSweetProxy(title, type, cp?, html?, text?, from?, position?, showConfirmButton?, timer?) {
    this.announceSweet({ title, type, cp, html, text, from, position, showConfirmButton, timer });
  }

  announceLoggedInUser(userObject: Object) {
    this.loggedInUserAnnouncedSource.next(userObject);
  }

  onlineStatusBroadCast(status: Object) {
    this.broadCastOnlineSource.next(status);
  }
  off() {
    this.announceNotification({ status: 'Off' });
  }
  on() {
    this.announceNotification({ status: 'On' });
  }
}
