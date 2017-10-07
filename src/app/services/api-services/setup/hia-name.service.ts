import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HiaNameService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('lshmhianames');
    this._socket = _socketService.getService('lshmhianames');
    this._socket.on('created', function (lshmhianames) {
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

  create(hiaName: any) {
    return this._socket.create(hiaName);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}