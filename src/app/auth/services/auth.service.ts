import { CoolLocalStorage } from 'angular2-cool-storage';
import { SocketService, RestService } from '../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
let request = require('superagent');
@Injectable()
export class AuthService {
  public _socket;
  public _changePasswordRest;
  private _rest;
  private _restLogin;
  public listner;
  private missionAnnouncedSource = new Subject<Object>();
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private _locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('users');
    this._changePasswordRest = _restService.getService('changepassword');
    this._socket = _socketService.getService('users');
    this._socket.timeout = 30000;
    this._restLogin = _restService.getService('auth/local');
    this._socket.on('created', function (user) {
    });
    this.listner = Observable.fromEvent(this._socket, 'patch');
  }
  announceMission(mission: Object) {
    this.missionAnnouncedSource.next(mission);
  }

  logOut() {
    return this._socketService.logOut();
  }
  login(query: any) {
    return this._socketService.loginIntoApp(query);
  }

  find(query: any) {
    return this._socket.find(query);
  }
  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }
  checkAuth() {
    // this._restService._app.logout();
    // this.logOut();
    if (this._locker.getItem('auth') !== undefined && this._locker.getItem('auth') != null) {
      let auth:any = this._locker.getItem('auth');
      this._restService._app.passport.logout();
      this.logOut();
      return true;
    }
    return false;
  }

  create(user: any) {
    return this._socket.create(user);
  }

  update(user: any) {
    return this._socket.update(user._id, user);
  }

  patch(_id: any, data: any, param: any) {
    return this._socket.patch(_id, data, param);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
  // changePassword(body: any) {
  //   let host = this._restService.getHost();
  //   let path = host + '/changepassword';
  //   return request
  //     .post(path)
  //     .send(body);
  // }
  // resetPassword(body: any) {
  //   let host = this._restService.getHost();
  //   let path = host + '/passwordreset';
  //   return request
  //     .post(path)
  //     .send(body);
  // }

}
