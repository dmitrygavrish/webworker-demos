import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {calculateWorker} from './common/workers/calculate.worker';
import {calculateWebWorkerServiceProvider} from './common/providers/calculate-web-worker-service.provider';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    calculateWebWorkerServiceProvider(calculateWorker),
    // adding calculateWorker as provider to avoid AOT mode errors
    {
      provide: calculateWorker,
      useValue: calculateWorker
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
