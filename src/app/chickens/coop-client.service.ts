import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export interface CoopStatus {
  timer: {
    open: [number, number],
    close: [number, number]
  };
  door: {
    isOpen: boolean,
    isClosed: boolean,
    isOpening: boolean,
    isClosing: boolean,
  };
  time: number;
  rssi: number;
}

@Injectable()
export class CoopClient {
  private socket: SocketIOClient.Socket;
  private statusObservable: Observable<CoopStatus>;
  private statusObserver: Observer<CoopStatus>;

  constructor () {
    this.socket = io('http://localhost:8001/coop', {
      autoConnect: false
    });
  }

  connect () {
    console.log('Opening socket...');
    this.socket.open();
    this.socket.on('status', (status) => {
      this.statusObserver.next(status);
    });
  }

  status () {
    this.socket.emit('status');
    return this.onStatus();
  }

  onStatus () {
    if (!this.statusObservable) {
      this.statusObservable = new Observable((observer: Observer<CoopStatus>) => {
        this.statusObserver = observer;
      });
    }

    return this.statusObservable;
  }
}
