import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class TitleService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('titles');
    this._socket = _socketService.getService('titles');
  }

  find(query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('titles').then((socket: any) => {
        return socket.find(query);
      }));
    });
  }

  get(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('titles').then((socket: any) => {
        return this._socket.get(id, query);
      }));
    });
  }
  create(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('titles').then((socket: any) => {
        return this._socket.create(param);
      }));
    });
  }
  update(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('titles').then((socket: any) => {
        return this._socket.update(param._id, param);
      }));
    });
  }
  remove(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('titles').then((socket: any) => {
        return this._socket.remove(id, query);
      }));
    });
  }
}
