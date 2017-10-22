import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Response, Request } from '@angular/http';
import { CoolLocalStorage } from 'angular2-cool-storage';
let request = require('superagent');

@Injectable()
export class ClaimsPaymentService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('claim-payments');
    this._socket = _socketService.getService('claim-payments');
  }

  find(query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('claim-payments').then((socket: any) => {
        return socket.find(query);
      }));
    });
  }

  get(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('claim-payments').then((socket: any) => {
        return this._socket.get(id, query);
      }));
    });
  }
  create(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('claim-payments').then((socket: any) => {
        return this._socket.create(param);
      }));
    });
  }
  update(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('claim-payments').then((socket: any) => {
        return this._socket.update(param._id, param);
      }));
    });
  }
  remove(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('claim-payments').then((socket: any) => {
        return this._socket.remove(id, query);
      }));
    });
  }

  createMultipleItem(claims: any) {
    const path = this._restService.getHost() + '/queue-claims-payment';
    return request.post(path).send(claims).then((res: Response | any) => {
      return new Promise((resolve, reject) => {
        resolve(res.body);
      });
    }).catch(err => {
      console.log(err);
    });
  }

}
