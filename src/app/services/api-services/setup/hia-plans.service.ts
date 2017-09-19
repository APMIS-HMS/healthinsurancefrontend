import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HiaPlanService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('hiaplans');
    this._socket = _socketService.getService('hiaplans');
    this._socket.on('created', function (hiaplans) {
    });
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

  create(hiaPlan: any) {
    return this._socket.create(hiaPlan);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}