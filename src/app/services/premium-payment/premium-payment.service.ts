import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');

@Injectable()
export class PremiumPaymentService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;
  private _announcePolicy = new Subject<any>();
  private _announceWhenDone = new Subject<any>();
  announcedPolicy = this._announcePolicy.asObservable();
  announcedWhenDone = this._announceWhenDone.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('premium-payments');
    this._socket = _socketService.getService('premium-payments');
  }

  find(query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('premium-payments').then((socket: any) => {
        return socket.find(query);
      }));
    });
  }

  findWithOutAuth(query: any) {
    return this._socket.find(query);
  }

  get(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('premium-payments').then((socket: any) => {
        return this._socket.get(id, query);
      }));
    });
  }
  create(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('premium-payments').then((socket: any) => {
        return this._socket.create(param);
      }));
    });
  }
  createWithOutAuth(param: any) {
    return this._socket.create(param);
  }
  update(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('premium-payments').then((socket: any) => {
        return this._socket.update(param._id, param);
      }));
    });
  }
  remove(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('premium-payments').then((socket: any) => {
        return this._socket.remove(id, query);
      }));
    });
  }

  verifyPaymentWithMiddleWare(body: any) {
    const path = this._restService.getHost() + '/payment-verification';
    return request
      .post(path)
      .send(body);
  }

  payWidthCashWithMiddleWare(body: any) {
    const path = this._restService.getHost() + '/premium-cash-payment';
    return request
      .post(path)
      .send(body);
  }

  setPolicy(value: string) {
    this._announcePolicy.next(value);
  }

  setWhenDone(value: boolean) {
    this._announceWhenDone.next(value);
  }
}
