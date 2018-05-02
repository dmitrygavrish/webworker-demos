import {Component, Inject} from '@angular/core';
import {CALCULATE_WEB_WORKER_SERVICE} from './config/tokens';
import {WebWorkerService} from './common/services/web-worker.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    @Inject(CALCULATE_WEB_WORKER_SERVICE)
    public calculateService: WebWorkerService
  ) {
  }
  
  onStartCalculations() {
    this.calculateService
      .handle({
        data: null,
        imports: [`${environment.host}/assets/js/calculations.js`]
      })
      .then((data: any) => {
        console.log('received from worker:', data);
      });
  }
}
