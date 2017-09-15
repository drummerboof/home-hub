import { Component, Inject } from '@nestjs/common';
import { Socket } from 'net';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { CoopStatus } from '@shared/coop-status';

export enum Commands {
  HELLO = 1,
  STATUS,
  SYNC_TIME,
  SET_TIMER,
  OPEN,
  CLOSE
}

export interface CoopClientOptions {
  port: number;
  host: string;
}

function intToBytes (num: number): number[] {
  const out = [];
  const view = new DataView(new ArrayBuffer(4));
  view.setUint32(0, num, false);

  for (let i = 0; i < 4; i++) {
    out[i] = view.getUint8(i);
  }

  return out;
}

@Component()
export class CoopClient {
  public statusMessages: Observable<CoopStatus>;

  private _observer: Observer<CoopStatus>;

  private options: CoopClientOptions;

  private socket: Socket;

  private HANDLERS = {
    [Commands.HELLO]: (data: Buffer) => {
      console.log(data);
      this.send(Commands.HELLO);
    },
    [Commands.STATUS]: (data: Buffer) => {
      if (data.length < 14) {
        throw new Error('Invalid status received');
      }

      const flags = data.readUInt8(5);

      this._observer.next({
        timers: {
          openHour: data.readUInt8(1),
          openMinute: data.readUInt8(2),
          closeHour: data.readUInt8(3),
          closeMinute: data.readUInt8(4),
        },
        door: {
          isOpen: !!(flags & 0x01),
          isClosed: !!(flags & 0x02),
          isOpening: !!(flags & 0x04),
          isClosing: !!(flags & 0x08)
        },
        time: data.readUInt32LE(6),
        rssi: data.readInt32LE(10),
      });
    },
    [Commands.SYNC_TIME]: (data: Buffer) => {
      console.log(data);
    },
    [Commands.SET_TIMER]: (data: Buffer) => {
      console.log(data);
    },
    [Commands.OPEN]: (data: Buffer) => {
      console.log(data);
    },
    [Commands.CLOSE]: (data: Buffer) => {
      console.log(data);
    }
  };

  constructor (@Inject('coopConfig') options: CoopClientOptions) {
    this.options = Object.assign({}, options);
    this.socket = new Socket();
    this.socket.on('data', (data) => this.handleData(data));
    this.socket.on('error', (err) => this.handleError(err));
    this.socket.on('close', (err) => this.handleClose(err));
    this.statusMessages = new Observable((observer: Observer<CoopStatus>) => {
      this._observer = observer;
    });
  }

  connect (): Promise<any> {
    console.log(this.options);
    return new Promise((resolve, reject) => {
      this.socket.connect(this.options.port, this.options.host, (error) => {
        if (error) {
          return reject(error);
        }
        resolve(this.socket);
      });
    });
  }

  disconnect (): void {
    if (!this.socket) {
      throw new Error('Cannot disconnect without connecting first');
    }

    this.socket.destroy();
  }

  status (): Promise<any> {
    return this.send(Commands.STATUS);
  }

  syncTime (timestamp: number): Promise<any> {
    return this.send(...[Commands.SYNC_TIME].concat(intToBytes(timestamp)));
  }

  setTimers (timers: CoopStatus['timers']): Promise<any> {
    return this.send(Commands.SET_TIMER, timers.openHour, timers.openMinute, timers.closeHour, timers.closeMinute);
  }

  open (): Promise<any> {
    return this.send(Commands.OPEN);
  }

  close (): Promise<any> {
    return this.send(Commands.CLOSE);
  }

  private send (...data: number[]): Promise<any> {
    console.log(`Sending command ${Commands[data[0]]}...`);

    return new Promise((resolve, reject) => {
      this.socket.write(Buffer.from(data), 'UTF8', (error) => {
        if (error) {
          return reject(error);
        }
        resolve(this.socket);
      });
    });
  }

  private handleData (data: Buffer) {
    const command = data.readUInt8(0);
    if (!(command in Commands)) {
      throw new Error(`Invalid command: ${command}`);
    }

    console.log(`Handling command: ${Commands[command]}`);

    this.HANDLERS[command](data);
  }

  private handleError (err) {
    console.error('Error', err);
  }

  private handleClose (err) {
    console.error('Close', err);
  }
}
