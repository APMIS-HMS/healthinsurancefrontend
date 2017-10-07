import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SocketService, RestService } from './../../feathers/feathers.service';
const request = require('superagent');
@Injectable()
export class UploadService {

  constructor(private locker: CoolLocalStorage, private _restService: RestService,
    private _sockerService: SocketService, private _sanitizer: DomSanitizer) {
  }

  upload(formData, id) {
    const host = this._restService.getHost();
    const path = host + '/upload-file';
    return request
      .post(path)
      .send(formData);
  }
  transform(url) {
    url = this._restService.getHost() + '/' + url + '?'; + new Date().getTime();
    return url;
    // return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  checkOnlineStatus() {
    return this._sockerService.onlineStatus;
  }
}