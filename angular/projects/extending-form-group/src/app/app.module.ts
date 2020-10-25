import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {DcInputsModule} from "../../../core/inputs/dc-inputs.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    DcInputsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
