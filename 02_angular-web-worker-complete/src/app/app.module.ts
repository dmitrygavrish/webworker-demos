import {WorkerAppModule} from '@angular/platform-webworker';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    WorkerAppModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
