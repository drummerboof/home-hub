import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ChickensModule } from './chickens/chickens.module';
import { MdIconModule, MdToolbarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChickensModule,
    BrowserAnimationsModule,
    MdToolbarModule,
    FlexLayoutModule,
    MdIconModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
