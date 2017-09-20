import { CoolLocalStorage } from 'angular2-cool-storage';
import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserTypeService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private _locker:CoolLocalStorage
  ) {
    this._rest = _restService.getService('user-types');
    this._socket = _socketService.getService('user-types');
  }

  find(query: any) {
    return this._rest.find(query);
  }

  findAll() {
    // const auth: any = this._locker.getObject('auth')
    // this._restService._app.authenticate({ strategy: 'local', accessToken: auth.accessToken })
    return this._rest.find();
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