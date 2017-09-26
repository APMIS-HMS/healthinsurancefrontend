import { Injectable } from '@angular/core';
import { SocketService, RestService } from '../../feathers/feathers.service';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class ModuleService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('modules');
    this._socket = _socketService.getService('modules');
  }

  findAll() {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('modules').then((socket: any) => {
        return socket.find();
      }))
    });
  }

  find(query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('modules').then((socket: any) => {
        return socket.find(query);
      }))
    });
  }

  get(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('modules').then((socket: any) => {
        return this._socket.get(id, query);
      }))
    });
  }
  create(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('modules').then((socket: any) => {
        return this._socket.create(param);
      }))
    });
  }
  update(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('modules').then((socket: any) => {
        return this._socket.update(param._id, param);
      }))
    });
  }
  remove(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('modules').then((socket: any) => {
        return this._socket.remove(id, query);
      }))
    });
  }
}
