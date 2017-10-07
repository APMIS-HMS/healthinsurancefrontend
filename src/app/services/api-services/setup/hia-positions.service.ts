import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HiaPositionService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('lshmpositions');
    this._socket = _socketService.getService('lshmpositions');
    this._socket.on('created', function (lshmpositions) {
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

  create(hiaPosition: any) {
    return this._socket.create(hiaPosition);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}