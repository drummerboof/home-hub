import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as times from 'lodash.times';
import { CoopStatus } from '@shared/coop-status';
import { CoopClient } from './coop-client.service';

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

  timerForm: FormGroup;
  timersSubmitted = false;
  status: CoopStatus;
  hours = times(24, (value) => ({ value, text: padNum(value) }));
  minutes = times(12, (value) => ({ value: value * 5, text: padNum(value * 5) }));


  constructor (private readonly coopClient: CoopClient, private readonly fb: FormBuilder) {
    this.timerForm = this.fb.group({
      openHour: 0,
      openMinute: 0,
      closeHour: 0,
      closeMinute: 0,
    });

    coopClient.status().subscribe((status) => {
      this.status = status;
      if (this.timerForm.pristine || this.timersSubmitted) {
        this.timerForm.reset(this.status.timers, { emitEvent: false });
        this.timersSubmitted = false;
      }
    });
  }

  onOpen () {
    console.log('this.coopClient.open();');
  }

  onClose () {
    console.log('this.coopClient.close();');
  }

  onSubmit () {
    this.timersSubmitted = true;
    this.coopClient.setTimers(this.timerForm.value);
  }

  time () {
    const offset = (new Date()).getTimezoneOffset();
    return (this.status.time + offset * 60) * 1000;
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
