import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { CoopStatus } from '@shared/coop-status';
import 'rxjs/add/observable/fromEvent';

@Injectable()
export class CoopClient {
  private socket: SocketIOClient.Socket;
  private statusObservable: Observable<CoopStatus>;

  constructor () {
    this.socket = io('/coop', {
      autoConnect: false
    });
    this.statusObservable = Observable.fromEvent(this.socket, 'status');
  }

  connect () {
    this.socket.open();
  }

  status () {
    this.socket.emit('status');
    return this.onStatus();
  }

  setTimers (timerData: CoopStatus['timers']) {
    this.socket.emit('timers', timerData);
  }

  onStatus () {
    return this.statusObservable;
  }
}
