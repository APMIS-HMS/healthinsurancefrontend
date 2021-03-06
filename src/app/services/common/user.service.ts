import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class UserService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('users');
    this._socket = _socketService.getService('users');
  }

  find(query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('users').then((socket: any) => {
        return socket.find(query);
      }));
    });
  }

  findWithOutAuth(query: any) {
    return this._socket.find(query);
  }

  get(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('users').then((socket: any) => {
        return this._socket.get(id, query);
      }));
    });
  }
  create(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('users').then((socket: any) => {
        console.log(param)
        return socket.create(param);
      }));
    });
  }
  update(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('users').then((socket: any) => {
        return socket.update(param._id, param);
      }));
    });
  }
  patch(_id: any, data: any, param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('users').then((socket: any) => {
        console.log(_id)
        console.log(data);
        console.log(param)
        return socket.patch(_id, data, param);
      }));
    });
  }
  remove(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('users').then((socket: any) => {
        return socket.remove(id, query);
      }));
    });
  }
}
