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
const HOST = 'http://localhost:3031'; // Your base server URL here


@Injectable()
export class SocketService {
    public socket: any;
    public _app: any;


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
        this.locker.clear();
        this._app.logout();
    }
    loginIntoApp(query: any) {
        return this._app.authenticate({
            strategy: 'local',
            'email': query.email,
            'password': query.password
        });
    }
    getService(value: any) {
        if (this.locker.getItem('auth') !== undefined && this.locker.getItem('auth') != null) {
            let token = this.locker.getItem('auth');
            const copyInvestigation = JSON.parse(token);
            this._app.authenticate({ strategy: 'jwt', accessToken: copyInvestigation.accessToken })
            // return new Promise((resolve, reject) => {

            //     let token = this.locker.getItem('auth');
            //     const copyInvestigation = JSON.parse(token);
            //     console.log(copyInvestigation.accessToken)
            //     resolve(this._app.authenticate({ strategy: 'jwt', accessToken: copyInvestigation.accessToken }).then(payload => {
            //         console.log(payload)
            //         // return Promise.resolve(data);
            //         return resolve(this._app.service(value));
            //     }, error => {
            //         console.log(error)
            //     }));




            // });


            // console.log('authenticate again')
            // let token = this.locker.getItem('auth');
            // const copyInvestigation = JSON.parse(token);
            // console.log(copyInvestigation.accessToken)
            // Promise.resolve(this._app.authenticate({ strategy: 'jwt', accessToken: copyInvestigation.accessToken }).then(payload => {
            //     console.log(payload)
            //     // return Promise.resolve(data);
            //     return Promise.resolve(this._app.service(value));
            // }, error => {
            //     console.log(error)
            // }));
        }
        return this._app.service(value)
    }
    authenticateUser(service) {
        if (this.locker.getItem('auth') !== undefined && this.locker.getItem('auth') != null) {
          return new Promise((resolve, reject) => {
            let token = this.locker.getItem('auth');
            const copyToken = JSON.parse(token);
            resolve(this._app.authenticate({ strategy: 'jwt', accessToken: copyToken.accessToken }).then(payload => {
              this.socket = this.getService(service);
              return Promise.resolve(this.socket);
            }, error => {
              console.log(error)
            }));
    
          });
        }
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
        if (this.locker.getItem('auth') !== undefined && this.locker.getItem('auth') != null) {
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
        if (this.locker.getItem('auth') !== undefined && this.locker.getItem('auth') != null) {
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
        }

        return this._app.service(value);
    }
    getHost() {
        return HOST;
    }
}
