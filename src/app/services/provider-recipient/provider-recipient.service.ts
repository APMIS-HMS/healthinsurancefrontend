import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class ProviderRecipientService {
  public listner;
  public _socket;
  private _rest;
  private _restLogin;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage,
    private _http: Http
  ) {
    this._rest = _restService.getService('provider-recipients');
    this._socket = _socketService.getService('provider-recipients');
  }

  find(query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('provider-recipients').then((socket: any) => {
        return socket.find(query);
      }))
    });
  }

  get(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('provider-recipients').then((socket: any) => {
        return this._socket.get(id, query);
      }))
    });
  }
  create(param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('provider-recipients').then((socket: any) => {
        return this._socket.create(param);
      }))
    });
  }
  update(data: any, param?) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('provider-recipients').then((socket: any) => {
        return this._socket.update(data._id, data, param);
      }))
    });
  }

  update2(claim: any) {
    return this._socket.update(claim._id, claim);
  }

  patch(_id: any, data: any, param: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('provider-recipients').then((socket: any) => {
        return socket.patch(_id, data, param);
      }));
    });
  }
  remove(id: string, query: any) {
    return new Promise((resolve, reject) => {
      resolve(this._socketService.authenticateUser('provider-recipients').then((socket: any) => {
        return this._socket.remove(id, query);
      }))
    });
  }

  public payProviderAccount(payload): Promise<any> {
    const host = this._restService.getHost() + '/pay-provider-recipient';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http.post(host, payload, { headers: headers }).toPromise()
      .then((res) => this.extractData(res)).catch(error => this.handleErrorPromise(error));
  }

  public verifyProviderAccount(payload): Promise<any> {
    const host = this._restService.getHost() + '/verify-provider-recipient';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http.post(host, payload, { headers: headers }).toPromise()
      .then((res) => this.extractData(res)).catch(error => this.handleErrorPromise(error));
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleErrorObservable(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} ${error.statusText || ''} - ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

  private handleErrorPromise(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} ${error.statusText || ''} - ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Promise.reject(errMsg);
  }
}
