import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

let request = require('superagent');

@Injectable()
export class PolicyService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  public _listenerCreate;
  public _listenerUpdate;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('policies');
    this._socket = _socketService.getService('policies');

    //Listener
    this._listenerCreate = Observable.fromEvent(this._socket, 'created');
    this._listenerUpdate = Observable.fromEvent(this._socket, 'updated');
  }

  find(query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('policies').then((socket: any) => {
        return socket.find(query);
      }));
    });
  }

  get(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('policies').then((socket: any) => {
        return this._rest.get(id, query);
      }));
    });
  }
  create(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('policies').then((socket: any) => {
        return this._socket.create(param);
      }));
    });
  }
  update(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('policies').then((socket: any) => {
        return this._socket.update(param._id, param);
      }));
    });
  }
  remove(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('policies').then((socket: any) => {
        return this._socket.remove(id, query);
      }));
    });
  }

  searchPolicy(query: any) {
    const host = `${this._restService.getHost()}/api/search-policy`;

    // return new Promise((resolve, reject) => {
    //   resolve(this._socketService.authenticateUser('policies').then((socket: any) => {
    //     // return request.get(path).query({ search: search });
    //     return request.post(path).query(query);
    //   }));
    // });
    return request.post(host).send(query).then((res: Response | any) => {
      return new Promise((resolve, reject) => {
        resolve(res.body);
      });
    }).catch(err => {
      console.log(err);
    });
  }
}
