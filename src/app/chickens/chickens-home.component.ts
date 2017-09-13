import { Component } from '@angular/core';
import { CoopClient, CoopStatus } from './coop-client.service';

const padNum = (num) => (num < 10 ? '0' : '') + num;

@Component({
  selector: 'hh-chickens',
  templateUrl: './chickens-home.component.html',
  styleUrls: ['./chickens-home.component.scss']
})
export class ChickensHomeComponent {
  static DOOR_STATES = {
    isOpening: 'Opening...',
    isClosing: 'Closing...',
    isOpen: 'Open',
    isClosed: 'Closed',
  };

  loadedTime = 0;

  realTimeOffset = 0;

  status: CoopStatus;

  constructor (coopClient: CoopClient) {
    coopClient.onStatus().subscribe((status) => {
      this.status = status;
      this.loadedTime = Date.now();
    });
  }

  time () {
    const offset = (new Date()).getTimezoneOffset();
    return (this.status.time + offset * 60) * 1000;
  }

  timer (which: 'open' | 'close') {
    return `${padNum(this.status.timer[which][0])}:${padNum(this.status.timer[which][1])}`;
  }

  doorStatus () {
    if (!this.status) {
      return 'Unknown';
    }

    for (const [state, value] of Object.entries(ChickensHomeComponent.DOOR_STATES)) {
      if (this.status.door[state]) {
        return value;
      }
    }

    return 'Limbo';
  }
}
