import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HiaService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('lshmhias');
    this._socket = _socketService.getService('lshmhias');
    this._socket.on('created', function (lshmhias) {
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

  create(hia: any) {
    return this._socket.create(hia);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}