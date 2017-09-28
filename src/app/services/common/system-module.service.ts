import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';


@Injectable()
export class SystemModuleService {

  private notificationAnnouncedSource = new Subject<Object>();
  notificationAnnounced$ = this.notificationAnnouncedSource.asObservable();

  constructor(private locker: CoolLocalStorage) {
  }
  announceNotification(notification: Object) {
    this.notificationAnnouncedSource.next(notification);
  }
  off(){
    this.announceNotification({status:'Off'});
  }
  on(){
    this.announceNotification({status:'On'});
  }
}