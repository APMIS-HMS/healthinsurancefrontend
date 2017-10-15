import { SystemModuleService } from './system-module.service';
import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
let request = require('superagent');


@Injectable()
export class FacilityService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage,
    private _systmeService: SystemModuleService
  ) {
    this._rest = _restService.getService('facilities');
    this._socket = _socketService.getService('facilities');
  }

  find(query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('facilities').then((socket: any) => {
        return socket.find(query);
      }))
    });
  }
  findWithOutAuth(query: any) {
    return this._socket.find(query);
  }

  get(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('facilities').then((socket: any) => {
        return this._socket.get(id, query);
      }))
    });
  }
  create(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('facilities').then((socket: any) => {
        return this._socket.create(param);
      }))
    });
  }
  update(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('facilities').then((socket: any) => {
        return this._socket.update(param._id, param);
      }))
    });
  }
  remove(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('facilities').then((socket: any) => {
        return this._socket.remove(id, query);
      }))
    });
  }

  sendSMSWithMiddleWare(body: any) {
    let host = this._restService.getHost();
    let path = host + '/api/send-sms';
    return request
      .put(path)
      .send(body);
  }

}