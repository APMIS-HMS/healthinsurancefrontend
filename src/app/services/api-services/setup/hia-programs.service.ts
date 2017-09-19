import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HiaProgramService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('lshmhiaprograms');
    this._socket = _socketService.getService('lshmhiaprograms');
    this._socket.on('created', function (lshmhiaprograms) {
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

  create(hiaProgram: any) {
    return this._socket.create(hiaProgram);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}