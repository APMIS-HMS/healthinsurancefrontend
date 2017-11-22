import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
let request = require('superagent');

@Injectable()
export class BeneficiaryService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('beneficiaries');
    this._socket = _socketService.getService('beneficiaries');
  }

  find(query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('beneficiaries').then((socket: any) => {
        return socket.find(query);
      }))
    });
  }

  get(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('beneficiaries').then((socket: any) => {
        return this._socket.get(id, query);
      }))
    });
  }

  create(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('beneficiaries').then((socket: any) => {
        return this._socket.create(param);
      }))
    });
  }
  update(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('beneficiaries').then((socket: any) => {
        return this._socket.update(param._id, param);
      }))
    });
  }
  remove(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('beneficiaries').then((socket: any) => {
        return this._socket.remove(id, query);
      }))
    });
  }

  createWithMiddleWare(body: any) {
    let host = this._restService.getHost();
    let path = host + '/lashma-beneficiaries';
    return request
      .post(path)
      .send(body);
  }

  updateWithMiddleWare(body: any) {
    let host = this._restService.getHost();
    let path = host + '/lashma-beneficiaries';
    return request
      .put(path)
      .send(body);
  }

  validateAge(body: any) {
    let host = this._restService.getHost();
    let path = host + '/api/validate-age';
    return request
      .get(path)
      .query({ dateOfBirth: body.date });
  }

  countBenefeciaries(userType:string, _id:any){
    let host = this._restService.getHost();
    let path = host + '/api/get-beneficiary-count';
    return request
      .get(path)
      .query({_id: _id, userType: userType});
  }
}