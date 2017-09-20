const feathers = require('feathers/client');
const socketio = require('feathers-socketio/client');
const io = require('socket.io-client');
const localstorage = require('feathers-localstorage');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest/client');
const authentication = require('feathers-authentication-client');
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Injectable } from '@angular/core';
const rx = require('feathers-reactive');
const RxJS = require('rxjs');

// const HOST = 'http://40.68.100.29:3030'; // Live
const HOST = 'http://localhost:3030'; // Your base server URL here


@Injectable()
export class SocketService {
    public socket: any;
    private _app: any;
    constructor(
        private locker: CoolLocalStorage
    ) {
        this.socket = io(HOST);

        this._app = feathers()
            .configure(socketio(this.socket))
            .configure(rx(RxJS, { listStrategy: 'always' }))
            .configure(hooks())
            .configure(authentication({ storage: window.localStorage }));
    }
    logOut() {
        this._app.logout();
        this.locker.clear();
    }
    loginIntoApp(query: any) {
        return this._app.authenticate({
            strategy: 'local',
            'userName': query.email,
            'password': query.password
        });
    }
    getService(value: any) {
        return this._app.service(value);
    }
}

const superagent = require('superagent');
@Injectable()
export class RestService {
    public _app: any;
    logOut() {
        this.locker.clear();
    }
    constructor(
        private locker: CoolLocalStorage
    ) {
        console.log('check')
        if (this.locker.getItem('auth') !== undefined && this.locker.getItem('auth') != null) {
            console.log('its here')
            const auth: any = this.locker.getObject('auth')
            this._app = feathers()
                .configure(rest(HOST).superagent(superagent,
                    {
                        headers: { 'authorization': 'Bearer ' + auth.accessToken }
                    }
                )) // Fire up rest
                .configure(rx(RxJS, { listStrategy: 'always' }))
                .configure(hooks())
                .configure(authentication());
        } else {
            this._app = feathers() // Initialize feathers
                .configure(rest(HOST).superagent(superagent)) // Fire up rest
                .configure(hooks())
                .configure(authentication({ storage: window.localStorage })); // Configure feathers-hooks
        }
    }
    loginIntoApp(query) {
        return this._app.authenticate({
            strategy: 'local',
            'email': query.email,
            'password': query.password
        });
    }
    getService(value: any) {
        const auth: any = this.locker.getObject('auth')
        this._app = feathers()
            .configure(rest(HOST).superagent(superagent,
                {
                    headers: { 'authorization': 'Bearer ' + auth.accessToken }
                }
            )) // Fire up rest
            .configure(rx(RxJS, { listStrategy: 'always' }))
            .configure(hooks())
            .configure(authentication());
        return this._app.service(value);
    }
    getHost() {
        return HOST;
    }
}
