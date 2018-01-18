import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';


@Injectable()
export class ClaimService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage 
  ) {
    this._rest = _restService.getService('cliams');
    this._socket = _socketService.getService('claims');
    this._socket.timeout = 10000;
  }

  find(query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('claims').then((socket: any) => {
        return socket.find(query);
      }))
    });
  }

  get(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('claims').then((socket: any) => {
        return this._socket.get(id, query);
      }))
    });
  }
  create(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('claims').then((socket: any) => {
        return this._socket.create(param);
      }))
    });
  }
  update(data: any, param?) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('claims').then((socket: any) => {
        return this._socket.update(data._id, data, param);
      }))
    });
  }

  update2(claim: any) {
    return this._socket.update(claim._id, claim);
  }

  patch(_id: any, data: any, param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('claims').then((socket: any) => {
        return socket.patch(_id, data, param);
      }));
    });
  }
  remove(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('claims').then((socket: any) => {
        return this._socket.remove(id, query);
      }))
    });
  }

}