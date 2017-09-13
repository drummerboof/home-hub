import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  MdButtonModule, MdCardModule, MdFormFieldModule, MdIconModule, MdInputModule,
  MdSelectModule
} from '@angular/material';

import { ChickensHomeComponent } from './chickens-home.component';
import { ChickensRoutingModule } from './chickens-routing.module';
import { CoopClient } from './coop-client.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ChickensRoutingModule,
    MdCardModule,
    MdInputModule,
    MdIconModule,
    FlexLayoutModule,
    MdSelectModule,
    ReactiveFormsModule,
    MdButtonModule,
  ],
  providers: [
    CoopClient,
    {
      provide: APP_INITIALIZER,
      useFactory: ChickensModule.coopClientConnectFactory,
      deps: [
        CoopClient
      ],
      multi: true,
    }
  ],
  entryComponents: [
    ChickensHomeComponent
  ],
  declarations: [
    ChickensHomeComponent
  ]
})
export class ChickensModule {
  static coopClientConnectFactory (coopClient: CoopClient) {
    return () => coopClient.connect();
  }
}
