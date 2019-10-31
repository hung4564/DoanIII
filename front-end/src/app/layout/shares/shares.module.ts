import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPipe } from 'app/pipes/pipe.module';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [MainPipe],
  exports: [MaterialModule, BrowserModule, FormsModule, ReactiveFormsModule, MainPipe]
})
export class SharesModule {}
