import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class PersonService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('people');
    this._socket = _socketService.getService('people');
  }

  find(query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('people').then((socket: any) => {
        return socket.find(query);
      }));
    });
  }

  findWithOutAuth(query: any) {
    return this._socket.find(query);
  }

  get(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('people').then((socket: any) => {
        return this._socket.get(id, query);
      }));
    });
  }
  create(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('people').then((socket: any) => {
        return this._socket.create(param);
      }));
    });
  }
  createWithOutAuth(param: any) {
    return this._socket.create(param);
  }
  update(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('people').then((socket: any) => {
        return this._socket.update(param._id, param);
      }));
    });
  }
  remove(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('people').then((socket: any) => {
        return this._socket.remove(id, query);
      }));
    });
  }
}
