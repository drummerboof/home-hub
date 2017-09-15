import Server = SocketIO.Server;
import Timer = NodeJS.Timer;
import Client = SocketIO.Client;

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import * as throttle from 'lodash.throttle';

import { CoopClient } from './services/coop-client';

@WebSocketGateway({ port: 3001, namespace: 'coop' })
export class CoopGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  clientCount = 0;
  statusTimeout: Timer;
  throttledStatus: () => void;

  constructor (private client: CoopClient) {
    this.throttledStatus = throttle(() => this.client.status(), 5000);
  }

  afterInit (server: Server) {
    console.log('Connecting...');
    this.client.connect().then(() => {
      this.client.statusMessages.subscribe((status) => {
        server.emit('status', status);
        clearTimeout(this.statusTimeout);
        if (this.clientCount) {
          this.statusTimeout = setTimeout(() => this.client.status(), 10000);
        }
      });
    });
  }

  handleConnection (client: Client) {
    this.clientCount++;
    clearTimeout(this.statusTimeout);
    this.throttledStatus();
  }

  handleDisconnect (client: Client) {
    this.clientCount--;
    if (!this.clientCount) {
      clearTimeout(this.statusTimeout);
    }
  }

  @SubscribeMessage('open')
  onOpen (client, data): void {
    this.client.open();
  }

  @SubscribeMessage('close')
  onClose (client, data): void {
    this.client.close();
  }

  @SubscribeMessage('status')
  onStatus (client, data): void {
    this.client.status();
  }

  @SubscribeMessage('timers')
  onTimers (client, data): void {
    this.client.setTimers(data);
  }
}
