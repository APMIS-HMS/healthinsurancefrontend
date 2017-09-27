import { CoolLocalStorage } from 'angular2-cool-storage';
import { SocketService, RestService } from '../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserTypeService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private _locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('user-types');
  }

  find(query?: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('user-types').then((socket: any) => {
        return this._socket.find(query);
      }))
    });
  }

  findAll() {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('user-types').then((socket: any) => {
        return socket.find();
      }))
    });
  }
  get(id: string, query: any) {
    return this._rest.get(id, query);
  }

  create(userType: any) {
    return this._rest.create(userType);
  }

  remove(id: string, query: any) {
    return this._rest.remove(id, query);
  }

}