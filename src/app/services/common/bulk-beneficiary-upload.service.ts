import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
let request = require('superagent');


@Injectable()
export class BulkBeneficiaryUploadService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage) {
  }

  create(body: any) {
    let host = this._restService.getHost();
    let path = host + '/api/beneficiaries';
    return request
      .post(path)
      .send(body);
  }

}