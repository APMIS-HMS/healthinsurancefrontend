import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SocketService, RestService } from './../../feathers/feathers.service';
const request = require('superagent');
@Injectable()
export class SystemModuleService {

  private notificationAnnouncedSource = new Subject<Object>();
  notificationAnnounced$ = this.notificationAnnouncedSource.asObservable();

  private broadCastOnlineSource = new Subject<Object>();
  broadCastOnlineSource$ = this.broadCastOnlineSource.asObservable();

  constructor(private locker: CoolLocalStorage) {
  }
  announceNotification(notification: Object) {
    this.notificationAnnouncedSource.next(notification);
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