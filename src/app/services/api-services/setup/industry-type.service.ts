import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class IndustryTypesService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('lshmindustrytypes');
    this._socket = _socketService.getService('lshmindustrytypes');
    this._socket.on('created', function (lshmindustrytypes) {
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

  create(type: any) {
    return this._socket.create(type);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}