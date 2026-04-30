import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// All components are standalone — AppComponent is bootstrapped directly.
// This module exists only as the NgModule bootstrap entry point.
@NgModule({
  imports: [BrowserModule, AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
